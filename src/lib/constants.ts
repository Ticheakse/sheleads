import { shibarium, shibariumTestnet, baseSepolia, hardhat } from "wagmi/chains"

export const CONTRACT_ADDRESSES: { [chainId: number]: string } = {
  [hardhat.id]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  [baseSepolia.id]: "0xBE7Fe774DfaDDd92aC71562A0113D85508139AB5",
  [shibariumTestnet.id]: "",
  [shibarium.id]: "",
}

export const algorithm = "aes-256-cbc"
