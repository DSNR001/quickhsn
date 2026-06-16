import React from 'react';
import GstCalculator from './GstCalculator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Online GST Calculator - Quick HSN India',
  description: 'Easily calculate GST Exclusive and Inclusive values. Check CGST, SGST, and IGST components instantaneously using legal Indian tax slabs.',
};

export default function GstCalculatorPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Standard Indian GST Calculator
        </h1>
        <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
          Add or remove GST for official HSN rates. View accurate inter-state and intra-state tax separations instantly.
        </p>
      </div>

      <GstCalculator />

      {/* Educational Context below the tool */}
      <section className="max-w-4xl mx-auto mt-12 bg-white rounded-xl p-6 border border-gray-200 shadow-sm text-gray-700">
        <h2 className="text-xl font-bold text-gray-900 mb-4">How the Calculation Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm leading-relaxed">
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">GST Exclusive Formula (+ Add)</h3>
            <p className="mb-2 bg-gray-50 p-2 rounded font-mono text-xs">GST Amount = (Base Price × GST%) / 100</p>
            <p>Used when you know the raw manufacturing or service cost and need to find out how much tax to collect from the buyer.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">GST Inclusive Formula (- Remove)</h3>
            <p className="mb-2 bg-gray-50 p-2 rounded font-mono text-xs">Base Price = Total Price / (1 + (GST% / 100))</p>
            <p>Used when you have a final retail price (MRP) and need to isolate the clean revenue from the tax liabilities.</p>
          </div>
        </div>
      </section>
    </main>
  );
}