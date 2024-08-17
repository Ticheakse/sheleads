import { useEffect, useState } from "react"

import { useSheLeadsContext } from "@/components/web3/context/sheLeadsContext"
import { getAIResponse, viewIPFSContent } from "@/lib/utils"
import { SheLeads } from "@/components/abis/types/SheLeads"
import { RecommendationsType } from "@/components/abis/types/generalTypes"
import { getPromptForLinkedIn } from "@/lib/prompts"
import { Button } from "@/components/ui/button"

const ActionPlan = () => {
  const {
    getMyActionPlan,
    getProfessionalProfile: getPP,
    getRecommendation,
    contract,
  } = useSheLeadsContext()
  const [actionPlan, setActionPlan] = useState()
  const [professionalProfileId, setProfessionalProfileId] = useState<string>("")
  const [recommendations, setRecommendations] = useState<RecommendationsType>()
  const [professionalProfile, setProfessionalProfile] = useState<
    SheLeads.ProfessionalProfileStruct | undefined
  >()
  const [promptLinkedIn, setPromptLinkedIn] = useState<string>("")

  const getProfessionalProfile =
    async (): Promise<SheLeads.ProfessionalProfileStruct | null> => {
      const pp = await getPP()
      if (pp?.id == undefined || pp?.content === "") return null
      console.log('pp?.id.toString() :>> ', pp?.id.toString());
      setProfessionalProfileId(pp?.id.toString())
      const profileContent = await viewIPFSContent(pp.content)
      setProfessionalProfile(profileContent)
      return profileContent
    }

  const getRec = async (
    pid: number
  ): Promise<SheLeads.RecommendationStruct | null> => {
    const rec = await getRecommendation(pid)
    if (!rec || rec.id === undefined || rec.content === "") return null
    setProfessionalProfileId(rec?.id.toString())
    const recContent = await viewIPFSContent(rec.content)
    setRecommendations(recContent)
    return recContent
  }

  useEffect(() => {
    const asyncFunc = async () => {
      if (!contract && professionalProfileId === "") return
      console.log('professionalProfileId.length :>> ', professionalProfileId.length);

      const ap = await getMyActionPlan()

      if (!ap || ap.content === undefined || ap.content === "") return
      const realActionPlan = await viewIPFSContent(ap.content)

      setActionPlan(realActionPlan)

      const pp = await getProfessionalProfile()
      console.log('professionalProfileId :>> ', professionalProfileId);
      if (pp && professionalProfileId) {
        const rec = await getRec(parseInt(professionalProfileId));
        const pln = getPromptForLinkedIn(pp, rec, realActionPlan);

        setPromptLinkedIn(pln);
      }
    }

    asyncFunc()
  }, [contract, professionalProfileId])

  const getLinkedInRecommendation = async () => {
    let res = await getAIResponse(promptLinkedIn)
    console.log("res :>> ", res)
  }

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 max-w-4xl mx-auto bg-background m-8 shadow-lg rounded-lg gap-y-5">
      <h1 className="text-xl font-semibold text-center">My Action Plan</h1>
      {actionPlan != undefined ? (
        <>
          <h2>My Action Plan</h2>
          <Button onClick={getLinkedInRecommendation}>Recommendation for LinkedIn</Button>
        </>
      ) : (
        <h2>Action Plan not ready yet</h2>
      )}
    </div>
  )
}

export default ActionPlan
