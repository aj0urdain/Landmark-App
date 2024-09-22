import { NextRequest, NextResponse } from "next/server";
import { getToken, clearToken } from "@/lib/salesforce/tokenCache";

export async function GET(request: NextRequest) {
  console.log(`${request} test-error`);
  clearToken(); // Clear any existing token to force a new token fetch

  try {
    const token = await getToken("salesforce", true); // Simulate error
    return NextResponse.json({ message: "Token obtained successfully", token });
  } catch (error) {
    console.error("Error in test-error route:", error);
    return NextResponse.json(
      { error: "Failed to obtain Salesforce token after multiple attempts" },
      { status: 500 },
    );
  }
}
