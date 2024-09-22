import axios from "axios";
import { SOQLBuilder } from "@/lib/salesforce/soqlBuilder";
import { getToken, clearToken } from "./tokenCache";

export async function refreshSalesforceToken(): Promise<string> {
  return await getToken();
}

export async function makeSalesforceApiRequest(query: SOQLBuilder) {
  let attempts = 0;
  const maxAttempts = 5;

  async function attemptRequest() {
    attempts++;
    try {
      console.log(`Attempt ${attempts} to make Salesforce API request`);
      const token = await getToken();
      console.log(`Using token: ${token.substring(0, 10)}...`);
      const salesforceInstance = process.env.SALESFORCE_INSTANCE_URL;
      const apiVersion = process.env.SALESFORCE_API_VERSION || "v61.0";

      console.log("salesforceInstance:", salesforceInstance);

      const response = await axios.get(
        `${salesforceInstance}/services/data/${apiVersion}/query?q=${encodeURIComponent(query.build())}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Salesforce API request successful.");
      return response.data;
    } catch (error) {
      console.error(
        `Error making Salesforce API request (Attempt ${attempts}):`,
        error,
      );
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 400 || error.response?.status === 401)
      ) {
        console.log("Invalid token detected. Clearing token from cache.");
        clearToken();
        if (attempts >= maxAttempts) {
          throw new Error(
            "Max attempts reached. Unable to complete Salesforce API request.",
          );
        }
        return attemptRequest();
      }
      throw error;
    }
  }

  try {
    return await attemptRequest();
  } catch (error) {
    console.error("All attempts to make Salesforce API request failed:", error);
    if (error instanceof Error) {
      return { error: error.message, details: error.stack };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}

export async function getSalesforceData(
  objectName: string,
  fields: string[],
  conditions?: string,
) {
  const query = new SOQLBuilder().select(...fields).from(objectName);

  if (conditions) {
    query.where(conditions);
  }

  return makeSalesforceApiRequest(query);
}
