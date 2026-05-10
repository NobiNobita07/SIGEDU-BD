import axios from './axios';

export const estudianteService = {
    getAll: async () => {
        const response = await axios.get('/estudiantes');
        return response.data;
    },
    getById: async (id) => {
        const response = await axios.get(`/estudiantes/${id}`);
        return response.data;
    },
    getByDni: async (dni) => {
        const response = await axios.get(`/estudiantes/dni/${dni}`);
        return response.data;
    },
    getByCodigo: async (codigo) => {
        const response = await axios.get(`/estudiantes/codigo/${codigo}`);
        return response.data;
    },
    buscar: async (nombre, apellido) => {
        const response = await axios.get(`/estudiantes/buscar?nombre=${nombre || ''}&apellido=${apellido || ''}`);
        return response.data;
    },
    create: async (estudiante) => {
        const response = await axios.post('/estudiantes', estudiante);
        return response.data;
    },
    update: async (id, estudiante) => {
        const response = await axios.put(`/estudiantes/${id}`, estudiante);
        return response.data;
    },
    delete: async (id) => {
        const response = await axios.delete(`/estudiantes/${id}`);
        return response.data;
    },
    reactivar: async (id) => {
        const response = await axios.patch(`/estudiantes/${id}/reactivar`);
        return response.data;
    },
    getActivos: async () => {
        const response = await axios.get('/estudiantes/activos');
        return response.data;
    }
};