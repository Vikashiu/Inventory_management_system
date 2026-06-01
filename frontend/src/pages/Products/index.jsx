import React, { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProductStore } from '../../stores/productStore';
import EmptyState from '../../components/EmptyState';
import ProductTable from '../../components/ProductTable';
import ProductFormModal from '../../components/ProductFormModal';

export default function ProductsPage() {
  // Pull data and actions straight from Zustand
  const { products, isLoading, fetchProducts, addProduct, updateProduct, deleteProduct } = useProductStore();
  
  // Local state for the Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch products when the page loads
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast.success('Product updated successfully!');
      } else {
        await addProduct(productData);
        toast.success('New product created!');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to save product. Please try again.');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        toast.success('Product deleted.');
      } catch (error) {
        toast.error('Failed to delete product.');
        console.error(error);
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Action Header Banner */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 cursor-pointer">
          <span className="text-xl font-bold text-slate-900">All Items</span>
          <span className="text-xs text-slate-400">▼</span>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={handleOpenAdd} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus size={16} /> New Item
          </button>
          <button className="border border-slate-200 bg-white hover:bg-slate-50 p-2 rounded-lg text-slate-500 transition">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Render Logic: Loading -> Empty -> Table */}
      <div className="flex-1">
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="animate-spin text-blue-500" size={32} />
            <span className="text-sm font-medium">Loading inventory...</span>
          </div>
        ) : products.length === 0 ? (
          <EmptyState onCreateClick={handleOpenAdd} />
        ) : (
          <ProductTable 
            products={products} 
            onEdit={handleOpenEdit} 
            onDelete={handleDelete} 
          />
        )}
      </div>

      {/* Pop-up Modal */}
      <ProductFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveProduct} 
        editingProduct={editingProduct} 
      />
    </div>
  );
}