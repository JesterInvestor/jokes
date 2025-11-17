Punny Power & Quest Contracts
=============================

Files:
- `PunnyPower.sol` — ERC-20 token (PUNNY) with owner/minter-controlled minting.
- `QuestRegistry.sol` — Admin-managed quest registry. Owner can add quests and mark users eligible; users call `claim` to mint PUNNY tokens for completed quests. Owner can also `award` directly.

Quick notes
- These contracts use OpenZeppelin contracts. Install the dependencies in your project (example with Hardhat):

  npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers @openzeppelin/contracts

- Compile with Hardhat or your preferred tool.

Deployment hints
- Deploy `PunnyPower` first. Then deploy `QuestRegistry` with the deployed `PunnyPower` address.
- After both are deployed, set the `QuestRegistry` as the minter on `PunnyPower`:

  punnyPower.setMinter(questRegistry.address)

Celo notes
- If you intend to deploy on Celo (recommended testnet: Alfajores) set these env vars before running the Hardhat deploy script:

  - `CELO_ALFAJORES_RPC` — RPC URL for Alfajores (or use the global `RPC_URL`)
  - `CELO_MAINNET_RPC` — RPC URL for Celo mainnet (if deploying to mainnet)
  - `BACKEND_PRIVATE_KEY` — private key for the backend wallet which will be set as owner/minter

Example (Alfajores):

  CELO_ALFAJORES_RPC="https://alfajores-forno.celo-testnet.org" BACKEND_PRIVATE_KEY="0x..." npm run hh:deploy:alfajores


Security
- This implementation keeps control with the contract owner (admin). Off-chain verification should be used to ensure only eligible users get marked. For production use, add proper access control (roles), consider timelocks and review economics.

Extensions
- Persist quest metadata on-chain or off-chain as needed; integrate with your backend to mark eligibility automatically when a user uploads/shares/ connects.
- Consider adding events and more granular roles for verifiers.
