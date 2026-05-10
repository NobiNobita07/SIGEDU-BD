import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    timeout: 20000,
});

const getStoredToken = () => {
    return (
        localStorage.getItem('sigedu_token') ||
        localStorage.getItem('token') ||
        localStorage.getItem('authToken')
    );
};

api.interceptors.request.use(
    (config) => {
        const token = getStoredToken();

        if (token) {
            const cleanToken = token.startsWith('Bearer ')
                ? token.replace('Bearer ', '')
                : token;

            config.headers.Authorization = `Bearer ${cleanToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        if ((status === 401 || status === 403) && window.location.pathname !== '/login') {
            localStorage.removeItem('sigedu_token');
            localStorage.removeItem('sigedu_user');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;
