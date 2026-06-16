"use client";

import { useState, useEffect } from "react";

export default function GSTLookupPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"gstin" | "pan">("gstin");
  
  // Toggle state to keep instructions collapsed by default, pulling button upwards
  const [showInstructions, setShowInstructions] = useState(false);
  
  // Form input states
  const [gstNumber, setGstNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  
  // Feedback states
  const [validationError, setValidationError] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  // Eliminate Next.js server hydration variance
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset alerts when switching tabs
  const handleTabChange = (tab: "gstin" | "pan") => {
    setActiveTab(tab);
    setValidationError("");
    setCopySuccess(false);
  };

  const handleLookupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    setCopySuccess(false);

    if (activeTab === "gstin") {
      const cleanGST = gstNumber.trim().toUpperCase();

      if (cleanGST.length === 0) {
        setValidationError("Please enter a valid 15-digit GSTIN first.");
        return;
      }
      if (cleanGST.length !== 15) {
        setValidationError(`GSTIN must be exactly 15 characters long. You entered ${cleanGST.length} characters.`);
        return;
      }

      try {
        await navigator.clipboard.writeText(cleanGST);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 4000);
      } catch (err) {
        console.error("Clipboard copy failure: ", err);
      }

      const targetGovUrl = `https://services.gst.gov.in/services/searchtp`;
      window.open(targetGovUrl, "_blank", "noopener,noreferrer");

    } else {
      const cleanPAN = panNumber.trim().toUpperCase();

      if (cleanPAN.length === 0) {
        setValidationError("Please enter a valid 10-character PAN card number first.");
        return;
      }

      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(cleanPAN)) {
        setValidationError("Invalid PAN layout format. It must follow standard pattern structure (e.g., ABCDE1234F).");
        return;
      }

      try {
        await navigator.clipboard.writeText(cleanPAN);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 4000);
      } catch (err) {
        console.error("Clipboard copy failure: ", err);
      }

      const targetGovUrl = `https://services.gst.gov.in/services/searchtpbypan`;
      window.open(targetGovUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <div className="w-full bg-gradient-to-r from-blue-700 to-blue-800 text-white text-center py-5 px-4 shadow-md">
          <h1 className="text-2xl font-bold">Real-Time GSTIN Verification</h1>
        </div>
        <div className="text-center text-gray-400 text-sm mt-10">Loading interface parameters...</div>
        <div></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-4 text-gray-900">
      {/* Banner */}
      <div className="w-full bg-gradient-to-r from-blue-700 to-blue-800 text-white text-center py-5 px-4 shadow-md">
        <div className="flex items-center justify-center gap-2 mb-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Real-Time GSTIN Verification
          </h1>
        </div>
        <p className="text-blue-100 text-xs font-medium opacity-90">
          Verify Goods & Services Taxpayer Registration Profiles Securely
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-3">
        {/* Sub-Header Title */}
        <div className="text-center mb-3">
          <h2 className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">
            SEARCH TAXPAYERS GSTIN (OR) REGISTRATION PROFILE
          </h2>
        </div>

        {/* Dual-Tab Layout Switcher */}
        <div className="flex bg-gray-200 p-1 rounded-xl mb-3 max-w-sm mx-auto shadow-inner">
          <button
            type="button"
            onClick={() => handleTabChange("gstin")}
            className={`flex-1 text-center py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === "gstin" ? "bg-white text-blue-700 shadow" : "text-gray-600 hover:text-gray-900"}`}
          >
            SEARCH BY GSTIN
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("pan")}
            className={`flex-1 text-center py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === "pan" ? "bg-white text-blue-700 shadow" : "text-gray-600 hover:text-gray-900"}`}
          >
            SEARCH BY PAN
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
          
          {/* Collapsible Helper Instructions Panel to push the main buttons up */}
          <div className="mb-3 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <button
              type="button"
              onClick={() => setShowInstructions(!showInstructions)}
              className="w-full bg-gray-50 hover:bg-gray-100 px-4 py-2 text-xs font-bold text-green-700 flex justify-between items-center transition border-b border-gray-100"
            >
              <span className="flex items-center gap-1.5 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Verify Business Authenticity ({activeTab === "gstin" ? "GSTIN Mode" : "PAN Mode"})
              </span>
              <span className="text-red-700 underline text-[11px]">
                {showInstructions ? "Hide Instructions ✕" : "💡 View How to Use instructions / उपयोग करने का तरीका"}
              </span>
            </button>

            {showInstructions && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600 leading-relaxed p-4 bg-white">
                {/* Left Column: English Instruction Set */}
                <div className="space-y-1">
                  <strong className="text-gray-800 font-bold block border-b border-gray-200 pb-1 mb-1">
                    HOW TO USE:
                  </strong>
                  {activeTab === "gstin" ? (
                    <>
                      <p>1. Enter the 15-character GST Identification Number (GSTIN) without mistakes, and hit the copy & verify button below.</p>
                      <p>2. It will soon be validated, formatted, and copied to your clipboard and you will redirected to the official GST portal.</p>
                      <p>3. Paste it now using ctrl + v (or) mouse right click, and press any key on your keyboard.</p>
                      <p>4. Now the Captcha section opens. Fill the captcha and hit search button.</p>
                    </>
                  ) : (
                    <>
                      <p>1. Enter the 10-character Permanent Account Number (PAN) correctly, and hit the copy & verify button below.</p>
                      <p>2. The code validates it, copies it to your clipboard, and launches the official GST PAN-search dashboard in a new tab.</p>
                      <p>3. Paste it now using ctrl + v (or) mouse right click, and press any key on your keyboard.</p>
                      <p>4. Now the Captcha section opens. Fill the captcha and hit search button.</p>
                    </>
                  )}
                </div>

                {/* Right Column: Hindi Instruction Set */}
                <div className="space-y-1 border-t md:border-t-0 md:border-l border-gray-200 pt-3 md:pt-0 md:pl-4">
                  <strong className="text-gray-800 font-bold block border-b border-gray-200 pb-1 mb-1">
                    उपयोग करने का तरीका (HOW TO USE):
                  </strong>
                  {activeTab === "gstin" ? (
                    <>
                      <p>1. बिना किसी गलती के 15-अंकों का GST नंबर दर्ज करें, और नीचे दिए गए Copy & Verify बटन पर क्लिक करें।</p>
                      <p>2. आपका नंबर तुरंत मान्य होकर आपके क्लिपबोर्ड पर कॉपी हो जाएगा और आप सीधे आधिकारिक सरकारी GST पोर्टल पर पहुंच जाएंगे।</p>
                      <p>3. वहाँ सर्च बॉक्स में <kbd className="bg-gray-200 px-1 rounded text-[10px] font-mono">Ctrl + V</kbd> या राइट-क्लिक करके इसे पेस्ट करें, और कीबोर्ड पर कोई भी बटन दबाएं।</p>
                      <p>4. ऐसा करते ही कैप्चा (Captcha) सेक्शन खुल जाएगा। कैप्चा कोड भरें और Search बटन पर क्लिक करें।</p>                    
                  </>
                  ) : (
                    <>
                      <p>1. बिना किसी गलती के 10-अंकों का पैन (PAN) नंबर दर्ज करें, और नीचे दिए गए Copy & Verify बटन पर क्लिक करें।</p>
                      <p>2. आपका पैन नंबर कॉपी हो जाएगा और आधिकारिक सरकारी GST पैन-खोज पोर्टल नए टैब में खुल जाएगा।</p>
                      <p>3. वहाँ सर्च बॉक्स में <kbd className="bg-gray-200 px-1 rounded text-[10px] font-mono">Ctrl + V</kbd> या राइट-क्लिक करके इसे पेस्ट करें, और कीबोर्ड पर कोई भी बटन दबाएं।</p>
                      <p>4. ऐसा करते ही कैप्चा (Captcha) सेक्शन खुल जाएगा। कैप्चा कोड भरें और Search बटन पर क्लिक करें।</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Form Processing Module (Brought higher up on screen layout) */}
          <form onSubmit={handleLookupSubmit} className="px-2 py-3 space-y-3.5">
            {activeTab === "gstin" ? (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-cyan-600 mb-1">
                  ENTER 15-DIGIT GSTIN NUMBER
                </label>
                <input 
                  type="text"
                  value={gstNumber}
                  onChange={(e) => {
                    setGstNumber(e.target.value);
                    if (validationError) setValidationError("");
                  }}
                  maxLength={15}
                  placeholder="Ex: 37AAAAA0000A1Z5"
                  className="w-full border border-gray-300 rounded-xl p-3 text-center font-mono text-lg uppercase tracking-widest placeholder:tracking-normal placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 transition shadow-inner"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-cyan-600 mb-1">
                  ENTER 10-DIGIT PAN NUMBER
                </label>
                <input 
                  type="text"
                  value={panNumber}
                  onChange={(e) => {
                    setPanNumber(e.target.value);
                    if (validationError) setValidationError("");
                  }}
                  maxLength={10}
                  placeholder="Ex: ABCDE1234F"
                  className="w-full border border-gray-300 rounded-xl p-3 text-center font-mono text-lg uppercase tracking-widest placeholder:tracking-normal placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 transition shadow-inner"
                />
              </div>
            )}

            {/* Live Client Validation feedback warnings */}
            {validationError && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium rounded-xl p-2.5 text-center">
                ⚠️ {validationError}
              </div>
            )}

            {/* Clipboard Copy Success Notification */}
            {copySuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-xl p-2.5 text-center">
                📋 {activeTab === "gstin" ? "GSTIN" : "PAN"} copied to clipboard! Right-click and paste (<kbd className="font-mono text-[10px]">Ctrl+V</kbd>) inside the official GST portal input block.
              </div>
            )}

            {/* Action Action Button - Now clearly visible above the fold line */}
            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold py-3 px-4 rounded-xl transition shadow hover:shadow-md flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              🚀 Copy & Verify on Official GST Portal
            </button>
          </form>

          {/* Footer informational insights */}
          <div className="px-3 pb-2 pt-2 border-t border-gray-100 bg-slate-50/50 rounded-b-xl mt-2">
            <div className="flex gap-2.5 items-start text-[11px] text-gray-500">
              <span className="text-sm leading-none">💡</span>
              <p className="leading-relaxed">
                <strong>Why verify registration?</strong> Cross-checking active profiles ensures tax-filing consistency across your supply chain networks. Making certain data parameters line up prevents input transaction mismatches, securing eligible <strong>Input Tax Credit (ITC)</strong> tracking and safeguarding business equity compliance.
              </p>
            </div>
          </div>

        </div>

        {/* Dashboard Escape Link */}
        <div className="text-center mt-4">
          <a 
            href="/" 
            className="text-xs font-semibold text-blue-700 hover:text-blue-800 transition underline underline-offset-4"
          >
            ← Return to Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}