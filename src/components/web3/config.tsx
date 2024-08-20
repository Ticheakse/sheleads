import { defaultWagmiConfig } from "@web3modal/wagmi/react/config"

import { cookieStorage, createStorage } from "wagmi"
import { baseSepolia, hardhat, shibarium } from "wagmi/chains"

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) throw new Error("Project ID is not defined")

const metadata = {
  name: "SheLeads",
  description: "SheLeads",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
}

const chains = [shibarium, baseSepolia] as const

export const config = defaultWagmiConfig({
  chains: process.env.NODE_ENV === "production" ? chains : [...chains, hardhat],
  projectId,
  metadata,
  ssr: false,
  auth: { email: false },
  storage: createStorage({
    storage: cookieStorage,
  }),
})
