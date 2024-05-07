import { type Guilds } from "@/utils/types";
import { signIn, useSession, signOut, getSession } from "next-auth/react";
import Navbar from "@/components/nav";
import Head from "next/head";
import { useAccount, useSignMessage } from "wagmi";
import { useEffect, useState } from "react";
import Link from "next/link";

declare global {
  interface Window {
    ethereum?: Record<string, unknown> | undefined;
  }
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Points Demo Application - Ceramic</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/ceramic-favicon.svg" />
        <meta property="og:title" content="Points Demo Application - Ceramic" />
        <meta
          property="og:description"
          content="Earn points for joining the Ceramic community!"
        />
      </Head>
      <div className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#0f0f0f] to-[#1e1e1e]">
        <Navbar />
        <AuthShowcase />
      </div>
    </>
  );
}

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [loggedIn, setLoggedIn] = useState(false);
  const [guilds, setGuilds] = useState<Guilds[] | undefined>(undefined);
  const [claim, setClaim] = useState<boolean>(false);
  const [access, setAccess] = useState<string>("");
  const [totals, setTotals] = useState<
    { contextTotal: number; total: number } | undefined
  >(undefined);

  useEffect(() => {
    if (address) {
      setLoggedIn(true);
    }
  }, [address]);

  const fetchData = async () => {
    const session = await getSession();
    return session;
  };

  const checkPoints = async (context: string, recipient: string) => {
    try {
      const response = await fetch("/api/readPoints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipient, context }),
      });
      const data = (await response.json()) as {
        contextTotal: number;
        total: number;
      };
      setTotals(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const getMessageResponse = async (): Promise<{
    message: string;
    nonce: string;
  }> => {
    try {
      const response = await fetch("/api/getSignature", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = (await response.json()) as
        | { message: string; nonce: string }
        | { error: string };
      console.log(data);
      if ("error" in data) {
        throw new Error(data.error);
      }
      return data;
    } catch (error) {
      console.error(error);
      throw new Error(String(error));
    }
  };

  const submitPassport = async () => {
    try {
      // call the API to get the signing message and the nonce
      const { message, nonce } = await getMessageResponse();
      // sign the message
      const signature = await signMessageAsync({ message });

      // submit the passport
      const response = await fetch("/api/submitPassport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address, signature, nonce }),
      });
      const data = (await response.json()) as {
        score: string;
        address: string;
        last_score_timestamp: string;
      };
      console.log(data);
    } catch (err) {
      console.log("error: ", err);
    }
  };

  const awardPoints = async (
    context: string,
    recipient: string,
    amount: number,
  ) => {
    try {
      const response = await fetch("/api/createPoints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipient, context, amount }),
      });
      const data = (await response.json()) as {
        contextTotal: number;
        total: number;
      };
      console.log(data);
      setTotals(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const getGuilds = async (
    accessToken: string,
  ): Promise<Guilds[] | undefined> => {
    const guilds = await fetch("/api/servers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: accessToken }),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        return data as Guilds[] | undefined;
      });
    console.log(guilds);
    return guilds;
  };

  useEffect(() => {
    fetchData()
      .then((data) => {
        if (data) {
          console.log(data);
          setAccess(data.accessToken);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
      {loggedIn && (
        <>
          {address?.length && (
            <h1 className="text-center text-6xl font-extrabold tracking-tight text-white">
              Connected with
              <span className="text-[hsl(280,100%,70%)]">
                {" ..." + address.slice(address.length - 6, address.length)}
              </span>
            </h1>
          )}
          <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
            {!access && (
              <>
                <h3 className="text-2xl font-bold">
                  Join the{" "}
                  <Link
                    href="https://chat.ceramic.network/"
                    style={{ color: "orange" }}
                  >
                    Ceramic Discord
                  </Link>
                </h3>
                <div className="text-xl">
                  Join the Ceramic Discord to earn points for participating in
                  our community.
                </div>
              </>
            )}
            {guilds?.length ? (
              <div className="text-2xl">
                You are a member of{" "}
                <span className="text-[hsl(280,100%,70%)]">
                  {guilds.length}
                </span>{" "}
                Discord servers:
                <ul className="m-4">
                  {guilds.map((guild) =>
                    guild.name == "Ceramic" ? (
                      <li
                        key={guild.id}
                        className="text-2xl text-[hsl(280,100%,70%)]"
                      >
                        {guild.name}
                      </li>
                    ) : (
                      <li key={guild.id} className="text-sm">
                        {" "}
                        {guild.name}
                      </li>
                    ),
                  )}
                </ul>
                <span className="text-xl">
                  If you are a member of the Ceramic Discord and you have not
                  yet claimed your points, you should see the option to
                  &quot;Claim Points&quot; below.
                </span>
              </div>
            ) : (
              <div className="text-lg">
                Once you have joined, connect your Discord account and then
                press the &quot;Check Status&quot; button below to check your
                eligibility and claim your points.
              </div>
            )}
          </div>
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">
              {sessionData && (
                <span>
                  Logged into Discord as{" "}
                  <span className="text-[hsl(280,100%,70%)]">
                    {sessionData.user?.name}
                  </span>
                </span>
              )}
            </p>
            {access && address && !claim && !totals?.contextTotal ? (
              <button
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={async () => {
                  const guilds = await getGuilds(access);
                  // check if user is in the Ceramic server
                  const ceramic = guilds?.find(
                    (guild) => guild.name === "Ceramic",
                  );
                  const points = await checkPoints(
                    "discord",
                    `did:pkh:eip155:1:${address.toLowerCase()}`,
                  );
                  console.log(points);
                  if (ceramic && (points?.contextTotal ?? 0) === 0) {
                    setClaim(true);
                  }
                  setGuilds(guilds);
                }}
              >
                Check Status
              </button>
            ) : claim && address && !((totals?.contextTotal ?? 0) > 0) ? (
              <button
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={async () => {
                  await awardPoints(
                    "discord",
                    `did:pkh:eip155:1:${address.toLowerCase()}`,
                    20,
                  );
                }}
              >
                Claim Points
              </button>
            ) : (
              <></>
            )}
            {(totals?.contextTotal ?? 0) > 0 && (
              <div className="text-xl text-white">
                Discord points claimed:{" "}
                <span className="text-[hsl(280,100%,70%)]">
                  {totals?.contextTotal}
                </span>
              </div>
            )}
            {access ? (
              <button
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={() => {
                  void signOut();
                }}
              >
                Sign Out
              </button>
            ) : (
              <button
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={() => {
                  void signIn("discord");
                }}
              >
                Connect Discord
              </button>
            )}
          </div>
        </>
      )}
      {!loggedIn && (
        <>
          <h1 className="text-center text-6xl font-extrabold tracking-tight text-white">
            Earn <span className="text-[hsl(280,100%,70%)]">Community</span>{" "}
            Points
          </h1>

          <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
            <h3 className="text-2xl font-bold">Connect with us!</h3>
            <div className="text-xl">
              Earn points by becoming part of our community!
            </div>
            <div className="text-lg">To begin, connect your wallet.</div>
          </div>
        </>
      )}
      {loggedIn && (
        <button
          className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          onClick={() => {
            void submitPassport();
          }}
        >
          Check Passport Score{" "}
        </button>
      )}
    </div>
  );
};
