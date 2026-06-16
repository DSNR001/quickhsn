"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase/supabase";
import type { HSNMasterRow } from "@/lib/supabase/types";

export default function Page() {
  // We keep all your custom states completely intact
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<HSNMasterRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<Record<string, boolean>>({});
  const [invoiceInputs, setInvoiceInputs] = useState<
      Record<
      string,
      {
        quantity: string;
        rate: string;
      }
    >
  >({});

  const handleSearch = async () => {
    const term = query.trim();
    if (!term) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const supabase = getSupabase();

      const { data, error } = await supabase
        .from("hsn_master")
        .select("hsn_code, description, gst_rate, condition_type, notes, keywords")
        .or(`hsn_code.ilike.%${term}%,description.ilike.%${term}%`)
        .limit(50);

      if (error) {
        console.error(error);
        setResults([]);
      } else {
        setResults((data as HSNMasterRow[]) ?? []);
      }
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const parentResults = results.filter(
    (row) => String(row.hsn_code).length < 8
  );

  const detailedResults = results.filter(
    (row) => String(row.hsn_code).length === 8
  );

  const relatedKeywords = Array.from(
    new Set(
      results.flatMap((row) =>
        row.keywords
          ? String(row.keywords)
              .split(",")
              .map((k) => k.trim())
              .filter(
                (k) =>
                  k.length >= 3 &&
                  !/^\d+$/.test(k)
              )
          : []
      )
    )
  ).slice(0, 12);

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);

      setCopied((prev) => ({
        ...prev,
        [code]: true,
      }));

      setTimeout(() => {
        setCopied((prev) => ({
          ...prev,
          [code]: false,
        }));
      }, 1200);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-10">
      <div className="w-full flex justify-end px-4 pt-2">
        <div className="flex flex-wrap items-center gap-5 rounded-xl bg-white px-5 py-2 shadow-sm border border-gray-200 text-xs sm:text-sm font-medium text-blue-700">
          <a href="/faq" className="hover:text-blue-900 hover:underline">FAQ</a>
          <a href="/blog" className="hover:text-blue-900 hover:underline">Blog</a>
          <a href="/notifications" className="hover:text-blue-900 hover:underline">Circulars</a>
          <a href="/privacy" className="hover:text-blue-900 hover:underline">Privacy Policy</a>
          <a href="/about" className="hover:text-blue-900 hover:underline">About Us</a>
        </div>
      </div>

      <div className="w-full max-w-3xl flex flex-col gap-5">
        <h1 className="text-3xl font-bold text-center">QuickHSN.in</h1>

        <p className="text-center text-sm sm:text-base font-medium tracking-wide text-green-600">
          “Smart HSN Search for Modern GST Compliance”
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Search HSN / SAC code or product"
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={handleSearch}
            className="rounded-xl bg-blue-600 px-6 py-3 text-white font-medium shadow hover:bg-blue-700 transition"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Quick Tools */}
        <div className="mt-3">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">⚡ Quick Tools</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
           <a 
    href="/invoice" 
    className="p-2.5 md:p-3 border rounded-lg hover:bg-gray-50 transition text-center block cursor-pointer text-sm hover:text-blue-700 text-xs md:text-sm font-medium shadow-sm bg-white"
  >
    📄 Generate GST Invoice
  </a>
  
   <a 
    href="/gst-calculator" 
    className="p-2.5 md:p-3 border rounded-lg hover:bg-gray-50 transition text-center block cursor-pointer text-gray-800 hover:text-blue-700 text-xs md:text-sm font-medium shadow-sm bg-white"
  >
    🧮 GST Calculator
  </a>
  
  <a 
    href="/gst" 
    className="p-2.5 md:p-3 border rounded-lg hover:bg-gray-50 transition text-center block cursor-pointer text-gray-800 hover:text-blue-700 text-xs md:text-sm font-medium shadow-sm bg-white"
  >
    🏢 Find GSTIN
  </a>

    <a 
    href="/ifsc" 
    className="p-2.5 md:p-3 border rounded-lg hover:bg-gray-50 transition text-center block cursor-pointer text-gray-800 hover:text-blue-700 text-xs md:text-sm font-medium shadow-sm bg-white"
  >
    🏦 Check IFSC
  </a>

   <a 
    href="/pincode" 
    className="p-2.5 md:p-3 border rounded-lg hover:bg-gray-50 transition text-center block cursor-pointer text-gray-800 hover:text-blue-700 text-xs md:text-sm font-medium shadow-sm bg-white"
  >
    📍 PIN Search
  </a>
 
          </div>
        </div>

        {loading && (
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-700">
            Searching HSN database...
          </div>
        )}

        {relatedKeywords.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-sm font-semibold text-gray-700">Related Suggestions</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {relatedKeywords.map((keyword) => (
                <button
                  key={keyword}
                  onClick={async () => {
                    setQuery(keyword);
                    const supabase = getSupabase();
                    const { data } = await supabase
                      .from("hsn_master")
                      .select("hsn_code, description, gst_rate, condition_type, notes, keywords")
                      .or(`hsn_code.ilike.%${keyword}%,description.ilike.%${keyword}%`)
                      .limit(50);
                    setResults((data as HSNMasterRow[]) ?? []);
                  }}
                  className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-blue-50 hover:border-blue-300"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        )}

        {parentResults.length > 0 && (
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h2 className="text-lg font-semibold text-gray-800">Category Match (4/6 Digit)</h2>
              <p className="text-sm text-gray-500">Broader HSN classifications</p>
            </div>

            {parentResults.map((row, index) => (
              <div key={index} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-500">HSN Code</div>
                    <div className="mt-1 flex items-center gap-3">
                      <div className="font-mono text-lg font-bold text-blue-700">{row.hsn_code}</div>
                      <button
                        onClick={() => handleCopy(String(row.hsn_code))}
                        className="rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-100"
                      >
                        {copied[String(row.hsn_code)] ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                  <div className="self-start rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                    {row.gst_rate}%
                  </div>
                </div>
                <div className="mt-3 text-sm leading-7 text-gray-700">{row.description}</div>
              </div>
            ))}
          </div>
        )}

        {detailedResults.length > 0 && (
          <div className="mt-10 space-y-4">
            <div className="border-b pb-2">
              <h2 className="text-lg font-semibold text-gray-800">Detailed 8-Digit Codes</h2>
              <p className="text-sm text-gray-500">Product-level GST classifications</p>
            </div>

            {detailedResults.map((row, index) => (
              <div key={index} className="rounded-xl border-l-4 border-green-500 border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-500">HSN Code</div>
                    <div className="mt-1 flex items-center gap-3">
                      <div className="font-mono text-lg font-bold text-green-700">{row.hsn_code}</div>
                      <button
                        onClick={() => handleCopy(String(row.hsn_code))}
                        className="rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-100"
                      >
                        {copied[String(row.hsn_code)] ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                  <div className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                    {row.gst_rate}%
                  </div>
                </div>

                <div className="mt-3 text-sm leading-7 text-gray-700">{row.description}</div>

                {row.condition_type && (
                  <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-amber-700">Condition Type</div>
                    <div className="mt-1 text-sm text-amber-700">{row.condition_type}</div>
                  </div>
                )}

                {row.notes && (
                  <div className="mt-3 rounded-lg bg-blue-50 border border-blue-200 p-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-blue-700">Notes</div>
                    <div className="mt-1 text-sm text-blue-800 leading-6">{row.notes}</div>
                  </div>
                )}

                <div className="mt-4 border-t pt-3">
                  <div className="text-xs uppercase font-semibold tracking-wide text-amber-700">GST Calculator</div>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-blue-900">Quantity</label>
                      <input
                        type="number"
                        inputMode="decimal"
                        placeholder="Enter quantity"
                        value={invoiceInputs[String(row.hsn_code)]?.quantity || ""}
                        onChange={(e) =>
                          setInvoiceInputs((prev) => ({
                            ...prev,
                            [String(row.hsn_code)]: {
                              quantity: e.target.value,
                              rate: prev[String(row.hsn_code)]?.rate || "",
                            },
                          }))
                        }
                        className="mt-1 w-full rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-green-300"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-blue-900">Rate</label>
                      <input
                        type="number"
                        inputMode="decimal"
                        placeholder="Enter rate"
                        value={invoiceInputs[String(row.hsn_code)]?.rate || ""}
                        onChange={(e) =>
                          setInvoiceInputs((prev) => ({
                            ...prev,
                            [String(row.hsn_code)]: {
                              quantity: prev[String(row.hsn_code)]?.quantity || "",
                              rate: e.target.value,
                            },
                          }))
                        }
                        className="mt-1 w-full rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                      />
                    </div>
                  </div>

                  {(() => {
                    const quantity = parseFloat(invoiceInputs[String(row.hsn_code)]?.quantity || "0") || 0;
                    const rate = parseFloat(invoiceInputs[String(row.hsn_code)]?.rate || "0") || 0;

                    if (quantity <= 0 || rate <= 0) return null;

                    const subTotal = quantity * rate;
                    const gstRate = parseFloat(String(row.gst_rate)) || 0;
                    const gstAmount = (subTotal * gstRate) / 100;
                    const cgst = gstAmount / 2;
                    const sgst = gstAmount / 2;
                    const igst = gstAmount;
                    const total = subTotal + gstAmount;

                    return (
                      <div className="mt-4 rounded-xl bg-green-50 border border-green-200 p-4 text-sm space-y-2">
                        <div className="flex justify-between">
                          <span>Sub-Total</span>
                          <span>₹{subTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>GST ({gstRate}%)</span>
                          <span>₹{gstAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>CGST</span>
                          <span>₹{cgst.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>SGST</span>
                          <span>₹{sgst.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>IGST</span>
                          <span>₹{igst.toFixed(2)}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-semibold text-base">
                          <span>Total Invoice Value</span>
                          <span>₹{total.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && query.trim() && results.length === 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
            No matching HSN / SAC records found.
          </div>
        )}

        <div className="mt-10 rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs leading-6 text-gray-600">
          <div className="font-semibold text-gray-700 mb-1">Disclaimer:</div>
          <p>
            The HSN / SAC codes, GST rates, descriptions, and related information
            provided on QuickHSN.in are for general informational purposes only. While we strive
            for accuracy, HSN codes and GST rates are subject to changes by the government. We do not
            warrant the completeness or accuracy of this data. Users must verify all information
            with official government sources or a qualified tax professional before making financial
            decisions. QuickHSN.in is not liable for any inaccuracies or financial losses.
          </p>
        </div>

        {/* TARGETED CHANGE 2: Removed old popup mounting bracket entirely to avoid structural conflicts */}
      </div>
    </main>
  );
}