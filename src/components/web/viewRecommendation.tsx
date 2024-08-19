import { useEffect, useState } from "react"

import { cn, viewIPFSContent } from "@/lib/utils"
import { SheLeads } from "@/components/abis/types/SheLeads"

type ViewRecommendationProps = {
  recommendation: SheLeads.RecommendationStruct
}

const ViewRecommendation = ({ recommendation }: ViewRecommendationProps) => {
  const [recomm, setRecomm] =
    useState<{ title: string; description: string }[]>()

  useEffect(() => {
    const asyncFunc = async () => {
      const theRecomm = await viewIPFSContent(recommendation.content)
      setRecomm(theRecomm)
    }

    asyncFunc()
  }, [])

  return (
    <div className="flex flex-col gap-y-5">
      {recomm?.map((r, idx) => (
        <div
          key={idx}
          className={cn(
            ` gap-4 border-2 rounded-md border-gray-500/40 p-4 hover:shadow-lg transition-all duration-300`
          )}
        >
          <div className="flex flex-col gap-4 ">
            <h5>
              <span className="font-semibold">Title:</span> {r.title}
            </h5>
            <h5>
              <span className="font-semibold">Description:</span>{" "}
              {r.description}
            </h5>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ViewRecommendation
