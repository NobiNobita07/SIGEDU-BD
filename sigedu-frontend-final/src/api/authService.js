import api from './axios';

export const authService = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        const result = response.data;

        if (result?.success && result?.data?.token) {
            localStorage.setItem('sigedu_token', result.data.token);
            localStorage.setItem('sigedu_user', JSON.stringify({
                idUsuario: result.data.idUsuario,
                username: result.data.username,
                email: result.data.email,
                rol: result.data.rol,
            }));
        }

        return result;
    },

    logout: () => {
        localStorage.removeItem('sigedu_token');
        localStorage.removeItem('sigedu_user');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getToken: () => localStorage.getItem('sigedu_token'),

    getUser: () => {
        const user = localStorage.getItem('sigedu_user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => Boolean(localStorage.getItem('sigedu_token')),
};
