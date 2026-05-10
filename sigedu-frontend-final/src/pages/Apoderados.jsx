import React, { useEffect, useState } from 'react';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { apoderadoService } from '../api/apoderadoService';
import { consultaDniService } from '../api/consultaDniService';

const emptyForm = {
    apoderado: {
        nombres: '',
        apellidos: '',
        dni: '',
        telefono: '',
        email: '',
        parentesco: '',
        direccion: '',
        estado: true
    },
    estudiante: {
        codigo: '',
        nombres: '',
        apellidos: '',
        dni: '',
        fechaNacimiento: '',
        direccion: '',
        telefono: '',
        email: '',
        estado: true
    }
};

const Apoderados = () => {
    const [apoderados, setApoderados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [alert, setAlert] = useState(null);
    const [registrarHijo, setRegistrarHijo] = useState(true);
    const [formData, setFormData] = useState(emptyForm);
    const [busqueda, setBusqueda] = useState('');
    const [consultandoDniApoderado, setConsultandoDniApoderado] = useState(false);
    const [consultandoDniEstudiante, setConsultandoDniEstudiante] = useState(false);

    useEffect(() => {
        cargarApoderados();
    }, []);

    const cargarApoderados = async () => {
        try {
            setLoading(true);
            const response = await apoderadoService.getAll();

            if (response.success) {
                setApoderados(response.data || []);
            }
        } catch (error) {
            setAlert({
                type: 'error',
                message: error.response?.data?.message || 'Error al cargar apoderados'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleApoderadoChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            apoderado: {
                ...formData.apoderado,
                [name]: value
            }
        });
    };

    const handleEstudianteChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            estudiante: {
                ...formData.estudiante,
                [name]: value
            }
        });
    };

    const consultarDniApoderado = async () => {
        const dni = formData.apoderado.dni.trim();

        if (!/^\d{8}$/.test(dni)) {
            setAlert({
                type: 'warning',
                message: 'Ingrese un DNI válido de 8 dígitos para consultar.'
            });
            return;
        }

        try {
            setConsultandoDniApoderado(true);

            const response = await consultaDniService.consultarDni(dni);

            if (response.success && response.data) {
                setFormData((prev) => ({
                    ...prev,
                    apoderado: {
                        ...prev.apoderado,
                        dni: response.data.dni || dni,
                        nombres: response.data.nombres || '',
                        apellidos: response.data.apellidos || ''
                    }
                }));

                setAlert({
                    type: 'success',
                    message: 'Datos del apoderado encontrados correctamente.'
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
                message: error.response?.data?.message || 'No se pudo consultar el DNI del apoderado.'
            });
        } finally {
            setConsultandoDniApoderado(false);
        }
    };

    const consultarDniEstudiante = async () => {
        const dni = formData.estudiante.dni.trim();

        if (!/^\d{8}$/.test(dni)) {
            setAlert({
                type: 'warning',
                message: 'Ingrese un DNI válido de 8 dígitos para consultar.'
            });
            return;
        }

        try {
            setConsultandoDniEstudiante(true);

            const response = await consultaDniService.consultarDni(dni);

            if (response.success && response.data) {
                setFormData((prev) => ({
                    ...prev,
                    estudiante: {
                        ...prev.estudiante,
                        dni: response.data.dni || dni,
                        nombres: response.data.nombres || '',
                        apellidos: response.data.apellidos || ''
                    }
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
                message: error.response?.data?.message || 'No se pudo consultar el DNI del estudiante.'
            });
        } finally {
            setConsultandoDniEstudiante(false);
        }
    };

    const resetForm = () => {
        setEditing(null);
        setRegistrarHijo(true);
        setFormData(emptyForm);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const apoderadoPayload = {
                ...formData.apoderado,
                dni: formData.apoderado.dni.trim(),
                telefono: formData.apoderado.telefono.trim(),
                email: formData.apoderado.email.trim()
            };

            let response;

            if (editing) {
                response = await apoderadoService.update(editing, apoderadoPayload);
            } else if (registrarHijo) {
                const payload = {
                    apoderado: apoderadoPayload,
                    estudiante: {
                        ...formData.estudiante,
                        dni: formData.estudiante.dni.trim(),
                        telefono: formData.estudiante.telefono.trim(),
                        email: formData.estudiante.email.trim()
                    }
                };

                response = await apoderadoService.createConEstudiante(payload);
            } else {
                response = await apoderadoService.create(apoderadoPayload);
            }

            if (response.success) {
                setAlert({
                    type: 'success',
                    message: editing
                        ? 'Apoderado actualizado correctamente'
                        : registrarHijo
                            ? 'Apoderado y estudiante registrados correctamente'
                            : 'Apoderado registrado correctamente'
                });

                setModalOpen(false);
                resetForm();
                cargarApoderados();
            }
        } catch (error) {
            setAlert({
                type: 'error',
                message: error.response?.data?.message || 'Error al guardar apoderado'
            });
        }
    };

    const handleEdit = (apoderado) => {
        setEditing(apoderado.idApoderado);
        setRegistrarHijo(false);

        setFormData({
            ...emptyForm,
            apoderado: {
                nombres: apoderado.nombres || '',
                apellidos: apoderado.apellidos || '',
                dni: apoderado.dni || '',
                telefono: apoderado.telefono || '',
                email: apoderado.email || '',
                parentesco: apoderado.parentesco || '',
                direccion: apoderado.direccion || '',
                estado: apoderado.estado ?? true
            }
        });

        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este apoderado?')) return;

        try {
            const response = await apoderadoService.delete(id);

            if (response.success) {
                setAlert({ type: 'success', message: 'Apoderado eliminado correctamente' });
                cargarApoderados();
            }
        } catch (error) {
            setAlert({
                type: 'error',
                message: error.response?.data?.message || 'Error al eliminar apoderado'
            });
        }
    };

    const handleReactivar = async (id) => {
        try {
            const response = await apoderadoService.reactivar(id);

            if (response.success) {
                setAlert({ type: 'success', message: 'Apoderado reactivado correctamente' });
                cargarApoderados();
            }
        } catch (error) {
            setAlert({
                type: 'error',
                message: error.response?.data?.message || 'Error al reactivar apoderado'
            });
        }
    };

    const apoderadosFiltrados = apoderados.filter((apoderado) => {
        const texto = busqueda.toLowerCase().trim();

        if (!texto) return true;

        return (
            apoderado.nombres?.toLowerCase().includes(texto) ||
            apoderado.apellidos?.toLowerCase().includes(texto) ||
            apoderado.dni?.toLowerCase().includes(texto) ||
            apoderado.telefono?.toLowerCase().includes(texto) ||
            apoderado.email?.toLowerCase().includes(texto) ||
            apoderado.parentesco?.toLowerCase().includes(texto) ||
            apoderado.direccion?.toLowerCase().includes(texto)
        );
    });

    const totalActivos = apoderados.filter(a => a.estado).length;
    const totalInactivos = apoderados.filter(a => !a.estado).length;

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
                                Gestión administrativa
                            </p>
                            <h1 className="text-3xl font-black text-slate-900">
                                Apoderados
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Registra apoderados y si corresponde, vincula al estudiante en el mismo proceso.
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
                            <span>Nuevo Apoderado</span>
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
                    <p className="text-sm text-slate-500">Total apoderados</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{apoderados.length}</p>
                </div>

                <div className="bg-green-50 rounded-2xl shadow-sm border border-green-100 p-5">
                    <p className="text-sm text-green-700">Apoderados activos</p>
                    <p className="text-3xl font-black text-green-700 mt-1">{totalActivos}</p>
                </div>

                <div className="bg-red-50 rounded-2xl shadow-sm border border-red-100 p-5">
                    <p className="text-sm text-red-700">Apoderados inactivos</p>
                    <p className="text-3xl font-black text-red-700 mt-1">{totalInactivos}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                    Buscar apoderado
                </label>

                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        🔍
                    </span>

                    <input
                        type="text"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar por nombre, apellido, DNI, teléfono, email, parentesco o dirección..."
                        className="w-full border border-slate-300 rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                    />
                </div>

                <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-slate-500">
                        Resultados encontrados: {apoderadosFiltrados.length}
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
                            Listado de apoderados
                        </h2>
                        <p className="text-sm text-slate-500">
                            Información registrada de padres, madres o tutores.
                        </p>
                    </div>
                </div>

                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Nombres</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Apellidos</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">DNI</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Teléfono</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Parentesco</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Estado</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Acciones</th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-slate-100">
                        {apoderadosFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                                    {busqueda
                                        ? 'No se encontraron apoderados con ese criterio de búsqueda.'
                                        : 'No hay apoderados registrados. Presiona “Nuevo Apoderado”.'}
                                </td>
                            </tr>
                        ) : (
                            apoderadosFiltrados.map((apoderado) => (
                                <tr key={apoderado.idApoderado} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{apoderado.nombres}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700">{apoderado.apellidos}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700">{apoderado.dni}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700">{apoderado.telefono || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700">{apoderado.parentesco}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${
                                                apoderado.estado
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {apoderado.estado ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(apoderado)}
                                                className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition"
                                            >
                                                Editar
                                            </button>

                                            {apoderado.estado ? (
                                                <button
                                                    onClick={() => handleDelete(apoderado.idApoderado)}
                                                    className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 font-semibold transition"
                                                >
                                                    Eliminar
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleReactivar(apoderado.idApoderado)}
                                                    className="px-3 py-1.5 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 font-semibold transition"
                                                >
                                                    Reactivar
                                                </button>
                                            )}
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
                title={editing ? 'Editar Apoderado' : 'Nuevo Apoderado'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                        <h3 className="text-lg font-black text-slate-800 mb-1">Datos del Apoderado</h3>
                        <p className="text-sm text-slate-500 mb-4">
                            Complete la información principal del padre, madre o tutor.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Nombres *</label>
                                <input
                                    type="text"
                                    name="nombres"
                                    value={formData.apoderado.nombres}
                                    onChange={handleApoderadoChange}
                                    required
                                    className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Apellidos *</label>
                                <input
                                    type="text"
                                    name="apellidos"
                                    value={formData.apoderado.apellidos}
                                    onChange={handleApoderadoChange}
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
                                        value={formData.apoderado.dni}
                                        onChange={handleApoderadoChange}
                                        required
                                        maxLength="8"
                                        pattern="[0-9]{8}"
                                        title="El DNI debe tener 8 dígitos"
                                        className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={consultarDniApoderado}
                                        disabled={consultandoDniApoderado}
                                        className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold disabled:opacity-60 whitespace-nowrap"
                                    >
                                        {consultandoDniApoderado ? 'Buscando...' : 'Buscar DNI'}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Teléfono</label>
                                <input
                                    type="text"
                                    name="telefono"
                                    value={formData.apoderado.telefono}
                                    onChange={handleApoderadoChange}
                                    maxLength="15"
                                    className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.apoderado.email}
                                    onChange={handleApoderadoChange}
                                    className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Parentesco *</label>
                                <select
                                    name="parentesco"
                                    value={formData.apoderado.parentesco}
                                    onChange={handleApoderadoChange}
                                    required
                                    className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Seleccionar parentesco</option>
                                    <option value="Padre">Padre</option>
                                    <option value="Madre">Madre</option>
                                    <option value="Tutor">Tutor</option>
                                    <option value="Hermano(a)">Hermano(a)</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-slate-700 mb-1">Dirección</label>
                                <textarea
                                    name="direccion"
                                    value={formData.apoderado.direccion}
                                    onChange={handleApoderadoChange}
                                    rows="2"
                                    className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {!editing && (
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-black text-slate-800">Datos del Estudiante</h3>
                                    <p className="text-sm text-slate-500">
                                        Al guardar, el estudiante quedará vinculado automáticamente al apoderado.
                                    </p>
                                </div>

                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-white px-3 py-2 rounded-xl border">
                                    <input
                                        type="checkbox"
                                        checked={registrarHijo}
                                        onChange={(e) => setRegistrarHijo(e.target.checked)}
                                    />
                                    Registrar hijo
                                </label>
                            </div>

                            {registrarHijo && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Código *</label>
                                        <input
                                            type="text"
                                            name="codigo"
                                            value={formData.estudiante.codigo}
                                            onChange={handleEstudianteChange}
                                            required={registrarHijo}
                                            className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">DNI *</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                name="dni"
                                                value={formData.estudiante.dni}
                                                onChange={handleEstudianteChange}
                                                required={registrarHijo}
                                                maxLength="8"
                                                pattern="[0-9]{8}"
                                                title="El DNI debe tener 8 dígitos"
                                                className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={consultarDniEstudiante}
                                                disabled={consultandoDniEstudiante}
                                                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold disabled:opacity-60 whitespace-nowrap"
                                            >
                                                {consultandoDniEstudiante ? 'Buscando...' : 'Buscar DNI'}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Nombres *</label>
                                        <input
                                            type="text"
                                            name="nombres"
                                            value={formData.estudiante.nombres}
                                            onChange={handleEstudianteChange}
                                            required={registrarHijo}
                                            className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Apellidos *</label>
                                        <input
                                            type="text"
                                            name="apellidos"
                                            value={formData.estudiante.apellidos}
                                            onChange={handleEstudianteChange}
                                            required={registrarHijo}
                                            className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Fecha de nacimiento *</label>
                                        <input
                                            type="date"
                                            name="fechaNacimiento"
                                            value={formData.estudiante.fechaNacimiento}
                                            onChange={handleEstudianteChange}
                                            required={registrarHijo}
                                            className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Teléfono</label>
                                        <input
                                            type="text"
                                            name="telefono"
                                            value={formData.estudiante.telefono}
                                            onChange={handleEstudianteChange}
                                            maxLength="15"
                                            className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.estudiante.email}
                                            onChange={handleEstudianteChange}
                                            className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Dirección</label>
                                        <textarea
                                            name="direccion"
                                            value={formData.estudiante.direccion}
                                            onChange={handleEstudianteChange}
                                            rows="2"
                                            className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

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

export default Apoderados;