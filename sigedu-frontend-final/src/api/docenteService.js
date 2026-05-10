import axios from './axios';

export const docenteService = {
    getAll: async () => {
        const response = await axios.get('/docentes');
        return response.data;
    },
    getById: async (id) => {
        const response = await axios.get(`/docentes/${id}`);
        return response.data;
    },
    getByDni: async (dni) => {
        const response = await axios.get(`/docentes/dni/${dni}`);
        return response.data;
    },
    getByCodigo: async (codigo) => {
        const response = await axios.get(`/docentes/codigo/${codigo}`);
        return response.data;
    },
    getByEspecialidad: async (especialidad) => {
        const response = await axios.get(`/docentes/especialidad/${especialidad}`);
        return response.data;
    },
    create: async (docente) => {
        const response = await axios.post('/docentes', docente);
        return response.data;
    },
    update: async (id, docente) => {
        const response = await axios.put(`/docentes/${id}`, docente);
        return response.data;
    },
    delete: async (id) => {
        const response = await axios.delete(`/docentes/${id}`);
        return response.data;
    },
    reactivar: async (id) => {
        const response = await axios.patch(`/docentes/${id}/reactivar`);
        return response.data;
    },
    getActivos: async () => {
        const response = await axios.get('/docentes/activos');
        return response.data;
    }
};