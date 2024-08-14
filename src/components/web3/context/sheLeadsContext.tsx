import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
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
  addProfessionalProfile: (content: string) => Promise<void>
  getProfessionalProfile: () => Promise<
    SheLeads.ProfessionalProfileStruct | undefined
  >
  addRecommendation: (
    professionalProfileId: number,
    content: string
  ) => Promise<void>
  getRecomendation: (
    professionalProfileId: number
  ) => Promise<SheLeads.RecommendationStruct | undefined>
  addActionPlan: (recommendationId: number, content: string) => Promise<void>
  getActionPlan: (
    recommendationId: number
  ) => Promise<SheLeads.ActionPlanStruct | undefined>
}

export const SheLeadsContext = createContext<SheLeadsContextType | null>(null)

const SheLeadsProvider = ({ children }: SheLeadsProviderProps) => {
  const router = useRouter()
  const chainId = useChainId()

  const { contract, isConnected } = useContract({
    contractAddress: CONTRACT_ADDRESSES[chainId],
    ABI: SheLeadsAbi.abi,
  })

  // useEffect(() => {
  //   const asyncFunc = async () => {
  //     if (isConnected && contract) {
  //       const userI = await contract.getMyUserInfo()

  //       if (!userI.name) router.push("/register")
  //       else {
  //         setUserInfo(userI)
  //       }
  //     } else {
  //       // router.push("/")
  //     }
  //   }

  //   asyncFunc()
  // }, [isConnected, contract])

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

  const getRecomendation = async (
    professionalProfileId: number
  ): Promise<SheLeads.RecommendationStruct | undefined> => {
    if (!contract) return

    return await contract.getRecomendation(professionalProfileId)
  }

  const addActionPlan = async (
    recommendationId: number,
    content: string
  ): Promise<void> => {
    if (!contract) return

    const tx1 = await contract.addActionPlan(recommendationId, content)
    await tx1.wait()
  }

  const getActionPlan = async (
    recommendationId: number
  ): Promise<SheLeads.ActionPlanStruct | undefined> => {
    if (!contract) return

    return await contract.getActionPlan(recommendationId)
  }

  return (
    <SheLeadsContext.Provider
      value={{
        contract,
        addProfessionalProfile,
        getProfessionalProfile,
        addRecommendation,
        getRecomendation,
        addActionPlan,
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
