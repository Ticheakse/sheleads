import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import * as dotenv from "dotenv"

dotenv.config()

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  defaultNetwork: "localhost",
  networks: {
    shibarium: {
      url: "https://www.shibrpc.com", // Replace with Shibarium's RPC URL
      accounts: [process.env.PRIVATE_KEY as string],
    },
    puppynet: {
      url: "https://puppynet.shibrpc.com",
      accounts: [process.env.PRIVATE_KEY as string],
    },
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: [process.env.PRIVATE_KEY as string],
      gasPrice: 1000000000,
    },
  },
  etherscan: {
    apiKey: {
      shibarium: process.env.ETHERSCAN_API_KEY as string,
      puppynet: process.env.ETHERSCAN_API_KEY as string,
      baseSepolia: process.env.BLOCKSCOUT_KEY as string,
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
