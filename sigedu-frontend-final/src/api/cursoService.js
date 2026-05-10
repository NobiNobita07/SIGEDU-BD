import axios from './axios';

export const cursoService = {
    getAll: async () => {
        const response = await axios.get('/cursos');
        return response.data;
    },
    getById: async (id) => {
        const response = await axios.get(`/cursos/${id}`);
        return response.data;
    },
    getByNombre: async (nombre) => {
        const response = await axios.get(`/cursos/nombre/${nombre}`);
        return response.data;
    },
    create: async (curso) => {
        const response = await axios.post('/cursos', curso);
        return response.data;
    },
    update: async (id, curso) => {
        const response = await axios.put(`/cursos/${id}`, curso);
        return response.data;
    },
    delete: async (id) => {
        const response = await axios.delete(`/cursos/${id}`);
        return response.data;
    },
    reactivar: async (id) => {
        const response = await axios.patch(`/cursos/${id}/reactivar`);
        return response.data;
    },
    getActivos: async () => {
        const response = await axios.get('/cursos/activos');
        return response.data;
    }
};