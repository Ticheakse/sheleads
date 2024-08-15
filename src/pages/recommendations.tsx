import { Button } from "@/components/ui/button"
import { useSheLeadsContext } from "@/components/web3/context/sheLeadsContext"
import { useEffect } from "react"

const Recommendations = () => {
  const { getProfessionalProfile } = useSheLeadsContext()

  useEffect(() => {
    const asyncFunc = async () => {
      const pp = await getProfessionalProfile()
      console.log("pp :>> ", pp?.id)
      console.log("pp :>> ", pp?.content)
      if (pp?.content == undefined) return

      const professionalProfile = await viewProfessionalProfile(pp?.content)
      console.log("professionalProfile :>> ", professionalProfile)
      // if (!prompt) return
      // const response = await fetch("/api/cgpt", {
      //   method: "post",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ prompt }),
      // })
      // const respuesta = await response.json()
      // // setSuggestion(respuesta.text)
      // console.log("respuesta :>> ", respuesta)
    }

    asyncFunc()
  }, [])

  const viewProfessionalProfile = async (cid: string) => {
    const contenido = await fetch(`/api/ipfs?cid=${cid}`)
    const res = await contenido.json()
    return res.resource
  }

  return (
    <>
      <h1>hola</h1>
      {/* <Button onClick={viewProfessionalProfile}>ver</Button> */}
    </>
  )
}

export default Recommendations
