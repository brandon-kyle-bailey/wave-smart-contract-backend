const hre = require("hardhat");
const {useSigners, loadContractFactory, deployContract, useAccountBalance } = require('../lib/helpers/contractDeployHelpers');

const run = async () => {
    const [deployer] = await useSigners(hre);
    const accountBalance = await useAccountBalance(deployer);
    console.log(`Deploying contract with account: ${deployer.address}`);
    console.log(`Account balance: ${accountBalance.toString()}`);
    const contractFactory = await loadContractFactory(hre, process.argv[2]);
    const contract = await deployContract(contractFactory, {
        value: hre.ethers.utils.parseEther('0.1'),
    });
    console.log(`Contract address: ${contract.address}`);
}

const main = async () => {
    try {
        await run();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

main();