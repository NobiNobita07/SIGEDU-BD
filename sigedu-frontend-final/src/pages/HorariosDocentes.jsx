import React, { useEffect, useState } from 'react';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { horarioDocenteService } from '../api/horarioDocenteService';
import { docenteService } from '../api/docenteService';
import { cursoService } from '../api/cursoService';
import { gradoSeccionService } from '../api/gradoSeccionService';
import { periodoAcademicoService } from '../api/periodoAcademicoService';
import { docenteCursoService } from '../api/docenteCursoService';
import { useAuth } from '../context/AuthContext';

const HorariosDocentes = () => {
    const { user } = useAuth();

    const canManage = user?.rol === 'ADMIN' || user?.rol === 'SECRETARIA';

    const [horarios, setHorarios] = useState([]);
    const [docentes, setDocentes] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [docenteCursos, setDocenteCursos] = useState([]);
    const [cursosFiltrados, setCursosFiltrados] = useState([]);
    const [grados, setGrados] = useState([]);
    const [periodos, setPeriodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [alert, setAlert] = useState(null);
    const [formError, setFormError] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [filtroDia, setFiltroDia] = useState('');

    const [formData, setFormData] = useState({
        docente: { idDocente: '' },
        curso: { idCurso: '' },
        gradoSeccion: { idGradoSeccion: '' },
        periodoAcademico: { idPeriodoAcademico: '' },
        diaSemana: 'Lunes',
        horaInicio: '08:00',
        horaFin: '10:00',
        aula: '',
        estado: true
    });

    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setLoading(true);

            const [
                horariosRes,
                docentesRes,
                cursosRes,
                gradosRes,
                periodosRes,
                docenteCursosRes
            ] = await Promise.all([
                horarioDocenteService.getAll(),
                docenteService.getAll(),
                cursoService.getAll(),
                gradoSeccionService.getAll(),
                periodoAcademicoService.getAll(),
                docenteCursoService.getAll()
            ]);

            if (horariosRes.success) setHorarios(horariosRes.data || []);
            if (docentesRes.success) setDocentes(docentesRes.data || []);
            if (cursosRes.success) setCursos(cursosRes.data || []);
            if (gradosRes.success) setGrados(gradosRes.data || []);
            if (periodosRes.success) setPeriodos(periodosRes.data || []);
            if (docenteCursosRes.success) setDocenteCursos(docenteCursosRes.data || []);
        } catch (error) {
            setAlert({
                type: 'error',
                message: error.response?.data?.message || 'Error al cargar horarios'
            });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEditing(null);
        setFormError('');
        setCursosFiltrados([]);
        setFormData({
            docente: { idDocente: '' },
            curso: { idCurso: '' },
            gradoSeccion: { idGradoSeccion: '' },
            periodoAcademico: { idPeriodoAcademico: '' },
            diaSemana: 'Lunes',
            horaInicio: '08:00',
            horaFin: '10:00',
            aula: '',
            estado: true
        });
    };

    const getDocenteNombre = (horario) => {
        return `${horario.docente?.nombres || ''} ${horario.docente?.apellidos || ''}`.trim();
    };

    const getGradoTexto = (horario) => {
        return `${horario.gradoSeccion?.grado || ''} ${horario.gradoSeccion?.seccion || ''} (${horario.gradoSeccion?.nivel || ''})`;
    };

    const normalizarHora = (hora) => {
        if (!hora) return '';
        return hora.substring(0, 5);
    };

    const obtenerIdDocenteCurso = (dc) => {
        return dc.docente?.idDocente || dc.idDocente || dc.docenteId || '';
    };

    const obtenerCursoDeAsignacion = (dc) => {
        return dc.curso || {
            idCurso: dc.idCurso,
            nombre: dc.nombreCurso || dc.cursoNombre || 'Curso asignado'
        };
    };

    const obtenerCursosPorDocente = (idDocenteSeleccionado) => {
        const idDocente = parseInt(idDocenteSeleccionado);

        if (!idDocente) return [];

        const asignaciones = docenteCursos.filter((dc) => {
            const id = obtenerIdDocenteCurso(dc);
            return parseInt(id) === idDocente;
        });

        const cursosAsignados = asignaciones
            .map(obtenerCursoDeAsignacion)
            .filter((curso) => curso && curso.idCurso);

        const cursosUnicos = cursosAsignados.filter((curso, index, array) =>
            array.findIndex(c => c.idCurso === curso.idCurso) === index
        );

        return cursosUnicos;
    };

    const aplicarCursosPorDocente = (idDocenteSeleccionado) => {
        const cursosDelDocente = obtenerCursosPorDocente(idDocenteSeleccionado);

        setCursosFiltrados(cursosDelDocente);

        setFormData((prev) => ({
            ...prev,
            curso: { idCurso: '' }
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'docenteId') {
            setFormError('');

            setFormData((prev) => ({
                ...prev,
                docente: { idDocente: value ? parseInt(value) : '' },
                curso: { idCurso: '' }
            }));

            aplicarCursosPorDocente(value);
        } else if (name === 'cursoId') {
            setFormData({
                ...formData,
                curso: { idCurso: value ? parseInt(value) : '' }
            });
        } else if (name === 'gradoSeccionId') {
            setFormData({
                ...formData,
                gradoSeccion: { idGradoSeccion: value ? parseInt(value) : '' }
            });
        } else if (name === 'periodoAcademicoId') {
            setFormData({
                ...formData,
                periodoAcademico: { idPeriodoAcademico: value ? parseInt(value) : '' }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!canManage) {
            setFormError('No tienes permisos para registrar o modificar horarios.');
            return;
        }

        if (!formData.docente.idDocente) {
            setFormError('Debe seleccionar un docente.');
            return;
        }

        if (!formData.curso.idCurso) {
            setFormError('Debe seleccionar un curso asignado al docente.');
            return;
        }

        if (formData.horaInicio >= formData.horaFin) {
            setFormError('La hora de inicio debe ser menor que la hora de fin.');
            return;
        }

        try {
            setFormError('');

            const response = editing
                ? await horarioDocenteService.update(editing, formData)
                : await horarioDocenteService.create(formData);

            if (response.success) {
                setAlert({
                    type: 'success',
                    message: editing
                        ? 'Horario actualizado correctamente'
                        : 'Horario registrado correctamente'
                });

                setModalOpen(false);
                resetForm();
                cargarDatos();
            }
        } catch (error) {
            setFormError(error.response?.data?.message || 'Error al guardar horario');
        }
    };

    const handleEdit = (horario) => {
        if (!canManage) {
            setAlert({
                type: 'error',
                message: 'El docente solo puede visualizar horarios.'
            });
            return;
        }

        const idDocente = horario.docente?.idDocente || '';
        const cursosDelDocente = obtenerCursosPorDocente(idDocente);

        setCursosFiltrados(cursosDelDocente);
        setEditing(horario.idHorarioDocente);
        setFormError('');

        setFormData({
            docente: { idDocente },
            curso: { idCurso: horario.curso?.idCurso || '' },
            gradoSeccion: { idGradoSeccion: horario.gradoSeccion?.idGradoSeccion || '' },
            periodoAcademico: { idPeriodoAcademico: horario.periodoAcademico?.idPeriodoAcademico || '' },
            diaSemana: horario.diaSemana || 'Lunes',
            horaInicio: normalizarHora(horario.horaInicio),
            horaFin: normalizarHora(horario.horaFin),
            aula: horario.aula || '',
            estado: horario.estado ?? true
        });

        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!canManage) {
            setAlert({
                type: 'error',
                message: 'No tienes permisos para eliminar horarios.'
            });
            return;
        }

        if (user?.rol !== 'ADMIN') {
            setAlert({
                type: 'error',
                message: 'Solo el administrador puede eliminar horarios.'
            });
            return;
        }

        if (!window.confirm('¿Estás seguro de eliminar este horario?')) return;

        try {
            const response = await horarioDocenteService.delete(id);

            if (response.success) {
                setAlert({
                    type: 'success',
                    message: 'Horario eliminado correctamente'
                });

                cargarDatos();
            }
        } catch (error) {
            setAlert({
                type: 'error',
                message: error.response?.data?.message || 'Error al eliminar horario'
            });
        }
    };

    const handleReactivar = async (id) => {
        try {
            const response = await horarioDocenteService.reactivar(id);

            if (response.success) {
                setAlert({
                    type: 'success',
                    message: 'Horario reactivado correctamente'
                });

                cargarDatos();
            }
        } catch (error) {
            setAlert({
                type: 'error',
                message: error.response?.data?.message || 'Error al reactivar horario'
            });
        }
    };

    const horariosFiltrados = horarios.filter((horario) => {
        if (filtroDia && horario.diaSemana !== filtroDia) return false;

        const texto = busqueda.toLowerCase().trim();

        if (!texto) return true;

        const docente = getDocenteNombre(horario).toLowerCase();
        const curso = horario.curso?.nombre?.toLowerCase() || '';
        const grado = getGradoTexto(horario).toLowerCase();
        const periodo = String(horario.periodoAcademico?.anio || '').toLowerCase();
        const dia = horario.diaSemana?.toLowerCase() || '';
        const aula = horario.aula?.toLowerCase() || '';
        const estado = horario.estado ? 'activo' : 'inactivo';

        return (
            docente.includes(texto) ||
            curso.includes(texto) ||
            grado.includes(texto) ||
            periodo.includes(texto) ||
            dia.includes(texto) ||
            aula.includes(texto) ||
            estado.includes(texto) ||
            normalizarHora(horario.horaInicio).includes(texto) ||
            normalizarHora(horario.horaFin).includes(texto)
        );
    });

    const totalActivos = horarios.filter(h => h.estado).length;
    const totalInactivos = horarios.filter(h => !h.estado).length;

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
                                Horarios de Docentes
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Registra horarios académicos evitando cruces entre docentes, aulas y secciones.
                            </p>
                        </div>

                        {canManage && (
                            <button
                                onClick={() => {
                                    resetForm();
                                    setFormError('');
                                    setModalOpen(true);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-bold shadow-lg shadow-blue-900/20 transition flex items-center justify-center gap-2"
                            >
                                <span className="text-lg">+</span>
                                <span>Nuevo Horario</span>
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
                    <p className="text-sm text-slate-500">Total horarios</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{horarios.length}</p>
                </div>

                <div className="bg-green-50 rounded-2xl shadow-sm border border-green-100 p-5">
                    <p className="text-sm text-green-700">Horarios activos</p>
                    <p className="text-3xl font-black text-green-700 mt-1">{totalActivos}</p>
                </div>

                <div className="bg-red-50 rounded-2xl shadow-sm border border-red-100 p-5">
                    <p className="text-sm text-red-700">Horarios inactivos</p>
                    <p className="text-3xl font-black text-red-700 mt-1">{totalInactivos}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Buscar horario
                        </label>

                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                🔍
                            </span>

                            <input
                                type="text"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                placeholder="Buscar por docente, curso, sección, aula, hora o estado..."
                                className="w-full border border-slate-300 rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Filtrar por día
                        </label>

                        <select
                            value={filtroDia}
                            onChange={(e) => setFiltroDia(e.target.value)}
                            className="w-full border border-slate-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                        >
                            <option value="">Todos los días</option>
                            {diasSemana.map(dia => (
                                <option key={dia} value={dia}>
                                    {dia}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-slate-500">
                        Resultados encontrados: {horariosFiltrados.length}
                    </p>

                    {(busqueda || filtroDia) && (
                        <button
                            onClick={() => {
                                setBusqueda('');
                                setFiltroDia('');
                            }}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                        >
                            Limpiar filtros
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-lg font-black text-slate-800">
                        Listado de horarios
                    </h2>
                    <p className="text-sm text-slate-500">
                        Horarios registrados por docente, curso, sección, día y aula.
                    </p>
                </div>

                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Docente</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Curso</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Grado/Sección</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Día</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Horario</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Aula</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Estado</th>
                            {canManage && (
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Acciones</th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-slate-100">
                        {horariosFiltrados.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={canManage ? 8 : 7}
                                    className="px-6 py-12 text-center text-slate-500"
                                >
                                    {busqueda || filtroDia
                                        ? 'No se encontraron horarios con los filtros aplicados.'
                                        : 'No hay horarios registrados.'}
                                </td>
                            </tr>
                        ) : (
                            horariosFiltrados.map((horario) => (
                                <tr key={horario.idHorarioDocente} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        <span className="font-bold text-slate-900">
                                            {getDocenteNombre(horario)}
                                        </span>
                                        <div className="text-xs text-slate-500">
                                            {horario.docente?.codigo || '-'}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        {horario.curso?.nombre || '-'}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        {getGradoTexto(horario)}
                                    </td>

                                    <td className="px-6 py-4 text-sm font-bold text-slate-700">
                                        {horario.diaSemana}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        {normalizarHora(horario.horaInicio)} - {normalizarHora(horario.horaFin)}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        {horario.aula || '-'}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${
                                                horario.estado
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {horario.estado ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>

                                    {canManage && (
                                        <td className="px-6 py-4 text-sm font-medium">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(horario)}
                                                    className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition"
                                                >
                                                    Editar
                                                </button>

                                                {horario.estado ? (
                                                    user?.rol === 'ADMIN' && (
                                                        <button
                                                            onClick={() => handleDelete(horario.idHorarioDocente)}
                                                            className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 font-semibold transition"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    )
                                                ) : (
                                                    <button
                                                        onClick={() => handleReactivar(horario.idHorarioDocente)}
                                                        className="px-3 py-1.5 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 font-semibold transition"
                                                    >
                                                        Reactivar
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
                    title={editing ? 'Editar Horario' : 'Nuevo Horario'}
                    size="lg"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {formError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                                {formError}
                            </div>
                        )}

                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                            <h3 className="text-lg font-black text-slate-800 mb-1">
                                Datos del Horario
                            </h3>
                            <p className="text-sm text-slate-500 mb-4">
                                Seleccione docente, curso, sección y rango de horas. El sistema validará cruces automáticamente.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Docente *</label>
                                    <select
                                        name="docenteId"
                                        value={formData.docente.idDocente}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Seleccionar docente</option>
                                        {docentes.map(d => (
                                            <option key={d.idDocente} value={d.idDocente}>
                                                {d.nombres} {d.apellidos} - {d.especialidad || 'Sin especialidad'}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Curso *</label>
                                    <select
                                        name="cursoId"
                                        value={formData.curso.idCurso}
                                        onChange={handleInputChange}
                                        required
                                        disabled={!formData.docente.idDocente || cursosFiltrados.length === 0}
                                        className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
                                    >
                                        <option value="">
                                            {!formData.docente.idDocente
                                                ? 'Primero seleccione un docente'
                                                : cursosFiltrados.length === 0
                                                    ? 'Este docente no tiene cursos asignados'
                                                    : 'Seleccione un curso asignado'}
                                        </option>

                                        {cursosFiltrados.map(c => (
                                            <option key={c.idCurso} value={c.idCurso}>
                                                {c.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Grado/Sección *</label>
                                    <select
                                        name="gradoSeccionId"
                                        value={formData.gradoSeccion.idGradoSeccion}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Seleccionar grado/sección</option>
                                        {grados.map(g => (
                                            <option key={g.idGradoSeccion} value={g.idGradoSeccion}>
                                                {g.grado} - {g.seccion} ({g.nivel})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Periodo Académico *</label>
                                    <select
                                        name="periodoAcademicoId"
                                        value={formData.periodoAcademico.idPeriodoAcademico}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Seleccionar periodo</option>
                                        {periodos.map(p => (
                                            <option key={p.idPeriodoAcademico} value={p.idPeriodoAcademico}>
                                                {p.anio} - {p.estado}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Día *</label>
                                    <select
                                        name="diaSemana"
                                        value={formData.diaSemana}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {diasSemana.map(dia => (
                                            <option key={dia} value={dia}>
                                                {dia}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Aula</label>
                                    <input
                                        type="text"
                                        name="aula"
                                        value={formData.aula}
                                        onChange={handleInputChange}
                                        placeholder="Ej: A-101"
                                        className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Hora inicio *</label>
                                    <input
                                        type="time"
                                        name="horaInicio"
                                        value={formData.horaInicio}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Hora fin *</label>
                                    <input
                                        type="time"
                                        name="horaFin"
                                        value={formData.horaFin}
                                        onChange={handleInputChange}
                                        required
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

export default HorariosDocentes;