import { RecommendationsType } from "@/components/abis/types/generalTypes"

export const getPromptForRecommendations = (professionalProfile: any) =>
  `Based on the this JSON ${JSON.stringify(
    professionalProfile
  )}, create 5 personalized recommendations for an AI-powered career coaching app. how to display learning suggestions, 
  networking opportunities, short- and long-term goals, and what to do if the user is unsure about their goals. 
  The response must be in JSON format in this format: { recommendations: [{ isApproved: false, title: "", description: "" }] } 
  where isApproved must always be false`

export const getPromptRegenerateRecommendation = (
  recommendations: RecommendationsType,
  index: number
) =>
  `Based on this JSON ${recommendations} you made, remove the index ${index} from the array and add 1 more recommendations in the same index. The response only in JSON format.`

export const getPromptForValidation = (
  recommendations: string,
  question: string
) =>
  `Answer from 1 to 5, with 1 being the lowest and 5 being the highest,
 if the recommendations: ${recommendations} on average are valid and accurate with respect to this request: ${question}. 
 The response is in JSON format like this: { finalResult: "" }`

export const getPromptForActionPlan = (
  professionalProfile: any,
  recommendations: any
) =>
  `Based on the this professional profile JSON ${JSON.stringify(
    professionalProfile
  )} and the recommendation JSON ${JSON.stringify(
    recommendations
  )}, genera un plan de acción para el futuro de la chica
 The response is in JSON format like this: { actionPlan: [{ item: "", goals: [{ goal: "", actions: [{ actionTitle: "", description: "", timeline: "", resources: [{ resourceName: "", link: "" }]}]}]}] }
 with at least three action plan, three goal each one, one action for each one, at least two resources each
  `

export const getPromptForLinkedIn = (
  professionalProfile: any,
  recommendations: any,
  actionPlan: any
) =>
  `Using this JSON ${JSON.stringify(
    professionalProfile
  )}, recommendations in this JSON this JSON ${JSON.stringify(
    recommendations
  )}, and action plan in this JSON this JSON ${JSON.stringify(actionPlan)}, 
 create the content needed to update her LinkedIn profile. Include the following sections: Professional Bio, Headline/Short Description, 
 Work Experience (with responsibilities and achievements), Skills & Endorsements, Education, Professional Summary, 
 Volunteer Experience (if applicable), Recommendations, Personal Interests & Causes, Contact Information, and Media Attachments (optional).
 The response is in JSON format like this { linkedinProfileUpdate: { professionalBio: "", headlineShortDescription: "", workExperience: [{ jobTitle: "", companyName: "", duration: "", mainResponsibilities: "",  achievements: "", specificSkills: [""]}], skillsAndEndorsements: [""]}}`

export const getDailyQuotePrompt = () =>
  `Provide an inspiring quote for women who are actively shaping their careers and future. The quote should be between 100 and 150 characters, focusing on empowerment, resilience, and personal growth.`
