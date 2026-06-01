import React, { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, Loader2, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCustomerStore } from '../../stores/customerStore';
import CustomerTable from '../../components/CustomerTable';
import CustomerFormModal from '../../components/CustomerFormModal';

function CustomersPage() {
  const { customers, isLoading, fetchCustomers, addCustomer, updateCustomer, deleteCustomer } = useCustomerStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleSaveCustomer = async (customerData) => {
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, customerData);
        toast.success('Customer profile updated!');
      } else {
        await addCustomer(customerData);
        toast.success('New customer added!');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteCustomer(id);
        toast.success('Customer removed.');
      } catch (error) {
        toast.error(error.message);
        console.error(error);
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 cursor-pointer">
          <span className="text-xl font-bold text-slate-900">Client Directory</span>
          <span className="text-xs text-slate-400">▼</span>
        </div>
        
        <div className="flex gap-2">
          <button onClick={handleOpenAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 shadow-sm transition">
            <Plus size={16} /> Add Customer
          </button>
          <button className="border border-slate-200 bg-white hover:bg-slate-50 p-2 rounded-lg text-slate-500 transition">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="animate-spin text-blue-500" size={32} />
            <span className="text-sm font-medium">Loading directory...</span>
          </div>
        ) : customers.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-slate-200 rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-sm h-125">
            <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-slate-300 mb-6">
              <Users size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Build Your Client List</h3>
            <p className="text-slate-500 text-sm max-w-sm mb-6 leading-relaxed">
              Keep track of buyers, contact information, and purchase history by adding your first customer to the directory.
            </p>
            <button onClick={handleOpenAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition">
              Add Customer
            </button>
          </div>
        ) : (
          <CustomerTable customers={customers} onEdit={handleOpenEdit} onDelete={handleDelete} />
        )}
      </div>

      <CustomerFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveCustomer} editingCustomer={editingCustomer} />
    </div>
  );
}
export default CustomersPage;