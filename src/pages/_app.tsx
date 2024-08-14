import "@/styles/globals.css"
import type { AppProps } from "next/app"

import Web3ModalProvider from "@/components/web3/context/appContext"
import AppLayout from "@/components/layouts/appLayout"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Web3ModalProvider>
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </Web3ModalProvider>
  )
}
