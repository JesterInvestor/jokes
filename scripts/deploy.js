// Load environment variables from .env and .env.local
try {
  require('dotenv').config({ path: '.env.local' })
} catch (e) {
  try { require('dotenv').config() } catch (e) {}
}

const fs = require('fs')
const path = require('path')
const { ethers } = require('ethers')

async function main() {
  // Prefer explicit RPC env vars. Support both RPC_URL and legacy/mistyped RCP_URL.
  const RPC = process.env.RPC_URL || process.env.RCP_URL || process.env.CELO_ALFAJORES_RPC || 'http://127.0.0.1:8545'
  const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || process.env.BACKEND_PRIVATE_KEY
  const BACKEND_PRIVATE_KEY = process.env.BACKEND_PRIVATE_KEY || ''
  const BACKEND_ADDRESS = process.env.BACKEND_ADDRESS || ''

  function isValidPrivateKey(k) {
    return typeof k === 'string' && /^0x[0-9a-fA-F]{64}$/.test(k)
  }

  if (!DEPLOYER_PRIVATE_KEY) {
    throw new Error('No deployer private key provided. Set DEPLOYER_PRIVATE_KEY or BACKEND_PRIVATE_KEY in your environment or .env.local')
  }

  if (!isValidPrivateKey(DEPLOYER_PRIVATE_KEY)) {
    throw new Error('DEPLOYER_PRIVATE_KEY appears invalid. It must be a 32-byte hex string starting with 0x. Replace the placeholder with a valid private key or leave it empty to skip accounts in Hardhat config.')
  }

  console.log('Using RPC:', RPC)
  const provider = new ethers.providers.JsonRpcProvider(RPC)
  const deployerWallet = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, provider)
  console.log('Deployer address:', await deployerWallet.getAddress())

  const artifactsDir = path.join(process.cwd(), 'artifacts', 'contracts')
  const punnyArtifactPath = path.join(artifactsDir, 'PunnyPower.sol', 'PunnyPower.json')
  const jokeArtifactPath = path.join(artifactsDir, 'JokeVoting.sol', 'JokeVoting.json')

  if (!fs.existsSync(punnyArtifactPath) || !fs.existsSync(jokeArtifactPath)) {
    throw new Error('Compiled contract artifacts not found. Run `npx hardhat compile` first.')
  }

  const punnyJson = JSON.parse(fs.readFileSync(punnyArtifactPath, 'utf8'))
  const jokeJson = JSON.parse(fs.readFileSync(jokeArtifactPath, 'utf8'))

  const PunnyFactory = new ethers.ContractFactory(punnyJson.abi, punnyJson.bytecode, deployerWallet)
  const punny = await PunnyFactory.deploy()
  await punny.deployed()
  console.log('PunnyPower deployed to', punny.address)

  const JokeFactory = new ethers.ContractFactory(jokeJson.abi, jokeJson.bytecode, deployerWallet)
  const jokeVoting = await JokeFactory.deploy(punny.address)
  await jokeVoting.deployed()
  console.log('JokeVoting deployed to', jokeVoting.address)

  if (BACKEND_PRIVATE_KEY && BACKEND_PRIVATE_KEY !== DEPLOYER_PRIVATE_KEY) {
    const backendWallet = new ethers.Wallet(BACKEND_PRIVATE_KEY, provider)
    const backendAddr = BACKEND_ADDRESS || await backendWallet.getAddress()
    console.log('Transferring PunnyPower ownership to backend:', backendAddr)
    const tx = await punny.transferOwnership(backendAddr)
    await tx.wait()
    console.log('Ownership transferred')

    const punnyAsBackend = punny.connect(backendWallet)
    const tx2 = await punnyAsBackend.setMinter(jokeVoting.address)
    await tx2.wait()
    console.log('Backend set the minter to JokeVoting')
  } else {
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
