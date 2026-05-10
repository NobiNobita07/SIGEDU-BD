import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const menuItems = [
        { path: '/', name: 'Panel', icon: '📊', roles: ['ADMIN', 'DOCENTE', 'SECRETARIA'] },

        { path: '/apoderados', name: 'Apoderados', icon: '👪', roles: ['ADMIN', 'SECRETARIA'] },
        { path: '/estudiantes', name: 'Estudiantes', icon: '🎓', roles: ['ADMIN', 'DOCENTE', 'SECRETARIA'] },
        { path: '/docentes', name: 'Docentes', icon: '👨‍🏫', roles: ['ADMIN', 'SECRETARIA'] },

        { path: '/cursos', name: 'Cursos', icon: '📚', roles: ['ADMIN', 'DOCENTE', 'SECRETARIA'] },
        { path: '/grados', name: 'Grados/Secciones', icon: '🏫', roles: ['ADMIN', 'SECRETARIA'] },
        { path: '/matriculas', name: 'Matrículas', icon: '📝', roles: ['ADMIN', 'SECRETARIA'] },

        { path: '/notas', name: 'Notas', icon: '📖', roles: ['ADMIN', 'DOCENTE'] },
        { path: '/asistencias', name: 'Asistencias', icon: '✅', roles: ['ADMIN', 'DOCENTE'] },

        { path: '/pagos', name: 'Pagos', icon: '💰', roles: ['ADMIN', 'SECRETARIA'] },
        { path: '/reportes', name: 'Informes', icon: '📈', roles: ['ADMIN', 'DOCENTE', 'SECRETARIA'] },
    ];

    const userRole = user?.rol || '';
    const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));
    const currentPage = filteredMenuItems.find(item => item.path === location.pathname)?.name || 'SIGEDU';

    return (
        <div className="min-h-screen bg-[#F3F6FB] flex font-sans text-slate-800">
            <aside className="w-72 bg-[#07111F] text-white min-h-screen fixed left-0 top-0 shadow-2xl flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl shadow-lg shadow-blue-900/40">
                            🎓
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-wide">SIGEDU</h1>
                            <p className="text-[11px] text-slate-400">Gestión Educativa</p>
                        </div>
                    </div>
                </div>

                <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                    {filteredMenuItems.map((item) => {
                        const active = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                                    active
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-950/50 ring-1 ring-white/20'
                                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                <span className="text-lg w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center">
                                    {item.icon}
                                </span>
                                <span className="font-semibold text-sm">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="bg-white/8 backdrop-blur rounded-3xl p-4 ring-1 ring-white/10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center font-bold shadow-lg">
                                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-sm truncate">{user?.username || 'Usuario'}</p>
                                <p className="text-[11px] text-slate-400 uppercase tracking-wide">{userRole || 'ROL'}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-2xl text-sm font-bold transition shadow-lg shadow-red-950/30"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </aside>

            <div className="ml-72 flex-1 min-h-screen">
                <header className="bg-white/90 backdrop-blur border-b border-slate-200 sticky top-0 z-20">
                    <div className="px-8 py-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">{currentPage}</h2>
                            <p className="text-sm text-slate-500">
                                {userRole === 'ADMIN' && 'Panel general de dirección y administración'}
                                {userRole === 'DOCENTE' && 'Panel académico del docente'}
                                {userRole === 'SECRETARIA' && 'Panel administrativo de secretaría'}
                                {!userRole && 'Panel administrativo académico'}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-3xl ring-1 ring-slate-200">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold">
                                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-bold text-slate-800">{user?.username || 'Usuario'}</p>
                                <p className="text-[11px] text-slate-500 uppercase">{userRole || 'ROL'}</p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-8">
                    <div className="animate-[fadeIn_0.25s_ease-in-out]">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;