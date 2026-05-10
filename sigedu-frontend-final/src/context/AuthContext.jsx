import React, { createContext, useContext, useMemo, useState } from 'react';
import { authService } from '../api/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => authService.getUser());
    const [token, setToken] = useState(() => authService.getToken());

    const login = async ({ username, password }) => {
        const response = await authService.login({ username, password });

        if (!response.success) {
            throw new Error(response.message || 'No se pudo iniciar sesión');
        }

        const loginData = response.data;
        localStorage.setItem('sigedu_token', loginData.token);
        localStorage.setItem('sigedu_user', JSON.stringify(loginData));
        setToken(loginData.token);
        setUser(loginData);
        return loginData;
    };

    const logout = () => {
        authService.logout();
        setToken(null);
        setUser(null);
    };

    const value = useMemo(() => ({
        user,
        token,
        login,
        logout,
        isAuthenticated: Boolean(token),
    }), [user, token]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
};
