export default function BlogPage() {
  return (
    <main className="min-h-screen px-4 py-10 flex justify-center">
      <div className="w-full max-w-4xl space-y-2">

        <h1 className="text-3xl font-bold text-center text-blue-700">
          QuickHSN Blog
        </h1>

        <p className="text-center text-gray-600">
          Articles and guides on HSN codes, GST rates, and tax compliance.
        </p>

        <div className="space-y-6">

          <div className="rounded-xl border p-5 shadow-sm">
            <h2 className="font-semibold text-lg">
              What is GST? How to Correct a Wrong HSN Code Filed in GSTR-1
            </h2>
            <p className="mt-2 text-gray-700 text-justify">
              Learn practical steps to correct wrong HSN reporting
              in GST returns without unnecessary penalties.
            </p>
          </div>

          <div className="rounded-xl border p-5 shadow-sm">
            <h2 className="font-semibold text-lg">
              Difference Between HSN and SAC Codes
            </h2>
            <p className="mt-2 text-gray-700">
              Understand when to use HSN codes for goods and
              SAC codes for services.
            </p>
          </div>

          <div className="rounded-xl border p-5 shadow-sm">
            <h2 className="font-semibold text-lg">
              Top Common HSN Search Mistakes
            </h2>
            <p className="mt-2 text-gray-700">
              Avoid common errors traders make while selecting
              HSN codes for GST filing.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}