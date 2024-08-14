import { defaultWagmiConfig } from "@web3modal/wagmi/react/config"

import { cookieStorage, createStorage } from "wagmi"
import { shibariumTestnet, baseSepolia, hardhat, shibarium } from "wagmi/chains"

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) throw new Error("Project ID is not defined")

const metadata = {
  name: "SheLeads",
  description: "SheLeads",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
}

const chains = [hardhat, shibariumTestnet, baseSepolia, shibarium] as const

export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: false,
  auth: { email: false },
  storage: createStorage({
    storage: cookieStorage,
  }),
})
