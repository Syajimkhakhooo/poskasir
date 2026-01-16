import api from './api';

export const stockOpnameService = {
    getAll: async () => {
        const response = await api.get('/stock-opnames');
        return response.data.data;
    },

    create: async (stockOpnameData) => {
        const response = await api.post('/stock-opnames', stockOpnameData);
        return response.data.data;
    },
};
