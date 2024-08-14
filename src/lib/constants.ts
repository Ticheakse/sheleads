import { shibarium, shibariumTestnet, baseSepolia, hardhat } from "wagmi/chains"

export const CONTRACT_ADDRESSES: { [chainId: number]: string } = {
  [hardhat.id]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  [baseSepolia.id]: "",
  [shibariumTestnet.id]: "",
  [shibarium.id]: "",
}
