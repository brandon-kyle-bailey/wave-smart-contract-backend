
const useSigners = async (hre) => {
    return await hre.ethers.getSigners();
}

const loadContractFactory = async (hre, contractName) => {
    return await hre.ethers.getContractFactory(contractName);
}
const deployContract = async (contractFactory, deployProps) => {
    const deployedContract = await contractFactory.deploy(deployProps);
    await deployedContract.deployed();
    return deployedContract;
}

const executeContract = async (contract, callback, inputs) => {
    await callback(contract, inputs);
}

const useAccountBalance = async (account) => {
    return await account.getBalance();
}

module.exports = {
    useSigners, loadContractFactory, deployContract, executeContract, useAccountBalance
}