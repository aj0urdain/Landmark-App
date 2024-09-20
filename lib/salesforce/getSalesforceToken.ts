import axios from "axios";

interface SalesforceToken {
  access_token: string;
  instance_url: string;
  id: string;
  token_type: string;
  issued_at: string;
  signature: string;
}

export async function getSalesforceToken(): Promise<SalesforceToken> {
  const params = new URLSearchParams();
  params.append("grant_type", "password");
  params.append("client_id", process.env.SALESFORCE_CLIENT_ID!);
  params.append("client_secret", process.env.SALESFORCE_CLIENT_SECRET!);
  params.append("username", process.env.SALESFORCE_USERNAME!);
  params.append("password", process.env.SALESFORCE_PASSWORD!);

  try {
    const response = await axios.post<SalesforceToken>(
      "https://login.salesforce.com/services/oauth2/token",
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error getting Salesforce token:", error);
    throw new Error("Failed to obtain Salesforce token");
  }
}
