import { create } from 'zustand';
import { salesService } from '../services/salesService';

export const useSalesStore = create((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await salesService.getAll();
      set({ orders: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createOrder: async (orderData) => {
    try {
      const newOrder = await salesService.create(orderData);
      set((state) => ({ orders: [newOrder, ...state.orders] }));
      return newOrder;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message;
      throw new Error(errorMessage);
    }
  },

  cancelOrder: async (id) => {
    try {
      await salesService.cancel(id);
      // Backend DELETE returns 204 No Content and the GET /orders/ endpoint
      // filters out CANCELLED orders, so just remove it from our local state
      set((state) => ({
        orders: state.orders.filter(order => order.id !== id)
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message;
      throw new Error(errorMessage);
    }
  }
}));