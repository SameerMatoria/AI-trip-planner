import React, { useState, useEffect } from "react";

export default function RenameDialog({ open, initial, onClose, onSubmit }) {
  const [val, setVal] = useState(initial || "");
  useEffect(() => { setVal(initial || ""); }, [initial, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
        <div className="px-5 py-4 bg-gradient-to-r from-blue-50 to-emerald-50 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Rename itinerary</h3>
          <p className="text-xs text-gray-600">Give your trip a memorable title.</p>
        </div>

        <div className="px-5 py-4">
          <input
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Enter a title"
          />
          <div className="mt-4 flex justify-end gap-2">
            <button className="rounded-xl border px-3 py-1.5 hover:bg-gray-50" onClick={onClose}>
              Cancel
            </button>
            <button
              className="rounded-xl bg-gray-900 text-white px-3 py-1.5 hover:bg-black disabled:opacity-50"
              onClick={() => onSubmit?.(val)}
              disabled={!val.trim()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
