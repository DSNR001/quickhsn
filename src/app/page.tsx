import ContactForm from "@/components/ContactForm";
import HsnLookup from "@/app/hsn-lookup/HsnLookup";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-10">
      {/* Top Navigation Links */}
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

        {/* The HSN Lookup Tool (Quick Tools will now hide/show inside here) */}
        <HsnLookup />

        {/* Main Disclaimer stays permanently at the bottom */}
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
      </div>
      <ContactForm />
    </main>
  );
}