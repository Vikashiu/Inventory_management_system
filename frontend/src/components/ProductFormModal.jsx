import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function ProductFormModal({ isOpen, onClose, onSave, editingProduct }) {
  const [formData, setFormData] = useState({
    sku: '', name: '', price: '', initial_stock: '', reorder_level: ''
  });

  // Whenever the modal opens or the product being edited changes, update the form
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        sku: editingProduct.sku,
        name: editingProduct.name,
        price: editingProduct.price || '',
        initial_stock: editingProduct.quantity_in_stock || '',
        reorder_level: editingProduct.reorder_level || ''
      });
    } else {
      setFormData({ sku: '', name: '', price: '', initial_stock: '', reorder_level: '' });
    }
  }, [editingProduct, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: parseFloat(formData.price),
      initial_stock: parseInt(formData.initial_stock),
      reorder_level: parseInt(formData.reorder_level)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 overflow-hidden transform transition-all">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-900">
            {editingProduct ? 'Edit Product Parameters' : 'Add New Inventory Item'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition">
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Product SKU</label>
            <input type="text" name="sku" required value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} placeholder="e.g., PROD-001" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 font-mono" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Product Name</label>
            <input type="text" name="name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g., Wireless Gaming Mouse" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Unit Price ($)</label>
            <input type="number" step="0.01" name="price" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="0.00" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Initial Stock</label>
              <input type="number" name="initial_stock" required value={formData.initial_stock} onChange={e => setFormData({...formData, initial_stock: e.target.value})} disabled={!!editingProduct} placeholder="0" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Reorder Level</label>
              <input type="number" name="reorder_level" required value={formData.reorder_level} onChange={e => setFormData({...formData, reorder_level: e.target.value})} placeholder="10" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition">
              {editingProduct ? 'Save Changes' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}