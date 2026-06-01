import React from 'react';
import { Box } from 'lucide-react';

export default function EmptyState({ onCreateClick }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-sm h-125">
      <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-slate-300 mb-6">
        <Box size={40} strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">Create New Items</h3>
      <p className="text-slate-500 text-sm max-w-sm mb-6 leading-relaxed">
        Create single items or items with variants to start adding them to transactions and manage your inventory stock.
      </p>
      <button 
        onClick={onCreateClick} 
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition"
      >
        New Item
      </button>
    </div>
  );
}