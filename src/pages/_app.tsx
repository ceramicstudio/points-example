import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { WagmiConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import "@/styles/globals.css";

const PROJECT_ID = "86e78deb6cf634c706f45426dd186bf7";

const chains = [mainnet];
const wagmiConfig = defaultWagmiConfig({ chains, projectId: PROJECT_ID });

createWeb3Modal({ wagmiConfig, projectId: PROJECT_ID, chains });

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </WagmiConfig>
  );
};

export default MyApp;
