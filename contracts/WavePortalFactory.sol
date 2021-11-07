// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortalFactory {
    uint256 totalWaves;
    uint256 prizeAmount = 0.0001 ether;

    modifier hasMinimumBalance() {
        require(
            prizeAmount <= address(this).balance, 
            "Trying to withdraw more money than the contract has."
        );
        _;
    }

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    constructor() payable {
        console.log("Hello world from a smart contract!");
    }

    function wave(string memory _message) public hasMinimumBalance() {
        totalWaves += 1;
        console.log(msg.sender, "Has waved!");

        waves.push(Wave(msg.sender, _message, block.timestamp));
        emit NewWave(msg.sender, block.timestamp, _message);
        (bool success, ) = (msg.sender).call{value: prizeAmount}("");
        require(success, "Failed to withdraw money from contract.");
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("Total waves: ", totalWaves);
        return totalWaves;
    }
}