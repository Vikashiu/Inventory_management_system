import React, { useState, useEffect } from 'react';
import { X, Package, User, Calendar, Hash, Loader2 } from 'lucide-react';
import { salesService } from '../services/salesService';

const STATUS_STYLES = {
  DRAFT: 'bg-amber-50 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  SHIPPED: 'bg-blue-50 text-blue-700 border-blue-200',
  RECEIVED: 'bg-teal-50 text-teal-700 border-teal-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
};

export default function OrderDetailModal({ isOpen, onClose, orderId }) {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && orderId) {
      setIsLoading(true);
      setError(null);
      salesService.getById(orderId)
        .then(data => {
          setOrder(data);
          setIsLoading(false);
        })
        .catch(err => {
          setError(err.response?.data?.detail || err.message);
          setIsLoading(false);
        });
    } else {
      setOrder(null);
    }
  }, [isOpen, orderId]);

  if (!isOpen) return null;

  const statusStyle = order ? (STATUS_STYLES[order.status] || STATUS_STYLES.DRAFT) : '';

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-100 overflow-hidden transform transition-all flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
          <h2 className="text-base font-bold text-slate-900">
            {order ? `Order ${order.order_number}` : 'Order Details'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="h-48 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="animate-spin text-blue-500" size={28} />
              <span className="text-sm font-medium">Loading order details...</span>
            </div>
          ) : error ? (
            <div className="h-48 flex items-center justify-center">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          ) : order ? (
            <div className="space-y-6">
              {/* Order Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                    <Hash size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Order Number</p>
                    <p className="text-sm font-bold text-slate-900 font-mono">{order.order_number}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Customer</p>
                    <p className="text-sm font-bold text-slate-900">{order.customer_name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Order Date</p>
                    <p className="text-sm font-bold text-slate-900">
                      {new Date(order.order_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                    <Package size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Status</p>
                    <span className={`inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusStyle} uppercase tracking-wider`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div>
                <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">Order Items</h3>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3 text-center">Qty Ordered</th>
                        <th className="px-4 py-3 text-center">Qty Shipped</th>
                        <th className="px-4 py-3 text-right">Unit Price</th>
                        <th className="px-4 py-3 text-right">Line Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {order.lines.map((line, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-medium text-slate-900">{line.product_name}</td>
                          <td className="px-4 py-3 text-center text-slate-700">{line.quantity_ordered}</td>
                          <td className="px-4 py-3 text-center text-slate-700">{line.quantity_shipped}</td>
                          <td className="px-4 py-3 text-right text-slate-700">${line.unit_price.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right font-medium text-slate-900">${line.line_total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer with Total */}
        {order && (
          <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
            <div className="text-sm text-slate-500">
              Total Amount: <span className="text-xl font-bold text-slate-900 ml-2">${order.total_amount.toFixed(2)}</span>
            </div>
            <button onClick={onClose} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold shadow-sm transition">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
