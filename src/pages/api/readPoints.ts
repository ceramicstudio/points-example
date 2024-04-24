import { type NextApiRequest, type NextApiResponse } from 'next'
import { contextReader, reader } from '@/utils/context'

interface Request extends NextApiRequest {
  body: {
    recipient: string
    context: string
  }
}

interface Response extends NextApiResponse {
  status(code: number): Response
  send(data: { contextTotal: number; total: number } | { error: string }): void
}

export default async function handler(req: Request, res: Response) {
  try {
    const { recipient, context } = req.body

    const [contextTotal, total] = await Promise.all([
      contextReader.getAggregationPointsFor([recipient, context]),
      reader.getAggregationPointsFor([recipient]),
    ])
    res.status(200).send({ contextTotal, total })
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: 'Internal Server Error' })
  }
}
