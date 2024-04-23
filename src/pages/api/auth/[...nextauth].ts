import NextAuth from "next-auth";
import { authOptions } from "@/server/auth";

authOptions.callbacks = {
  ...authOptions.callbacks,
  jwt: async ({ token, account }) => {
    if (account?.access_token) {
      token.accessToken = account.access_token;
    }
    return Promise.resolve(token);
  },
};

export default NextAuth(authOptions);
