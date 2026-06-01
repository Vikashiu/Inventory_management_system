import { create } from 'zustand';
import { productService } from '../services/productService';

export const useProductStore = create((set) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await productService.getAll();
      set({ products: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addProduct: async (productData) => {
    try {
      const newProduct = await productService.create(productData);
      set((state) => ({ products: [...state.products, newProduct] }));
    } catch (error) {
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const updated = await productService.update(id, productData);
      set((state) => ({
        products: state.products.map(p => p.id === id ? updated : p)
      }));
    } catch (error) {
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      await productService.delete(id);
      set((state) => ({ 
        products: state.products.filter(p => p.id !== id) 
      }));
    } catch (error) {
      throw error;
    }
  }
}));