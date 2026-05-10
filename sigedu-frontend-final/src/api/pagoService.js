import axios from './axios';

export const pagoService = {
    getAll: async () => {
        const response = await axios.get('/pagos');
        return response.data;
    },
    getById: async (id) => {
        const response = await axios.get(`/pagos/${id}`);
        return response.data;
    },
    getByMatricula: async (idMatricula) => {
        const response = await axios.get(`/pagos/matricula/${idMatricula}`);
        return response.data;
    },
    getByEstado: async (estado) => {
        const response = await axios.get(`/pagos/estado/${estado}`);
        return response.data;
    },
    getDeudasByEstudiante: async (idEstudiante) => {
        const response = await axios.get(`/pagos/deudas/estudiante/${idEstudiante}`);
        return response.data;
    },
    getTotalDeudas: async (idEstudiante) => {
        const response = await axios.get(`/pagos/deudas/estudiante/${idEstudiante}/total`);
        return response.data;
    },
    getByMatriculaAndMes: async (idMatricula, mes) => {
        const response = await axios.get(`/pagos/matricula/${idMatricula}/mes/${mes}`);
        return response.data;
    },
    create: async (pago) => {
        const response = await axios.post('/pagos', pago);
        return response.data;
    },
    registrarPago: async (idPago, data) => {
        const response = await axios.post(`/pagos/${idPago}/registrar-pago`, data);
        return response.data;
    },
    update: async (id, pago) => {
        const response = await axios.put(`/pagos/${id}`, pago);
        return response.data;
    },
    delete: async (id) => {
        const response = await axios.delete(`/pagos/${id}`);
        return response.data;
    }
};