import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { HeartHandshake } from "lucide-react"
import { onlyFetchAi } from "@/lib/utils"
import { getDailyQuotePrompt } from "@/lib/prompts"
import { LoadingSpinner } from "../ui/loading-spinner"

const DailyQuote = () => {
  const [dailyQuote, setDailyQuote] = useState("")

  useEffect(() => {
    const asyncFunc = async () => {
      if (dailyQuote !== "") return

      const dq = await onlyFetchAi(getDailyQuotePrompt())
      setDailyQuote(dq.text)
    }
    asyncFunc()
  }, [dailyQuote])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold tracking-wide">
          Daily Inspiration
        </CardTitle>
        <HeartHandshake className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {dailyQuote === "" ? (
          <LoadingSpinner />
        ) : (
          <p className="text-sm text-muted-foreground">{dailyQuote}</p>
        )}
      </CardContent>
    </Card>
  )
}

export default DailyQuote
