import { NextRequest, NextResponse } from "next/server";
import { makeSalesforceApiRequest } from "@/lib/salesforce/salesforce";
import { SOQLBuilder } from "@/lib/salesforce/soqlBuilder";

export async function GET(request: NextRequest) {
  console.log(`${request} test-api-error`);
  try {
    // Use an invalid query to force an error
    const invalidQuery = new SOQLBuilder()
      .select("InvalidField")
      .from("InvalidObject");
    const result = await makeSalesforceApiRequest(invalidQuery);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in test-api-error route:", error);
    return NextResponse.json(
      {
        error: "Failed to make Salesforce API request after multiple attempts",
      },
      { status: 500 },
    );
  }
}
