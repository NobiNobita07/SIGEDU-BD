import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const redirectTo = location.state?.from?.pathname || '/';

    if (isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData);
            navigate(redirectTo, { replace: true });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                'Usuario o contraseña incorrectos'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-950" />

            <div className="absolute top-[-120px] left-[-120px] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-[-120px] right-[-120px] w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />

            <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 p-10 text-white">
                    <div>
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center text-3xl shadow-lg">
                                🎓
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-wide">SIGEDU-BD</h1>
                                <p className="text-sm text-blue-100">Sistema de Gestión Educativa</p>
                            </div>
                        </div>

                        <h2 className="text-4xl font-black leading-tight mb-4">
                            Gestión académica, administrativa y económica en una sola plataforma.
                        </h2>

                        <p className="text-blue-100 leading-relaxed">
                            Plataforma web orientada a centralizar estudiantes, docentes, cursos,
                            matrículas, notas, asistencias, pagos y reportes institucionales.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mt-10">
                        <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
                            <p className="text-2xl mb-1">🔐</p>
                            <p className="text-xs text-blue-100">Acceso seguro</p>
                        </div>
                        <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
                            <p className="text-2xl mb-1">📊</p>
                            <p className="text-xs text-blue-100">Reportes PDF</p>
                        </div>
                        <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
                            <p className="text-2xl mb-1">💳</p>
                            <p className="text-xs text-blue-100">Pagos digitales</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-12">
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-4 shadow-sm">
                            <span className="text-3xl">🎓</span>
                        </div>

                        <h1 className="text-3xl font-black text-slate-900">Bienvenido</h1>

                        <p className="text-slate-500 mt-2">
                            Acceso seguro al sistema SIGEDU-BD
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                            Institución Educativa José Abelardo Quiñones Gonzales
                        </p>
                    </div>

                    {error && (
                        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Usuario
                            </label>

                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                                placeholder="Ingrese su usuario"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Contraseña
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                                    placeholder="Ingrese su contraseña"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-700 transition"
                                    title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-700 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
                        >
                            {loading ? 'Validando acceso...' : 'Iniciar sesión'}
                        </button>
                    </form>

                    <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-600">
                        <div className="flex items-center justify-between mb-2">
                            <p className="font-bold text-slate-700">Usuarios de prueba</p>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                Demo
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-1 text-xs">
                            <p><span className="font-semibold">Administrador:</span> admin / 123456</p>
                            <p><span className="font-semibold">Docente:</span> docente / 123456</p>
                            <p><span className="font-semibold">Secretaría:</span> secretaria / 123456</p>
                        </div>
                    </div>

                    <p className="text-center text-xs text-slate-400 mt-6">
                        © 2026 SIGEDU-BD · Sistema de Gestión Educativa - Hecho por Nobita Nobi
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;