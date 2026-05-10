import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { asistenciaService } from '../api/asistenciaService';
import { matriculaService } from '../api/matriculaService';
import { cursoService } from '../api/cursoService';
import { gradoSeccionService } from '../api/gradoSeccionService';

const Asistencias = () => {
    const [asistencias, setAsistencias] = useState([]);
    const [matriculas, setMatriculas] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [grados, setGrados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [alert, setAlert] = useState(null);
    const [filtroGrado, setFiltroGrado] = useState('');
    const [filtroFecha, setFiltroFecha] = useState(new Date().toISOString().split('T')[0]);
    const [busqueda, setBusqueda] = useState('');

    const [formData, setFormData] = useState({
        matricula: { idMatricula: '' },
        curso: { idCurso: '' },
        fecha: new Date().toISOString().split('T')[0],
        estado: 'Presente',
        observacion: ''
    });

    const estadosAsistencia = ['Presente', 'Tarde', 'Falta', 'Justificado'];

    const estadoColors = {
        Presente: 'bg-green-100 text-green-700',
        Tarde: 'bg-yellow-100 text-yellow-700',
        Falta: 'bg-red-100 text-red-700',
        Justificado: 'bg-blue-100 text-blue-700'
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setLoading(true);

            const [asistenciasRes, matriculasRes, cursosRes, gradosRes] = await Promise.all([
                asistenciaService.getAll(),
                matriculaService.getAll(),
                cursoService.getAll(),
                gradoSeccionService.getAll()
            ]);

            if (asistenciasRes.success) setAsistencias(asistenciasRes.data || []);
            if (matriculasRes.success) setMatriculas(matriculasRes.data || []);
            if (cursosRes.success) setCursos(cursosRes.data || []);
            if (gradosRes.success) setGrados(gradosRes.data || []);
        } catch (error) {
            setAlert({
                type: 'error',
                message: error.response?.data?.message || 'Error al cargar datos'
            });
        } finally {
            setLoading(false);
        }
    };

    const getEstudianteNombre = (asistencia) => {
        return `${asistencia.matricula?.estudiante?.nombres || ''} ${asistencia.matricula?.estudiante?.apellidos || ''}`.trim();
    };

    const getGradoTexto = (asistencia) => {
        return `${asistencia.matricula?.gradoSeccion?.grado || ''} ${asistencia.matricula?.gradoSeccion?.seccion || ''}`.trim();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'matriculaId') {
            setFormData({ ...formData, matricula: { idMatricula: parseInt(value) } });
        } else if (name === 'cursoId') {
            setFormData({ ...formData, curso: { idCurso: parseInt(value) } });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = editing
                ? await asistenciaService.update(editing, formData)
                : await asistenciaService.create(formData);

            if (response.success) {
                setAlert({
                    type: 'success',
                    message: editing
                        ? 'Asistencia actualizada exitosamente'
                        : 'Asistencia registrada exitosamente'
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

    const handleRegistroMasivo = async () => {
        if (!filtroGrado || !filtroFecha) {
            setAlert({
                type: 'warning',
                message: 'Seleccione un grado y una fecha para el registro masivo'
            });
            return;
        }

        const matriculasFiltradas = matriculas.filter(m =>
            m.gradoSeccion?.idGradoSeccion === parseInt(filtroGrado) &&
            m.estado === 'Activa'
        );

        if (matriculasFiltradas.length === 0) {
            setAlert({
                type: 'warning',
                message: 'No hay estudiantes activos en este grado'
            });
            return;
        }

        const asistenciasBatch = [];

        for (const matricula of matriculasFiltradas) {
            for (const curso of cursos) {
                asistenciasBatch.push({
                    matricula: { idMatricula: matricula.idMatricula },
                    curso: { idCurso: curso.idCurso },
                    fecha: filtroFecha,
                    estado: 'Presente',
                    observacion: 'Registro masivo'
                });
            }
        }

        try {
            const response = await asistenciaService.createBatch(asistenciasBatch);

            if (response.success) {
                setAlert({
                    type: 'success',
                    message: `Se registraron ${asistenciasBatch.length} asistencias masivamente`
                });

                cargarDatos();
            }
        } catch (error) {
            setAlert({
                type: 'error',
                message: error.response?.data?.message || 'Error al registrar asistencias masivas'
            });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar esta asistencia?')) return;

        try {
            const response = await asistenciaService.delete(id);

            if (response.success) {
                setAlert({
                    type: 'success',
                    message: 'Asistencia eliminada exitosamente'
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

    const handleEdit = (asistencia) => {
        setEditing(asistencia.idAsistencia);

        setFormData({
            matricula: { idMatricula: asistencia.matricula?.idMatricula || '' },
            curso: { idCurso: asistencia.curso?.idCurso || '' },
            fecha: asistencia.fecha || new Date().toISOString().split('T')[0],
            estado: asistencia.estado || 'Presente',
            observacion: asistencia.observacion || ''
        });

        setModalOpen(true);
    };

    const resetForm = () => {
        setEditing(null);
        setFormData({
            matricula: { idMatricula: '' },
            curso: { idCurso: '' },
            fecha: new Date().toISOString().split('T')[0],
            estado: 'Presente',
            observacion: ''
        });
    };

    const asistenciasFiltradas = asistencias.filter(a => {
        if (filtroGrado && a.matricula?.gradoSeccion?.idGradoSeccion !== parseInt(filtroGrado)) {
            return false;
        }

        if (filtroFecha && a.fecha !== filtroFecha) {
            return false;
        }

        const texto = busqueda.toLowerCase().trim();

        if (!texto) return true;

        const estudiante = getEstudianteNombre(a).toLowerCase();
        const codigo = a.matricula?.estudiante?.codigo?.toLowerCase() || '';
        const dni = a.matricula?.estudiante?.dni?.toLowerCase() || '';
        const grado = getGradoTexto(a).toLowerCase();
        const curso = a.curso?.nombre?.toLowerCase() || '';
        const fecha = a.fecha?.toLowerCase() || '';
        const estado = a.estado?.toLowerCase() || '';
        const observacion = a.observacion?.toLowerCase() || '';

        return (
            estudiante.includes(texto) ||
            codigo.includes(texto) ||
            dni.includes(texto) ||
            grado.includes(texto) ||
            curso.includes(texto) ||
            fecha.includes(texto) ||
            estado.includes(texto) ||
            observacion.includes(texto)
        );
    });

    const totalPresente = asistencias.filter(a => a.estado === 'Presente').length;
    const totalTarde = asistencias.filter(a => a.estado === 'Tarde').length;
    const totalFaltas = asistencias.filter(a => a.estado === 'Falta').length;

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
                                Asistencias
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Registra y consulta la asistencia de los estudiantes por curso, grado y fecha.
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
                            <span>Registrar Asistencia</span>
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                    <p className="text-sm text-slate-500">Total registros</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{asistencias.length}</p>
                </div>

                <div className="bg-green-50 rounded-2xl shadow-sm border border-green-100 p-5">
                    <p className="text-sm text-green-700">Presentes</p>
                    <p className="text-3xl font-black text-green-700 mt-1">{totalPresente}</p>
                </div>

                <div className="bg-yellow-50 rounded-2xl shadow-sm border border-yellow-100 p-5">
                    <p className="text-sm text-yellow-700">Tardanzas</p>
                    <p className="text-3xl font-black text-yellow-700 mt-1">{totalTarde}</p>
                </div>

                <div className="bg-red-50 rounded-2xl shadow-sm border border-red-100 p-5">
                    <p className="text-sm text-red-700">Faltas</p>
                    <p className="text-3xl font-black text-red-700 mt-1">{totalFaltas}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">
                            Filtrar por Grado
                        </label>

                        <select
                            value={filtroGrado}
                            onChange={(e) => setFiltroGrado(e.target.value)}
                            className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todos los grados</option>
                            {grados.map(g => (
                                <option key={g.idGradoSeccion} value={g.idGradoSeccion}>
                                    {g.grado} - {g.seccion} ({g.nivel})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">
                            Filtrar por Fecha
                        </label>

                        <input
                            type="date"
                            value={filtroFecha}
                            onChange={(e) => setFiltroFecha(e.target.value)}
                            className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={handleRegistroMasivo}
                            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-bold transition"
                        >
                            Registrar Asistencia Masiva
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                    Buscar asistencia
                </label>

                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        🔍
                    </span>

                    <input
                        type="text"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar por Estudiante, Código, DNI, Grado, Curso, Fecha, Estado u Observación..."
                        className="w-full border border-slate-300 rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                    />
                </div>

                <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-slate-500">
                        Resultados encontrados: {asistenciasFiltradas.length}
                    </p>

                    {(busqueda || filtroGrado || filtroFecha) && (
                        <button
                            onClick={() => {
                                setBusqueda('');
                                setFiltroGrado('');
                                setFiltroFecha('');
                            }}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                        >
                            Limpiar filtros
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-black text-slate-800">
                            Registro de asistencias
                        </h2>
                        <p className="text-sm text-slate-500">
                            Control de asistencia por estudiante, curso y fecha.
                        </p>
                    </div>
                </div>

                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">
                                Estudiante
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">
                                Curso
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">
                                Fecha
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">
                                Estado
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">
                                Observación
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">
                                Acciones
                            </th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-slate-100">
                        {asistenciasFiltradas.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                    {busqueda || filtroGrado || filtroFecha
                                        ? 'No se encontraron asistencias con los filtros aplicados.'
                                        : 'No hay asistencias registradas.'}
                                </td>
                            </tr>
                        ) : (
                            asistenciasFiltradas.map((asistencia) => (
                                <tr key={asistencia.idAsistencia} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        <span className="font-bold text-slate-900">
                                            {getEstudianteNombre(asistencia)}
                                        </span>
                                        <div className="text-xs text-slate-500">
                                            Código: {asistencia.matricula?.estudiante?.codigo || '-'}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            Grado: {asistencia.matricula?.gradoSeccion?.grado} {asistencia.matricula?.gradoSeccion?.seccion}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        {asistencia.curso?.nombre || '-'}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        {asistencia.fecha}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${estadoColors[asistencia.estado]}`}>
                                            {asistencia.estado}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                                        {asistencia.observacion || '-'}
                                    </td>

                                    <td className="px-6 py-4 text-sm font-medium">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(asistencia)}
                                                className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition"
                                            >
                                                Editar
                                            </button>

                                            <button
                                                onClick={() => handleDelete(asistencia.idAsistencia)}
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
                title={editing ? 'Editar Asistencia' : 'Registrar Asistencia'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                        <h3 className="text-lg font-black text-slate-800 mb-1">
                            Datos de la Asistencia
                        </h3>
                        <p className="text-sm text-slate-500 mb-4">
                            Seleccione estudiante, curso, fecha y estado de asistencia.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">
                                    Estudiante *
                                </label>

                                <select
                                    name="matriculaId"
                                    value={formData.matricula.idMatricula}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Seleccionar estudiante</option>
                                    {matriculas.map(m => (
                                        <option key={m.idMatricula} value={m.idMatricula}>
                                            {m.estudiante?.nombres} {m.estudiante?.apellidos} - {m.gradoSeccion?.grado} {m.gradoSeccion?.seccion}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">
                                    Curso *
                                </label>

                                <select
                                    name="cursoId"
                                    value={formData.curso.idCurso}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Seleccionar curso</option>
                                    {cursos.map(c => (
                                        <option key={c.idCurso} value={c.idCurso}>{c.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">
                                    Fecha *
                                </label>

                                <input
                                    type="date"
                                    name="fecha"
                                    value={formData.fecha}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">
                                    Estado *
                                </label>

                                <select
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {estadosAsistencia.map(e => (
                                        <option key={e} value={e}>{e}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-slate-700 mb-1">
                                    Observación
                                </label>

                                <textarea
                                    name="observacion"
                                    value={formData.observacion}
                                    onChange={handleInputChange}
                                    rows="2"
                                    className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Observaciones sobre la asistencia..."
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
        </>
    );
};

export default Asistencias;