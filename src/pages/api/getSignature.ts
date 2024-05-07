import { type NextApiRequest, type NextApiResponse } from "next";
import axios from "axios";

interface Response extends NextApiResponse {
  status(code: number): Response;
  send(data: { message: string; nonce: string } | { error: string }): void;
}

export default async function handler(req: NextApiRequest, res: Response) {
  try {
    const messageAndNonce = await fetchMessageAndNonce();
    if (messageAndNonce) {
      res.status(200).send(messageAndNonce);
    } else {
      res.status(500).send({ error: "Internal Server Error" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

const fetchMessageAndNonce = async () => {
  const axiosSigningMessageConfig = {
    headers: {
      "X-API-KEY": process.env.GITCOIN_API_KEY!,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  const { data } = await axios.get<
    { message: string; nonce: string } | undefined
  >(
    "https://api.scorer.gitcoin.co/registry/signing-message",
    axiosSigningMessageConfig,
  );
  return data;
};
