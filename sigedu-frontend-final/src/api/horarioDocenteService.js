import axios from './axios';

export const horarioDocenteService = {
    getAll: async () => {
        const response = await axios.get('/horarios-docentes');
        return response.data;
    },

    getActivos: async () => {
        const response = await axios.get('/horarios-docentes/activos');
        return response.data;
    },

    getById: async (id) => {
        const response = await axios.get(`/horarios-docentes/${id}`);
        return response.data;
    },

    getByDocente: async (idDocente) => {
        const response = await axios.get(`/horarios-docentes/docente/${idDocente}`);
        return response.data;
    },

    create: async (horario) => {
        const response = await axios.post('/horarios-docentes', horario);
        return response.data;
    },

    update: async (id, horario) => {
        const response = await axios.put(`/horarios-docentes/${id}`, horario);
        return response.data;
    },

    delete: async (id) => {
        const response = await axios.delete(`/horarios-docentes/${id}`);
        return response.data;
    },

    reactivar: async (id) => {
        const response = await axios.patch(`/horarios-docentes/${id}/reactivar`);
        return response.data;
    }
};