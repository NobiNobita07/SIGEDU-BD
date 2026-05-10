import axios from './axios';

export const asistenciaService = {
    getAll: async () => {
        const response = await axios.get('/asistencias');
        return response.data;
    },
    getById: async (id) => {
        const response = await axios.get(`/asistencias/${id}`);
        return response.data;
    },
    getByMatricula: async (idMatricula) => {
        const response = await axios.get(`/asistencias/matricula/${idMatricula}`);
        return response.data;
    },
    getByFecha: async (fecha) => {
        const response = await axios.get(`/asistencias/fecha/${fecha}`);
        return response.data;
    },
    getByGradoAndFecha: async (idGradoSeccion, fecha) => {
        const response = await axios.get(`/asistencias/grado/${idGradoSeccion}/fecha/${fecha}`);
        return response.data;
    },
    getPorcentaje: async (idMatricula) => {
        const response = await axios.get(`/asistencias/matricula/${idMatricula}/porcentaje`);
        return response.data;
    },
    create: async (asistencia) => {
        const response = await axios.post('/asistencias', asistencia);
        return response.data;
    },
    createBatch: async (asistencias) => {
        const response = await axios.post('/asistencias/batch', asistencias);
        return response.data;
    },
    update: async (id, asistencia) => {
        const response = await axios.put(`/asistencias/${id}`, asistencia);
        return response.data;
    },
    delete: async (id) => {
        const response = await axios.delete(`/asistencias/${id}`);
        return response.data;
    }
};