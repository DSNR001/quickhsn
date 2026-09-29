import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/server'; 

interface Props {
  params: Promise<{
    code: string;
  }>;
}

export const revalidate = 86400;

// 1. Dynamic Metadata Generator (Titles & Meta Descriptions)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const supabase = await getSupabaseClient();

  // Query updated to 'hsn_master'
  const { data: hsnDataArray } = await supabase
    .from('hsn_master')
    .select('hsn_code, description, gst_rate')
    .eq('hsn_code', code)
    .limit(1);

  const hsnData = hsnDataArray?.[0];

  if (!hsnData) {
    return {
      title: `HSN Code ${code} Details & GST Rate - QuickHSN`,
      description: `Check GST rates, product descriptions, and tax schedules for HSN code ${code} on QuickHSN.`,
    };
  }

  const cleanDescription = hsnData.description
    ? hsnData.description.replace(/\s+/g, ' ').trim()
    : 'goods and services';

  const truncatedDesc =
    cleanDescription.length > 90
      ? `${cleanDescription.substring(0, 87)}...`
      : cleanDescription;

  const metaDescription = `Check ${hsnData.gst_rate}% GST rate on ${truncatedDesc} under HSN Code${hsnData.hsn_code}. Find detailed CGST, SGST, and IGST schedules on QuickHSN.`;

  return {
    title: `HSN Code ${hsnData.hsn_code} GST Rate (${hsnData.gst_rate}%) & Description - QuickHSN`,
    description: metaDescription,
    openGraph: {
      title: `HSN Code ${hsnData.hsn_code} GST Rate:${hsnData.gst_rate}%`,
      description: metaDescription,
      url: `https://quickhsn.in/hsn/${hsnData.hsn_code}`,
      siteName: 'QuickHSN',
      type: 'website',
    },
  };
}

// 2. Main Page Component (Separate function, outside generateMetadata)
export default async function HsnDetailPage({ params }: Props) {
  const { code } = await params;
  const supabase = await getSupabaseClient();

  console.log("--> Received HSN param:", code);

  // Query updated to 'hsn_master'
  const { data: hsnDataArray, error } = await supabase
    .from('hsn_master')
    .select('*')
    .eq('hsn_code', code)
    .limit(1);

  const hsnData = hsnDataArray?.[0];

  console.log("--> Supabase Data:", hsnData);
  console.log("--> Supabase Error:", error);

  if (error || !hsnData) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `https://quickhsn.in/hsn/${hsnData.hsn_code}`,
    termCode: hsnData.hsn_code,
    name: `HSN Code ${hsnData.hsn_code}`,
    description: hsnData.description,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'Harmonized System of Nomenclature (HSN) - GST India',
      url: 'https://quickhsn.in',
    },
    disambiguatingDescription: `Goods and services under HSN Code ${hsnData.hsn_code} attract a GST rate of${hsnData.gst_rate}%.`,
  };

  return (
    <main className="max-w-4xl mx-auto p-6 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-6">
        <a
          href="/hsn-lookup"
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          &larr; Back to HSN Search Lookup
        </a>
      </div>

      <article className="bg-white shadow-md rounded-xl p-8 border border-gray-100">
        <header className="border-b pb-4 mb-6">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded mb-2">
            HSN Classification
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900">
            HSN Code {hsnData.hsn_code}
          </h1>
        </header>

        <section className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Description
            </h2>
            <p className="text-lg text-gray-800 mt-1">{hsnData.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">
                Applicable GST Rate
              </h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {hsnData.gst_rate}%
              </p>
            </div>

            {hsnData.chapter && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Chapter</h3>
                <p className="text-lg font-semibold text-gray-800 mt-1">
                  Chapter {hsnData.chapter}
                </p>
              </div>
            )}
          </div>
        </section>
      </article>
    </main>
  );
}