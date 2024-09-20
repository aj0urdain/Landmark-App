import { getTokenFromCache, setTokenInCache } from "./tokenCache";
import dayjs from "dayjs";
import axios from "axios";
import { SOQLBuilder } from "@/lib/salesforce/soqlBuilder";
import { supabaseAdmin } from "@/utils/supabase/admin";

async function getNewTokenFromSalesforce(): Promise<{
  access_token: string;
  refresh_token: string;
  instance_url: string;
  expires_in: number;
}> {
  console.log("Getting new token from Salesforce...");

  console.log(
    "process.env.SALESFORCE_CLIENT_ID:",
    process.env.SALESFORCE_CLIENT_ID,
  );
  console.log(
    "process.env.SALESFORCE_CLIENT_SECRET:",
    process.env.SALESFORCE_CLIENT_SECRET,
  );
  console.log(
    "process.env.SALESFORCE_REFRESH_TOKEN:",
    process.env.SALESFORCE_REFRESH_TOKEN,
  );
  try {
    const response = await axios.post(
      "https://login.salesforce.com/services/oauth2/token",
      null,
      {
        params: {
          grant_type: "refresh_token",
          client_id: process.env.SALESFORCE_CLIENT_ID,
          client_secret: process.env.SALESFORCE_CLIENT_SECRET,
          refresh_token: process.env.SALESFORCE_REFRESH_TOKEN,
        },
      },
    );

    return {
      access_token: response.data.access_token,
      refresh_token:
        response.data.refresh_token || process.env.SALESFORCE_REFRESH_TOKEN,
      instance_url: response.data.instance_url,
      expires_in: response.data.expires_in || 1800,
    };
  } catch (error) {
    console.error("Error getting new token from Salesforce:", error);
    throw new Error("Failed to get new token from Salesforce");
  }
}

async function updateTokenInDatabase(token: {
  access_token: string;
  refresh_token: string;
  issued_at: string;
  expires_in: number;
}) {
  // Mark the old token as inactive
  await supabaseAdmin
    .from("tokens")
    .update({ active: false })
    .eq("type", "salesforce")
    .eq("active", true);

  // Insert the new token as active
  const { error: insertError } = await supabaseAdmin.from("tokens").insert({
    type: "salesforce",
    access_token: token.access_token,
    refresh_token: token.refresh_token,
    issued_at: token.issued_at,
    expires_in: token.expires_in || 1800,
    active: true,
  });

  if (insertError) {
    // console.error("Error inserting new token in Supabase:", insertError);
    throw new Error("Failed to insert new token into Supabase.");
  }
}

export async function refreshSalesforceToken(): Promise<string> {
  const cachedData = getTokenFromCache();
  if (cachedData) {
    console.log("Token is still valid and retrieved from cache.");
    return cachedData.token;
  }

  console.log("No valid token in cache, checking database...");

  // Fetch the active token from Supabase
  const { data, error } = await supabaseAdmin
    .from("tokens")
    .select("*")
    .eq("type", "salesforce")
    .eq("active", true)
    .order("issued_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    console.log("No valid token in database, getting new token...");
    const newToken = await getNewTokenFromSalesforce();
    const tokenData = {
      access_token: newToken.access_token,
      refresh_token: newToken.refresh_token,
      issued_at: dayjs().toISOString(), // Store as ISO string
      expires_in: newToken.expires_in || 1800,
    };
    await updateTokenInDatabase(tokenData);
    setTokenInCache(newToken.access_token, newToken.expires_in);
    return newToken.access_token;
  }

  const { access_token, issued_at, expires_in } = data;
  const tokenExpirationTime = dayjs(issued_at).add(
    expires_in || 3600,
    "second",
  );

  // Check if token is expired or about to expire in the next 5 minutes
  if (dayjs().isAfter(tokenExpirationTime.subtract(5, "minutes"))) {
    console.log("Token expired or about to expire, refreshing...");

    try {
      const newToken = await getNewTokenFromSalesforce();
      const tokenData = {
        access_token: newToken.access_token,
        refresh_token: newToken.refresh_token,
        issued_at: dayjs().toISOString(),
        expires_in: newToken.expires_in,
      };
      await updateTokenInDatabase(tokenData);
      setTokenInCache(newToken.access_token, newToken.expires_in);

      console.log("Token data:", {
        issued_at,
        expires_in,
        currentTime: dayjs().toISOString(),
        expirationTime: tokenExpirationTime.toISOString(),
        isExpired: dayjs().isAfter(tokenExpirationTime.subtract(5, "minutes")),
      });
      return newToken.access_token;
    } catch (refreshError) {
      // console.error("Error refreshing Salesforce token:", refreshError);
      throw new Error("Error refreshing Salesforce token.");
    }
  } else {
    console.log("Token from database is still valid.");
    setTokenInCache(access_token, expires_in || 1800);
    return access_token;
  }
}

export async function makeSalesforceApiRequest(query: SOQLBuilder) {
  try {
    console.log("Making Salesforce API request...");
    const token = await refreshSalesforceToken();
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
    console.error("Error making Salesforce API request:");
    // console.error("Error making Salesforce API request:", error);
    if (error instanceof Error) {
      return { error: error.message, details: error.stack };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
}
