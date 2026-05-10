import axios from './axios';

export const consultaDniService = {
    consultarDni: async (dni) => {
        const response = await axios.get(`/consultas/dni/${dni}`);
        return response.data;
    }
};