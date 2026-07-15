"use client";

import React, { useState } from "react";

interface InvoiceItem {
  id: string;
  description: string;
  hsn: string;
  qty: number;
  rate: number;
  discount: number; // Added Discount field (%)
  gstRate: number;
}

// Complete list of all 37 Indian States and UTs with official GST state codes
const INDIAN_STATES = [
  { code: "01", name: "Jammu & Kashmir" },
  { code: "02", name: "Himachal Pradesh" },
  { code: "03", name: "Punjab" },
  { code: "04", name: "Chandigarh" },
  { code: "05", name: "Uttarakhand" },
  { code: "06", name: "Haryana" },
  { code: "07", name: "Delhi" },
  { code: "08", name: "Rajasthan" },
  { code: "09", name: "Uttar Pradesh" },
  { code: "10", name: "Bihar" },
  { code: "11", name: "Sikkim" },
  { code: "12", name: "Arunachal Pradesh" },
  { code: "13", name: "Nagaland" },
  { code: "14", name: "Manipur" },
  { code: "15", name: "Mizoram" },
  { code: "16", name: "Tripura" },
  { code: "17", name: "Meghalaya" },
  { code: "18", name: "Assam" },
  { code: "19", name: "West Bengal" },
  { code: "20", name: "Jharkhand" },
  { code: "21", name: "Odisha" },
  { code: "22", name: "Chhattisgarh" },
  { code: "23", name: "Madhya Pradesh" },
  { code: "24", name: "Gujarat" },
  { code: "26", name: "Dadra & Nagar Haveli and Daman & Diu" },
  { code: "27", name: "Maharashtra" },
  { code: "29", name: "Karnataka" },
  { code: "30", name: "Goa" },
  { code: "31", name: "Lakshadweep" },
  { code: "32", name: "Kerala" },
  { code: "33", name: "Tamil Nadu" },
  { code: "34", name: "Puducherry" },
  { code: "35", name: "Andaman & Nicobar Islands" },
  { code: "36", name: "Telangana" },
  { code: "37", name: "Andhra Pradesh" },
  { code: "38", name: "Ladakh" },
  { code: "97", name: "Other Territory" }
];

