import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import * as dotenv from "dotenv"

dotenv.config()

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  defaultNetwork: "localhost",
  networks: {
    shibarium: {
      url: "https://puppynet.shibrpc.com",
      accounts: [process.env.PRIVATE_KEY as string],
    },
  },
  etherscan: {
    apiKey: {
      shibarium: process.env.ETHERSCAN_API_KEY as string,
    },
    customChains: [
      {
        network: "shibarium",
        chainId: 157,
        urls: {
          apiURL: "https://puppyscan.shib.io/api/",
          browserURL: "https://puppyscan.shib.io",
        },
      },
    ],
  },
}

export default config
