import axios from './axios';

export const rolService = {
    getAll: async () => {
        const response = await axios.get('/roles');
        return response.data;
    },
    getById: async (id) => {
        const response = await axios.get(`/roles/${id}`);
        return response.data;
    },
    create: async (rol) => {
        const response = await axios.post('/roles', rol);
        return response.data;
    },
    update: async (id, rol) => {
        const response = await axios.put(`/roles/${id}`, rol);
        return response.data;
    },
    delete: async (id) => {
        const response = await axios.delete(`/roles/${id}`);
        return response.data;
    },
    reactivar: async (id) => {
        const response = await axios.patch(`/roles/${id}/reactivar`);
        return response.data;
    },
    getActivos: async () => {
        const response = await axios.get('/roles/activos');
        return response.data;
    }
};