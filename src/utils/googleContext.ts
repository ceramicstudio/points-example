import { google } from "googleapis";
import { GoogleAuth } from "google-auth-library";

const spreadsheetId = process.env.SHEET_ID ?? "";
const type = process.env.TYPE ?? "";
const project_id = process.env.PROJECT_ID ?? "";
const private_key_id = process.env.PRIVATE_KEY_ID ?? "";
const private_key = process.env.PRIVATE_KEY ?? "";
const client_email = process.env.CLIENT_EMAIL ?? "";
const client_id = process.env.CLIENT_ID ?? "";
const universe_domain = process.env.UNIVERSE_DOMAIN ?? "";

const auth = new GoogleAuth({
  scopes: "https://www.googleapis.com/auth/spreadsheets",
  credentials: {
    type,
    client_email,
    private_key,
    private_key_id,
    project_id,
    client_id,
    universe_domain,
  },
});

  const authClient = await auth.getClient();

  //@ts-expect-error - google.sheets type mismatch
  const googleSheetsInstance = google.sheets({
    version: "v4",
    auth: authClient,
  });

  export { googleSheetsInstance, spreadsheetId };
