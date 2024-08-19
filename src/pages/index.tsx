import Link from "next/link"
import {
  CheckCircleIcon,
  DollarSign,
  Footprints,
  HeartHandshake,
  Lightbulb,
  PlusIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useSheLeadsContext } from "@/components/web3/context/sheLeadsContext"
import { useEffect, useState } from "react"
import { SheLeads } from "@/components/abis/types/SheLeads"
import { useRouter } from "next/router"
import ViewRecommendation from "@/components/web/viewRecommendation"
import { getFormatDate } from "@/lib/utils"
import logo from "../../public/logo-no-bg.png"
import Image from "next/image"
import DailyQuote from "@/components/web/dailyQuote"

export default function Home() {
  const { getRecommendations, contract } = useSheLeadsContext()
  const router = useRouter()
  const [isPreloading, setIsPreloading] = useState(false)
  const [recommendations, setRecommendations] = useState<
    SheLeads.RecommendationStruct[] | undefined
  >()

  useEffect(() => {
    const asyncFunc = async () => {
      if (!contract || isPreloading) return
      setIsPreloading(true)

      const recomm = await getRecommendations()

      setRecommendations(recomm)
    }

    asyncFunc()
  }, [contract, recommendations])

  if (!contract)
    return (
      <div className="flex flex-col items-center py-64 gap-4 ">
        <Image src={logo} alt="SheLeads" width="300" />
      </div>
    )
  else
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold tracking-wide">
                Total Recommendations
              </CardTitle>
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {recommendations?.length ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Last generated at: 09:12 PM - 07/06/2024
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold tracking-wide">
                Action Plan Tracker Done!
              </CardTitle>
              <Footprints className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5 of 14</div>
              <p className="text-xs text-muted-foreground">
                Last step done at: 15:34 PM - 08/20/2024
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold tracking-wide">
                Total Tokens
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">54 $KNINE</div>
              <p className="text-xs text-muted-foreground">
                Earned money: USD $43
              </p>
            </CardContent>
          </Card>
          <DailyQuote />
          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold tracking-wide">
                My Last Inspiration
              </CardTitle>
              <HeartHandshake className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Frase motivacional creada por la AI
              </p>
            </CardContent>
          </Card> */}
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Last Recommendations</CardTitle>
                <CardDescription>
                  Recent recommendations based in your Professional Profile
                </CardDescription>
              </div>
              <Button
                asChild
                size="sm"
                className="ml-auto gap-1"
                onClick={(e) => {
                  e.preventDefault()
                  router.push("/profile")
                }}
              >
                <Link href="#">
                  <PlusIcon className="h-4 w-4" />
                  Add New
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recommendations?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No recommendations were found
                        <br />
                        <Button
                          asChild
                          variant="link"
                          className="ml-auto gap-1 underline"
                          onClick={(e) => {
                            e.preventDefault()
                            router.push("/profile")
                          }}
                        >
                          <Link href="#">Add New</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                  {recommendations?.map((r, idx) => {
                    return (
                      <TableRow key={idx}>
                        <TableCell>
                          <div className="font-medium">
                            {getFormatDate(r.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button>View</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[825px]">
                              <DialogHeader>
                                <DialogTitle className="text-center text-xl font-semibold">
                                  Tailored AI Recommendations
                                </DialogTitle>
                              </DialogHeader>
                              <ViewRecommendation recommendation={r} />
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-5">
            <CardHeader>
              <CardTitle>Action Plan Tracker Last Steps</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Participate in online design communities
                  </p>
                  <p className="text-xs text-muted-foreground">
                    16:40 PM - 09/08/2024
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Engage with mentors in the UI/UX field
                  </p>
                  <p className="text-xs text-muted-foreground">
                    16:40 PM - 05/08/2024
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />

                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Join a Blockchain and AI networking group
                  </p>
                  <p className="text-xs text-muted-foreground">
                    16:40 PM - 02/08/2024
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-center w-full">
          <Image src={logo} alt="SheLeads" width="100" />
        </div>
      </div>
    )
}
