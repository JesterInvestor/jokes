"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ethers_1 = require("ethers");
async function main() {
    const RPC = process.env.CELO_ALFAJORES_RPC || process.env.RPC_URL || 'http://127.0.0.1:8545';
    const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || process.env.BACKEND_PRIVATE_KEY;
    const BACKEND_PRIVATE_KEY = process.env.BACKEND_PRIVATE_KEY || '';
    const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS || '';
    if (!DEPLOYER_PRIVATE_KEY) {
        throw new Error('No deployer private key provided. Set DEPLOYER_PRIVATE_KEY or BACKEND_PRIVATE_KEY in env');
    }
    const provider = new ethers_1.ethers.providers.JsonRpcProvider(RPC);
    const deployerWallet = new ethers_1.ethers.Wallet(DEPLOYER_PRIVATE_KEY, provider);
    console.log('Deployer address:', await deployerWallet.getAddress());
    // Ensure artifacts exist (require you ran `npx hardhat compile`)
    const artifactsDir = path_1.default.join(process.cwd(), 'artifacts', 'contracts');
    const punnyArtifactPath = path_1.default.join(artifactsDir, 'PunnyPower.sol', 'PunnyPower.json');
    const jokeArtifactPath = path_1.default.join(artifactsDir, 'JokeVoting.sol', 'JokeVoting.json');
    if (!fs_1.default.existsSync(punnyArtifactPath) || !fs_1.default.existsSync(jokeArtifactPath)) {
        throw new Error('Compiled contract artifacts not found. Run `npx hardhat compile` first.');
    }
    const punnyJson = JSON.parse(fs_1.default.readFileSync(punnyArtifactPath, 'utf8'));
    const jokeJson = JSON.parse(fs_1.default.readFileSync(jokeArtifactPath, 'utf8'));
    // Deploy PunnyPower
    const PunnyFactory = new ethers_1.ethers.ContractFactory(punnyJson.abi, punnyJson.bytecode, deployerWallet);
    const punny = await PunnyFactory.deploy();
    await punny.deployed();
    console.log('PunnyPower deployed to', punny.address);
    // Deploy JokeVoting with punny address
    const JokeFactory = new ethers_1.ethers.ContractFactory(jokeJson.abi, jokeJson.bytecode, deployerWallet);
    const jokeVoting = await JokeFactory.deploy(punny.address);
    await jokeVoting.deployed();
    console.log('JokeVoting deployed to', jokeVoting.address);
    // Configure minter/ownership
    if (BACKEND_PRIVATE_KEY && BACKEND_PRIVATE_KEY !== DEPLOYER_PRIVATE_KEY) {
        const backendWallet = new ethers_1.ethers.Wallet(BACKEND_PRIVATE_KEY, provider);
        const backendAddr = BACKEND_ADDRESS || await backendWallet.getAddress();
        console.log('Transferring PunnyPower ownership to backend:', backendAddr);
        const tx = await punny.transferOwnership(backendAddr);
        await tx.wait();
        console.log('Ownership transferred');
        // Have backend set minter
        const punnyAsBackend = punny.connect(backendWallet);
        const tx2 = await punnyAsBackend.setMinter(jokeVoting.address);
        await tx2.wait();
        console.log('Backend set the minter to JokeVoting');
    }
    else {
        // Either no separate backend key provided, or backend==deployer
        const tx = await punny.setMinter(jokeVoting.address);
        await tx.wait();
        console.log('Deployer set the minter to JokeVoting');
    }
    console.log('Deployment complete.');
}
main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
