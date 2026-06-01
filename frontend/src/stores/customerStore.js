import { create } from 'zustand';
import { customerService } from '../services/customerService.js';

export const useCustomerStore = create((set) => ({
  customers: [],
  isLoading: false,
  error: null,

  fetchCustomers: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await customerService.getAll();
      set({ customers: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addCustomer: async (customerData) => {
    try {
      const newCustomer = await customerService.create(customerData);
      set((state) => ({ customers: [...state.customers, newCustomer] }));
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message;
      throw new Error(errorMessage);
    }
  },

  updateCustomer: async (id, customerData) => {
    try {
      const updated = await customerService.update(id, customerData);
      set((state) => ({
        customers: state.customers.map(c => c.id === id ? updated : c)
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message;
      throw new Error(errorMessage);
    }
  },

  deleteCustomer: async (id) => {
    try {
      await customerService.delete(id);
      set((state) => ({ 
        customers: state.customers.filter(c => c.id !== id) 
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message;
      throw new Error(errorMessage);
    }
  }
}));