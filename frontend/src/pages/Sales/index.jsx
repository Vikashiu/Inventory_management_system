import React, { useState, useEffect } from 'react';
import { Plus, ShoppingCart, Loader2, XCircle, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSalesStore } from '../../stores/salesStore';
import { useProductStore } from '../../stores/productStore';
import { useCustomerStore } from '../../stores/customerStore';
import OrderFormModal from '../../components/OrderFormModal.jsx';
import OrderDetailModal from '../../components/OrderDetailModal.jsx';

// Status badge styles mapped to backend enum values (uppercase)
const STATUS_STYLES = {
  DRAFT: 'bg-amber-50 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  SHIPPED: 'bg-blue-50 text-blue-700 border-blue-200',
  RECEIVED: 'bg-teal-50 text-teal-700 border-teal-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
};

const StatusBadge = ({ status }) => {
  const style = STATUS_STYLES[status] || STATUS_STYLES.DRAFT;
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${style} uppercase tracking-wider`}>
      {status || 'DRAFT'}
    </span>
  );
};

export default function SalesPage() {
  const { orders, isLoading: isLoadingOrders, fetchOrders, createOrder, cancelOrder } = useSalesStore();
  const { products, fetchProducts } = useProductStore();
  const { customers, fetchCustomers } = useCustomerStore();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [detailOrderId, setDetailOrderId] = useState(null);

  // Fetch all required data on mount
  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchCustomers();
  }, [fetchOrders, fetchProducts, fetchCustomers]);

  const handleCreateOrder = async (orderData) => {
    try {
      await createOrder(orderData);
      toast.success('Order created successfully!');
      setIsFormOpen(false);
      // Re-fetch products to update stock levels
      fetchProducts();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCancelOrder = async (id) => {
    if (window.confirm("Are you sure you want to cancel this order? This cannot be undone.")) {
      try {
        await cancelOrder(id);
        toast.success('Order cancelled.');
        // Re-fetch products to restore stock levels
        fetchProducts();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-slate-900">Sales Orders</span>
        </div>
        <button onClick={() => setIsFormOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 shadow-sm transition">
          <Plus size={16} /> New Order
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {isLoadingOrders ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="animate-spin text-blue-500" size={32} />
            <span className="text-sm font-medium">Loading sales history...</span>
          </div>
        ) : orders.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-slate-200 rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-sm h-125">
            <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-slate-300 mb-6">
              <ShoppingCart size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No Sales Yet</h3>
            <p className="text-slate-500 text-sm max-w-sm mb-6 leading-relaxed">
              Create your first sales order by selecting a customer and adding items from your inventory.
            </p>
            <button onClick={() => setIsFormOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition">
              Create Order
            </button>
          </div>
        ) : (
          /* Orders Table */
          <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
            <table className="w-full min-w-[800px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                  <th className="px-6 py-4">Order #</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Total</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 font-mono font-medium text-slate-600 whitespace-nowrap">
                      {order.order_number}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                      {/* customer_name is included directly in the OrderResponse */}
                      {order.customer_name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      {new Date(order.order_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900 whitespace-nowrap">
                      ${(order.total_amount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-1">
                        <button 
                          onClick={() => setDetailOrderId(order.id)}
                          className="p-2 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        
                        {/* Only show Cancel button if the order isn't already cancelled */}
                        {order.status !== 'CANCELLED' && (
                          <button 
                            onClick={() => handleCancelOrder(order.id)}
                            className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                            title="Cancel Order"
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <OrderFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleCreateOrder}
        customers={customers}
        products={products}
      />

      <OrderDetailModal
        isOpen={!!detailOrderId}
        onClose={() => setDetailOrderId(null)}
        orderId={detailOrderId}
      />
    </div>
  );
}