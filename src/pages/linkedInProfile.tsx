// @ts-nocheck
import { useEffect, useState } from "react"

import { useSheLeadsContext } from "@/components/web3/context/sheLeadsContext"
import { getAIResponse, viewIPFSContent } from "@/lib/utils"
import { RecommendationsType } from "@/components/abis/types/generalTypes"
import { getPromptForLinkedIn } from "@/lib/prompts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { SheLeads } from "@/components/abis/types/SheLeads"

const LinkedInProfile = () => {
  const {
    getMyActionPlan,
    getProfessionalProfile: getPP,
    getRecommendation,
    contract,
    isConnected,
  } = useSheLeadsContext()
  const router = useRouter()
  const [professionalProfileId, setProfessionalProfileId] = useState<string>("")
  const [promptLinkedIn, setPromptLinkedIn] = useState<string>("")
  const [lip, setLinkedInInfo] = useState()

  useEffect(() => {
    if (!isConnected) router.push("/")
  }, [isConnected])

  const getProfessionalProfile = async (): Promise<{
    id: string
    content: string
  } | null> => {
    const pp = await getPP()
    if (pp?.id == undefined || pp?.content === "") return null
    setProfessionalProfileId(pp?.id.toString())
    const content = await viewIPFSContent(pp?.content)
    return { id: pp?.id.toString(), content }
  }

  const getRec = async (
    pid: number
  ): Promise<SheLeads.RecommendationStruct | null> => {
    const rec = await getRecommendation(pid)
    if (!rec || rec.id === undefined || rec.content === "") return null
    setProfessionalProfileId(rec?.id.toString())
    const recContent = await viewIPFSContent(rec.content)
    return recContent
  }

  useEffect(() => {
    const asyncFunc = async () => {
      if (!contract && (professionalProfileId === "" || promptLinkedIn === ""))
        return

      const ap = await getMyActionPlan()

      if (!ap || ap.content === undefined || ap.content === "") return
      const realActionPlan = await viewIPFSContent(ap.content)

      if (professionalProfileId === "") {
        const pp = await getProfessionalProfile()

        if (pp) {
          const rec = await getRec(parseInt(pp.id))
          const pln = getPromptForLinkedIn(pp, rec, realActionPlan)
          setPromptLinkedIn(pln)

          let res = await getAIResponse(pln)
          setLinkedInInfo(res.linkedinProfileUpdate)
        }
      }
    }

    asyncFunc()
  }, [contract, professionalProfileId, promptLinkedIn])

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 max-w-4xl mx-auto bg-background m-8 shadow-lg rounded-lg gap-y-5">
      <div className="text-center pb-5">
        <h1 className="text-2xl font-semibold  underline">
          LinkedIn Recommendations for your Profile
        </h1>
        <span className="text-sm">
          Copy and paste the information to get your LinkedIn Profile updated
        </span>
      </div>

      {lip != undefined ? (
        <>
          <div className="grid gap-5">
            <div className="grid p-8 gap-2 border border-black/80 rounded-sm w-fit">
              <h3 className="text-lg w-fit font-semibold">Personal Bio</h3>
              <p className="text-base  w-fit ">{lip.professionalBio}</p>
            </div>

            <div className="grid p-8 gap-2 border border-black/80 rounded-sm w-fit">
              <h3 className="text-lg w-fit font-semibold">Work Experience</h3>
              <ul className="list-none grid gap-5 pt-5">
                {lip.workExperience?.map((a, aIdx) => (
                  <li className="px-2 grid gap-5" key={aIdx}>
                    <div className="flex flex-row gap-2 items-center">
                      <Badge className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg">
                        {aIdx + 1}
                      </Badge>
                      <h4 className="text-lg font-semibold">{a.jobTitle}</h4>
                    </div>
                    <div>
                      <h5>
                        <span className="font-semibold">Company Name:</span>{" "}
                        {a.companyName}
                      </h5>
                      <h5>
                        <span className="font-semibold">Duration:</span>{" "}
                        {a.duration}
                      </h5>
                      <h5>
                        <span className="font-semibold">
                          Main Responsabilities:
                        </span>{" "}
                        {a.mainResponsibilities}
                      </h5>
                      <h5>
                        <span className="font-semibold">Achievements:</span>{" "}
                        {a.achievements}
                      </h5>
                      <h5>
                        <span className="font-semibold">Specifics Skills:</span>{" "}
                        {a.specificSkills.map(String).join(", ")}
                      </h5>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid p-8 gap-2 border border-black/80 rounded-sm w-fit">
              <h3 className="text-lg w-fit font-semibold">
                Skills and Endorsments
              </h3>
              <p className="text-base  w-fit ">
                {lip.skillsAndEndorsements.map(String).join(", ")}
              </p>
            </div>
          </div>

          <div className="flex justify-start w-full pt-2">
            <Button
              onClick={() => {
                router.push("/")
              }}
            >
              Back to Home
            </Button>
          </div>
        </>
      ) : (
        <h2>Searching the best LinkedIn Profile for you</h2>
      )}
    </div>
  )
}

export default LinkedInProfile
