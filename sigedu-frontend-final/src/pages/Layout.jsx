import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const menuItems = [
        { path: '/', name: 'Dashboard', icon: '📊' },
        { path: '/apoderados', name: 'Apoderados', icon: '👪' },
        { path: '/estudiantes', name: 'Estudiantes', icon: '👨‍🎓' },
        { path: '/docentes', name: 'Docentes', icon: '👨‍🏫' },
        { path: '/cursos', name: 'Cursos', icon: '📚' },
        { path: '/grados', name: 'Grados/Secciones', icon: '🏫' },
        { path: '/matriculas', name: 'Matrículas', icon: '📝' },
        { path: '/notas', name: 'Notas', icon: '📖' },
        { path: '/asistencias', name: 'Asistencias', icon: '✅' },
        { path: '/pagos', name: 'Pagos', icon: '💰' },
        { path: '/reportes', name: 'Reportes', icon: '📈' },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-blue-700 text-white shadow-lg sticky top-0 z-40">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center space-x-4">
                        <button type="button" onClick={() => setSidebarOpen(true)} className="p-2 rounded-md hover:bg-blue-600 focus:outline-none">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="text-xl font-bold">SIGEDU-BD</h1>
                        <span className="text-sm hidden md:inline">Sistema de Gestión Educativa</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-semibold">{user?.username || 'Usuario'}</p>
                            <p className="text-xs text-blue-100">{user?.rol || 'ROL'}</p>
                        </div>
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold">{user?.username?.charAt(0)?.toUpperCase() || 'U'}</span>
                        </div>
                        <button type="button" onClick={handleLogout} className="bg-blue-800 hover:bg-blue-900 px-3 py-2 rounded-lg text-sm transition-colors">
                            Salir
                        </button>
                    </div>
                </div>
            </header>

            {sidebarOpen && <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20" onClick={() => setSidebarOpen(false)} />}

            <aside className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 z-30 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Menú Principal</h2>
                </div>
                <nav className="p-2">
                    {menuItems.map((item) => (
                        <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)} className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-colors ${location.pathname === item.path ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                            <span className="text-xl">{item.icon}</span>
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </aside>

            <main className="p-6">{children}</main>
        </div>
    );
};

export default Layout;
