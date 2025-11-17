import "dotenv/config";
import { HardhatUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-ethers";

const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || "";
const CELO_MAINNET_RPC = process.env.CELO_MAINNET_RPC || "";
const CELO_ALFAJORES_RPC = process.env.CELO_ALFAJORES_RPC || "";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.8.19" }],
  },
  networks: {
    hardhat: {},
    localhost: {
      url: RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : undefined,
    },
    // Celo networks
    alfajores: {
      url: CELO_ALFAJORES_RPC || RPC_URL,
      chainId: 44787,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : undefined,
    },
    celo: {
      url: CELO_MAINNET_RPC || RPC_URL,
      chainId: 42220,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : undefined,
    },
  },
};

export default config;
