"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
  onClose: () => void;
};

export default function PINModal({ onClose }: Props) {
  const [pin, setPin] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleSearch = async () => {
  try {
    const res = await fetch(`/api/pin-lookup?pin=${pin}`);
    const data = await res.json();

    if (
      data[0]?.Status === "Success" &&
      data[0]?.PostOffice?.length > 0
    ) {
      const office = data[0].PostOffice[0];

      alert(
        `PIN: ${pin}\n` +
        `Office: ${office.Name}\n` +
        `District: ${office.District}\n` +
        `State: ${office.State}`
      );
    } else {
      alert("No records found");
    }
  } catch {
    alert("PIN lookup failed");
  }
};

  const modalContent = (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative border border-gray-100 block"
        style={{ backgroundColor: '#ffffff', minWidth: '320px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition text-2xl font-semibold leading-none focus:outline-none"
          style={{ color: '#9ca3af' }}
          aria-label="Close modal"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4" style={{ color: '#111827' }}>
          <span>📍</span> Find PIN Details
        </h2>

        <div className="mb-4">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter 6-digit PIN code"
            className="w-full border border-gray-300 rounded-xl p-3 text-base text-gray-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400"
            style={{ color: '#111827', backgroundColor: '#ffffff', borderColor: '#d1d5db' }}
          />
        </div>

        <button 
          onClick={handleSearch}
          disabled={pin.length !== 6}
          className="w-full font-medium rounded-xl p-3 text-white transition focus:outline-none shadow-md"
          style={{
            backgroundColor: pin.length === 6 ? '#2563eb' : '#d1d5db',
            color: '#ffffff',
            cursor: pin.length === 6 ? 'pointer' : 'not-allowed'
          }}
        >
          Search
        </button>
      </div>
    </div>
  );

  if (!mounted) return null;

  return createPortal(modalContent, document.body);
}