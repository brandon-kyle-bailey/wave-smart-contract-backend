const hre = require("hardhat");
const {useSigners, loadContractFactory, deployContract, executeContract } = require('../lib/helpers/contractDeployHelpers');

const contractCallback = async (contract, inputs) => {
    const [randomPerson] = inputs;
    
    let waveCount;
    
    waveCount = await contract.getTotalWaves();
    console.log(`Total waves: ${waveCount.toNumber()}`);
    
    let waveTxn = await contract.wave("A message #1!");
    await waveTxn.wait();
    waveCount = await contract.getTotalWaves();
    console.log(`Total waves: ${waveCount.toNumber()}`);

    waveTxn = await contract.wave("A message #2!");
    await waveTxn.wait();
    waveCount = await contract.getTotalWaves();
    console.log(`Total waves: ${waveCount.toNumber()}`);
    
    waveTxn = await contract.connect(randomPerson).wave("Another message!");
    await waveTxn.wait();
    waveCount = await contract.getTotalWaves();
    console.log(`Total waves: ${waveCount.toNumber()}`);
    console.log(await contract.getAllWaves());
}


const run = async () => {
    const [owner, randomPerson] = await useSigners(hre);
    const contractFactory = await loadContractFactory(hre, process.argv[2]);
    const contract = await deployContract(contractFactory, {
        value: hre.ethers.utils.parseEther('0.1'),
    });
    console.log(`Contract deployed to: ${contract.address}`);
    console.log(`Contract deployed by: ${owner.address}`);
    console.log(`Contract balance: ${
        hre.ethers.utils.formatEther(await hre.ethers.provider.getBalance(
        contract.address
      ))
    }`);

    await executeContract(contract, contractCallback, [randomPerson]);
    console.log(`Contract balance: ${
        hre.ethers.utils.formatEther(await hre.ethers.provider.getBalance(
        contract.address
      ))
    }`);
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