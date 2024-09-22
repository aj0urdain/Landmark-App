import { NextRequest, NextResponse } from "next/server";
import { getSalesforceToken } from "@/lib/salesforce/getSalesforceToken";
import axios from "axios";

export async function GET(request: NextRequest) {
  try {
    // Get the Salesforce token
    console.log(request);
    const tokenResponse = await getSalesforceToken();
    const { access_token, instance_url } = tokenResponse;

    // Example SOQL query for pba__Location__c
    const query =
      "SELECT Id, Name, CreatedById FROM pba__Location__c ORDER BY CreatedDate DESC LIMIT 30";

    // Make the API request to Salesforce
    const response = await axios.get(
      `${instance_url}/services/data/${process.env.SALESFORCE_API_VERSION}/query`,
      {
        params: { q: query },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    return NextResponse.json({
      message: "Query executed successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error executing Salesforce query:", error);
    return NextResponse.json(
      { error: "Failed to execute Salesforce query" },
      { status: 500 },
    );
  }
}
