import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

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
import { ReloadIcon } from "@radix-ui/react-icons"
import { upload, viewIPFSContent } from "@/lib/utils"
import {
  professionalProfileSoftwareEngineer,
  professionalProfileWaleska,
} from "@/components/data/professionalProfile"
import { Textarea } from "@/components/ui/textarea"
import { SheLeads } from "@/components/abis/types/SheLeads"

const formSchema = z.object({
  workExperience: z.array(
    z.object({
      jobTitle: z.string().min(2, {
        message: "Job Title must be at least 2 characters.",
      }),
      companyName: z
        .string()
        .min(2, {
          message: "Company Name must be at least 2 characters.",
        })
        .optional(),
      duration: z.string().min(2, {
        message: "Duration must be at least 2 characters.",
      }),
      mainResponsabilities: z.string().min(2, {
        message: "Main Responsabilities must be at least 2 characters.",
      }),
      specificSkills: z.string().min(2, {
        message: "Specific Skills must be at least 2 characters.",
      }),
    })
  ),
  educationCertification: z.object({
    highestLevelOfEducation: z.string().min(2, {
      message: "Highest Level of Education must be at least 2 characters.",
    }),
    fieldOfStudy: z.string().min(2, {
      message: "Field of Study must be at least 2 characters.",
    }),
    certifications: z.string().min(2, {
      message: "Certifications must be at least 2 characters.",
    }),
  }),
  personalCompetences: z.object({
    strengths: z.string().min(2, {
      message: "Strengths must be at least 2 characters.",
    }),
    weaknesses: z.string().min(2, {
      message: "Weaknesses must be at least 2 characters.",
    }),
  }),
  goalsAndInspirations: z.object({
    WhatWouldYouLikeToDo: z.string().min(2, {
      message: "What You Would Like to Do must be at least 2 characters.",
    }),
    shortTermGoals: z
      .string()
      .min(2, {
        message: "Short-Term Goals must be at least 2 characters.",
      })
      .optional(),
    longTermGoals: z
      .string()
      .min(2, {
        message: "Long-Term Goals must be at least 2 characters.",
      })
      .optional(),
  }),
  personalInterests: z.object({
    areasOfPersonalInterest: z.string().min(2, {
      message: "Areas of Personal Interest must be at least 2 characters.",
    }),
    timeAvailability: z
      .string()
      .min(2, {
        message: "Time Availability must be at least 2 characters.",
      })
      .optional(),
  }),
})

