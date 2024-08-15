import type { NextApiRequest, NextApiResponse } from "next"
import { decryptCID, uploadToIPFS } from "@/lib/web3"

type Data = {
  cid?: string
  resource?: string
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const resource = await uploadToIPFS(JSON.stringify(req.body))

    return res.status(200).json({ cid: resource.data.Hash })
  } else if (req.method === "GET") {
    const { cid } = req.query

    if (cid == undefined)
      return res.status(500).json({ message: "CID not provided" })

    const resource = await decryptCID(cid as string)

    return res.status(200).json({ resource: JSON.parse(resource) })
  } else {
    return res.status(403).json({ message: "Method not allowed" })
  }
}
