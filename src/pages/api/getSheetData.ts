import { type NextApiRequest, type NextApiResponse } from "next";
import { spreadsheetId, googleSheetsInstance } from "@/utils/googleContext";

interface Response extends NextApiResponse {
  status(code: number): Response;
  send(data: { rows: string[][] | undefined | null } | { error: string }): void;
}

export default async function handler(req: NextApiRequest, res: Response) {
  try {
    const result = await googleSheetsInstance.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1',
      })
    const rows = result.data.values;
    res.status(200).send({ rows });
    }
   catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}
