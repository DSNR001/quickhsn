"use client";

import { useState, useEffect } from "react";

interface BankDetails {
  ifsc: string;
  bank: string;
  branch: string;
  centre: string;
  district: string;
  state: string;
  address: string;
  contact: string;
  micr: string;
  neft: boolean;
  rtgs: boolean;
  imps: boolean;
  upi: boolean;
}

export default function IfscUnifiedSearchPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"smart" | "direct">("smart");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Tab 1 States
  const [smartQuery, setSmartQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BankDetails[]>([]);
  
  // Tab 2 States
  const [ifscQuery, setIfscQuery] = useState("");
  
  // Shared Viewer State
  const [selectedBranchDetails, setSelectedBranchDetails] = useState<BankDetails | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle Tab 1 Search Execution
  const handleSmartSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smartQuery.trim()) return;

    setLoading(true);
    setErrorMessage("");
    setSelectedBranchDetails(null);
    setSearchResults([]);

    try {
      const res = await fetch(`/api/ifsc-dropdown?q=${encodeURIComponent(smartQuery)}`);
      if (!res.ok) throw new Error(`HTTP Error Status: ${res.status}`);
      
      const json = await res.json();
      if (json.success && json.data) {
        setSearchResults(json.data);
        if (json.data.length === 0) {
          setErrorMessage("No matching bank branches found for your criteria.");
        }
      } else {
        setErrorMessage(json.message || "Could not complete search routing search maps.");
      }
    } catch (err: any) {
      setErrorMessage(`Search error: ${err.message || "Connection timed out"}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle Tab 2: Direct alphanumeric code lookup
  const handleDirectSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = ifscQuery.trim().toUpperCase();
    setErrorMessage("");
    setSelectedBranchDetails(null);
    setSearchResults([]);

    if (code.length !== 11) {
      setErrorMessage("Please enter a valid 11-character IFSC code.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/ifsc-lookup?ifsc=${encodeURIComponent(code)}`);
      const payload = await response.json();
      
      if (response.ok && payload.success && payload.data) {
        const d = payload.data;
        
        // 🚀 FIXED: Unified mapper maps uppercase server keys to local state format safely
        setSelectedBranchDetails({
          ifsc: d.IFSC || d.ifsc || code,
          bank: d.BANK || d.bank || "Information Found",
          branch: d.BRANCH || d.branch || "Branch Details",
          centre: d.CENTRE || d.centre || "NA",
          district: d.DISTRICT || d.district || "NA",
          state: d.STATE || d.state || "NA",
          address: d.ADDRESS || d.address || "Official address not recorded.",
          contact: d.CONTACT || d.contact || "NA",
          micr: d.MICR || d.micr || "NA",
          neft: d.NEFT === "Yes" || d.NEFT === true || d.neft === true,
          rtgs: d.RTGS === "Yes" || d.RTGS === true || d.rtgs === true,
          imps: d.IMPS === "Yes" || d.IMPS === true || d.imps === true,
          upi: d.UPI === "Yes" || d.UPI === true || d.upi === true
        });
      } else {
        setErrorMessage(payload.message || "IFSC code not found in registry database.");
      }
    } catch {
      setErrorMessage("Network connectivity error.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <div className="w-full bg-gradient-to-r from-blue-700 to-blue-800 text-white text-center py-8 px-4">
          <h1 className="text-2xl font-bold">Bank IFSC Information Portal</h1>
        </div>
        <div className="text-center text-gray-400 text-sm mt-10">Initializing system configurations...</div>
        <div></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-16 flex flex-col justify-between text-gray-900">
      <div>
        {/* Banner */}
        <div className="w-full bg-gradient-to-r from-blue-700 to-blue-800 text-white text-center py-8 px-4 shadow-md">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">Bank IFSC Information Portal</h1>
          <p className="text-blue-100 text-xs sm:text-sm font-medium opacity-90">Verify official RBI branch parameters effortlessly</p>
        </div>

        <div className="max-w-4xl mx-auto px-4 mt-6">
          {/* Tab Selection Row */}
          <div className="flex bg-gray-200 p-1 rounded-xl mb-6 max-w-sm mx-auto shadow-inner">
            <button
              onClick={() => { setActiveTab("smart"); setSelectedBranchDetails(null); setSearchResults([]); setErrorMessage(""); }}
              className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "smart" ? "bg-white text-blue-700 shadow" : "text-gray-600 hover:text-gray-900"}`}
            >
              Search by Branch Name
            </button>
            <button
              onClick={() => { setActiveTab("direct"); setSelectedBranchDetails(null); setSearchResults([]); setErrorMessage(""); }}
              className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "direct" ? "bg-white text-blue-700 shadow" : "text-gray-600 hover:text-gray-900"}`}
            >
              Direct IFSC Search
            </button>
          </div>

         {/* TAB 1: SEARCH BAR CONTAINER */}
          {activeTab === "smart" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <form onSubmit={handleSmartSearch} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={smartQuery}
                  onChange={(e) => setSmartQuery(e.target.value)}
                  placeholder="Enter Bank and Place name (e.g., State Bank Hindupur)"
                  className="flex-1 border border-gray-300 rounded-xl p-3 text-base text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  type="submit"
                  disabled={loading || !smartQuery.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium px-8 py-3 rounded-xl shadow text-base transition"
                >
                  {loading ? "Searching..." : "Search Branch"}
                </button>
              </form>

              {/* 🚀 NEW: HELPFUL HOW TO USE INSTRUCTIONS */}
              {searchResults.length === 0 && !loading && !errorMessage && (
                <div className="mt-6 bg-blue-50/60 border border-blue-100 rounded-xl p-4 text-sm text-gray-700 leading-relaxed">
                  <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-1.5">
                    💡 Quick Tips for Best Results:
                  </h4>
                  <ul className="space-y-1.5 list-disc list-inside text-gray-600 pl-1">
                    <li>
                      Use full bank keywords instead of short abbreviations (e.g., type <span className="font-semibold text-gray-900">"State Bank"</span> instead of "SBI").
                    </li>
                    <li>
                      Type <span className="font-semibold text-gray-900">"Union Bank"</span> for UBI, or <span className="font-semibold text-gray-900">"Punjab"</span> for PNB followed by the location name.
                    </li>
                    <li>
                      <span className="italic">Example combinations:</span> <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200 text-xs text-blue-700 font-bold">State Bank Hindupur</span> or <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200 text-xs text-blue-700 font-bold">Canara Anantapur</span>.
                    </li>
                  </ul>
                </div>
              )}

              {/* Selection list if multiple branches are returned */}
              {searchResults.length > 0 && !selectedBranchDetails && (
                <div className="mt-5 border-t border-gray-100 pt-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Select Your Matching Branch:</h4>
                  <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto border border-gray-200 rounded-xl bg-gray-50">
                    {searchResults.map((br) => (
                      <button
                        key={br.ifsc}
                        type="button"
                        onClick={() => setSelectedBranchDetails(br)}
                        className="w-full text-left p-3.5 hover:bg-blue-50/50 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1"
                      >
                        <div>
                          <span className="font-bold text-sm text-gray-900 block">{br.bank}</span>
                          <span className="text-xs text-gray-500">{br.branch} — <span className="italic font-mono">{br.district}, {br.state}</span></span>
                        </div>
                        <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold">{br.ifsc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DIRECT INPUT CODE CHECK */}
          {activeTab === "direct" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <form onSubmit={handleDirectSearch} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  maxLength={11}
                  value={ifscQuery}
                  onChange={(e) => setIfscQuery(e.target.value)}
                  placeholder="Enter 11-digit IFSC code (e.g., SBIN0000845)"
                  className="flex-1 border border-gray-300 rounded-xl p-3 text-base font-mono uppercase tracking-wider text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  type="submit"
                  disabled={loading || ifscQuery.trim().length !== 11}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium px-8 py-3 rounded-xl shadow text-base transition"
                >
                  {loading ? "Searching..." : "Verify"}
                </button>
              </form>
            </div>
          )}

          {/* Error Notice Display Banner */}
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium text-center">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* DATA PRESENTATION CARD */}
          {selectedBranchDetails && (
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden shadow">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedBranchDetails.bank || "Information Found"}
                  </h3>
                  <p className="text-gray-500 text-xs font-medium mt-0.5">
                    Branch: {selectedBranchDetails.branch || "N/A"}
                  </p>
                </div>
                {activeTab === "smart" && (
                  <button
                    onClick={() => setSelectedBranchDetails(null)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold border border-blue-200 bg-white px-2.5 py-1 rounded-lg shadow-sm"
                  >
                    Back to List
                  </button>
                )}
              </div>
              <div className="p-6 text-gray-900">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm border-b border-gray-100 pb-5">
                  <div>
                    <span className="text-gray-400 text-xs block uppercase font-bold tracking-wider">IFSC Code</span>
                    <span className="font-mono font-bold text-blue-600 text-base select-all">
                      {selectedBranchDetails.ifsc}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs block uppercase font-bold tracking-wider">MICR Code</span>
                    <span className="font-mono text-gray-900 font-medium">
                      {selectedBranchDetails.micr || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs block uppercase font-bold tracking-wider">State Location</span>
                    <span className="text-gray-900 font-medium">
                      {selectedBranchDetails.state || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs block uppercase font-bold tracking-wider">District / City</span>
                    <span className="text-gray-900 font-medium">
                      {selectedBranchDetails.district || "N/A"} / {selectedBranchDetails.centre || "N/A"}
                    </span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-400 text-xs block uppercase font-bold tracking-wider">Official Address</span>
                    <span className="text-gray-800 font-medium leading-relaxed">
                      {selectedBranchDetails.address || "No official registry address noted."}
                    </span>
                  </div>
                </div>
                <div className="mt-5">
                  <span className="text-gray-400 text-xs block uppercase font-bold tracking-wider mb-2">Supported Systems</span>
                  <div className="flex flex-wrap gap-2 text-xs font-bold">
                    <span className="px-2.5 py-1 rounded border bg-green-50 text-green-700 border-green-200">
                      NEFT: Available
                    </span>
                    <span className="px-2.5 py-1 rounded border bg-green-50 text-green-700 border-green-200">
                      RTGS: Available
                    </span>
                    <span className="px-2.5 py-1 rounded border bg-green-50 text-green-700 border-green-200">
                      IMPS: Available
                    </span>
                    <span className="px-2.5 py-1 rounded border bg-green-50 text-green-700 border-green-200">
                      UPI: Supported
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer Footer Area */}
      <footer className="w-full max-w-4xl mx-auto px-4 mt-12">
        <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 text-justify text-[11px] text-gray-500 leading-relaxed shadow-inner">
          <p className="font-semibold text-gray-600 mb-1 uppercase tracking-wider">⚠️ Disclaimer Notice</p>
          <p>
            The IFSC, MICR codes, and branch directory details displayed on this platform are compiled directly from public repository rosters published periodically by the Reserve Bank of India (RBI). While we take utmost care to ensure accuracy, data variations or institutional changes can occur. 
          </p>
          <p className="mt-1">
            This utility is intended exclusively for informational and validation check assistance. Visitors are strongly advised to cross-verify all essential routing identities with their respective banking institutions or recipient passbooks before initiating critical electronic fund transfers (NEFT, RTGS, IMPS, or UPI).
          </p>
        </div>
      </footer>
    </main>
  );
}