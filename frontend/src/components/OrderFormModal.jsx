import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

export default function OrderFormModal({ isOpen, onClose, onSave, customers, products }) {
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState([{ product_id: '', quantity: 1, unit_price: 0 }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setCustomerId('');
      setItems([{ product_id: '', quantity: 1, unit_price: 0 }]);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleAddItem = () => {
    setItems([...items, { product_id: '', quantity: 1, unit_price: 0 }]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    // Auto-fill price when a product is selected
    if (field === 'product_id') {
      const selectedProduct = products.find(p => p.id.toString() === value);
      if (selectedProduct) {
        newItems[index].unit_price = selectedProduct.price;
      }
    }
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Filter out incomplete lines before sending
    const validItems = items.filter(item => item.product_id && item.quantity > 0);
    
    try {
      await onSave({
        customer_id: parseInt(customerId),
        // Backend expects "lines" with "quantity_ordered" (not "items" with "quantity")
        lines: validItems.map(item => ({
          product_id: parseInt(item.product_id),
          quantity_ordered: parseInt(item.quantity)
        }))
      });
    } catch {
      // Error is handled by the parent via toast
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-100 overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
          <h2 className="text-base font-bold text-slate-900">Create New Sales Order</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition">
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} id="order-form" className="p-6 flex flex-col gap-6 overflow-y-auto flex-1">
          {/* Customer Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Select Customer</label>
            <select 
              required 
              value={customerId} 
              onChange={e => setCustomerId(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white"
            >
              <option value="" disabled>Choose a customer...</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>
              ))}
            </select>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">Order Items</label>
            </div>
            
            <div className="space-y-3">
              {items.map((item, index) => {
                const selectedProduct = products.find(p => p.id.toString() === item.product_id.toString());
                const maxStock = selectedProduct?.quantity_in_stock || 0;

                return (
                  <div key={index} className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <select
                      required
                      value={item.product_id}
                      onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                      className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white"
                    >
                      <option value="" disabled>Select Product...</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} — ${p.price.toFixed(2)} ({p.quantity_in_stock} in stock)
                        </option>
                      ))}
                    </select>
                    
                    <input
                      type="number"
                      min="1"
                      max={maxStock || undefined}
                      required
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="w-24 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      placeholder="Qty"
                    />
                    
                    <div className="w-24 text-right font-medium text-slate-700 text-sm">
                      ${(item.quantity * item.unit_price).toFixed(2)}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      disabled={items.length === 1}
                      className="p-2 text-slate-400 hover:text-red-600 disabled:opacity-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleAddItem}
              className="mt-3 text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1"
            >
              <Plus size={16} /> Add another item
            </button>
          </div>
          
        </form>

        {/* Footer with Total */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <div className="text-sm text-slate-500">
            Total Amount: <span className="text-lg font-bold text-slate-900 ml-2">${calculateTotal().toFixed(2)}</span>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Cancel</button>
            <button 
              type="submit" 
              form="order-form"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}