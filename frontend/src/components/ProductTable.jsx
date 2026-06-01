import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

export default function ProductTable({ products, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
      <table className="w-full min-w-[800px] text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
            <th className="px-6 py-4">SKU</th>
            <th className="px-6 py-4">Product Name</th>
            <th className="px-6 py-4 text-right">Price</th>
            <th className="px-6 py-4 text-center">Current Stock</th>
            <th className="px-6 py-4 text-center">Reorder Level</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-slate-50/70 transition">
              <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-500">{product.sku}</td>
              <td className="px-6 py-4 font-medium text-slate-900">{product.name}</td>
              <td className="px-6 py-4 text-right font-medium text-slate-900">
                ${product.price ? product.price.toFixed(2) : '0.00'}
              </td>
              <td className="px-6 py-4 text-center">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  (product.quantity_in_stock || 0) <= (product.reorder_level || 0)
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                }`}>
                  {product.quantity_in_stock || 0} units
                </span>
              </td>
              <td className="px-6 py-4 text-center text-slate-500">{product.reorder_level || 0}</td>
              <td className="px-6 py-4 text-right flex justify-end gap-2">
                <button onClick={() => onEdit(product)} className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 hover:text-slate-800 transition">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => onDelete(product.id)} className="p-1.5 hover:bg-red-50 rounded-md text-slate-400 hover:text-red-600 transition">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}