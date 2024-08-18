import crypto from "crypto"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { algorithm } from "./constants"
import { EncryptDataProps } from "@/components/abis/types/generalTypes"

const key = process.env.ENCRIPTION_KEY || ""

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getBaseURL = (cid: string) =>
  `https://gateway.lighthouse.storage/ipfs/${cid}`

export const encryptData = (data: any): EncryptDataProps => {
  const iv = crypto.randomBytes(16)
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key, "hex"), iv)

  let encrypted = cipher.update(data)
  encrypted = Buffer.concat([encrypted, cipher.final()])

  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") }
}

export const decrypt = (data: EncryptDataProps): string => {
  let iv = Buffer.from(data.iv, "hex")
  let encryptedText = Buffer.from(data.encryptedData, "hex")
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, "hex"), iv)
  let decrypted = decipher.update(encryptedText)

  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}

export const listCID = async (cid: string) => {
  const jsonContent = await fetch(`${getBaseURL(cid)}`)
  return await jsonContent.json()
}

export const upload = async (data: any): Promise<string> => {
  const response = await fetch("/api/ipfs", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  })

  const contentID = await response.json()
  if (contentID.cid === "") return ""

  return contentID.cid
}

export const cleanCGPTResponse = (text: string) => {
  text = text.replaceAll("```json", "")
  text = text.replaceAll("```", "")

  return JSON.parse(text)
}

export const viewIPFSContent = async (cid: string) => {
  const contenido = await fetch(`/api/ipfs?cid=${cid}`)
  const res = await contenido.json()
  return res.resource
}

export const fetchAI = async (prompt: string) => {
  const response = await fetch("/api/cgpt", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  })
  let { text } = await response.json()
console.log('text :>> ', text);
  text = text.replaceAll("```json", "")
  text = text.replaceAll("```", "")

  return JSON.parse(text)
}

export const getAIResponse = async (prompt: string) => {
  const text = await fetchAI(prompt)

  return text
}
