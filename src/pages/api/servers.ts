import { type NextApiRequest, type NextApiResponse } from "next";
import { type Guilds } from "@/utils/types";

interface Request extends NextApiRequest {
  body: {
    token: string;
  };
}

export default async function handler(req: Request, res: NextApiResponse) {
  try {

    const getServers = async (
      accessToken: string,
    ): Promise<Guilds[] | undefined> => {
      const guilds = await fetch(
        "https://discordapp.com/api/users/@me/guilds",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          return data as Guilds[];
        });
      return [...guilds];
    };

    const { token } = req.body;
    const guilds = await getServers(token);
    res.status(200).json(guilds);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
}
