import { Interface, InterfaceAbi, ethers } from "ethers"
import lighthouse from "@lighthouse-web3/sdk"

export const getSignedContract = async (
  address: string,
  contractAddress: string,
  ABI: Interface | InterfaceAbi
): Promise<ethers.Contract> => {
  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner(address)

  return new ethers.Contract(contractAddress, ABI, signer)
}

export const getBaseURL = (cid: string) =>
  `https://gateway.lighthouse.storage/ipfs/${cid}`

export const signAuthMessage = async (address: string) => {
  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner(address)

  const messageRequested = (await lighthouse.getAuthMessage(address)).data
    .message

  if (!messageRequested) return

  const signedMessage = await signer.signMessage(messageRequested)

  return signedMessage
}
