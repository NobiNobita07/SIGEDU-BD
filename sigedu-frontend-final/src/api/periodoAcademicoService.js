import axios from './axios';

export const periodoAcademicoService = {
    // Obtener todos los períodos
    getAll: async () => {
        const response = await axios.get('/periodos-academicos');
        return response.data;
    },

    // Obtener período por ID
    getById: async (id) => {
        const response = await axios.get(`/periodos-academicos/${id}`);
        return response.data;
    },

    // Obtener período por año
    getByAnio: async (anio) => {
        const response = await axios.get(`/periodos-academicos/anio/${anio}`);
        return response.data;
    },

    // Obtener período activo
    getActivo: async () => {
        const response = await axios.get('/periodos-academicos/activo');
        return response.data;
    },

    // Crear período
    create: async (periodo) => {
        const response = await axios.post('/periodos-academicos', periodo);
        return response.data;
    },

    // Actualizar período
    update: async (id, periodo) => {
        const response = await axios.put(`/periodos-academicos/${id}`, periodo);
        return response.data;
    },

    // Activar período
    activar: async (id) => {
        const response = await axios.patch(`/periodos-academicos/${id}/activar`);
        return response.data;
    },

    // Finalizar período
    finalizar: async (id) => {
        const response = await axios.patch(`/periodos-academicos/${id}/finalizar`);
        return response.data;
    },

    // Eliminar período
    delete: async (id) => {
        const response = await axios.delete(`/periodos-academicos/${id}`);
        return response.data;
    }
};