import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { HeartHandshake, Linkedin } from "lucide-react"
import { onlyFetchAi } from "@/lib/utils"
import { getDailyQuotePrompt } from "@/lib/prompts"
import { LoadingSpinner } from "../ui/loading-spinner"
import { Button } from "../ui/button"
import { useRouter } from "next/router"

const WidgetLinkedIn = () => {
  const router = useRouter()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold tracking-wide">
          LinkedIn Profile
        </CardTitle>
        <Linkedin className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex items-center justify-center pt-5">
        <Button
          onClick={(e) => {
            e.preventDefault()
            router.push("/linkedInProfile")
          }}
        >
          View profile
        </Button>
      </CardContent>
    </Card>
  )
}

export default WidgetLinkedIn
