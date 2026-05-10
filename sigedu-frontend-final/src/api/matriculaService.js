import axios from './axios';

export const matriculaService = {
    getAll: async () => {
        const response = await axios.get('/matriculas');
        return response.data;
    },
    getById: async (id) => {
        const response = await axios.get(`/matriculas/${id}`);
        return response.data;
    },
    getByEstudiante: async (idEstudiante) => {
        const response = await axios.get(`/matriculas/estudiante/${idEstudiante}`);
        return response.data;
    },
    getMatriculaActiva: async (idEstudiante) => {
        const response = await axios.get(`/matriculas/estudiante/${idEstudiante}/activa`);
        return response.data;
    },
    getByGrado: async (idGradoSeccion) => {
        const response = await axios.get(`/matriculas/grado/${idGradoSeccion}`);
        return response.data;
    },
    getByPeriodo: async (anio) => {
        const response = await axios.get(`/matriculas/periodo/${anio}`);
        return response.data;
    },
    create: async (matricula) => {
        const response = await axios.post('/matriculas', matricula);
        return response.data;
    },
    update: async (id, matricula) => {
        const response = await axios.put(`/matriculas/${id}`, matricula);
        return response.data;
    },
    delete: async (id) => {
        const response = await axios.delete(`/matriculas/${id}`);
        return response.data;
    }
};