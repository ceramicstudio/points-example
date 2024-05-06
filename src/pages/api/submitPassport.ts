import { type NextApiRequest, type NextApiResponse } from "next";
import axios from "axios";

const GITCOIN_API_KEY = process.env.GITCOIN_API_KEY ?? "";
const SCORER_ID = process.env.SCORER_ID ?? "";

interface Response extends NextApiResponse {
  status(code: number): Response;
  send(
    data:
      | { score: string; address: string; last_score_timestamp: string }
      | { error: string },
  ): void;
}

interface Request extends NextApiRequest {
  body: {
    address: string;
    signature: string;
    nonce: string;
  };
}

export default async function handler(req: Request, res: Response) {
  try {
    const { address, signature, nonce } = req.body;
    const data = await submitPassport(address, signature, nonce);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

const submitPassport = async (
  address: string,
  signature: string,
  nonce: string,
) => {
  const submitPassportConfig = {
    headers: {
      "X-API-KEY": GITCOIN_API_KEY,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  const submitPassportData = {
    address,
    scorer_id: SCORER_ID,
    signature,
    nonce,
  };
  const { data } = await axios.post<{
    score: string;
    address: string;
    last_score_timestamp: string;
  }>(
    "https://api.scorer.gitcoin.co/registry/submit-passport",
    submitPassportData,
    submitPassportConfig,
  );
  return data;
};
