import "dotenv/config";
import { ethers } from "hardhat";

async function main() {
  const BACKEND_PRIVATE_KEY = process.env.BACKEND_PRIVATE_KEY || "";
  const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS || "";
  const NETWORK = process.env.NETWORK || 'localhost'

  const [deployer] = await ethers.getSigners();
  console.log("Deploying to network:", NETWORK)
  console.log("Deployer:", deployer.address);

  // Deploy PunnyPower
  const Punny = await ethers.getContractFactory("PunnyPower", deployer);
  const punny = await Punny.deploy();
  await punny.deployed();
  console.log("PunnyPower deployed to", punny.address);

  // Deploy JokeVoting with punny address
  const JV = await ethers.getContractFactory("JokeVoting", deployer);
  const jokeVoting = await JV.deploy(punny.address);
  await jokeVoting.deployed();
  console.log("JokeVoting deployed to", jokeVoting.address);

  // If BACKEND_PRIVATE_KEY provided, transfer ownership to backend and have backend set minter
  if (BACKEND_PRIVATE_KEY) {
    const backendWallet = new ethers.Wallet(BACKEND_PRIVATE_KEY, ethers.provider);
    const backendAddress = BACKEND_ADDRESS || await backendWallet.getAddress();

    console.log("Transferring PunnyPower ownership to backend:", backendAddress);
    const tx = await punny.transferOwnership(backendAddress);
    await tx.wait();
    console.log("Ownership transferred");

    // Have backend call setMinter(jokeVoting.address)
    const punnyAsBackend = punny.connect(backendWallet);
    const tx2 = await punnyAsBackend.setMinter(jokeVoting.address);
    await tx2.wait();
    console.log("Backend set the minter to JokeVoting");
  } else {
    // Fallback: deployer sets minter
    const tx = await punny.setMinter(jokeVoting.address);
    await tx.wait();
    console.log("Deployer set the minter to JokeVoting");
  }

  console.log("Deployment complete.");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
