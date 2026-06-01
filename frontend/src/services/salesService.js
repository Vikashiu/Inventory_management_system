import api from './apiClient';

export const salesService = {
  async getAll() {
    const response = await api.get('/orders/');
    return response.data;
  },
  async getById(id) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  async create(orderData) {
    const response = await api.post('/orders/', orderData);
    return response.data;
  },
  // Cancel an order — backend uses DELETE /orders/{id} and returns 204 No Content
  async cancel(id) {
    await api.delete(`/orders/${id}`);
    // DELETE returns 204 with no body, so we return a minimal object
    return { id };
  }
};