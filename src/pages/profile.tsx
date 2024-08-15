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

import { useRouter } from "next/router"
import { useState } from "react"
import { ReloadIcon } from "@radix-ui/react-icons"

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
  const { addProfessionalProfile } = useSheLeadsContext()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workExperience: [
        {
          jobTitle: "asd",
          companyName: "as",
          duration: "2 years",
          mainResponsabilities: "asd",
          specificSkills: "asd",
        },
      ],
      educationCertification: {
        highestLevelOfEducation: "asd",
        fieldOfStudy: "asd",
        certifications: "asd",
      },
      personalCompetences: {
        strengths: "asd",
        weaknesses: "asd",
      },
      goalsAndInspirations: {
        WhatWouldYouLikeToDo: "asd",
        shortTermGoals: "asd",
        longTermGoals: "asd",
      },
      personalInterests: {
        areasOfPersonalInterest: "asd",
        timeAvailability: "asd",
      },
    },
  })

  const { fields, append, remove } = useFieldArray({
    name: "workExperience",
    control: form.control,
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)

    const response = await fetch("/api/ipfs", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })

    const contentID = await response.json()
    console.log("contentID :>> ", contentID.cid)
    if (contentID.cid === "") return

    await addProfessionalProfile(contentID.cid)

    setIsLoading(false)
    router.push("/recommendations")
  }

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 max-w-4xl mx-auto bg-background m-8 shadow-lg rounded-lg gap-y-5">
      <h1 className="text-xl font-semibold text-center">New to SheLeads?</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/** workExperience */}
          {fields.map((field, index) => (
            <div key={field.id}>
              <FormField
                control={form.control}
                name={`workExperience.${index}.jobTitle`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>jobTitle</FormLabel>
                    <FormControl>
                      <Input placeholder="jobTitle" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`workExperience.${index}.companyName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>companyName</FormLabel>
                    <FormControl>
                      <Input placeholder="companyName" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`workExperience.${index}.duration`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>duration</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`workExperience.${index}.mainResponsabilities`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>mainResponsabilities</FormLabel>
                    <FormControl>
                      <Input placeholder="mainResponsabilities" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`workExperience.${index}.specificSkills`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>specificSkills</FormLabel>
                    <FormControl>
                      <Input placeholder="specificSkills" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {index > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  Delete
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="secondary"
            onClick={(e) => {
              e.preventDefault()

              append({
                jobTitle: "asd2",
                companyName: "as2",
                duration: "20 months",
                mainResponsabilities: "asd2",
                specificSkills: "asd2",
              })
            }}
          >
            Append
          </Button>
          {/** educationCertification */}
          <FormField
            control={form.control}
            name="educationCertification.highestLevelOfEducation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>highestLevelOfEducation</FormLabel>
                <FormControl>
                  <Input placeholder="highestLevelOfEducation" {...field} />
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
                <FormLabel>fieldOfStudy</FormLabel>
                <FormControl>
                  <Input placeholder="fieldOfStudy" {...field} />
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
                <FormLabel>certifications</FormLabel>
                <FormControl>
                  <Input placeholder="certifications" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/** personalCompetences */}
          <FormField
            control={form.control}
            name="personalCompetences.strengths"
            render={({ field }) => (
              <FormItem>
                <FormLabel>strengths</FormLabel>
                <FormControl>
                  <Input placeholder="strengths" {...field} />
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
                <FormLabel>weaknesses</FormLabel>
                <FormControl>
                  <Input placeholder="weaknesses" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/** goalsAndInspirations */}
          <FormField
            control={form.control}
            name="goalsAndInspirations.WhatWouldYouLikeToDo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatWouldYouLikeToDo</FormLabel>
                <FormControl>
                  <Input placeholder="WhatWouldYouLikeToDo" {...field} />
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
                <FormLabel>shortTermGoals</FormLabel>
                <FormControl>
                  <Input placeholder="shortTermGoals" {...field} />
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
                <FormLabel>longTermGoals</FormLabel>
                <FormControl>
                  <Input placeholder="longTermGoals" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/** personalInterests */}
          <FormField
            control={form.control}
            name="personalInterests.areasOfPersonalInterest"
            render={({ field }) => (
              <FormItem>
                <FormLabel>areasOfPersonalInterest</FormLabel>
                <FormControl>
                  <Input placeholder="areasOfPersonalInterest" {...field} />
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
                <FormLabel>timeAvailability</FormLabel>
                <FormControl>
                  <Input placeholder="timeAvailability" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Submit
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default Profile
