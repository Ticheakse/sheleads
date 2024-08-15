import { Interface, InterfaceAbi, ethers } from "ethers"
import lighthouse from "@lighthouse-web3/sdk"
import { decrypt, encryptData, listCID } from "./utils"

const apiKey = process.env.LIGHTHOUSE_API_KEY as string

export const getSignedContract = async (
  address: string,
  contractAddress: string,
  ABI: Interface | InterfaceAbi
): Promise<ethers.Contract> => {
  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner(address)

  return new ethers.Contract(contractAddress, ABI, signer)
}

export const uploadToIPFS = async (
  content: any
): Promise<{
  data: any
}> => {
  const { iv, encryptedData } = encryptData(content)

  const dataToStore = JSON.stringify({ iv, encryptedData })

  return await lighthouse.uploadText(dataToStore, apiKey)
}

export const decryptCID = async (cid: string) => {
  const encryptedData = await listCID(cid)
  return decrypt(encryptedData)
}
