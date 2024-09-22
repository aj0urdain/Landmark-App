import { NextRequest, NextResponse } from "next/server";
import jsforce from "jsforce";

// Salesforce connection configuration
const conn = new jsforce.Connection({
  loginUrl:
    process.env.SALESFORCE_INSTANCE_URL || "https://login.salesforce.com",
  version: process.env.SALESFORCE_API_VERSION,
});

// Login function
async function loginToSalesforce(): Promise<void> {
  try {
    await conn.login(
      process.env.SALESFORCE_USERNAME as string,
      (process.env.SALESFORCE_PASSWORD as string) +
        (process.env.SALESFORCE_SECURITY_TOKEN as string),
    );
    console.log("Connected to Salesforce successfully");
  } catch (err) {
    console.error("Error connecting to Salesforce:", err);
  }
}

export async function GET(req: NextRequest) {
  console.log(req);

  try {
    if (!conn.accessToken) {
      await loginToSalesforce();
    }

    const query =
      "SELECT Id, Name, CreatedById FROM pba__Location__c ORDER BY CreatedDate DESC LIMIT 30";
    const result = await conn.query<{
      Id: string;
      Name: string;
      CreatedById: string;
    }>(query);

    return NextResponse.json(result.records);
  } catch (err) {
    console.error("Error querying Salesforce:", err);
    return NextResponse.json(
      { error: "Error querying Salesforce" },
      { status: 500 },
    );
  }
}
