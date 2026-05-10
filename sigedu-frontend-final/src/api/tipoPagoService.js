import axios from './axios';

export const tipoPagoService = {
    getAll: async () => {
        const response = await axios.get('/tipos-pago');
        return response.data;
    },
    getById: async (id) => {
        const response = await axios.get(`/tipos-pago/${id}`);
        return response.data;
    },
    getByConcepto: async (concepto) => {
        const response = await axios.get(`/tipos-pago/concepto/${concepto}`);
        return response.data;
    },
    create: async (tipoPago) => {
        const response = await axios.post('/tipos-pago', tipoPago);
        return response.data;
    },
    update: async (id, tipoPago) => {
        const response = await axios.put(`/tipos-pago/${id}`, tipoPago);
        return response.data;
    },
    updateMonto: async (id, monto) => {
        const response = await axios.patch(`/tipos-pago/${id}/monto?monto=${monto}`);
        return response.data;
    },
    delete: async (id) => {
        const response = await axios.delete(`/tipos-pago/${id}`);
        return response.data;
    },
    reactivar: async (id) => {
        const response = await axios.patch(`/tipos-pago/${id}/reactivar`);
        return response.data;
    },
    getActivos: async () => {
        const response = await axios.get('/tipos-pago/activos');
        return response.data;
    }
};