const Profile = () => {
  const router = useRouter()
  const {
    addProfessionalProfile,
    getProfessionalProfile: getPP,
    contract,
    isConnected,
  } = useSheLeadsContext()
  const [isLoading, setIsLoading] = useState(false)
  const [dummyData, setDummyData] = useState<z.infer<typeof formSchema>>()

  const [professionalProfileId, setProfessionalProfileId] = useState<string>("")
  const [professionalProfile, setProfessionalProfile] = useState<
    SheLeads.ProfessionalProfileStruct | undefined
  >()

  useEffect(() => {
    if (!isConnected) router.push("/")
  }, [isConnected])

  const getProfessionalProfile =
    async (): Promise<SheLeads.ProfessionalProfileStruct | null> => {
      const pp = await getPP()
      if (pp?.id == undefined || pp?.content === "") return null
      setProfessionalProfileId(pp?.id.toString())
      return await viewIPFSContent(pp?.content)
    }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    /* @ts-ignore */
    values: { ...dummyData },
  })

  const { fields, append, remove } = useFieldArray({
    name: "workExperience",
    control: form.control,
  })

  const loadDummyData = (data: any) => {
    setDummyData(data)
  }

  useEffect(() => {
    const asyncFunc = async () => {
      if (!(contract && professionalProfileId === "")) return

      const professionalProfile = await getProfessionalProfile()
      if (professionalProfile === null) return
      setProfessionalProfile(professionalProfile)
    }

    asyncFunc()
  }, [contract, professionalProfileId])

  useEffect(() => {
    if (
      professionalProfile != undefined &&
      /* @ts-ignore */
      professionalProfile.educationCertification != undefined
    ) {
      /* @ts-ignore */
      setDummyData(professionalProfile)
    } else {
      /* @ts-ignore */
      setDummyData({
        workExperience: [
          {
            jobTitle: "",
            companyName: "",
            duration: "",
            mainResponsabilities: "",
            specificSkills: "",
          },
        ],
      })
    }
  }, [professionalProfile])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)

    const cid = await upload(JSON.stringify(values))

    if (cid === "") return

    await addProfessionalProfile(cid)

    setIsLoading(false)
    router.push("/recommendations")
  }

  const Optional = () => <span className="text-gray-500/80 text-xs ml-1">(Optional)</span>

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 max-w-4xl mx-auto bg-background m-8 shadow-lg rounded-lg gap-y-5">
      <div className="text-center">
        <h1 className="text-2xl font-semibold underline">
          Let’s Get Started with your Profile!
        </h1>
        <span className="text-sm">Texto para guiar al usuario</span>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/** workExperience */}
          <div className="grid border border-gray-500/40 p-4 rounded-md gap-2">
            <h2 className="flex justify-center text-lg font-semibold">
              Section 1: Work Experiences
            </h2>
            {fields.map((field, index) => (
              <div key={field.id}>
                <h3 className="text-base font-semibold border-b-2 pb-1">
                  Work Experience {index + 1}
                </h3>
                <div className="grid grid-cols-5 gap-4 py-3">
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`workExperience.${index}.jobTitle`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Add a Job Title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`workExperience.${index}.companyName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name <Optional /></FormLabel>
                          <FormControl>
                            <Input placeholder="Add a Company Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name={`workExperience.${index}.duration`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="Add duration" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`workExperience.${index}.mainResponsabilities`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Main Responsabilities</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Add Main Responsabilities"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`workExperience.${index}.specificSkills`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specific Skills</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Add your Specific Skills" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end items-end">
                    {index > 0 && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={() => remove(index)}
                      >
                        Delete Work Exp. {index + 1}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={(e) => {
                  e.preventDefault()

                  append({
                    jobTitle: "",
                    companyName: "",
                    duration: "",
                    mainResponsabilities: "",
                    specificSkills: "",
                  })
                }}
              >
                Other Work Experience?
              </Button>
            </div>
          </div>
          <div className="grid border border-gray-500/40 p-4 rounded-md">
            {/** educationCertification */}
            <h2 className="flex justify-center text-lg font-semibold">
              Section 2: Education and Certification
            </h2>
            <div className="grid grid-cols-3 gap-4 py-3">
              <FormField
                control={form.control}
                name="educationCertification.highestLevelOfEducation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Highest Level of Education</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add Highest level of education"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="educationCertification.fieldOfStudy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field of Study</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add field of study" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="educationCertification.certifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certifications</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add certifications" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid border border-gray-500/40 p-4 rounded-md">
            {/** personalCompetences */}

            <h2 className="flex justify-center text-lg font-semibold">
              Section 3: Personal Competences
            </h2>
            <div className="grid grid-cols-2 gap-4 py-3">
              <FormField
                control={form.control}
                name="personalCompetences.strengths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Strengths</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add strengths" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="personalCompetences.weaknesses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weaknesses</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add weaknesses" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid border border-gray-500/40 p-4 rounded-md">
            {/** goalsAndInspirations */}
            <h2 className="flex justify-center text-lg font-semibold">
              Section 4: Goals and Inspiration
            </h2>
            <div className="grid grid-cols-3 gap-4 py-3">
              <FormField
                control={form.control}
                name="goalsAndInspirations.WhatWouldYouLikeToDo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What would you like to do?</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add what would you like to do" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="goalsAndInspirations.shortTermGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Term Goals <Optional /></FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add short term goals" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="goalsAndInspirations.longTermGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Long Term Goals <Optional /></FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add long term goals" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid border border-gray-500/40 p-4 rounded-md">
            {/** personalInterests */}
            <h2 className="flex justify-center text-lg font-semibold">
              Section 5: Personal Interests
            </h2>
            <div className="grid grid-cols-2 gap-4 py-3">
              <FormField
                control={form.control}
                name="personalInterests.areasOfPersonalInterest"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Areas of Personal Interest</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add areas of personal interest"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="personalInterests.timeAvailability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Availability <Optional /></FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add time availability" {...field}>
                        {field.value}
                      </Textarea>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex justify-end w-full pt-2 gap-4">
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault()
                router.push("/")
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Profile
            </Button>
          </div>
        </form>
        {/* <div>
          <span>dummy data</span>
          <div className="flex w-full justify-start gap-2">
            <Button
              size="sm"
              onClick={() => loadDummyData(professionalProfileSoftwareEngineer)}
            >
              Software Engineer
            </Button>
            <Button
              size="sm"
              onClick={() => loadDummyData(professionalProfileWaleska)}
            >
              Waleska
            </Button>
          </div>
        </div> */}
      </Form>
    </div>
  )
}

export default Profile
