import axios from './axios';

export const notaService = {
    getAll: async () => {
        const response = await axios.get('/notas');
        return response.data;
    },
    getById: async (id) => {
        const response = await axios.get(`/notas/${id}`);
        return response.data;
    },
    getByMatricula: async (idMatricula) => {
        const response = await axios.get(`/notas/matricula/${idMatricula}`);
        return response.data;
    },
    getByMatriculaAndBimestre: async (idMatricula, bimestre) => {
        const response = await axios.get(`/notas/matricula/${idMatricula}/bimestre/${bimestre}`);
        return response.data;
    },
    getPromedio: async (idMatricula, bimestre) => {
        const response = await axios.get(`/notas/matricula/${idMatricula}/bimestre/${bimestre}/promedio`);
        return response.data;
    },
    getByEstudianteAndAnio: async (idEstudiante, anio) => {
        const response = await axios.get(`/notas/estudiante/${idEstudiante}/anio/${anio}`);
        return response.data;
    },
    create: async (nota) => {
        const response = await axios.post('/notas', nota);
        return response.data;
    },
    update: async (id, nota) => {
        const response = await axios.put(`/notas/${id}`, nota);
        return response.data;
    },
    delete: async (id) => {
        const response = await axios.delete(`/notas/${id}`);
        return response.data;
    }
};