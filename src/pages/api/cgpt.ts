import { NextApiRequest, NextApiResponse } from "next"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION,
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method Not Allowed" })

  const { prompt } = req.body

  if (!prompt) return res.status(400).json({ message: "Prompt is required" })

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-3.5-turbo-16k",
    })

    const text = completion.choices[0].message.content
    return res.status(200).json({
      text,
    })
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error generating response", error: error.message })
  }
}
