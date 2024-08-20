import { useEffect, useState } from "react"

import { useSheLeadsContext } from "@/components/web3/context/sheLeadsContext"
import { viewIPFSContent } from "@/lib/utils"
import { ActionPlanType } from "@/components/abis/types/generalTypes"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter, useSearchParams } from "next/navigation"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

const ActionPlan = () => {
  const { getMyActionPlan, getActionPlan, contract, isConnected } =
    useSheLeadsContext()
  const router = useRouter()
  const searchParams = useSearchParams()
  const actionPlanId = searchParams.get("actionPlanId")

  const [actionPlan, setActionPlan] = useState<ActionPlanType>()

  useEffect(() => {
    if (!isConnected) router.push("/")
  }, [isConnected])

  useEffect(() => {
    const getActionPlanAsync = async () => {
      if (!contract) return

      const ap =
        actionPlanId === null
          ? await getMyActionPlan()
          : await getActionPlan(parseInt(actionPlanId))

      if (!ap || ap.content === undefined || ap.content === "") return
      const realActionPlan = await viewIPFSContent(ap.content)

      setActionPlan(realActionPlan)
    }

    getActionPlanAsync()
  }, [contract])

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 max-w-4xl mx-auto bg-background m-8 shadow-lg rounded-lg gap-y-5">
      <h1 className="text-2xl font-semibold text-center pb-5 underline">
        Your Action Plan!
      </h1>
      {actionPlan != undefined ? (
        <>
          {actionPlan.actionPlan.map((ap, apIdx) => (
            <div key={apIdx}>
              <h3 className="text-lg p-4 border border-black/80 rounded-sm w-fit font-bold">
                {ap.item}
              </h3>
              <ul className="list-none py-4 flex flex-col gap-7">
                {ap.goals.map((g, index) => (
                  <li className="flex flex-col gap-3" key={index}>
                    <div className="flex flex-row gap-2 items-center">
                      <Badge className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg">
                        {index + 1}
                      </Badge>
                      <h4 className="text-lg font-semibold">{g.goal}</h4>
                    </div>
                    <ul className="list-none">
                      {g.actions.map((a, aIdx) => (
                        <li className="px-10" key={aIdx}>
                          <h5>
                            <span className="font-semibold">Title:</span>{" "}
                            {a.actionTitle}
                          </h5>
                          <h5>
                            <span className="font-semibold">Description:</span>{" "}
                            {a.description}
                          </h5>
                          <h5>
                            <span className="font-semibold">Timeline:</span>{" "}
                            {a.timeline}
                          </h5>
                          {a.resources.length > 0 && (
                            <div className="border border-black/40 p-3 rounded-md mt-4">
                              <h6 className="font-semibold pb-3">
                                Your Resources:
                              </h6>
                              {a.resources.map((r, rIdx) => (
                                <div className="px-4" key={rIdx}>
                                  <a
                                    href={r.link}
                                    target="_blank"
                                    className="underline"
                                  >
                                    {r.resourceName}
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex justify-end w-full pt-2">
            <Button
              onClick={() => {
                router.push("/")
              }}
            >
              View Dashboard
            </Button>
          </div>
        </>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  )
}

export default ActionPlan
