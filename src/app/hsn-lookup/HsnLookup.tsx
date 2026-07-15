"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase/supabase";
import type { HSNMasterRow } from "@/lib/supabase/types";

const HSN_SELECT_FIELDS =
  "hsn_code, description, gst_rate, condition_type, notes, keywords";

async function fetchHsnResults(term: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("hsn_master")
    .select(HSN_SELECT_FIELDS)
    .or(`hsn_code.ilike.%${term}%,description.ilike.%${term}%`)
    .limit(50);

  if (error) {
    console.error("HSN lookup error:", error);
    return [];
  }

  return (data as HSNMasterRow[]) ?? [];
}

function extractRelatedKeywords(results: HSNMasterRow[]) {
  return Array.from(
    new Set(
      results.flatMap((row) =>
        row.keywords
          ? String(row.keywords)
              .split(",")
              .map((keyword) => keyword.trim())
              .filter((keyword) => keyword.length >= 3 && !/^\d+$/.test(keyword))
          : []
      )
    )
  ).slice(0, 12);
}

export default function HsnLookup() {
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
      const data = await fetchHsnResults(term);
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeywordSearch = async (keyword: string) => {
    setQuery(keyword);
    setLoading(true);

    try {
      const data = await fetchHsnResults(keyword);
      setResults(data);
    } catch (err) {
      console.error("Keyword search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

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

  const parentResults = results.filter((row) => String(row.hsn_code).length < 8);
  const detailedResults = results.filter((row) => String(row.hsn_code).length === 8);
  const relatedKeywords = extractRelatedKeywords(results);

  return (
    <div className="space-y-4 max-w-4xl mx-auto px-1">
      {/* Search Input Bar */}
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
          className="flex-1 rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm md:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleSearch}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-white font-medium text-sm md:text-base shadow hover:bg-blue-700 transition"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {loading && (
        <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-xs md:text-sm text-blue-700">
          Searching HSN database...
        </div>
      )}

      {/* Suggestions */}
      {relatedKeywords.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
          <div className="text-xs font-semibold text-gray-600">Related Suggestions</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {relatedKeywords.map((keyword) => (
              <button
                key={keyword}
                onClick={() => handleKeywordSearch(keyword)}
                className="rounded-full border border-gray-300 bg-white px-2.5 py-1 text-xs hover:bg-blue-50 hover:border-blue-300 transition"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Results (4/6 Digit) */}
      {parentResults.length > 0 && (
        <div className="space-y-3">
          <div className="border-b border-gray-100 pb-1.5">
            <h2 className="text-base font-bold text-gray-800">Category Match (4/6 Digit)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {parentResults.map((row, index) => (
              <div key={`${row.hsn_code}-${index}`} className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between gap-2 border-b border-gray-50 pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-blue-700">{row.hsn_code}</span>
                    <button
                      onClick={() => handleCopy(String(row.hsn_code))}
                      className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] text-gray-500 hover:bg-gray-100"
                    >
                      {copied[String(row.hsn_code)] ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                    {row.gst_rate}% GST
                  </div>
                </div>
                {/* Fix 2: Changed text-xs to text-sm and lightened color slightly to gray-600 for clean display */}
                <div className="max-h-[100px] overflow-y-auto text-sm text-gray-600 leading-relaxed pr-1 scrollbar-thin">
                  {row.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Results (8 Digit) */}
      {detailedResults.length > 0 && (
        <div className="space-y-3 mt-6">
          <div className="border-b border-gray-100 pb-1.5">
            <h2 className="text-base font-bold text-gray-800">Detailed 8-Digit Codes</h2>
          </div>

          {detailedResults.map((row, index) => (
            <div key={`${row.hsn_code}-${index}`} className="rounded-xl border-l-4 border-green-500 border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-base md:text-lg font-bold text-green-700 tracking-wide">{row.hsn_code}</span>
                  <button
                    onClick={() => handleCopy(String(row.hsn_code))}
                    className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-500 hover:bg-gray-100 transition"
                  >
                    {copied[String(row.hsn_code)] ? "Copied" : "Copy"}
                  </button>
                </div>
                <div className="rounded-full bg-green-50 px-3 py-0.5 text-xs font-bold text-green-700">
                  {row.gst_rate}% GST
                </div>
              </div>

              <div className="max-h-[120px] overflow-y-auto text-xs md:text-sm text-gray-600 leading-relaxed pr-1 mb-3 bg-gray-50/50 p-2 rounded-lg border border-gray-100/60">
                {row.description}
              </div>

              {(row.condition_type || row.notes) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  {row.condition_type && (
                    <div className="rounded-lg bg-amber-50/60 border border-amber-100 p-2 text-xs">
                      <span className="font-bold text-amber-800 block text-[10px] uppercase tracking-wide">Condition</span>
                      <p className="text-amber-950 mt-0.5">{row.condition_type}</p>
                    </div>
                  )}
                  {row.notes && (
                    <div className="rounded-lg bg-blue-50/60 border border-blue-100 p-2 text-xs">
                      <span className="font-bold text-blue-800 block text-[10px] uppercase tracking-wide">Notes</span>
                      <p className="text-blue-950 mt-0.5 line-clamp-3 hover:line-clamp-none transition-all duration-200">{row.notes}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="border-t border-gray-100 pt-2.5">
                <div className="text-[11px] uppercase font-bold tracking-wide text-gray-500 mb-2">⚡ Instant GST Calculator</div>
                
                <div className="grid grid-cols-2 gap-2.5 max-w-md">
                  <div>
                    <label className="text-[11px] font-medium text-gray-500 block mb-1">Qty</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      placeholder="0"
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
                      className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-gray-500 block mb-1">Rate (₹)</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      placeholder="0.00"
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
                      className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
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
                  const total = subTotal + gstAmount;

                  return (
                    <div className="mt-2.5 rounded-lg bg-green-50/50 border border-green-100 p-2.5 text-xs max-w-md ml-0 space-y-1">
                      <div className="flex justify-between text-gray-600">
                        <span>Sub-Total:</span>
                        <span>₹{subTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>GST ({gstRate}%):</span>
                        {/* Fix 1: Brightened the CGST/SGST text from text-gray-400 to text-gray-700 and font-medium */}
                        <span>₹{gstAmount.toFixed(2)} <span className="text-[11px] text-gray-700 font-medium ml-1">(CGST: {cgst.toFixed(2)}, SGST: {sgst.toFixed(2)})</span></span>
                      </div>
                      <div className="border-t border-green-200/60 pt-1 flex justify-between font-bold text-gray-900 text-sm">
                        <span>Total Amount:</span>
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
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs md:text-sm text-amber-700">
          No matching HSN / SAC records found.
        </div>
      )}

      {/* Quick Tools Home Panel */}
      {detailedResults.length === 0 && parentResults.length === 0 && query.trim() === "" && (
        <div className="mt-4">
          {/* Fix 3: Changed text-sm to text-base and updated text color for prominent headings */}
          <h3 className="text-base font-bold mb-3 text-gray-800 tracking-wide">⚡ Quick Tools</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <a href="/invoice" className="p-2.5 border rounded-lg hover:bg-gray-50 transition text-center block text-xs font-medium shadow-sm bg-white text-gray-800">📄 GST-Invoice</a>
            <a href="/gst-calculator" className="p-2.5 border rounded-lg hover:bg-gray-50 transition text-center block text-xs font-medium shadow-sm bg-white text-gray-800">🧮 GST-Calculator</a>
            <a href="/gst" className="p-2.5 border rounded-lg hover:bg-gray-50 transition text-center block text-xs font-medium shadow-sm bg-white text-gray-800">🏢 Find GSTIN</a>
            <a href="/ifsc" className="p-2.5 border rounded-lg hover:bg-gray-50 transition text-center block text-xs font-medium shadow-sm bg-white text-gray-800">🏦 Check IFSC</a>
            <a href="/pincode" className="p-2.5 border rounded-lg hover:bg-gray-50 transition text-center block text-xs font-medium shadow-sm bg-white text-gray-800">📍 PIN Search</a>
          </div>
        </div>
      )}
    </div>
  );
}