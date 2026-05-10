import axios from './axios';

export const gradoSeccionService = {
    getAll: async () => {
        const response = await axios.get('/grados-secciones');
        return response.data;
    },
    getById: async (id) => {
        const response = await axios.get(`/grados-secciones/${id}`);
        return response.data;
    },
    getByNivel: async (nivel) => {
        const response = await axios.get(`/grados-secciones/nivel/${nivel}`);
        return response.data;
    },
    getByTurno: async (turno) => {
        const response = await axios.get(`/grados-secciones/turno/${turno}`);
        return response.data;
    },
    buscar: async (grado, seccion, nivel) => {
        const response = await axios.get(`/grados-secciones/buscar?grado=${grado}&seccion=${seccion}&nivel=${nivel}`);
        return response.data;
    },
    create: async (gradoSeccion) => {
        const response = await axios.post('/grados-secciones', gradoSeccion);
        return response.data;
    },
    update: async (id, gradoSeccion) => {
        const response = await axios.put(`/grados-secciones/${id}`, gradoSeccion);
        return response.data;
    },
    delete: async (id) => {
        const response = await axios.delete(`/grados-secciones/${id}`);
        return response.data;
    },
    reactivar: async (id) => {
        const response = await axios.patch(`/grados-secciones/${id}/reactivar`);
        return response.data;
    },
    getActivos: async () => {
        const response = await axios.get('/grados-secciones/activos');
        return response.data;
    }
};