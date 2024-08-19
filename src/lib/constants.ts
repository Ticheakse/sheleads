import { shibarium, shibariumTestnet, baseSepolia, hardhat } from "wagmi/chains"

export const CONTRACT_ADDRESSES: { [chainId: number]: string } = {
  [hardhat.id]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  [baseSepolia.id]: "0x9FC47a0A4431470bC6804785F96ae1ABd5B3950E",
  [shibariumTestnet.id]: "",
  [shibarium.id]: "",
}

export const algorithm = "aes-256-cbc"
