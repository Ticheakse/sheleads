import { ReactNode } from "react"
import { config, projectId } from "../config"

import { createWeb3Modal } from "@web3modal/wagmi/react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { WagmiProvider } from "wagmi"

const queryClient = new QueryClient()

if (!projectId) throw new Error("Project ID is not defined")

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeMode: "light",
})

export default function Web3ModalProvider({
  children,
}: {
  children: ReactNode
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
