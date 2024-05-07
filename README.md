# Points Demo Application (with-Gitcoin Branch)

A simple demo application designed to illustrate a straightforward way to consume the [Ceramic Points Library](https://www.npmjs.com/package/@ceramic-solutions/points?activeTab=readme). Seeing as the points library was built for developers and communities who might want to reward their participants for favorable behaviors (such as engagement on social platforms or meaningful contributions), this example application plays on this use case.

In this example, we will be using the points library to reward points to users for joining the Ceramic Discord server.

## Dependencies

In order to run this example locally, you will need to create a copy of the [.env.example](.env.example) file in the root of this directory, rename it to `.env`, and begin loading the file with active corresponding values. These include the following:

**NEXTAUTH_SECRET**

We will be using [NextAuth](https://next-auth.js.org/) as our open-source authentication solution (in order to verify Discord server membership). You can create a secret easily by running the following in your terminal:

```bash
openssl rand -base64 32
```

**DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET**

This app will use Discord as the authentication provider (wrapped by NextAuth). To obtain these credentials, navigate to the [Discord Developer Portal](https://discord.com/developers/applications) and set up a new application. On the left-hand panel, click on "OAuth2" and bring over your Client ID and Client Secret from the "Client Information" box. 

Finally, since you'll be running the application locally, set the following URI value within the "Redirects" box (found under "Client Information"): `http://localhost:3000/api/auth/callback/discord`.

**CERAMIC_PRIVATE_KEY**

This is the private key your application will use to instantiate a static key:did in order to write points using the library. This DID will act as the identifier for the issuer of points for your application (you).

If you have the [ComposeDB CLI](https://composedb.js.org/docs/0.7.x/api/modules/cli) installed globally, you can run the following command in your terminal to create one:

```bash
composedb did:generate-private-key
```

**AGGREGATION_ID**

A default value for this environment variable has been provided for you within the [.env.example](.env.example) file. Please leave this as-is.

**PROJECT_ID**

We will be using [WalletConnect's](https://walletconnect.com/) Web3Modal for Web3 authentication. In your [_app.tsx](./src/pages/_app.tsx) file, you will need to enter an active value for the `PROJECT_ID` constant defined on line 10. 

You can set up a developer account for free by visiting [cloud.walletconnect.com](https://cloud.walletconnect.com/sign-in). Once authenticated, create a new app and copy over the "Project ID" value (found in the dashboard view for that corresponding app).

**Passport Credentials**

This branch requires `GITCOIN_API_KEY` and `SCORER_ID` environment variables. To set these up, head over to the [Passport Developer Portal](https://scorer.gitcoin.co/).

Set up a new Scorer intended for "Airdrop Protection" and select the recommended settings. Once complete, copy the "Scorer ID" from the portal into its corresponding env variable. 

Next, generate an API key and enter it as well. 

## Getting Started

Once you've completed the steps above, you're ready to get started experimenting with the application in developer mode.

First, install your dependencies:

```bash
pnpm install
```

Once installed, run the application in developer mode:

```bash
pnpm dev
```

## Other Add-Ons

If you want to view a version that integrates awarding points for having a Gitcoin Passport score, as well as uses the allocation documents from the points library, check out the [with-gitcoin](https://github.com/ceramicstudio/points-example/tree/with-gitcoin) branch.

## License

Dual licensed under MIT and Apache 2