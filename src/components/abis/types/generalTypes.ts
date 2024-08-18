export type TIMEZONE = "Europe/Madrid" | "Europe/Paris" | "Europe/Istanbul"

declare global {
  interface Window {
    ethereum: any
  }
}

export type EncryptDataProps = { iv: string; encryptedData: string }

type RecommendationType = {
  isApproved: boolean
  title: string
  description: string
}

export type RecommendationsType = {
  recommendations: RecommendationType[]
}

type ResourceProps = {
  resourceName: string
  link: string
}

type GoalActionsProps = {
  actionTitle: string
  description: string
  timeline: string
  resources: ResourceProps[]
}

type GoalProps = {
  goal: string
  actions: GoalActionsProps[]
}

type ActionProp = {
  item: string
  goals: GoalProps[]
}

export type ActionPlanType = {
  actionPlan: ActionProp[] 
  // [
  //   {
  //     item: ""
  //     goals: [
  //       {
  //         goal: ""
  //         actions: [
  //           {
  //             actionTitle: ""
  //             description: ""
  //             timeline: ""
  //             resources: [{ resourceName: ""; link: "" }]
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // ]
}
