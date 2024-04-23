import { type NextApiRequest, type NextApiResponse } from "next";
import { PointsWriter } from "@ceramic-solutions/points";
import type { ModelInstanceDocument } from "@composedb/types";
import { PointsContent, type AggregationContent } from "@/utils/types";
import { fromString } from "uint8arrays";

const CERAMIC_PRIVATE_KEY: string = process.env.CERAMIC_PRIVATE_KEY ?? "";
const aggregationModelID: string | undefined =
  process.env.AGGREGATION_ID ?? undefined;

interface Request extends NextApiRequest {
  body: {
    recipient: string;
    amount: number;
    context: string;
  };
}

interface Response extends NextApiResponse {
  status(code: number): Response;
  send(data: { contextTotal: number; total: number } | { error: string }): void;
}

export default async function handler(req: Request, res: Response) {
  try {
    const { recipient, amount, context } = req.body;
    //eslint-disable-next-line
    const seed = fromString(CERAMIC_PRIVATE_KEY, "base16") as Uint8Array;

    // create a context writer
    const contextWriter = await PointsWriter.fromSeed({
      aggregationModelID,
      seed,
    });

    // create a total writer
    const writer = await PointsWriter.fromSeed({
      seed,
    });

    // get context aggregation doc if exists
    const aggregationDoc: ModelInstanceDocument<AggregationContent> | null =
      await contextWriter.loadAggregationDocumentFor([recipient, context]);

    // if aggregation doc does not exist for that context, set points aggregation for both context and global total
    if (aggregationDoc === null) {
      // update context-specific aggregation
      const updatedContextAgg: ModelInstanceDocument<AggregationContent> =
        await contextWriter.setPointsAggregationFor(
          [recipient, context],
          amount,
          {
            recipient,
            points: amount,
            date: new Date().toISOString(),
            context,
          } as Partial<PointsContent>,
        );

      // update total aggregation
      const updatedTotalAgg: ModelInstanceDocument<AggregationContent> =
        await writer.updatePointsAggregationFor([recipient], (content) => {
          return {
            points: content ? content.points + amount : amount,
            date: new Date().toISOString(),
            recipient,
          };
        });

      res.status(200).send({
        contextTotal: updatedContextAgg.content
          ? updatedContextAgg.content.points
          : 0,
        total: updatedTotalAgg.content ? updatedTotalAgg.content.points : 0,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}
