// app/api/salesforce/route.ts
import { NextRequest, NextResponse } from "next/server";
import { SOQLBuilder } from "@/lib/salesforce/soqlBuilder";
import { makeSalesforceApiRequest } from "@/lib/salesforce/salesforce";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const queryType = searchParams.get("queryType");

  try {
    let query: SOQLBuilder;

    switch (queryType) {
      case "portfolios":
        query = new SOQLBuilder()
          .select("Id", "Name", "CreatedById")
          .from("pba__Location__c")
          .orderBy("CreatedDate", "DESC")
          .limit(30);
        break;

      case "properties":
        query = new SOQLBuilder()
          .select("fields(all)")
          .from("pba__Property__c")
          .orderBy("CreatedDate", "DESC")
          .limit(200);
        break;

      case "listingsByPortfolios":
        const portfolioId = searchParams.get("portfolioId");
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
            "Portfolio__c",
          )
          .from("pba__Listing__c")
          .where(`Portfolio__c = '${portfolioId}'`)
          .orderBy("CreatedDate", "DESC")
          .limit(50);
        break;

      case "listings":
        query = new SOQLBuilder()
          .select(
            "Id",
            "Name",
            "Portfolio__c",
            "pba__ListingType__c",
            "pba__Status__c",
          )
          .from("pba__Listing__c")
          .orderBy("CreatedDate", "DESC")
          .limit(10);
        break;

      default:
        return NextResponse.json(
          { error: "Invalid query type" },
          { status: 400 },
        );
    }

    console.log("Query:", query.build()); // Log the query for debugging
    const salesforceResponse = await makeSalesforceApiRequest(query);

    // Check if data is null or undefined
    if (salesforceResponse == null) {
      return NextResponse.json(
        { error: "No data returned from Salesforce" },
        { status: 500 },
      );
    }

    // Attempt to stringify the data to check for non-serializable values
    try {
      JSON.stringify(salesforceResponse);
    } catch (jsonError) {
      console.error("Error stringifying Salesforce data:", jsonError);
      return NextResponse.json(
        { error: "Data contains non-serializable values" },
        { status: 500 },
      );
    }

    console.log("Salesforce data successfully returned.");
    return NextResponse.json(salesforceResponse);
  } catch (error) {
    console.error("Error fetching Salesforce data:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch data from Salesforce",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
