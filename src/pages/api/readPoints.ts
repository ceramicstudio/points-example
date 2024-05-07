import { type NextApiRequest, type NextApiResponse } from "next";
import { contextReader, reader, composeClient, issuer } from "@/utils/context";
import { type AllocationNode } from "@/utils/types";

interface Request extends NextApiRequest {
  body: {
    recipient: string;
    context: string;
  };
}

interface Response extends NextApiResponse {
  status(code: number): Response;
  send(
    data:
      | {
          contextTotal: number;
          total: number;
          allocations: AllocationNode[] | undefined;
        }
      | { error: string },
  ): void;
}

export default async function handler(req: Request, res: Response) {
  try {
    const { recipient, context } = req.body;
    const allocations = await getAllocations(recipient, context);
    const [contextTotal, total] = await Promise.all([
      contextReader.getAggregationPointsFor([recipient, context]),
      reader.getAggregationPointsFor([recipient]),
    ]);
    res.status(200).send({
      contextTotal,
      total,
      allocations: allocations ?? undefined,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

const getAllocations = async (recipient: string, context: string) => {
  try {
    const allocations = await composeClient.executeQuery<{
      node: {
        contextPointAllocationList: {
          edges: AllocationNode[];
        };
      };
    }>(`
    query GetAllocations {
      node(id: "${issuer.id}") {
        ... on CeramicAccount {
             contextPointAllocationList(
              filters: {
                and: [
                  { where: { recipient: { equalTo: "${recipient}" } } }
                  { and: { where: { context: { equalTo: "${context}" } } } }
                ]
              }, 
              first: 1000) {
                edges {
                  node {
                      id
                      context
                      issuer {
                        id
                      }
                      recipient {
                        id
                      }
                      points
                      multiplier
                   }
                }
              }
            }
          }
        }
    `);
    if (allocations?.data?.node?.contextPointAllocationList?.edges.length) {
      return allocations.data.node.contextPointAllocationList.edges;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
