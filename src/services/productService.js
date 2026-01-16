import api from './api';

export const productService = {
    getAll: async () => {
        const response = await api.get('/products');
        return response.data.data;
    },

    getById: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data.data;
    },

    create: async (productData) => {
        const response = await api.post('/products', productData);
        return response.data.data;
    },

    update: async (id, productData) => {
        const response = await api.put(`/products/${id}`, productData);
        return response.data.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    },
};
