import "dotenv/config";
import fs from 'fs'
import path from 'path'
import { ethers } from 'ethers'

async function main() {
  const RPC = process.env.CELO_ALFAJORES_RPC || process.env.RPC_URL || 'http://127.0.0.1:8545'
  const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || process.env.BACKEND_PRIVATE_KEY
  const BACKEND_PRIVATE_KEY = process.env.BACKEND_PRIVATE_KEY || ''
  const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS || ''

  if (!DEPLOYER_PRIVATE_KEY) {
    throw new Error('No deployer private key provided. Set DEPLOYER_PRIVATE_KEY or BACKEND_PRIVATE_KEY in env')
  }

  const provider = new ethers.providers.JsonRpcProvider(RPC)
  const deployerWallet = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, provider)
  console.log('Deployer address:', await deployerWallet.getAddress())

  // Ensure artifacts exist (require you ran `npx hardhat compile`)
  const artifactsDir = path.join(process.cwd(), 'artifacts', 'contracts')
  const punnyArtifactPath = path.join(artifactsDir, 'PunnyPower.sol', 'PunnyPower.json')
  const jokeArtifactPath = path.join(artifactsDir, 'JokeVoting.sol', 'JokeVoting.json')

  if (!fs.existsSync(punnyArtifactPath) || !fs.existsSync(jokeArtifactPath)) {
    throw new Error('Compiled contract artifacts not found. Run `npx hardhat compile` first.')
  }

  const punnyJson = JSON.parse(fs.readFileSync(punnyArtifactPath, 'utf8'))
  const jokeJson = JSON.parse(fs.readFileSync(jokeArtifactPath, 'utf8'))

  // Deploy PunnyPower
  const PunnyFactory = new ethers.ContractFactory(punnyJson.abi, punnyJson.bytecode, deployerWallet)
  const punny = await PunnyFactory.deploy()
  await punny.deployed()
  console.log('PunnyPower deployed to', punny.address)

  // Deploy JokeVoting with punny address
  const JokeFactory = new ethers.ContractFactory(jokeJson.abi, jokeJson.bytecode, deployerWallet)
  const jokeVoting = await JokeFactory.deploy(punny.address)
  await jokeVoting.deployed()
  console.log('JokeVoting deployed to', jokeVoting.address)

  // Configure minter/ownership
  if (BACKEND_PRIVATE_KEY && BACKEND_PRIVATE_KEY !== DEPLOYER_PRIVATE_KEY) {
    const backendWallet = new ethers.Wallet(BACKEND_PRIVATE_KEY, provider)
    const backendAddr = BACKEND_ADDRESS || await backendWallet.getAddress()
    console.log('Transferring PunnyPower ownership to backend:', backendAddr)
    const tx = await punny.transferOwnership(backendAddr)
    await tx.wait()
    console.log('Ownership transferred')

    // Have backend set minter
    const punnyAsBackend = punny.connect(backendWallet)
    const tx2 = await punnyAsBackend.setMinter(jokeVoting.address)
    await tx2.wait()
    console.log('Backend set the minter to JokeVoting')
  } else {
    // Either no separate backend key provided, or backend==deployer
    const tx = await punny.setMinter(jokeVoting.address)
    await tx.wait()
    console.log('Deployer set the minter to JokeVoting')
  }

  console.log('Deployment complete.')
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
