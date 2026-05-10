import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { cursoService } from '../api/cursoService';
import { useAuth } from '../context/AuthContext';

const Cursos = () => {
    const { user } = useAuth();
    const canManage = user?.rol === 'ADMIN' || user?.rol === 'SECRETARIA';

    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [alert, setAlert] = useState(null);
    const [busqueda, setBusqueda] = useState('');

    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        horasSemanales: 4,
        estado: true
    });

    useEffect(() => {
        cargarCursos();
    }, []);

    const cargarCursos = async () => {
        try {
            setLoading(true);
            const response = await cursoService.getAll();

            if (response.success) {
                setCursos(response.data || []);
            }
        } catch (error) {
            setAlert({
                type: 'error',
                message: error.response?.data?.message || 'Error al cargar cursos'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!canManage) {
            setAlert({
                type: 'error',
                message: 'No tienes permisos para registrar o modificar cursos'
            });
            return;
        }

        try {
            const response = editing
                ? await cursoService.update(editing, formData)
                : await cursoService.create(formData);

            if (response.success) {
                setAlert({
                    type: 'success',
                    message: editing
                        ? 'Curso actualizado exitosamente'
                        : 'Curso creado exitosamente'
                });

                setModalOpen(false);
                resetForm();
                cargarCursos();
            }
        } catch (error) {
            setAlert({
                type: 'error',
                message: error.response?.data?.message || 'Error al guardar'
            });
        }
    };

    const handleDelete = async (id) => {
        if (!canManage) {
            setAlert({
                type: 'error',
                message: 'No tienes permisos para eliminar cursos'
            });
            return;
        }

        if (user?.rol !== 'ADMIN') {
            setAlert({
                type: 'error',
                message: 'Solo el administrador puede eliminar cursos'
            });
            return;
        }

        if (!window.confirm('¿Estás seguro de eliminar este curso?')) return;

        try {
            const response = await cursoService.delete(id);

            if (response.success) {
                setAlert({
                    type: 'success',
                    message: 'Curso eliminado exitosamente'
                });
                cargarCursos();
            }
        } catch (error) {
            setAlert({
                type: 'error',
                message: error.response?.data?.message || 'Error al eliminar'
            });
        }
    };

    const handleEdit = (curso) => {
        if (!canManage) {
            setAlert({
                type: 'error',
                message: 'El docente solo puede visualizar cursos'
            });
            return;
        }

        setEditing(curso.idCurso);

        setFormData({
            nombre: curso.nombre || '',
            descripcion: curso.descripcion || '',
            horasSemanales: curso.horasSemanales || 4,
            estado: curso.estado ?? true
        });

        setModalOpen(true);
    };

    const resetForm = () => {
        setEditing(null);
        setFormData({
            nombre: '',
            descripcion: '',
            horasSemanales: 4,
            estado: true
        });
    };

    const cursosFiltrados = cursos.filter((curso) => {
        const texto = busqueda.toLowerCase().trim();

        if (!texto) return true;

        const estadoTexto = curso.estado ? 'activo' : 'inactivo';

        return (
            String(curso.idCurso || '').includes(texto) ||
            curso.nombre?.toLowerCase().includes(texto) ||
            curso.descripcion?.toLowerCase().includes(texto) ||
            String(curso.horasSemanales || '').includes(texto) ||
            estadoTexto.includes(texto)
        );
    });

    const totalActivos = cursos.filter(c => c.estado).length;
    const totalInactivos = cursos.filter(c => !c.estado).length;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner />
            </div>
        );
    }

    return (
        <>
            <div className="mb-6">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-1">
                                Gestión académica
                            </p>
                            <h1 className="text-3xl font-black text-slate-900">
                                Cursos
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                {canManage
                                    ? 'Administra el catálogo de cursos académicos del sistema.'
                                    : 'Consulta los cursos registrados en el sistema.'}
                            </p>
                        </div>

                        {canManage && (
                            <button
                                onClick={() => {
                                    resetForm();
                                    setModalOpen(true);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-bold shadow-lg shadow-blue-900/20 transition flex items-center justify-center gap-2"
                            >
                                <span className="text-lg">+</span>
                                <span>Nuevo Curso</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {alert && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                    <p className="text-sm text-slate-500">Total cursos</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{cursos.length}</p>
                </div>

                <div className="bg-green-50 rounded-2xl shadow-sm border border-green-100 p-5">
                    <p className="text-sm text-green-700">Cursos activos</p>
                    <p className="text-3xl font-black text-green-700 mt-1">{totalActivos}</p>
                </div>

                <div className="bg-red-50 rounded-2xl shadow-sm border border-red-100 p-5">
                    <p className="text-sm text-red-700">Cursos inactivos</p>
                    <p className="text-3xl font-black text-red-700 mt-1">{totalInactivos}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                    Buscar curso
                </label>

                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        🔍
                    </span>

                    <input
                        type="text"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar por ID, Nombre, Descripción, Horas o Estado..."
                        className="w-full border border-slate-300 rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                    />
                </div>

                <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-slate-500">
                        Resultados encontrados: {cursosFiltrados.length}
                    </p>

                    {busqueda && (
                        <button
                            onClick={() => setBusqueda('')}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                        >
                            Limpiar búsqueda
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-black text-slate-800">
                            Catálogo de cursos
                        </h2>
                        <p className="text-sm text-slate-500">
                            Información académica de los cursos registrados.
                        </p>
                    </div>
                </div>

                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">ID</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Nombre</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Descripción</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Horas/Semana</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Estado</th>
                            {canManage && (
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Acciones</th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-slate-100">
                        {cursosFiltrados.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={canManage ? 6 : 5}
                                    className="px-6 py-12 text-center text-slate-500"
                                >
                                    {busqueda
                                        ? 'No se encontraron cursos con ese criterio de búsqueda.'
                                        : 'No hay cursos registrados.'}
                                </td>
                            </tr>
                        ) : (
                            cursosFiltrados.map((curso) => (
                                <tr key={curso.idCurso} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{curso.idCurso}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{curso.nombre}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">{curso.descripcion || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700">{curso.horasSemanales}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${
                                                curso.estado
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {curso.estado ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>

                                    {canManage && (
                                        <td className="px-6 py-4 text-sm font-medium">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(curso)}
                                                    className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition"
                                                >
                                                    Editar
                                                </button>

                                                {user?.rol === 'ADMIN' && (
                                                    <button
                                                        onClick={() => handleDelete(curso.idCurso)}
                                                        className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 font-semibold transition"
                                                    >
                                                        Eliminar
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {canManage && (
                <Modal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title={editing ? 'Editar Curso' : 'Nuevo Curso'}
                    size="md"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                            <h3 className="text-lg font-black text-slate-800 mb-1">
                                Datos del Curso
                            </h3>
                            <p className="text-sm text-slate-500 mb-4">
                                Complete la información académica del curso.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Nombre *</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Descripción</label>
                                    <textarea
                                        name="descripcion"
                                        value={formData.descripcion}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Horas Semanales</label>
                                    <input
                                        type="number"
                                        name="horasSemanales"
                                        value={formData.horasSemanales}
                                        onChange={handleInputChange}
                                        min="1"
                                        max="40"
                                        className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
                                className="px-5 py-2.5 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-bold"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-lg shadow-blue-900/20"
                            >
                                {editing ? 'Actualizar' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </>
    );
};

export default Cursos;