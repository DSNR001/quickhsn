"use client";

import { useState } from "react";

type PostalRecord = {
  pincode: string;
  officeName: string;
  divisionName: string;
  stateName: string;
};

// 🚀 Explicitly type the third-party structural branch data to eliminate the 'any' error
interface PostalApiBranch {
  Name: string;
  Pincode: string;
  District: string;
  State: string;
  Division: string;
  Circle: string;
}

export default function PincodeSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<PostalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Directly handles the fetch via browser API if the backend proxy gets blocked
  const executeClientSideFallback = async (term: string) => {
    try {
      console.log("Executing direct browser network fallback...");
      const isNumeric = /^\d+$/.test(term);
      const searchTarget = encodeURIComponent(term);
      const endpointType = isNumeric ? "pincode" : "postoffice";
      
      const directRes = await fetch(`https://api.postalpincode.in/${endpointType}/${searchTarget}`);
      if (!directRes.ok) return false;

      const json = await directRes.json();
      if (json && Array.isArray(json) && json[0]?.Status === "Success") {
        const offices: PostalApiBranch[] = json[0].PostOffice || [];
        
        // 🚀 Fixed the 'po: any' type strictness check here
        const formatted: PostalRecord[] = offices.map((po: PostalApiBranch) => ({
          pincode: po.Pincode || "",
          officeName: po.Name || "",
          divisionName: po.Division || po.District || "",
          stateName: po.State || ""
        }));
        setResults(formatted);
        return true;
      }
      return false;
    } catch {
      // 🚀 Fixed the unused 'err' block constraint by removing the unused variable reference
      console.error("Mobile fallback direct fetch dropped or timed out.");
      return false;
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const term = searchQuery.trim();
    if (!term) return;

    setLoading(true);
    setHasSearched(true);
    setResults([]);

    try {
      const res = await fetch(`/api/pin-lookup?q=${encodeURIComponent(term)}`);
      const payload = await res.json();
      
      if (payload.success) {
        if (payload.fallbackNeeded) {
          const success = await executeClientSideFallback(term);
          if (!success) setResults([]);
        } else if (payload.data) {
          setResults(payload.data);
        }
      }
    } catch {
      // 🚀 Fixed another unused 'err' container here
      console.warn("Primary gateway error, switching to direct lookup framework.");
      await executeClientSideFallback(term);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="w-full bg-gradient-to-r from-blue-700 to-blue-800 text-white text-center py-10 px-4 shadow-md">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          Quick HSN PIN code Search
        </h1>
        <p className="text-blue-100 text-sm sm:text-base font-medium opacity-90">
          Search for postal codes or any Post Office across India
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-700 text-center mb-4">
            Pincode Search
          </h2>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter 6 digit PIN code / Post Office Ex. 110001 or Delhi"
                className="w-full border border-gray-300 rounded-xl p-3.5 pr-10 text-base text-gray-900 bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setResults([]);
                    setHasSearched(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold text-lg"
                >
                  &times;
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !searchQuery.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium px-8 py-3.5 rounded-xl shadow transition active:scale-[0.99] flex items-center justify-center gap-2 text-base"
            >
              <span>{loading ? "Searching..." : "Search"}</span>
            </button>
          </form>
        </div>

        {loading && (
          <div className="text-center text-gray-500 font-medium text-sm mt-8">
            Searching central postal directory...
          </div>
        )}

        {hasSearched && !loading && (
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-100 border-b border-gray-200 px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
              {results.length} records found for - &ldquo;{searchQuery}&rdquo;
            </div>

            {results.length === 0 ? (
              <div className="text-center text-gray-500 py-8 text-sm font-medium">
                No matching postal records located. Try checking your spelling or PIN code.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 font-semibold">
                    <tr>
                      <th className="px-6 py-3">Pincode</th>
                      <th className="px-6 py-3">Office Name</th>
                      <th className="px-6 py-3">Division Name</th>
                      <th className="px-6 py-3">State Name</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-700 font-medium">
                    {results.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-mono font-bold text-blue-600 text-base">
                          {row.pincode}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {row.officeName}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {row.divisionName}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {row.stateName}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}