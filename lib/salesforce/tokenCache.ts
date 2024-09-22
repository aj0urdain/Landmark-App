import { getSalesforceToken } from "./getSalesforceToken";

interface TokenData {
  token: string;
}

// Initialize with an invalid token

const tokenCache = new Map<string, TokenData>();

tokenCache.set("salesforce", { token: "INVALID_TOKEN" });

export async function getToken(
  key: string = "salesforce",
  simulateError: boolean = false,
): Promise<string> {
  let attempts = 0;
  const maxAttempts = 5;

  async function attemptGetToken(): Promise<string> {
    attempts++;
    console.log(`Attempt ${attempts} to get token`);

    const cachedData = tokenCache.get(key);
    if (cachedData) {
      console.log(
        `Token retrieved from cache: ${cachedData.token.substring(0, 10)}...`,
      );
      return cachedData.token;
    }

    try {
      console.log("Fetching new token from Salesforce");
      const newToken = await getSalesforceToken(simulateError);
      console.log(
        `New token obtained: ${newToken.access_token.substring(0, 10)}...`,
      );
      tokenCache.set(key, { token: newToken.access_token });
      return newToken.access_token;
    } catch (error) {
      console.error(
        `Error getting Salesforce token (Attempt ${attempts}):`,
        error,
      );
      if (attempts >= maxAttempts) {
        throw new Error(
          "Max attempts reached. Unable to obtain Salesforce token.",
        );
      }
      console.log("Clearing invalid token from cache");
      clearToken(key);
      return attemptGetToken();
    }
  }

  return attemptGetToken();
}

export function clearToken(key: string = "salesforce"): void {
  tokenCache.delete(key);
}
