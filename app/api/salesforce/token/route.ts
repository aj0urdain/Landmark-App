import { NextRequest, NextResponse } from "next/server";
import { getSalesforceToken } from "@/lib/salesforce/getSalesforceToken";

export async function GET(request: NextRequest) {
  try {
    console.log(request);
    const token = await getSalesforceToken();
    return NextResponse.json({ message: "Token obtained successfully", token });
  } catch (error) {
    console.error("Error obtaining Salesforce token:", error);
    return NextResponse.json(
      { error: "Failed to obtain Salesforce token" },
      { status: 500 },
    );
  }
}
