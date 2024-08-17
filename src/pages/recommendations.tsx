import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { ReloadIcon } from "@radix-ui/react-icons"

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
import { getAIResponse, upload, viewIPFSContent } from "@/lib/utils"
import { SheLeads } from "@/components/abis/types/SheLeads"
import {
  getPromptForActionPlan,
  getPromptForRecommendations,
  getPromptForValidation,
} from "@/lib/prompts"
import { RecommendationsType } from "@/components/abis/types/generalTypes"

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
  const router = useRouter()
  const {
    getProfessionalProfile: getPP,
    addRecommendationActionPlan,
    contract,
  } = useSheLeadsContext()
  const [isLoading, setIsLoading] = useState(false)
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

  useEffect(() => {
    const asyncFunc = async () => {
      if (!contract) return

      const professionalProfile = await getProfessionalProfile()
      if (professionalProfile === null) return
      setProfessionalProfile(professionalProfile)

      let promptforRecommendations =
        getPromptForRecommendations(professionalProfile)

      const recomm = await getAIResponse(promptforRecommendations)

      setRecommendations(recomm)
    }

    asyncFunc()
  }, [contract])

  const regenerate = (id: number) => {
    console.log("id :>> ", id)
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
      <h1 className="text-xl font-semibold text-center">Recommendations</h1>
      {recommendations?.recommendations == undefined ? (
        <h1>loading</h1>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id}>
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
                <FormField
                  control={form.control}
                  name={`recommendations.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title: {field.value}</FormLabel>
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
                <FormField
                  control={form.control}
                  name={`recommendations.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description: {field.value}</FormLabel>
                      <FormControl>
                        <Input type="hidden" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault()

                    regenerate(index)
                  }}
                >
                  Regenerate
                </Button>
              </div>
            ))}

            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Generate Action Plan
            </Button>
          </form>
        </Form>
      )}
    </div>
  )
}

export default Recommendations
