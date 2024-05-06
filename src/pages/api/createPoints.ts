import { type NextApiRequest, type NextApiResponse } from 'next'
import { contextWriter, writer } from '@/utils/context'
import type { ModelInstanceDocument } from '@composedb/types'
import { type PointsContent, type AggregationContent } from '@/utils/types'

interface Request extends NextApiRequest {
  body: {
    recipient: string
    amount: number
    context: string
  }
}

interface Response extends NextApiResponse {
  status(code: number): Response
  send(data: { contextTotal: number; total: number } | { error: string }): void
}

export default async function handler(req: Request, res: Response) {
  try {
    const { recipient, amount, context } = req.body

    // get context aggregation doc if exists
    const aggregationDoc: ModelInstanceDocument<AggregationContent> | null =
      await contextWriter.loadAggregationDocumentFor([recipient, context])

    // if aggregation doc does not exist for that context, set points aggregation for both context and global total
    if (aggregationDoc === null) {
      // update context-specific aggregation
      const updatedContextAgg: ModelInstanceDocument<AggregationContent> =
        await contextWriter.setPointsAggregationFor([recipient, context], amount, {
          recipient,
          points: amount,
          date: new Date().toISOString(),
          context,
        } as Partial<PointsContent>)

      // update total aggregation
      const updatedTotalAgg: ModelInstanceDocument<AggregationContent> =
        await writer.updatePointsAggregationFor([recipient], (content) => {
          return {
            points: content ? content.points + amount : amount,
            date: new Date().toISOString(),
            recipient,
          }
        })

      res.status(200).send({
        contextTotal: updatedContextAgg.content ? updatedContextAgg.content.points : 0,
        total: updatedTotalAgg.content ? updatedTotalAgg.content.points : 0,
      })
    }
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: 'Internal Server Error' })
  }
}
