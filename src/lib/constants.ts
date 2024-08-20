import { shibarium, shibariumTestnet, baseSepolia, hardhat } from "wagmi/chains"

export const CONTRACT_ADDRESSES: { [chainId: number]: string } = {
  [hardhat.id]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  [baseSepolia.id]: "0x0451Aaa9f950Fa956c00BA2dD02D8647E4A05679",
  [shibariumTestnet.id]: "",
  [shibarium.id]: "",
}

export const algorithm = "aes-256-cbc"
