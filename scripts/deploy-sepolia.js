// Deploy PunnyPower and QuestRegistry to Celo Sepolia
// Usage: node scripts/deploy-sepolia.js
require('dotenv').config({ path: '.env.local' })
const fs = require('fs')
const path = require('path')
const { ethers } = require('ethers')

async function main() {
  const RPC = process.env.RPC_URL || process.env.CELO_SEPOLIA_RPC || process.env.NEXT_PUBLIC_CELO_SEPOLIA_RPC || 'http://127.0.0.1:8545'
  let DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || process.env.BACKEND_PRIVATE_KEY

  if (!DEPLOYER_PRIVATE_KEY) {
    throw new Error('No deployer private key provided. Set DEPLOYER_PRIVATE_KEY in .env.local')
  }
  if (!DEPLOYER_PRIVATE_KEY.startsWith('0x')) DEPLOYER_PRIVATE_KEY = '0x' + DEPLOYER_PRIVATE_KEY

  function isValidPrivateKey(k) {
    return typeof k === 'string' && /^0x[0-9a-fA-F]{64}$/.test(k)
  }
  if (!isValidPrivateKey(DEPLOYER_PRIVATE_KEY)) {
    throw new Error('DEPLOYER_PRIVATE_KEY appears invalid. It must be a 32-byte hex string starting with 0x.')
  }

  console.log('Using RPC:', RPC)
  const provider = new ethers.providers.JsonRpcProvider(RPC)
  const wallet = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, provider)
  console.log('Deployer address:', await wallet.getAddress())

  const artifactsDir = path.join(process.cwd(), 'artifacts', 'contracts')
  const punnyArtifactPath = path.join(artifactsDir, 'PunnyPower.sol', 'PunnyPower.json')
  const questArtifactPath = path.join(artifactsDir, 'QuestRegistry.sol', 'QuestRegistry.json')

  if (!fs.existsSync(punnyArtifactPath) || !fs.existsSync(questArtifactPath)) {
    throw new Error('Compiled contract artifacts not found. Run `npx hardhat compile` first.')
  }

  const punnyJson = JSON.parse(fs.readFileSync(punnyArtifactPath, 'utf8'))
  const questJson = JSON.parse(fs.readFileSync(questArtifactPath, 'utf8'))

  // Deploy PunnyPower
  console.log('Deploying PunnyPower...')
  const PunnyFactory = new ethers.ContractFactory(punnyJson.abi, punnyJson.bytecode, wallet)
  const punny = await PunnyFactory.deploy()
  await punny.deployed()
  console.log('PunnyPower deployed to', punny.address)

  // Deploy QuestRegistry with punny address
  console.log('Deploying QuestRegistry (constructor: tokenAddress = PunnyPower)...')
  const QuestFactory = new ethers.ContractFactory(questJson.abi, questJson.bytecode, wallet)
  const quest = await QuestFactory.deploy(punny.address)
  await quest.deployed()
  console.log('QuestRegistry deployed to', quest.address)

  // Set minter on punny to quest registry
  try {
    const currentMinter = await punny.minter()
    if (currentMinter && currentMinter.toLowerCase() !== quest.address.toLowerCase()) {
      console.log('Setting QuestRegistry as minter on PunnyPower...')
      const tx = await punny.setMinter(quest.address)
      await tx.wait()
      console.log('Minter set to', quest.address)
    } else {
      console.log('Minter already set to QuestRegistry or zero address; setting anyway...')
      const tx = await punny.setMinter(quest.address)
      await tx.wait()
      console.log('Minter set to', quest.address)
    }
  } catch (e) {
    // Some compiled artifacts might not expose `minter()` as a view if not present; still attempt set
    try {
      const tx = await punny.setMinter(quest.address)
      await tx.wait()
      console.log('Minter set to', quest.address)
    } catch (e2) {
      console.warn('Failed to set minter on PunnyPower:', e2)
    }
  }

  // Persist deployment addresses
  const out = {
    network: 'sepolia',
    rpc: RPC,
    contracts: {
      PunnyPower: { address: punny.address },
      QuestRegistry: { address: quest.address }
    }
  }

  const deploymentsDir = path.join(process.cwd(), 'deployments')
  if (!fs.existsSync(deploymentsDir)) fs.mkdirSync(deploymentsDir)
  const outPath = path.join(deploymentsDir, 'sepolia.json')
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2))
  console.log('Wrote deployment to', outPath)

  console.log('Deployment finished.')
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
