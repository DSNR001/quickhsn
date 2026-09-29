import { MetadataRoute } from "next";
import { getSupabase } from "@/lib/supabase/supabase";

export const revalidate = 86400; // Revalidate sitemap cache once every 24 hours (86,400 seconds)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://quickhsn.in";

  // 1. Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/hsn-lookup`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gst-calculator`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/invoice`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // 2. Dynamic HSN Pages from Supabase
  try {
    const supabase = getSupabase();
    
    // Fetch all valid HSN codes
    const { data: hsnList, error } = await supabase
      .from("hsn_master")
      .select("hsn_code");

    if (error || !hsnList) {
      console.error("Error fetching HSN codes for sitemap:", error);
      return staticRoutes;
    }

    // Map HSN records into sitemap entries
    const hsnRoutes: MetadataRoute.Sitemap = hsnList.map((item) => ({
      url: `${baseUrl}/hsn/${item.hsn_code}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticRoutes, ...hsnRoutes];
  } catch (err) {
    console.error("Sitemap generation error:", err);
    return staticRoutes;
  }
}