import "@/styles/globals.css"
import type { AppProps } from "next/app"

import Web3ModalProvider from "@/components/web3/context/appContext"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Web3ModalProvider>
      <Component {...pageProps} />
    </Web3ModalProvider>
  )
}
