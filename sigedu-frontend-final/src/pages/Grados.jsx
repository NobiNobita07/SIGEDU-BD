import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { gradoSeccionService } from '../api/gradoSeccionService';
import { docenteService } from '../api/docenteService';

const Grados = () => {
    const [grados, setGrados] = useState([]);
    const [docentes, setDocentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [alert, setAlert] = useState(null);
    const [busqueda, setBusqueda] = useState('');

    const [formData, setFormData] = useState({
        grado: '',
        seccion: '',
        nivel: 'Primaria',
        turno: 'Mañana',
        docenteTutor: { idDocente: '' },
        estado: true
    });

    const niveles = ['Inicial', 'Primaria', 'Secundaria'];
    const turnos = ['Mañana', 'Tarde', 'Noche'];

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setLoading(true);

            const [gradosRes, docentesRes] = await Promise.all([
                gradoSeccionService.getAll(),
                docenteService.getAll()
            ]);

            if (gradosRes.success) setGrados(gradosRes.data || []);
            if (docentesRes.success) setDocentes(docentesRes.data || []);
        } catch (error) {
            setAlert({
                type: 'error',
                message: error.response?.data?.message || 'Error al cargar datos'
            });
        } finally {
            setLoading(false);
        }
    };

    const getDocenteTutorNombre = (grado) => {
        if (!grado.docenteTutor) return 'Sin asignar';
        return `${grado.docenteTutor.nombres || ''} ${grado.docenteTutor.apellidos || ''}`.trim();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'docenteTutorId') {
            setFormData({
                ...formData,
                docenteTutor: { idDocente: parseInt(value) || null }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = editing
                ? await gradoSeccionService.update(editing, formData)
                : await gradoSeccionService.create(formData);

            if (response.success) {
                setAlert({
                    type: 'success',
                    message: editing
                        ? 'Grado/Sección actualizado exitosamente'
                        : 'Grado/Sección creado exitosamente'
                });

                setModalOpen(false);
                resetForm();
                cargarDatos();
            }
        } catch (error) {
            setAlert({
                type: 'error',
                message: error.response?.data?.message || 'Error al guardar'
            });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este grado/sección?')) return;

        try {
            const response = await gradoSeccionService.delete(id);

            if (response.success) {
                setAlert({
                    type: 'success',
                    message: 'Grado/Sección eliminado exitosamente'
                });
                cargarDatos();
            }
        } catch (error) {
            setAlert({
                type: 'error',
                message: error.response?.data?.message || 'Error al eliminar'
            });
        }
    };

    const handleEdit = (grado) => {
        setEditing(grado.idGradoSeccion);

        setFormData({
            grado: grado.grado || '',
            seccion: grado.seccion || '',
            nivel: grado.nivel || 'Primaria',
            turno: grado.turno || 'Mañana',
            docenteTutor: { idDocente: grado.docenteTutor?.idDocente || '' },
            estado: grado.estado ?? true
        });

        setModalOpen(true);
    };

    const resetForm = () => {
        setEditing(null);
        setFormData({
            grado: '',
            seccion: '',
            nivel: 'Primaria',
            turno: 'Mañana',
            docenteTutor: { idDocente: '' },
            estado: true
        });
    };

    const getNivelColor = (nivel) => {
        const colors = {
            Inicial: 'bg-green-100 text-green-700',
            Primaria: 'bg-blue-100 text-blue-700',
            Secundaria: 'bg-purple-100 text-purple-700'
        };
        return colors[nivel] || 'bg-gray-100 text-gray-700';
    };

    const getTurnoColor = (turno) => {
        const colors = {
            Mañana: 'bg-yellow-100 text-yellow-700',
            Tarde: 'bg-orange-100 text-orange-700',
            Noche: 'bg-slate-100 text-slate-700'
        };
        return colors[turno] || 'bg-gray-100 text-gray-700';
    };

    const gradosFiltrados = grados.filter((grado) => {
        const texto = busqueda.toLowerCase().trim();

        if (!texto) return true;

        const docenteTutor = getDocenteTutorNombre(grado).toLowerCase();
        const estadoTexto = grado.estado ? 'activo' : 'inactivo';

        return (
            String(grado.idGradoSeccion || '').includes(texto) ||
            grado.grado?.toLowerCase().includes(texto) ||
            grado.seccion?.toLowerCase().includes(texto) ||
            grado.nivel?.toLowerCase().includes(texto) ||
            grado.turno?.toLowerCase().includes(texto) ||
            docenteTutor.includes(texto) ||
            estadoTexto.includes(texto)
        );
    });

    const totalActivos = grados.filter(g => g.estado).length;
    const totalInactivos = grados.filter(g => !g.estado).length;

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
                                Grados y Secciones
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Administra los grados, secciones, niveles, turnos y docentes tutores.
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                resetForm();
                                setModalOpen(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-bold shadow-lg shadow-blue-900/20 transition flex items-center justify-center gap-2"
                        >
                            <span className="text-lg">+</span>
                            <span>Nuevo Grado/Sección</span>
                        </button>
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
                    <p className="text-sm text-slate-500">Total grados/secciones</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{grados.length}</p>
                </div>

                <div className="bg-green-50 rounded-2xl shadow-sm border border-green-100 p-5">
                    <p className="text-sm text-green-700">Activos</p>
                    <p className="text-3xl font-black text-green-700 mt-1">{totalActivos}</p>
                </div>

                <div className="bg-red-50 rounded-2xl shadow-sm border border-red-100 p-5">
                    <p className="text-sm text-red-700">Inactivos</p>
                    <p className="text-3xl font-black text-red-700 mt-1">{totalInactivos}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                    Buscar grado o sección
                </label>

                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        🔍
                    </span>

                    <input
                        type="text"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar por Grado, Sección, Nivel, Turno, Docente o Estado..."
                        className="w-full border border-slate-300 rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                    />
                </div>

                <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-slate-500">
                        Resultados encontrados: {gradosFiltrados.length}
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
                            Listado de grados y secciones
                        </h2>
                        <p className="text-sm text-slate-500">
                            Organización académica por nivel, turno y docente tutor.
                        </p>
                    </div>
                </div>

                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Grado</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Sección</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Nivel</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Turno</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Docente</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Estado</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Acciones</th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-slate-100">
                        {gradosFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                                    {busqueda
                                        ? 'No se encontraron grados/secciones con ese criterio de búsqueda.'
                                        : 'No hay grados/secciones registrados.'}
                                </td>
                            </tr>
                        ) : (
                            gradosFiltrados.map((grado) => (
                                <tr key={grado.idGradoSeccion} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{grado.grado}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700">{grado.seccion}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${getNivelColor(grado.nivel)}`}>
                                            {grado.nivel}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${getTurnoColor(grado.turno)}`}>
                                            {grado.turno}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        {getDocenteTutorNombre(grado)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${
                                                grado.estado
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {grado.estado ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(grado)}
                                                className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition"
                                            >
                                                Editar
                                            </button>

                                            <button
                                                onClick={() => handleDelete(grado.idGradoSeccion)}
                                                className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 font-semibold transition"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editing ? 'Editar Grado/Sección' : 'Nuevo Grado/Sección'}
                size="md"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                        <h3 className="text-lg font-black text-slate-800 mb-1">
                            Datos del Grado/Sección
                        </h3>
                        <p className="text-sm text-slate-500 mb-4">
                            Complete la información académica del grado o sección.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Grado *</label>
                                <input
                                    type="text"
                                    name="grado"
                                    value={formData.grado}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Ej: 1ro, 2do, 3ro"
                                    className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Sección *</label>
                                <input
                                    type="text"
                                    name="seccion"
                                    value={formData.seccion}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Ej: A, B, C"
                                    className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Nivel *</label>
                                <select
                                    name="nivel"
                                    value={formData.nivel}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {niveles.map(n => (
                                        <option key={n} value={n}>{n}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Turno *</label>
                                <select
                                    name="turno"
                                    value={formData.turno}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {turnos.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-slate-700 mb-1">Docente Tutor</label>
                                <select
                                    name="docenteTutorId"
                                    value={formData.docenteTutor.idDocente || ''}
                                    onChange={handleInputChange}
                                    className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Sin asignar</option>
                                    {docentes.map(d => (
                                        <option key={d.idDocente} value={d.idDocente}>
                                            {d.nombres} {d.apellidos} - {d.especialidad || 'Sin especialidad'}
                                        </option>
                                    ))}
                                </select>
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
        </>
    );
};

export default Grados;