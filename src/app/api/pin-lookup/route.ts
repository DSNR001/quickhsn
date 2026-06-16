import { NextResponse } from "next/server";

interface PostalApiBranch {
  Name: string;
  Pincode: string;
  District: string;
  State: string;
  Division: string;
  Circle: string;
}

interface UIResponseRecord {
  pincode: string;
  officeName: string;
  divisionName: string;
  stateName: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // Sanitize mobile strings: drop trailing line returns, spaces, or rogue characters
  const rawQuery = (searchParams.get("q") || "").replace(/\s+/g, " ").trim().toLowerCase();

  if (!rawQuery) {
    return NextResponse.json({ success: true, data: [], message: "No search criteria provided." });
  }

  const isNumeric = /^\d+$/.test(rawQuery);
  const searchTarget = encodeURIComponent(rawQuery);
  const endpointType = isNumeric ? "pincode" : "postoffice";

  // Server side routes use the secure mirror endpoint first to protect mobile connections
  const url = `https://pincode.net.in/api/${endpointType}/${searchTarget}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { 
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
      },
      next: { revalidate: 3600 }
    });

    if (response.ok) {
      const json = await response.json();
      if (json && Array.isArray(json) && json[0]?.Status === "Success") {
        const offices: PostalApiBranch[] = json[0].PostOffice || [];
        const formattedRecords: UIResponseRecord[] = offices.map((po: PostalApiBranch) => ({
          pincode: po.Pincode || "",
          officeName: po.Name || "",
          divisionName: po.Division || po.District || "",
          stateName: po.State || ""
        }));

        return NextResponse.json({ success: true, fallbackNeeded: false, data: formattedRecords });
      }
    }
    
    return NextResponse.json({ success: true, fallbackNeeded: true, data: [] });

  } catch {
    // 🚀 FIXED: Removed the unused '(err)' variable to fully satisfy strict linter checks
    console.warn("Mobile gateway connection blocked. Transferring lookup back to client browser layout framework.");
    return NextResponse.json({ success: true, fallbackNeeded: true, data: [] });
  }
}