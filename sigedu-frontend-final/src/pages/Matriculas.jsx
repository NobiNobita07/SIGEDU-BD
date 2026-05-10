import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { matriculaService } from '../api/matriculaService';
import { estudianteService } from '../api/estudianteService';
import { gradoSeccionService } from '../api/gradoSeccionService';
import { periodoAcademicoService } from '../api/periodoAcademicoService';

const Matriculas = () => {
    const [matriculas, setMatriculas] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [grados, setGrados] = useState([]);
    const [periodos, setPeriodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [alert, setAlert] = useState(null);
    const [busqueda, setBusqueda] = useState('');

    const [formData, setFormData] = useState({
        estudiante: { idEstudiante: '' },
        gradoSeccion: { idGradoSeccion: '' },
        periodoAcademico: { idPeriodoAcademico: '' },
        fechaMatricula: new Date().toISOString().split('T')[0],
        estado: 'Activa'
    });

    const estados = ['Activa', 'Retirado', 'Trasladado', 'Egresado'];

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setLoading(true);

            const [matriculasRes, estudiantesRes, gradosRes, periodosRes] = await Promise.all([
                matriculaService.getAll(),
                estudianteService.getAll(),
                gradoSeccionService.getAll(),
                periodoAcademicoService.getAll()
            ]);

            if (matriculasRes.success) setMatriculas(matriculasRes.data || []);
            if (estudiantesRes.success) setEstudiantes(estudiantesRes.data || []);
            if (gradosRes.success) setGrados(gradosRes.data || []);
            if (periodosRes.success) setPeriodos(periodosRes.data || []);
        } catch (error) {
            setAlert({
                type: 'error',
                message: error.response?.data?.message || 'Error al cargar datos'
            });
        } finally {
            setLoading(false);
        }
    };

    const getEstudianteNombre = (matricula) => {
        return `${matricula.estudiante?.nombres || ''} ${matricula.estudiante?.apellidos || ''}`.trim();
    };

    const getGradoTexto = (matricula) => {
        return `${matricula.gradoSeccion?.grado || ''} ${matricula.gradoSeccion?.seccion || ''} ${matricula.gradoSeccion?.nivel || ''}`.trim();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'estudianteId') {
            setFormData({ ...formData, estudiante: { idEstudiante: parseInt(value) } });
        } else if (name === 'gradoSeccionId') {
            setFormData({ ...formData, gradoSeccion: { idGradoSeccion: parseInt(value) } });
        } else if (name === 'periodoAcademicoId') {
            setFormData({ ...formData, periodoAcademico: { idPeriodoAcademico: parseInt(value) } });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = editing
                ? await matriculaService.update(editing, formData)
                : await matriculaService.create(formData);

            if (response.success) {
                setAlert({
                    type: 'success',
                    message: editing
                        ? 'Matrícula actualizada exitosamente'
                        : 'Matrícula creada exitosamente'
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
        if (!window.confirm('¿Estás seguro de anular esta matrícula?')) return;

        try {
            const response = await matriculaService.delete(id);

            if (response.success) {
                setAlert({
                    type: 'success',
                    message: 'Matrícula anulada exitosamente'
                });
                cargarDatos();
            }
        } catch (error) {
            setAlert({
                type: 'error',
                message: error.response?.data?.message || 'Error al anular'
            });
        }
    };

    const handleEdit = (matricula) => {
        setEditing(matricula.idMatricula);

        setFormData({
            estudiante: { idEstudiante: matricula.estudiante?.idEstudiante || '' },
            gradoSeccion: { idGradoSeccion: matricula.gradoSeccion?.idGradoSeccion || '' },
            periodoAcademico: { idPeriodoAcademico: matricula.periodoAcademico?.idPeriodoAcademico || '' },
            fechaMatricula: matricula.fechaMatricula || new Date().toISOString().split('T')[0],
            estado: matricula.estado || 'Activa'
        });

        setModalOpen(true);
    };

    const resetForm = () => {
        setEditing(null);
        setFormData({
            estudiante: { idEstudiante: '' },
            gradoSeccion: { idGradoSeccion: '' },
            periodoAcademico: { idPeriodoAcademico: '' },
            fechaMatricula: new Date().toISOString().split('T')[0],
            estado: 'Activa'
        });
    };

    const getEstadoColor = (estado) => {
        const colors = {
            Activa: 'bg-green-100 text-green-700',
            Retirado: 'bg-red-100 text-red-700',
            Trasladado: 'bg-yellow-100 text-yellow-700',
            Egresado: 'bg-blue-100 text-blue-700'
        };

        return colors[estado] || 'bg-gray-100 text-gray-700';
    };

    const matriculasFiltradas = matriculas.filter((matricula) => {
        const texto = busqueda.toLowerCase().trim();

        if (!texto) return true;

        const estudiante = getEstudianteNombre(matricula).toLowerCase();
        const grado = getGradoTexto(matricula).toLowerCase();
        const periodo = String(matricula.periodoAcademico?.anio || '').toLowerCase();
        const codigo = matricula.estudiante?.codigo?.toLowerCase() || '';
        const dni = matricula.estudiante?.dni?.toLowerCase() || '';
        const fecha = matricula.fechaMatricula?.toLowerCase() || '';
        const estado = matricula.estado?.toLowerCase() || '';

        return (
            estudiante.includes(texto) ||
            grado.includes(texto) ||
            periodo.includes(texto) ||
            codigo.includes(texto) ||
            dni.includes(texto) ||
            fecha.includes(texto) ||
            estado.includes(texto)
        );
    });

    const totalActivas = matriculas.filter(m => m.estado === 'Activa').length;
    const totalNoActivas = matriculas.length - totalActivas;

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
                                Matrículas
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Administra la inscripción de estudiantes por grado, sección y período académico.
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
                            <span>Nueva Matrícula</span>
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
                    <p className="text-sm text-slate-500">Total matrículas</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{matriculas.length}</p>
                </div>

                <div className="bg-green-50 rounded-2xl shadow-sm border border-green-100 p-5">
                    <p className="text-sm text-green-700">Matrículas activas</p>
                    <p className="text-3xl font-black text-green-700 mt-1">{totalActivas}</p>
                </div>

                <div className="bg-yellow-50 rounded-2xl shadow-sm border border-yellow-100 p-5">
                    <p className="text-sm text-yellow-700">Otros estados</p>
                    <p className="text-3xl font-black text-yellow-700 mt-1">{totalNoActivas}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                    Buscar matrícula
                </label>

                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        🔍
                    </span>

                    <input
                        type="text"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar por Estudiante, Código, DNI, Grado, Sección, Período, Fecha o Estado..."
                        className="w-full border border-slate-300 rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                    />
                </div>

                <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-slate-500">
                        Resultados encontrados: {matriculasFiltradas.length}
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
                            Listado de matrículas
                        </h2>
                        <p className="text-sm text-slate-500">
                            Registro académico de estudiantes inscritos en períodos vigentes.
                        </p>
                    </div>
                </div>

                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Estudiante</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Grado/Sección</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Período</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Fecha Matrícula</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Estado</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Acciones</th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-slate-100">
                        {matriculasFiltradas.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                    {busqueda
                                        ? 'No se encontraron matrículas con ese criterio de búsqueda.'
                                        : 'No hay matrículas registradas.'}
                                </td>
                            </tr>
                        ) : (
                            matriculasFiltradas.map((matricula) => (
                                <tr key={matricula.idMatricula} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        <span className="font-bold text-slate-900">
                                            {getEstudianteNombre(matricula)}
                                        </span>
                                        <div className="text-xs text-slate-500">
                                            Código: {matricula.estudiante?.codigo || '-'}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        <span className="font-semibold">
                                            {matricula.gradoSeccion?.grado} - {matricula.gradoSeccion?.seccion}
                                        </span>
                                        <div className="text-xs text-slate-500">
                                            {matricula.gradoSeccion?.nivel || '-'}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        {matricula.periodoAcademico?.anio || '-'}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        {matricula.fechaMatricula}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${getEstadoColor(matricula.estado)}`}>
                                            {matricula.estado}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-sm font-medium">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(matricula)}
                                                className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition"
                                            >
                                                Editar
                                            </button>

                                            <button
                                                onClick={() => handleDelete(matricula.idMatricula)}
                                                className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 font-semibold transition"
                                            >
                                                Anular
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
                title={editing ? 'Editar Matrícula' : 'Nueva Matrícula'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                        <h3 className="text-lg font-black text-slate-800 mb-1">
                            Datos de la Matrícula
                        </h3>
                        <p className="text-sm text-slate-500 mb-4">
                            Seleccione el estudiante, grado/sección y período académico correspondiente.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Estudiante *</label>
                                <select
                                    name="estudianteId"
                                    value={formData.estudiante.idEstudiante}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Seleccionar estudiante</option>
                                    {estudiantes.map(e => (
                                        <option key={e.idEstudiante} value={e.idEstudiante}>
                                            {e.codigo} - {e.nombres} {e.apellidos}
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
                                    <option value="">Seleccionar grado</option>
                                    {grados.map(g => (
                                        <option key={g.idGradoSeccion} value={g.idGradoSeccion}>
                                            {g.grado} - {g.seccion} ({g.nivel})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Período Académico *</label>
                                <select
                                    name="periodoAcademicoId"
                                    value={formData.periodoAcademico.idPeriodoAcademico}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Seleccionar período</option>
                                    {periodos.map(p => (
                                        <option key={p.idPeriodoAcademico} value={p.idPeriodoAcademico}>
                                            {p.anio} - {p.estado}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Fecha Matrícula *</label>
                                <input
                                    type="date"
                                    name="fechaMatricula"
                                    value={formData.fechaMatricula}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Estado *</label>
                                <select
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {estados.map(e => (
                                        <option key={e} value={e}>{e}</option>
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

export default Matriculas;