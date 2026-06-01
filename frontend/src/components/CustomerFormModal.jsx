import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CustomerFormModal({ isOpen, onClose, onSave, editingCustomer }) {
  const [formData, setFormData] = useState({ full_name: '', email: '', phone: '' });

  useEffect(() => {
    if (editingCustomer) {
      setFormData({
        full_name: editingCustomer.full_name || '',
        email: editingCustomer.email || '',
        phone: editingCustomer.phone || ''
      });
    } else {
      setFormData({ full_name: '', email: '', phone: '' });
    }
  }, [editingCustomer, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Backend expects { full_name, email, phone } — always send exactly these
    onSave({
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 overflow-hidden transform transition-all">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-900">
            {editingCustomer ? 'Edit Customer Profile' : 'Add New Customer'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition">
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Full Name</label>
            <input 
              type="text" 
              required 
              value={formData.full_name} 
              onChange={e => setFormData({...formData, full_name: e.target.value})} 
              placeholder="e.g., Jane Doe" 
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Email Address</label>
            <input 
              type="email" 
              required
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              placeholder="jane@example.com" 
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Phone Number</label>
            <input 
              type="text" 
              required
              value={formData.phone} 
              onChange={e => setFormData({...formData, phone: e.target.value})} 
              placeholder="+1 (555) 000-0000" 
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" 
            />
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition">
              {editingCustomer ? 'Save Changes' : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}