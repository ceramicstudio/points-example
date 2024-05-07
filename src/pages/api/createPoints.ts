import { type NextApiRequest, type NextApiResponse } from "next";
import { contextWriter, writer } from "@/utils/context";
import type { ModelInstanceDocument } from "@composedb/types";
import {
  type PointsContent,
  type AggregationContent,
  type AllocationContent,
} from "@/utils/types";

interface Request extends NextApiRequest {
  body: {
    recipient: string;
    amount: number;
    context: string;
    multiplier?: number;
  };
}

interface Response extends NextApiResponse {
  status(code: number): Response;
  send(
    data:
      | {
          contextTotal: number;
          total: number;
          allocationDoc: AllocationContent | undefined;
        }
      | { error: string },
  ): void;
}

export default async function handler(req: Request, res: Response) {
  try {
    const { recipient, amount, context, multiplier } = req.body;

    // first create allocation
    const allocation = await createAllocation({
      recipient,
      amount,
      context,
      multiplier,
    });

    // get context aggregation doc if exists
    const aggregationDoc: ModelInstanceDocument<AggregationContent> | null =
      await contextWriter.loadAggregationDocumentFor([recipient, context]);

    // update context-specific aggregation
    const updatedContextAgg: ModelInstanceDocument<AggregationContent> =
      await contextWriter.setPointsAggregationFor(
        [recipient, context],
        amount + (aggregationDoc?.content?.points ?? 0),
        {
          recipient,
          points: (aggregationDoc?.content?.points ?? 0) + amount,
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
      allocationDoc: allocation?.content ?? undefined,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

const createAllocation = async ({
  recipient,
  amount,
  context,
  multiplier,
}: {
  recipient: string;
  amount: number;
  context: string;
  multiplier?: number;
}): Promise<ModelInstanceDocument<AllocationContent> | undefined> => {
  try {
    const allocation = await contextWriter.allocatePointsTo(recipient, amount, {
      context,
      date: new Date().toISOString(),
      multiplier: multiplier ?? 0,
    } as Partial<AllocationContent>);
    return allocation as ModelInstanceDocument<AllocationContent>;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
