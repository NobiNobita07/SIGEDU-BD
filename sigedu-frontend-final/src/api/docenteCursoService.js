import axios from './axios';

export const docenteCursoService = {
    getAll: async () => {
        const response = await axios.get('/docente-cursos');
        return response.data;
    },

    getById: async (id) => {
        const response = await axios.get(`/docente-cursos/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await axios.post('/docente-cursos', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await axios.put(`/docente-cursos/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await axios.delete(`/docente-cursos/${id}`);
        return response.data;
    }
};