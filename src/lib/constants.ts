import { shibarium, baseSepolia, hardhat } from "wagmi/chains"

export const CONTRACT_ADDRESSES: { [chainId: number]: string } = {
  [hardhat.id]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  [baseSepolia.id]: "0x7485ba960Cf0FEbf9fA0C699300d37c5c3B72799",
  [shibarium.id]: "0x9fF04b2d1be38783D0CAb05205C3caD3D0D71208",
}

export const algorithm = "aes-256-cbc"
