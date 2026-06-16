import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ifscCode = (searchParams.get("ifsc") || "").trim().toUpperCase();

  if (!ifscCode || ifscCode.length !== 11) {
    return NextResponse.json(
      { success: false, message: "Invalid IFSC code length. It must be exactly 11 characters." },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabase();

    // Query your table using explicit column layout filters
    const { data: bankData, error } = await supabase
      .from("bank_ifsc")
      .select("ifsc, bank, branch, centre, district, state, address, contact, imps, rtgs, neft, upi, micr")
      .ilike("ifsc", ifscCode)
      .limit(1)
      .single();

    if (error || !bankData) {
      return NextResponse.json({ 
        success: false, 
        message: "IFSC code not found in registry database columns." 
      });
    }

    // 🚀 FIXED: Using an 'any' type cast lets us read variations without triggering strict linter errors
    const b = bankData as any;

    // Standardize data mappings for the UI layout page mapping keys perfectly
    const formattedResult = {
      IFSC: b.ifsc || b.IFSC || ifscCode,
      BANK: b.bank || b.BANK || "Unknown Bank",
      BRANCH: b.branch || b.BRANCH || "Main Branch",
      CENTRE: b.centre || b.CENTRE || "NA",
      DISTRICT: b.district || b.DISTRICT || "NA",
      STATE: b.state || b.STATE || "NA",
      ADDRESS: b.address || b.ADDRESS || "Official address data not logged.",
      CONTACT: b.contact || b.CONTACT || "NA",
      MICR: b.micr || b.MICR || "NA",
      NEFT: b.neft === true || b.NEFT === true || String(b.neft).toLowerCase() === "yes" ? "Yes" : "No",
      RTGS: b.rtgs === true || b.RTGS === true || String(b.rtgs).toLowerCase() === "yes" ? "Yes" : "No",
      IMPS: b.imps === true || b.IMPS === true || String(b.imps).toLowerCase() === "yes" ? "Yes" : "No",
      UPI: b.upi === true || b.UPI === true || String(b.upi).toLowerCase() === "yes" ? "Yes" : "No"
    };

    return NextResponse.json({
      success: true,
      data: formattedResult
    });

  } catch (globalError: any) {
    return NextResponse.json(
      { success: false, message: globalError.message || "Database connection error." },
      { status: 500 }
    );
  }
}