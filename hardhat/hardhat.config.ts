import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import * as dotenv from "dotenv"

dotenv.config()

const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
const BLOCKSCOUT_KEY = process.env.BLOCKSCOUT_KEY || ""

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  defaultNetwork: "localhost",
  networks: {
    shibarium: {
      url: "https://www.shibrpc.com",
      accounts: PRIVATE_KEY !== "" ? [PRIVATE_KEY] : [],
    },
    puppynet: {
      url: "https://puppynet.shibrpc.com",
      accounts: PRIVATE_KEY !== "" ? [PRIVATE_KEY] : [],
    },
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: PRIVATE_KEY !== "" ? [PRIVATE_KEY] : [],
      gasPrice: 1000000000,
    },
  },
  etherscan: {
    apiKey: {
      shibarium: ETHERSCAN_API_KEY,
      puppynet: ETHERSCAN_API_KEY,
      baseSepolia: BLOCKSCOUT_KEY,
    },
    customChains: [
      {
        network: "shibarium",
        chainId: 109,
        urls: {
          apiURL: "https://www.shibariumscan.io/api/",
          browserURL: "https://www.shibariumscan.io/",
        },
      },
      {
        network: "puppynet",
        chainId: 157,
        urls: {
          apiURL: "https://puppyscan.shib.io/api/",
          browserURL: "https://puppyscan.shib.io",
        },
      },
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://base-sepolia.blockscout.com/api",
          browserURL: "https://base-sepolia.blockscout.com",
        },
      },
    ],
  },
}

export default config
