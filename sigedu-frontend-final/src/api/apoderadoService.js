import axios from './axios';

export const apoderadoService = {
    getAll: async () => {
        const response = await axios.get('/apoderados');
        return response.data;
    },
    getById: async (id) => {
        const response = await axios.get(`/apoderados/${id}`);
        return response.data;
    },
    getByDni: async (dni) => {
        const response = await axios.get(`/apoderados/dni/${dni}`);
        return response.data;
    },
    createConEstudiante: async (data) => {
        const response = await axios.post('/apoderados/con-estudiante', data);
        return response.data;
    },
    create: async (apoderado) => {
        const response = await axios.post('/apoderados', apoderado);
        return response.data;
    },
    update: async (id, apoderado) => {
        const response = await axios.put(`/apoderados/${id}`, apoderado);
        return response.data;
    },
    delete: async (id) => {
        const response = await axios.delete(`/apoderados/${id}`);
        return response.data;
    },
    reactivar: async (id) => {
        const response = await axios.patch(`/apoderados/${id}/reactivar`);
        return response.data;
    },
    getActivos: async () => {
        const response = await axios.get('/apoderados/activos');
        return response.data;
    }
};