export default function InvoiceGenerator() {
  const [logo, setLogo] = useState<string | null>(null);
  const [supplierName, setSupplierName] = useState("Your Business Name");
  const [supplierGstin, setSupplierGstin] = useState("");
  const [supplierState, setSupplierState] = useState("37 - Andhra Pradesh");
  
  const [clientName, setClientName] = useState("");
  const [clientGstin, setClientGstin] = useState("");
  const [clientState, setClientState] = useState("27 - Maharashtra");
  const [invoiceNo, setInvoiceNo] = useState("INV-2026-001");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", description: "Dry Red Chillies", hsn: "0904", qty: 100, rate: 220, discount: 0, gstRate: 5 }
  ]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) setLogo(event.target.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: "", hsn: "", qty: 1, rate: 0, discount: 0, gstRate: 18 }]);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const supplierStateCode = supplierState.substring(0, 2);
  const clientStateCode = clientState.substring(0, 2);
  const isIntrastate = supplierStateCode === clientStateCode;

  // Calculate Subtotal (Total Taxable Value considering discount)
  const subTotal = items.reduce((sum, item) => {
    const gross = item.qty * item.rate;
    const itemDiscount = gross * ((item.discount || 0) / 100);
    return sum + (gross - itemDiscount);
  }, 0);
  
  let totalCgst = 0;
  let totalSgst = 0;
  let totalIgst = 0;

  items.forEach(item => {
    const gross = item.qty * item.rate;
    const itemDiscount = gross * ((item.discount || 0) / 100);
    const itemTaxable = gross - itemDiscount;

    if (isIntrastate) {
      totalCgst += itemTaxable * (item.gstRate / 2 / 100);
      totalSgst += itemTaxable * (item.gstRate / 2 / 100);
    } else {
      totalIgst += itemTaxable * (item.gstRate / 100);
    }
  });

  const totalTax = totalCgst + totalSgst + totalIgst;
  const grandTotal = subTotal + totalTax;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Control Panel */}
      <div className="max-w-5xl mx-auto mb-8 bg-white p-6 rounded-lg shadow-sm print:hidden">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-2">GST Invoice Generator Setup</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Supplier Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-emerald-700">Supplier Details (You)</h3>
            <div>
              <label className="block text-xs font-medium text-gray-500">Upload Logo</label>
              <input type="file" accept="image/*" onChange={handleLogoChange} className="text-xs mt-1 w-full" />
            </div>
            <input type="text" placeholder="Your Business Name" value={supplierName} onChange={e => setSupplierName(e.target.value)} className="w-full p-2 border rounded text-sm" />
            <input type="text" placeholder="Your GSTIN" value={supplierGstin} onChange={e => setSupplierGstin(e.target.value.toUpperCase())} className="w-full p-2 border rounded text-sm uppercase" maxLength={15} />
            
            <select value={supplierState} onChange={e => setSupplierState(e.target.value)} className="w-full p-2 border rounded text-sm">
              {INDIAN_STATES.map((st) => (
                <option key={`sup-${st.code}`} value={`${st.code} - ${st.name}`}>
                  {st.code} - {st.name}
                </option>
              ))}
            </select>
          </div>

          {/* Client Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-blue-700">Billed To (Client)</h3>
            <input type="text" placeholder="Client Business Name" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full p-2 border rounded text-sm" />
            <input type="text" placeholder="Client GSTIN" value={clientGstin} onChange={e => setClientGstin(e.target.value.toUpperCase())} className="w-full p-2 border rounded text-sm uppercase" maxLength={15} />
            
            <select value={clientState} onChange={e => setClientState(e.target.value)} className="w-full p-2 border rounded text-sm">
              {INDIAN_STATES.map((st) => (
                <option key={`cli-${st.code}`} value={`${st.code} - ${st.name}`}>
                  {st.code} - {st.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 border-t pt-4">
          <input type="text" placeholder="Invoice No" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} className="p-2 border rounded text-sm" />
          <input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} className="p-2 border rounded text-sm" />
        </div>

        {/* Items Builder */}
        <div className="space-y-2 mb-6">
          <h3 className="font-semibold text-green-700">Line Items</h3>
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 bg-gray-100 p-2 rounded items-center">
              <input type="text" placeholder="Item Description" value={item.description} onChange={e => updateItem(item.id, "description", e.target.value)} className="md:col-span-3 p-1.5 border rounded text-sm bg-white" />
              <input type="text" placeholder="HSN" value={item.hsn} onChange={e => updateItem(item.id, "hsn", e.target.value)} className="md:col-span-2 p-1.5 border rounded text-sm bg-white" />
              <input type="number" placeholder="Qty" value={item.qty} onChange={e => updateItem(item.id, "qty", parseFloat(e.target.value) || 0)} className="md:col-span-1 p-1.5 border rounded text-sm bg-white" />
              <input type="number" placeholder="Rate" value={item.rate} onChange={e => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)} className="md:col-span-2 p-1.5 border rounded text-sm bg-white" />
              <input type="number" placeholder="Disc %" value={item.discount} onChange={e => updateItem(item.id, "discount", parseFloat(e.target.value) || 0)} className="md:col-span-1 p-1.5 border rounded text-sm bg-white" />
              <select value={item.gstRate} onChange={e => updateItem(item.id, "gstRate", parseInt(e.target.value))} className="md:col-span-2 p-1.5 border rounded text-sm bg-white">
                <option value={0}>0% GST</option>
                <option value={0.25}>0.25% GST</option>
                <option value={1.50}>1.50% GST</option>
                <option value={3}>3% GST</option>
                <option value={5}>5% GST</option>
                <option value={18}>18% GST</option>
                <option value={28}>28% GST</option>
                <option value={40}>40% GST</option>
              </select>
              <button onClick={() => removeItem(item.id)} className="md:col-span-1 text-red-500 hover:text-red-700 font-bold text-center">✕</button>
            </div>
          ))}
          <button onClick={addItem} className="px-4 py-2 bg-slate-700 text-white rounded text-sm font-medium hover:bg-slate-800 transition">
            + Add Line Item
          </button>
        </div>

        <div className="flex justify-end border-t pt-4">
          <button onClick={() => window.print()} className="px-6 py-3 bg-emerald-600 text-white rounded font-semibold hover:bg-emerald-700 shadow transition">
            Print / Download PDF Invoice
          </button>
        </div>
      </div>

      {/* Printable Sheet Asset */}
      <div className="max-w-4xl mx-auto bg-white p-8 border border-gray-200 shadow-lg rounded-sm print:shadow-none print:border-none print:p-0 my-0">
        <div className="flex justify-between items-start border-b pb-6 mb-6">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {logo ? (
              <img src={logo} alt="Business Logo" className="max-h-16 max-w-[200px] object-contain mb-3" />
            ) : (
              <div className="h-12 w-32 border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400 mb-3 print:hidden">No Logo Attached</div>
            )}
            <h2 className="text-xl font-bold text-gray-800">{supplierName || "TAX INVOICE"}</h2>
            <p className="text-xs text-gray-600 mt-1"><strong>GSTIN:</strong> {supplierGstin || "Not Provided"}</p>
            <p className="text-xs text-gray-600"><strong>State & Code:</strong> {supplierState}</p>
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-light text-gray-400 tracking-wide uppercase mb-2">Tax Invoice</h1>
            <p className="text-xs text-gray-600"><strong>Invoice No:</strong> {invoiceNo}</p>
            <p className="text-xs text-gray-600"><strong>Date:</strong> {invoiceDate}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8 bg-slate-50 p-3 rounded print:bg-transparent print:p-0">
          <div>
            <span className="text-xs uppercase font-semibold text-gray-400 block mb-1">Details of Receiver (Billed To)</span>
            <p className="text-sm font-bold text-gray-800">{clientName || "Client Name"}</p>
            <p className="text-xs text-gray-600 mt-1"><strong>GSTIN:</strong> {clientGstin || "URD (Unregistered)"}</p>
            <p className="text-xs text-gray-600"><strong>Place of Supply:</strong> {clientState}</p>
          </div>
        </div>

        <table className="w-full text-left border-collapse mb-6">
          <thead>
            <tr className="border-b-2 border-slate-300 text-xs font-semibold uppercase text-slate-700 bg-slate-100 print:bg-transparent">
              <th className="py-2 px-1">#</th>
              <th className="py-2">Description</th>
              <th className="py-2 text-center">HSN</th>
              <th className="py-2 text-right">Qty</th>
              <th className="py-2 text-right">Rate</th>
              <th className="py-2 text-right">Discount</th>
              <th className="py-2 text-right">Taxable Val</th>
              <th className="py-2 text-right">GST Rate</th>
              <th className="py-2 text-right px-1">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-xs text-gray-700">
            {items.map((item, i) => {
              const gross = item.qty * item.rate;
              const discountVal = gross * ((item.discount || 0) / 100);
              const taxable = gross - discountVal;
              const taxAmount = taxable * (item.gstRate / 100);

              return (
                <tr key={item.id} className="align-top">
                  <td className="py-2.5 px-1">{i + 1}</td>
                  {/* Clean line-wrapping for descriptions after ~40 chars without word clipping */}
                  <td className="py-2.5 font-medium break-words whitespace-pre-wrap max-w-[200px] md:max-w-[280px]">
                    {item.description || "Unlabeled Product"}
                  </td>
                  <td className="py-2.5 text-center">{item.hsn || "—"}</td>
                  <td className="py-2.5 text-right">{item.qty}</td>
                  <td className="py-2.5 text-right">₹{item.rate.toFixed(2)}</td>
                  <td className="py-2.5 text-right">{item.discount > 0 ? `${item.discount}%` : "—"}</td>
                  <td className="py-2.5 text-right">₹{taxable.toFixed(2)}</td>
                  <td className="py-2.5 text-right">{item.gstRate}%</td>
                  <td className="py-2.5 text-right px-1 font-medium">₹{(taxable + taxAmount).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-t pt-4">
          <div className="text-xs text-gray-500 max-w-sm">
            <p className="mb-1"><strong>Tax Summary Type:</strong> {isIntrastate ? "Intrastate Transaction (CGST + SGST applied)" : "Interstate Transaction (IGST applied)"}</p>
          </div>
          
          <div className="w-full md:w-72 text-xs text-gray-700 space-y-1.5 ml-auto">
            <div className="flex justify-between">
              <span>Total Taxable Value:</span>
              <span className="font-medium">₹{subTotal.toFixed(2)}</span>
            </div>
            {isIntrastate ? (
              <>
                <div className="flex justify-between">
                  <span>Central Tax (CGST):</span>
                  <span>₹{totalCgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>State Tax (SGST):</span>
                  <span>₹{totalSgst.toFixed(2)}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between">
                <span>Integrated Tax (IGST):</span>
                <span>₹{totalIgst.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold border-t border-gray-300 pt-2 text-slate-900">
              <span>Grand Total:</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Invoice Footer Section */}
        <div className="mt-12 pt-8 border-t border-dashed border-gray-300 grid grid-cols-2 text-[11px] text-gray-500">
          <div>
            <h4 className="font-semibold uppercase text-gray-700 mb-1">Declaration</h4>
            <p>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
            {/* Custom Bottom-Left Greeting */}
            <p className="mt-4 text-emerald-700 font-semibold italic text-xs">
              Thank you for Shopping with Us.
            </p>
          </div>
          <div className="text-right flex flex-col justify-between items-end h-24">
            <p className="font-semibold text-gray-700">Authorised Signatory</p>
            <div className="w-36 border-t border-gray-400 mt-8"></div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          @page {
            size: A4;
            margin: 15mm;
          }
        }
      `}</style>
    </div>
  );
}