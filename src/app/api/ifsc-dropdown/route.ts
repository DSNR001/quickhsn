import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim();

  if (!query) {
    return NextResponse.json({ success: true, data: [] });
  }

  try {
    const supabase = getSupabase();

    // Clean and split terms into uppercase keywords (e.g., ["SBI", "HINDUPUR"])
    const words = query.split(/\s+/).filter((w) => w.length > 0).map(w => w.toUpperCase());

    // Start with a clean base query matching our composite indexes
    let dbQuery = supabase
      .from("bank_ifsc")
      .select("ifsc, bank, branch, centre, district, state, address, contact, imps, rtgs, neft, upi, micr");

    // 🚀 THE FIX: Instead of merging everything loosely into a single .or() loop,
    // we apply each word as a strict progressive cross-column filter.
    // This forces an "AND" condition between your keywords.
    words.forEach((word) => {
      dbQuery = dbQuery.or(
        `bank.ilike.%${word}%,branch.ilike.%${word}%,district.ilike.%${word}%,centre.ilike.%${word}%,address.ilike.%${word}%`
      );
    });

    // Enforce our stable, high-speed performance layout ceiling limit
    const { data: branches, error } = await dbQuery.limit(50);

    if (error) throw error;

    // Map properties safely to remain 100% compliant with our working page.tsx
    const formattedData = (branches || []).map((b: any) => ({
      ifsc: b.ifsc || b.IFSC,
      bank: b.bank || b.BANK,
      branch: b.branch || b.BRANCH,
      centre: b.centre || b.CENTRE || "NA",
      district: b.district || b.DISTRICT || "NA",
      state: b.state || b.STATE || "NA",
      address: b.address || b.ADDRESS || "Address not available",
      contact: b.contact || b.CONTACT || "NA",
      micr: b.micr || b.MICR || "NA",
      neft: b.neft === true || b.NEFT === true || String(b.NEFT).toLowerCase() === "yes",
      rtgs: b.rtgs === true || b.RTGS === true || String(b.RTGS).toLowerCase() === "yes",
      imps: b.imps === true || b.IMPS === true || String(b.IMPS).toLowerCase() === "yes",
      upi: b.upi === true || b.UPI === true || String(b.UPI).toLowerCase() === "yes"
    }));

    return NextResponse.json({ success: true, data: formattedData });

  } catch (err: any) {
    console.error("Option 1 Final Intersection Exception:", err.message);
    return NextResponse.json({ success: false, data: [], message: err.message });
  }
}