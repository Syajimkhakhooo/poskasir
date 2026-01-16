import api from './api';

export const transactionService = {
    getAll: async () => {
        const response = await api.get('/transactions');
        return response.data.data;
    },

    create: async (transactionData) => {
        const response = await api.post('/transactions', transactionData);
        return response.data.data;
    },
};
