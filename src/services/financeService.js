import api from './api';

export const financeService = {
    getAll: async () => {
        const response = await api.get('/finances');
        return response.data.data;
    },

    create: async (financeData) => {
        const response = await api.post('/finances', financeData);
        return response.data.data;
    },

    update: async (id, financeData) => {
        const response = await api.put(`/finances/${id}`, financeData);
        return response.data.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/finances/${id}`);
        return response.data;
    },
};
