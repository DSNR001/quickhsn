'use client';

import React, { useState, useEffect, useTransition } from 'react';

type CalcType = 'exclusive' | 'inclusive';
type SupplyType = 'intra' | 'inter';

interface CalculationResults {
  taxableAmount: number;
  totalGst: number;
  cgst: number;
  sgst: number;
  igst: number;
  finalAmount: number;
}

export default function GstCalculator() {
  // --- New Top Strip Component State (As per your sketch) ---
  const [quantity, setQuantity] = useState<string>('');
  const [rate, setRate] = useState<string>('');
  const [subtotal, setSubtotal] = useState<number>(0);

  // --- Core GST Calculator State ---
  const [amount, setAmount] = useState<string>('1000');
  const [gstRate, setGstRate] = useState<number>(18);
  const [calcType, setCalcType] = useState<CalcType>('exclusive');
  const [supplyType, setSupplyType] = useState<SupplyType>('intra');
  const [, startTransition] = useTransition();

  const [results, setResults] = useState<CalculationResults>({
    taxableAmount: 0,
    totalGst: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    finalAmount: 0,
  });

  const gstSlabs = [0, 0.25, 1.5, 3, 5, 18, 28, 40];

  // 1. Automatically track and evaluate the Subtotal top strip
  useEffect(() => {
    const q = parseFloat(quantity) || 0;
    const r = parseFloat(rate) || 0;
    const calcSubtotal = q * r;
    setSubtotal(Math.round(calcSubtotal * 100) / 100);
  }, [quantity, rate]);

  // 2. Action to copy the calculated subtotal straight down into the GST engine
  const handleCopySubtotal = () => {
    if (subtotal > 0) {
      setAmount(subtotal.toString());
    }
  };

  // 3. Core GST Math Engine
  useEffect(() => {
    startTransition(() => {
      const parsedAmount = parseFloat(amount) || 0;
      let taxableAmount = 0;
      let totalGst = 0;
      let finalAmount = 0;

      if (calcType === 'exclusive') {
        taxableAmount = parsedAmount;
        totalGst = (taxableAmount * gstRate) / 100;
        finalAmount = taxableAmount + totalGst;
      } else {
        taxableAmount = parsedAmount / (1 + gstRate / 100);
        totalGst = parsedAmount - taxableAmount;
        finalAmount = parsedAmount;
      }

      const cgst = supplyType === 'intra' ? totalGst / 2 : 0;
      const sgst = supplyType === 'intra' ? totalGst / 2 : 0;
      const igst = supplyType === 'inter' ? totalGst : 0;

      setResults({
        taxableAmount: Math.round(taxableAmount * 100) / 100,
        totalGst: Math.round(totalGst * 100) / 100,
        cgst: Math.round(cgst * 100) / 100,
        sgst: Math.round(sgst * 100) / 100,
        igst: Math.round(igst * 100) / 100,
        finalAmount: Math.round(finalAmount * 100) / 100,
      });
    });
  }, [amount, gstRate, calcType, supplyType]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* ========================================================================= */}
      {/* NEW: TOP STRIP BASE AMOUNT CALCULATOR (Matches Wireframe)                  */}
      {/* ========================================================================= */}
      <div className="w-full p-4 md:p-5 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-md border border-slate-700 text-white">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Base Amount Assistant (Optional)
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          {/* Quantity - 4 Decimals */}
          <div className="sm:col-span-3">
            <label htmlFor="qty-input" className="block text-xs font-medium text-slate-300 mb-1">Quantity (Max 4 decimals)</label>
            <input
              id="qty-input"
              type="number"
              step="0.0001"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0.0000"
              className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white font-medium text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="hidden sm:flex sm:col-span-1 justify-center items-center text-slate-400 font-bold pb-2">×</div>

          {/* Rate - 2 Decimals */}
          <div className="sm:col-span-3">
            <label htmlFor="rate-input" className="block text-xs font-medium text-slate-300 mb-1">Rate / Item (₹)</label>
            <input
              id="rate-input"
              type="number"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="0.00"
              className="w-full p-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white font-medium text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="hidden sm:flex sm:col-span-1 justify-center items-center text-slate-400 font-bold pb-2">=</div>

          {/* Calculated Subtotal Output */}
          <div className="sm:col-span-2">
            <span className="block text-xs font-medium text-slate-300 mb-1">Subtotal (₹)</span>
            <div className="w-full p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg font-bold text-sm text-emerald-400 min-h-[42px] flex items-center">
              ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          {/* Quick Action Link / Action button to fill core engine form down below */}
          <div className="sm:col-span-2">
            <button
              type="button"
              disabled={subtotal <= 0}
              onClick={handleCopySubtotal}
              className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold tracking-wide transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                subtotal > 0 
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer active:scale-[0.98]' 
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 13l-7 7-7-7m14-6l-7 7-7-7" />
              </svg>
              Use Amount
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN TWO-COLUMN GST CALCULATOR SECTION                                     */}
      {/* ========================================================================= */}
      <div className="w-full p-4 md:p-6 bg-white rounded-xl shadow-md border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Hand Column: Inputs */}
          <div className="space-y-6">
            <div>
              <label htmlFor="amount-input" className="block text-sm font-semibold text-gray-700 mb-2">
                {calcType === 'exclusive' ? 'Base / Taxable Amount (₹)' : 'Total Invoice Value (₹)'}
              </label>
              <input
                id="amount-input"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium text-lg text-gray-900 transition-all bg-slate-50/50"
                placeholder="Enter base calculation amount"
                min="0"
              />
            </div>

            <div>
              <span className="block text-sm font-semibold text-gray-700 mb-2">Calculation Mode</span>
              <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setCalcType('exclusive')}
                  className={`py-2 text-sm font-medium rounded-md transition-colors ${
                    calcType === 'exclusive' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  GST Exclusive (+ Add)
                </button>
                <button
                  type="button"
                  onClick={() => setCalcType('inclusive')}
                  className={`py-2 text-sm font-medium rounded-md transition-colors ${
                    calcType === 'inclusive' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  GST Inclusive (- Remove)
                </button>
              </div>
            </div>

            <div>
              <span className="block text-sm font-semibold text-gray-700 mb-2">GST Rate (%)</span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {gstSlabs.map((slab) => (
                  <button
                    key={slab}
                    type="button"
                    onClick={() => setGstRate(slab)}
                    className={`py-2 text-sm font-bold border rounded-lg transition-all ${
                      gstRate === slab
                        ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {slab}%
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-sm font-semibold text-gray-700 mb-2">Supply Type</span>
              <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setSupplyType('intra')}
                  className={`py-2 text-sm font-medium rounded-md transition-colors ${
                    supplyType === 'intra' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Intra-State (CGST + SGST)
                </button>
                <button
                  type="button"
                  onClick={() => setSupplyType('inter')}
                  className={`py-2 text-sm font-medium rounded-md transition-colors ${
                    supplyType === 'inter' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Inter-State (IGST)
                </button>
              </div>
            </div>
          </div>

          {/* Right Hand Column: Calculations Break Down View Layout */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 flex flex-col justify-between">
            <div>
              <h3 className="text-md font-bold text-gray-800 uppercase tracking-wider mb-4 border-b pb-2 border-gray-200">
                Calculation Breakdown
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Taxable Value (Base Price)</span>
                  <span className="font-semibold text-gray-900">₹{results.taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>

                {supplyType === 'intra' ? (
                  <>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Central GST (CGST - {gstRate / 2}%)</span>
                      <span className="font-semibold text-gray-900">₹{results.cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">State GST (SGST - {gstRate / 2}%)</span>
                      <span className="font-semibold text-gray-900">₹{results.sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Integrated GST (IGST - {gstRate}%)</span>
                    <span className="font-semibold text-gray-900">₹{results.igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm pt-2 border-t border-dashed border-gray-300">
                  <span className="font-medium text-gray-700">Total GST Tax Amount</span>
                  <span className="font-bold text-gray-900">₹{results.totalGst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Total Invoice Footer Box Display */}
            <div className="mt-6 pt-4 border-t-2 border-gray-200 bg-blue-50 -mx-6 -mb-6 p-6 rounded-b-xl">
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-blue-900">Total Invoice Amount:</span>
                <span className="text-2xl font-black text-blue-900">
                  ₹{results.finalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}