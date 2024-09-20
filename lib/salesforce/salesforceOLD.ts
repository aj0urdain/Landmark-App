// import { getTokenFromCache, setTokenInCache } from "./tokenCache";
// import dayjs from "dayjs";
// import axios from "axios";

// import { SOQLBuilder } from "@/lib/salesforce/soqlBuilder";
// import { supabaseAdmin } from "@/utils/supabase/admin";

// // Function to check and refresh the token
// export async function refreshSalesforceToken(): Promise<string> {
//   const cachedData = getTokenFromCache();
//   if (cachedData) {
//     console.log("Token is still valid and retrieved from cache.");
//     return cachedData.token;
//   }

//   console.log("No valid token in cache, checking database...");

//   // Fetch the active token from Supabase
//   const { data, error } = await supabaseAdmin
//     .from("tokens")
//     .select("*")
//     .eq("type", "salesforce")
//     .eq("active", true)
//     .order("issued_at", { ascending: false })
//     .limit(1)
//     .single();

//   if (error || !data) {
//     console.error("Error fetching token from Supabase:", error);
//     throw new Error("Token not found.");
//   }

//   const { access_token, refresh_token, issued_at, expires_in } = data;
//   const tokenExpirationTime = dayjs(issued_at).add(expires_in, "second");

//   // Check if token is expired or about to expire in the next 5 minutes
//   if (dayjs().isAfter(tokenExpirationTime.subtract(5, "minutes"))) {
//     console.log("Token expired or about to expire, refreshing...");

//     // Refresh the token using the refresh_token
//     try {
//       const response = await axios.post(
//         "https://login.salesforce.com/services/oauth2/token",
//         null,
//         {
//           params: {
//             grant_type: "refresh_token",
//             client_id: process.env.SALESFORCE_CLIENT_ID,
//             client_secret: process.env.SALESFORCE_CLIENT_SECRET,
//             refresh_token: refresh_token,
//           },
//         },
//       );

//       const newAccessToken = response.data.access_token;
//       const newIssuedAt = dayjs().toISOString();
//       const newExpiresIn = 3600; // Set to 1 hour (3600 seconds)

//       // Mark the old token as inactive
//       const { error: deactivateError } = await supabaseAdmin
//         .from("tokens")
//         .update({ active: false })
//         .eq("type", "salesforce")
//         .eq("active", true);

//       if (deactivateError) {
//         console.error(
//           "Error deactivating old token in Supabase:",
//           deactivateError,
//         );
//         throw new Error("Failed to deactivate old token.");
//       }

//       // Insert the new token as active
//       const { error: insertError } = await supabaseAdmin.from("tokens").insert({
//         type: "salesforce",
//         access_token: newAccessToken,
//         refresh_token: refresh_token, // Use the same refresh token
//         issued_at: newIssuedAt,
//         expires_in: newExpiresIn, // Use the new expires_in value
//         active: true,
//       });

//       if (insertError) {
//         console.error("Error inserting new token in Supabase:", insertError);
//         throw new Error("Failed to insert new token.");
//       }

//       console.log("Token refreshed and stored successfully.");
//       setTokenInCache(newAccessToken, newExpiresIn);
//       return newAccessToken;
//     } catch (refreshError) {
//       console.error("Error refreshing Salesforce token:", refreshError);
//       throw new Error("Failed to refresh Salesforce token.");
//     }
//   } else {
//     console.log("Token from database is still valid.");
//     setTokenInCache(access_token, expires_in);
//     return access_token;
//   }
// }

// export async function makeSalesforceApiRequest(query: SOQLBuilder) {
//   try {
//     console.log("Making Salesforce API request...");
//     const token = await refreshSalesforceToken();
//     const salesforceInstance =
//       process.env.SALESFORCE_INSTANCE_URL ||
//       "https://burgessrawson-syd.my.salesforce.com";
//     const apiVersion = process.env.SALESFORCE_API_VERSION || "v61.0";

//     console.log("salesforceInstance");
//     console.log(salesforceInstance);

//     const response = await axios.get(
//       `${salesforceInstance}/services/data/${apiVersion}/query?q=${encodeURIComponent(query.build())}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       },
//     );

//     console.log("Salesforce API request successful.");
//     return response.data;
//   } catch (error) {
//     console.error("Error making Salesforce API request:", error);
//     throw new Error("API request failed.");
//   }
// }
