// app/api/salesforce/route.ts
import { NextRequest, NextResponse } from "next/server";
import { SOQLBuilder } from "@/lib/salesforce/soqlBuilder";
import { makeSalesforceApiRequest } from "@/lib/salesforce/salesforce";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const queryType = searchParams.get("queryType");
  const portfolioId = searchParams.get("portfolioId");

  try {
    let query: SOQLBuilder;

    if (queryType === "portfolios") {
      query = new SOQLBuilder()
        .select("Id", "Name")
        .from("pba__Portfolio__c")
        .limit(100);
    } else if (queryType === "listingsByPortfolios") {
      if (!portfolioId) {
        return NextResponse.json(
          { error: "Portfolio ID is required" },
          { status: 400 },
        );
      }
      query = new SOQLBuilder()
        .select(
          "Id",
          "Name",
          "pba__ListingType__c",
          "pba__Status__c",
          "CreatedDate",
        )
        .from("pba__Listing__c")
        .where(`pba__Portfolio__c = '${portfolioId}'`)
        .limit(100);
    } else {
      return NextResponse.json(
        { error: "Invalid query type" },
        { status: 400 },
      );
    }

    console.log("Query:", query.build()); // Log the query for debugging
    const salesforceResponse = await makeSalesforceApiRequest(query);
    return NextResponse.json(salesforceResponse);
  } catch (error) {
    console.error("Error in Salesforce API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from Salesforce", details: error },
      { status: 500 },
    );
  }
}
