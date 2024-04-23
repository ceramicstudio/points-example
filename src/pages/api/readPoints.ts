import { type NextApiRequest, type NextApiResponse } from "next";
import { getAuthenticatedDID } from "@ceramic-solutions/key-did";
import { PointsReader } from "@ceramic-solutions/points";
import type { ModelInstanceDocument } from "@composedb/types";
import { type AggregationContent } from "@/utils/types";
import { fromString } from "uint8arrays";

const CERAMIC_PRIVATE_KEY: string = process.env.CERAMIC_PRIVATE_KEY ?? "";
const aggregationModelID: string | undefined =
  process.env.AGGREGATION_ID ?? undefined;

interface Request extends NextApiRequest {
  body: {
    recipient: string;
    context: string;
  };
}

interface Response extends NextApiResponse {
  status(code: number): Response;
  send(data: { contextTotal: number; total: number } | { error: string }): void;
}

export default async function handler(req: Request, res: Response) {
  try {
    const { recipient, context } = req.body;
    //eslint-disable-next-line
    const seed = fromString(CERAMIC_PRIVATE_KEY, "base16") as Uint8Array;

    // generate issuer for reader context
    const issuer = await getAuthenticatedDID(seed);

    //create a context reader
    const contextReader = PointsReader.create({
      issuer: issuer.id,
      aggregationModelID,
    });

    //create a total reader
    const reader = PointsReader.create({
      issuer: issuer.id,
    });

    // get context aggregation doc if exists
    const contextAggregationDoc: ModelInstanceDocument<AggregationContent> | null =
      await contextReader.loadAggregationDocumentFor([recipient, context]);

    // get total aggregation doc if exists
    const totalAggregationDoc: ModelInstanceDocument<AggregationContent> | null =
      await reader.loadAggregationDocumentFor([recipient]);

    res.status(200).send({
      contextTotal: contextAggregationDoc
        ? contextAggregationDoc.content
          ? contextAggregationDoc.content.points
          : 0
        : 0,
      total: totalAggregationDoc
        ? totalAggregationDoc.content
          ? totalAggregationDoc.content.points
          : 0
        : 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}
