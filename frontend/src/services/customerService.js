import api from './apiClient';

export const customerService = {
  async getAll() {
    const response = await api.get('/customers/');
    return response.data;
  },
  async create(customerData) {
    const response = await api.post('/customers/', customerData);
    return response.data;
  },
  async update(id, customerData) {
    const response = await api.put(`/customers/${id}`, customerData);
    return response.data;
  },
  async delete(id) {
    await api.delete(`/customers/${id}`);
    return true;
  }
};