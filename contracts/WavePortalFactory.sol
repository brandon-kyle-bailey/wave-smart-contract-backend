// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortalFactory {
    uint256 totalWaves;
    uint256 prizeAmount = 0.0001 ether;
    uint256 private seed;

    mapping(address => uint256) public lastWavedAt;

    modifier hasMinimumBalance() {
        require(
            prizeAmount <= address(this).balance, 
            "Trying to withdraw more money than the contract has."
        );
        _;
    }

    modifier hasCooledDown() {
        require(
            lastWavedAt[msg.sender] + 30 seconds < block.timestamp, 
            "Must wait 30 seconds before waving again."
        );
        _;
    }

    event NewWave(address indexed from, uint256 timestamp, string message, uint256 reward);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
        uint256 reward;
    }

    Wave[] waves;

    constructor() payable {
        console.log("Hello world from a smart contract!");
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public hasMinimumBalance() hasCooledDown() {
        lastWavedAt[msg.sender] = block.timestamp;
        totalWaves += 1;
        console.log(msg.sender, "Has waved!");
        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Transaction seed: ", seed);
        uint256 reward = 0;
        waves.push(Wave(msg.sender, _message, block.timestamp, reward));
        if(seed <= 50) {
            console.log(msg.sender, " won!");
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
            reward = prizeAmount;
        }
        emit NewWave(msg.sender, block.timestamp, _message, reward);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("Total waves: ", totalWaves);
        return totalWaves;
    }
}