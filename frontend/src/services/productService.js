import api from './apiClient';

export const productService = {
  // GET all products
  async getAll() {
    const response = await api.get('/products/');
    return response.data; 
  },

  // POST create a new product
  async create(productData) {
    const response = await api.post('/products/', productData);
    return response.data;
  },

  // PUT update an existing product
  async update(id, productData) {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // DELETE a product
  async delete(id) {
    await api.delete(`/products/${id}`);
    return true;
  }
};