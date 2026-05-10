import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { estudianteService } from '../api/estudianteService';
import { apoderadoService } from '../api/apoderadoService';
import { consultaDniService } from '../api/consultaDniService';
import { useAuth } from '../context/AuthContext';

const Estudiantes = () => {
    const { user } = useAuth();

    const canManage = user?.rol === 'ADMIN' || user?.rol === 'SECRETARIA';

    const [estudiantes, setEstudiantes] = useState([]);
    const [apoderados, setApoderados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [alert, setAlert] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [consultandoDni, setConsultandoDni] = useState(false);

    const [formData, setFormData] = useState({
        codigo: '',
        nombres: '',
        apellidos: '',
        dni: '',
        fechaNacimiento: '',
        direccion: '',
        telefono: '',
        email: '',
        apoderado: { idApoderado: '' },
        estado: true
    });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setLoading(true);

            const estudiantesRes = await estudianteService.getAll();

            if (estudiantesRes.success) {
                setEstudiantes(estudiantesRes.data || []);
            }

            if (canManage) {
                const apoderadosRes = await apoderadoService.getAll();

                if (apoderadosRes.success) {
                    setApoderados(apoderadosRes.data || []);
                }
            }
        } catch (error) {
            setAlert({
                type: 'error',
                message: error.response?.data?.message || 'Error al cargar datos'
            });
        } finally {
            setLoading(false);
        }
    };

    const getApoderadoNombre = (estudiante) => {
        if (estudiante.apoderado) {
            return `${estudiante.apoderado.nombres || ''} ${estudiante.apoderado.apellidos || ''}`.trim();
        }

        if (estudiante.apoderadoNombres || estudiante.apoderadoApellidos) {
            return `${estudiante.apoderadoNombres || ''} ${estudiante.apoderadoApellidos || ''}`.trim();
        }

        return 'No asignado';
    };

    const getApoderadoId = (estudiante) => {
        return estudiante.apoderado?.idApoderado || estudiante.idApoderado || '';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'apoderadoId') {
            setFormData({
                ...formData,
                apoderado: { idApoderado: parseInt(value) }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const consultarDniEstudiante = async () => {
        const dni = formData.dni.trim();

        if (!/^\d{8}$/.test(dni)) {
            setAlert({
                type: 'warning',
                message: 'Ingrese un DNI válido de 8 dígitos para consultar.'
            });
            return;
        }

        try {
            setConsultandoDni(true);

            const response = await consultaDniService.consultarDni(dni);

            if (response.success && response.data) {
                setFormData((prev) => ({
                    ...prev,
                    dni: response.data.dni || dni,
                    nombres: response.data.nombres || '',
                    apellidos: response.data.apellidos || ''
                }));

                setAlert({
                    type: 'success',
                    message: 'Datos del estudiante encontrados correctamente.'
                });
            } else {
                setAlert({
                    type: 'warning',
                    message: response.message || 'No se encontraron datos para el DNI ingresado.'
                });
            }
        } catch (error) {
            setAlert({
                type: 'error',
                message: error.response?.data?.message || 'No se pudo consultar el DNI.'
            });
        } finally {
            setConsultandoDni(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!canManage) {
            setAlert({
                type: 'error',
                message: 'No tienes permisos para modificar estudiantes'
            });
            return;
        }

        try {
            if (editing) {
                const response = await estudianteService.update(editing, formData);

                if (response.success) {
                    setAlert({
                        type: 'success',
                        message: 'Estudiante actualizado exitosamente'
                    });
                }
            } else {
                const response = await estudianteService.create(formData);

                if (response.success) {
                    setAlert({
                        type: 'success',
                        message: 'Estudiante creado exitosamente'
                    });
                }
            }

            setModalOpen(false);
            resetForm();
            cargarDatos();
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
                message: 'No tienes permisos para eliminar estudiantes'
            });
            return;
        }

        if (user?.rol !== 'ADMIN') {
            setAlert({
                type: 'error',
                message: 'Solo el administrador puede eliminar estudiantes'
            });
            return;
        }

        if (window.confirm('¿Estás seguro de eliminar este estudiante?')) {
            try {
                const response = await estudianteService.delete(id);

                if (response.success) {
                    setAlert({
                        type: 'success',
                        message: 'Estudiante eliminado exitosamente'
                    });
                    cargarDatos();
                }
            } catch (error) {
                setAlert({
                    type: 'error',
                    message: error.response?.data?.message || 'Error al eliminar'
                });
            }
        }
    };

    const handleEdit = (estudiante) => {
        if (!canManage) {
            setAlert({
                type: 'error',
                message: 'El docente solo puede visualizar estudiantes'
            });
            return;
        }

        setEditing(estudiante.idEstudiante);

        setFormData({
            codigo: estudiante.codigo || '',
            nombres: estudiante.nombres || '',
            apellidos: estudiante.apellidos || '',
            dni: estudiante.dni || '',
            fechaNacimiento: estudiante.fechaNacimiento || '',
            direccion: estudiante.direccion || '',
            telefono: estudiante.telefono || '',
            email: estudiante.email || '',
            apoderado: { idApoderado: getApoderadoId(estudiante) },
            estado: estudiante.estado ?? true
        });

        setModalOpen(true);
    };

    const resetForm = () => {
        setEditing(null);
        setFormData({
            codigo: '',
            nombres: '',
            apellidos: '',
            dni: '',
            fechaNacimiento: '',
            direccion: '',
            telefono: '',
            email: '',
            apoderado: { idApoderado: '' },
            estado: true
        });
    };

    const estudiantesFiltrados = estudiantes.filter((estudiante) => {
        const texto = busqueda.toLowerCase().trim();

        if (!texto) return true;

        const apoderado = getApoderadoNombre(estudiante).toLowerCase();
        const estadoTexto = estudiante.estado ? 'activo' : 'inactivo';

        return (
            estudiante.codigo?.toLowerCase().includes(texto) ||
            estudiante.nombres?.toLowerCase().includes(texto) ||
            estudiante.apellidos?.toLowerCase().includes(texto) ||
            estudiante.dni?.toLowerCase().includes(texto) ||
            estudiante.telefono?.toLowerCase().includes(texto) ||
            estudiante.email?.toLowerCase().includes(texto) ||
            estudiante.direccion?.toLowerCase().includes(texto) ||
            apoderado.includes(texto) ||
            estadoTexto.includes(texto)
        );
    });

    const totalActivos = estudiantes.filter(e => e.estado).length;
    const totalInactivos = estudiantes.filter(e => !e.estado).length;

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
                                Estudiantes
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                {canManage
                                    ? 'Administra la información académica y personal de los estudiantes.'
                                    : 'Consulta la información de estudiantes registrados en el sistema.'}
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
                                <span>Nuevo Estudiante</span>
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
                    <p className="text-sm text-slate-500">Total estudiantes</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{estudiantes.length}</p>
                </div>

                <div className="bg-green-50 rounded-2xl shadow-sm border border-green-100 p-5">
                    <p className="text-sm text-green-700">Estudiantes activos</p>
                    <p className="text-3xl font-black text-green-700 mt-1">{totalActivos}</p>
                </div>

                <div className="bg-red-50 rounded-2xl shadow-sm border border-red-100 p-5">
                    <p className="text-sm text-red-700">Estudiantes inactivos</p>
                    <p className="text-3xl font-black text-red-700 mt-1">{totalInactivos}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                    Buscar estudiante
                </label>

                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        🔍
                    </span>

                    <input
                        type="text"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar por código, nombre, apellido, DNI, apoderado, teléfono, email o estado..."
                        className="w-full border border-slate-300 rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                    />
                </div>

                <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-slate-500">
                        Resultados encontrados: {estudiantesFiltrados.length}
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
                            Listado de estudiantes
                        </h2>
                        <p className="text-sm text-slate-500">
                            Información académica registrada y vinculada con sus apoderados.
                        </p>
                    </div>
                </div>

                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Código</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Nombres</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Apellidos</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">DNI</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Apoderado</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Estado</th>
                            {canManage && (
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Acciones</th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-slate-100">
                        {estudiantesFiltrados.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={canManage ? 7 : 6}
                                    className="px-6 py-12 text-center text-slate-500"
                                >
                                    {busqueda
                                        ? 'No se encontraron estudiantes con ese criterio de búsqueda.'
                                        : 'No hay estudiantes registrados.'}
                                </td>
                            </tr>
                        ) : (
                            estudiantesFiltrados.map((estudiante) => (
                                <tr key={estudiante.idEstudiante} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{estudiante.codigo}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700">{estudiante.nombres}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700">{estudiante.apellidos}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700">{estudiante.dni}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        {getApoderadoNombre(estudiante)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${
                                                estudiante.estado
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {estudiante.estado ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>

                                    {canManage && (
                                        <td className="px-6 py-4 text-sm font-medium">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(estudiante)}
                                                    className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition"
                                                >
                                                    Editar
                                                </button>

                                                {user?.rol === 'ADMIN' && (
                                                    <button
                                                        onClick={() => handleDelete(estudiante.idEstudiante)}
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
                    title={editing ? 'Editar Estudiante' : 'Nuevo Estudiante'}
                    size="lg"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                            <h3 className="text-lg font-black text-slate-800 mb-1">
                                Datos del Estudiante
                            </h3>
                            <p className="text-sm text-slate-500 mb-4">
                                Complete la información personal y académica del estudiante.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Código *</label>
                                    <input
                                        type="text"
                                        name="codigo"
                                        value={formData.codigo}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">DNI *</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            name="dni"
                                            value={formData.dni}
                                            onChange={handleInputChange}
                                            required
                                            maxLength="8"
                                            pattern="[0-9]{8}"
                                            title="El DNI debe tener 8 dígitos"
                                            className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={consultarDniEstudiante}
                                            disabled={consultandoDni}
                                            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold disabled:opacity-60 whitespace-nowrap"
                                        >
                                            {consultandoDni ? 'Buscando...' : 'Buscar DNI'}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Nombres *</label>
                                    <input
                                        type="text"
                                        name="nombres"
                                        value={formData.nombres}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Apellidos *</label>
                                    <input
                                        type="text"
                                        name="apellidos"
                                        value={formData.apellidos}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Fecha Nacimiento *</label>
                                    <input
                                        type="date"
                                        name="fechaNacimiento"
                                        value={formData.fechaNacimiento}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Apoderado *</label>
                                    <select
                                        name="apoderadoId"
                                        value={formData.apoderado.idApoderado}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Seleccionar apoderado</option>
                                        {apoderados.map(ap => (
                                            <option key={ap.idApoderado} value={ap.idApoderado}>
                                                {ap.nombres} {ap.apellidos} - {ap.dni}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Teléfono</label>
                                    <input
                                        type="text"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleInputChange}
                                        maxLength="15"
                                        className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Dirección</label>
                                    <textarea
                                        name="direccion"
                                        value={formData.direccion}
                                        onChange={handleInputChange}
                                        rows="2"
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

export default Estudiantes;