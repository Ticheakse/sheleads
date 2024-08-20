import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useChainId } from "wagmi"

import { useSheLeadsContext } from "@/components/web3/context/sheLeadsContext"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { cn, getAIResponse, upload, viewIPFSContent } from "@/lib/utils"
import { SheLeads } from "@/components/abis/types/SheLeads"
import {
  getPromptForActionPlan,
  getPromptForRecommendations,
  getPromptForValidation,
  getPromptRegenerateRecommendation,
} from "@/lib/prompts"
import { RecommendationsType } from "@/components/abis/types/generalTypes"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

const formSchema = z.object({
  recommendations: z.array(
    z.object({
      isApproved: z.boolean().default(false).optional(),
      title: z.string().min(2, {
        message: "Duration must be at least 2 characters.",
      }),
      description: z.string().min(2, {
        message: "Duration must be at least 2 characters.",
      }),
    })
  ),
})

const Recommendations = () => {
  const chainId = useChainId()
  const router = useRouter()
  const {
    getProfessionalProfile: getPP,
    addRecommendationActionPlan,
    contract,
    isConnected,
    sendRequest,
  } = useSheLeadsContext()
  const [isLoading, setIsLoading] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [indexRegen, setIndexRegen] = useState(0)
  const [isValidate, setIsValidate] = useState(false)
  const [professionalProfileId, setProfessionalProfileId] = useState<string>("")
  const [recommendations, setRecommendations] = useState<RecommendationsType>()
  const [professionalProfile, setProfessionalProfile] = useState<
    SheLeads.ProfessionalProfileStruct | undefined
  >()

  const getProfessionalProfile =
    async (): Promise<SheLeads.ProfessionalProfileStruct | null> => {
      const pp = await getPP()
      if (pp?.id == undefined || pp?.content === "") return null
      setProfessionalProfileId(pp?.id.toString())
      return await viewIPFSContent(pp?.content)
    }

  const validateWithChainlinkFunctions = async () => {
    const pp = getPromptForValidation(
      JSON.stringify(recommendations),
      JSON.stringify(professionalProfile)
    )

    await sendRequest(pp)
  }

  useEffect(() => {
    if (!isConnected) router.push("/")
  }, [isConnected])

  useEffect(() => {
    const asyncFunc = async () => {
      if (!(contract && professionalProfileId === "")) return
      console.log("professionalProfileId :>> ", professionalProfileId)

      const professionalProfile = await getProfessionalProfile()
      if (professionalProfile === null) return
      setProfessionalProfile(professionalProfile)

      let promptforRecommendations =
        getPromptForRecommendations(professionalProfile)

      const recomm = await getAIResponse(promptforRecommendations)

      setRecommendations(recomm)
    }

    asyncFunc()
  }, [contract, professionalProfileId])

  useEffect(() => {
    const asyncFunc = async () => {
      if (isValidate) return
      if (chainId !== 84532) return

      if (
        recommendations != undefined &&
        recommendations?.recommendations != undefined &&
        professionalProfile != undefined &&
        /* @ts-ignore */
        professionalProfile.workExperience != undefined
      ) {
        await validateWithChainlinkFunctions()
        setIsValidate(true)
      }
    }

    asyncFunc()
  }, [recommendations, professionalProfile, isValidate])

  const regenerate = async (index: number) => {
    setIsRegenerating(true)
    setIndexRegen(index)
    let promptRegenerateRecommendation = getPromptRegenerateRecommendation(
      /* @ts-ignore */
      JSON.stringify(recommendations),
      index
    )
    const recomm = await getAIResponse(promptRegenerateRecommendation)

    setRecommendations(recomm)
    setIsRegenerating(false)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: { recommendations: recommendations?.recommendations || [] },
  })

  const { fields } = useFieldArray({
    name: "recommendations",
    control: form.control,
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)

    const approvedRecommendations = values.recommendations.filter(
      (v) => v.isApproved
    )
    // console.log("approvedRecommendations :>> ", approvedRecommendations)

    const promptForActionPlan = getPromptForActionPlan(
      professionalProfile,
      approvedRecommendations
    )
    // console.log("promptForActionPlan :>> ", promptForActionPlan)

    const cidForApprovedRecommendations = await upload(
      JSON.stringify(approvedRecommendations)
    )

    const actionPlanGenerated = await getAIResponse(promptForActionPlan)
    const cidForActionPlan = await upload(JSON.stringify(actionPlanGenerated))

    await addRecommendationActionPlan(
      parseInt(professionalProfileId),
      cidForApprovedRecommendations,
      cidForActionPlan
    )

    setIsLoading(false)
    router.push("/actionPlan")
  }

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 max-w-4xl mx-auto bg-background m-8 shadow-lg rounded-lg gap-y-5">
      <h1 className="text-xl font-semibold text-center">
        Tailored AI Recommendations
      </h1>
      {recommendations?.recommendations == undefined ? (
        <LoadingSpinner />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id}>
                <div
                  className={cn(
                    `grid grid-cols-8 gap-4 border-2 rounded-md border-gray-500/40 p-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-300`,
                    isRegenerating && index === indexRegen
                      ? "text-muted-foreground"
                      : ""
                  )}
                >
                  <div className="flex flex-row gap-4 col-span-3">
                    <div className="flex justify-end items-center">
                      <FormField
                        control={form.control}
                        name={`recommendations.${index}.isApproved`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row justify-between space-x-3 space-y-0 ">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex justify-end items-center">
                      <FormField
                        control={form.control}
                        name={`recommendations.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex flex-col gap-2">
                              <p className="text-base">{field.value}</p>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="hidden"
                                placeholder="companyName"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name={`recommendations.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex flex-col gap-2">
                            <h2 className="text-sm font-semibold">
                              Description:
                            </h2>{" "}
                            <p className="px-2">{field.value}</p>
                          </FormLabel>
                          <FormControl>
                            <Input type="hidden" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div
                    className={cn(
                      "flex justify-end items-center",
                      isRegenerating && index === indexRegen
                        ? "justify-center"
                        : ""
                    )}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isRegenerating}
                      onClick={(e) => {
                        e.preventDefault()

                        regenerate(index)
                      }}
                    >
                      {isRegenerating && index === indexRegen ? (
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <span>Regenerate</span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-end w-full pt-2">
              <Button
                type="submit"
                disabled={!form.formState.isDirty || isLoading}
              >
                {isLoading && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Generate Action Plan
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}

export default Recommendations
