export type TIMEZONE = "Europe/Madrid" | "Europe/Paris" | "Europe/Istanbul"

declare global {
  interface Window {
    ethereum: any
  }
}

export type EncryptDataProps = { iv: string; encryptedData: string }

type RecommendationType = {
  isApproved: boolean
  title: string
  description: string
}

export type RecommendationsType = {
  recommendations: RecommendationType[]
}
