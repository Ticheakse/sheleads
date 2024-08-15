import "@/styles/globals.css"
import type { AppProps } from "next/app"

import Web3ModalProvider from "@/components/web3/context/appContext"
import AppLayout from "@/components/layouts/appLayout"
import SheLeadsProvider from "@/components/web3/context/sheLeadsContext"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Web3ModalProvider>
      <SheLeadsProvider>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </SheLeadsProvider>
    </Web3ModalProvider>
  )
}
