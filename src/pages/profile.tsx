import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { cn } from "@/lib/utils"
import { useRouter } from "next/router"
import { useState } from "react"
import { ReloadIcon } from "@radix-ui/react-icons"
import { CalendarComponent } from "@/components/ui/calendar"
import { useAccount } from "wagmi"
import { signAuthMessage } from "@/lib/web3"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
})

const Profile = () => {
  const router = useRouter()
  // const { registerUser } = useSheLeadsContext()
  const [isLoading, setIsLoading] = useState(false)
  const { isConnected, address } = useAccount()
  console.log("address :>> ", address)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // setIsLoading(true)
    const theData = {
      data: [
        {
          name: "Orally",
        },
        {
          name: "Sublingually",
        },
      ],
    }

    const signedMessage = await signAuthMessage(address as string)

    // const signature = await fetch(
    //   `https://encryption.lighthouse.storage/api/message/${address}`
    // )
    // console.log("signature :>> ", signature)

    /* to decrypt  */
    // const contenido = await fetch(
    //   `/api/uploadEncIPFS?signedMessage=${signedMessage}`
    // )
    // const salida = await contenido.json()
    // console.log("salida :>> ", salida)

    const content = {
      signedMessage,
      address,
      theData,
    }

    // console.log("JSON.stringify(content) :>> ", JSON.stringify(content))

    const response = await fetch("/api/uploadEncIPFS", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(content),
    })
    const contentID = await response.json()
    console.log("contentID :>> ", contentID.cid)

    // await registerUser(values.name, contentID.cid)
    // setIsLoading(false)
    // router.push("/dashboard")
  }

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 max-w-4xl mx-auto bg-background m-8 shadow-lg rounded-lg gap-y-5">
      <h1 className="text-xl font-semibold text-center">New to SheLeads?</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How do you want people to call you?</FormLabel>
                <FormControl>
                  <Input placeholder="superCoolChick" {...field} />
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
