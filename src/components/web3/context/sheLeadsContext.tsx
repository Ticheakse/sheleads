import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react"

import { SheLeads } from "@/components/abis/types/SheLeads"
import SheLeadsAbi from "@/components/abis/SheLeads.json"
import useContract from "@/hooks/useContract"
import { CONTRACT_ADDRESSES } from "@/lib/constants"
import { useChainId } from "wagmi"
import { useRouter } from "next/router"
import { ethers } from "ethers"

type SheLeadsProviderProps = {
  children: ReactNode
}

type SheLeadsContextType = {
  contract: ethers.Contract | null
  isConnected: boolean
  addProfessionalProfile: (contentId: string) => Promise<void>
  getProfessionalProfile: () => Promise<
    SheLeads.ProfessionalProfileStruct | undefined
  >
  addRecommendation: (
    professionalProfileId: number,
    content: string
  ) => Promise<void>
  getRecommendation: (
    professionalProfileId: number
  ) => Promise<SheLeads.RecommendationStruct | undefined>
  addActionPlan: (recommendationId: number, content: string) => Promise<void>
  getMyActionPlan: () => Promise<SheLeads.ActionPlanStruct | undefined>
  responsesCGPT: JSON[]
  setResponsesCGPT: Dispatch<SetStateAction<JSON[]>>
  addRecommendationActionPlan: (
    recommendationId: number,
    contentRecommendation: string,
    contentActionPlan: string
  ) => Promise<void>
  getRecommendations: () => Promise<SheLeads.RecommendationStruct[] | undefined>
  sendRequest: (prompt: string) => Promise<void>
  getActionPlan: (id: number) => Promise<SheLeads.ActionPlanStruct | undefined>
}

export const SheLeadsContext = createContext<SheLeadsContextType | null>(null)

const SheLeadsProvider = ({ children }: SheLeadsProviderProps) => {
  const router = useRouter()
  const chainId = useChainId()
  const [responsesCGPT, setResponsesCGPT] = useState<JSON[]>([])

  const { contract, isConnected } = useContract({
    contractAddress: CONTRACT_ADDRESSES[chainId],
    ABI: SheLeadsAbi.abi,
  })

  const addProfessionalProfile = async (content: string): Promise<void> => {
    if (!contract) return

    const tx1 = await contract.addProfessionalProfile(content)
    await tx1.wait()
  }

  const getProfessionalProfile = async (): Promise<
    SheLeads.ProfessionalProfileStruct | undefined
  > => {
    if (!contract) return

    return await contract.getProfessionalProfile()
  }

  const addRecommendation = async (
    professionalProfileId: number,
    content: string
  ): Promise<void> => {
    if (!contract) return

    const tx1 = await contract.addRecommendation(professionalProfileId, content)
    await tx1.wait()
  }

  const getRecommendation = async (
    professionalProfileId: number
  ): Promise<SheLeads.RecommendationStruct | undefined> => {
    if (!contract) return

    return await contract.getRecommendation(professionalProfileId)
  }

  const addActionPlan = async (
    recommendationId: number,
    content: string
  ): Promise<void> => {
    if (!contract) return

    const tx1 = await contract.addActionPlan(recommendationId, content)
    await tx1.wait()
  }

  const addRecommendationActionPlan = async (
    recommendationId: number,
    contentRecommendation: string,
    contentActionPlan: string
  ): Promise<void> => {
    if (!contract) return

    const tx1 = await contract.addRecommendationActionPlan(
      recommendationId,
      contentRecommendation,
      contentActionPlan
    )
    await tx1.wait()
  }

  const getMyActionPlan = async (): Promise<
    SheLeads.ActionPlanStruct | undefined
  > => {
    if (!contract) return

    return await contract.getMyActionPlan()
  }

  const getActionPlan = async (
    id: number
  ): Promise<SheLeads.ActionPlanStruct | undefined> => {
    if (!contract) return

    return await contract.getActionPlan(id)
  }

  const getRecommendations = async (): Promise<
    SheLeads.RecommendationStruct[] | undefined
  > => {
    if (!contract) return

    return await contract.getRecommendations()
  }

  const sendRequest = async (prompt: string) => {
    if (!contract) return

    await contract.sendRequest(156, process.env.NEXT_PUBLIC_OPENAI_ENC, [
      prompt,
    ])
  }

  return (
    <SheLeadsContext.Provider
      value={{
        contract,
        isConnected,
        addProfessionalProfile,
        getProfessionalProfile,
        addRecommendation,
        getRecommendation,
        addActionPlan,
        getMyActionPlan,
        responsesCGPT,
        setResponsesCGPT,
        addRecommendationActionPlan,
        getRecommendations,
        sendRequest,
        getActionPlan,
      }}
    >
      {children}
    </SheLeadsContext.Provider>
  )
}

export default SheLeadsProvider
export const useSheLeadsContext = () =>
  useContext(SheLeadsContext) as SheLeadsContextType
