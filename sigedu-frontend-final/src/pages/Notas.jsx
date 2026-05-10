import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { notaService } from '../api/notaService';
import { matriculaService } from '../api/matriculaService';
import { cursoService } from '../api/cursoService';
import { periodoAcademicoService } from '../api/periodoAcademicoService';

const Notas = () => {
    const [notas, setNotas] = useState([]);
    const [matriculas, setMatriculas] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [periodos, setPeriodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [alert, setAlert] = useState(null);
    const [busqueda, setBusqueda] = useState('');

    const [formData, setFormData] = useState({
        matricula: { idMatricula: '' },
        curso: { idCurso: '' },
        periodoAcademico: { idPeriodoAcademico: '' },
        bimestre: 1,
        nota: '',
        observacion: ''
    });

    const bimestres = [1, 2, 3, 4];

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setLoading(true);

            const [notasRes, matriculasRes, cursosRes, periodosRes] = await Promise.all([
                notaService.getAll(),
                matriculaService.getAll(),
                cursoService.getAll(),
                periodoAcademicoService.getAll()
            ]);

            if (notasRes.success) setNotas(notasRes.data || []);
            if (matriculasRes.success) setMatriculas(matriculasRes.data || []);
            if (cursosRes.success) setCursos(cursosRes.data || []);
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

    const getEstudianteNombre = (nota) => {
        return `${nota.matricula?.estudiante?.nombres || ''} ${nota.matricula?.estudiante?.apellidos || ''}`.trim();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'matriculaId') {
            setFormData({ ...formData, matricula: { idMatricula: parseInt(value) } });
        } else if (name === 'cursoId') {
            setFormData({ ...formData, curso: { idCurso: parseInt(value) } });
        } else if (name === 'periodoAcademicoId') {
            setFormData({ ...formData, periodoAcademico: { idPeriodoAcademico: parseInt(value) } });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const notaValue = parseFloat(formData.nota);

        if (isNaN(notaValue) || notaValue < 0 || notaValue > 20) {
            setAlert({ type: 'error', message: 'La nota debe estar entre 0 y 20' });
            return;
        }

        try {
            const response = editing
                ? await notaService.update(editing, formData)
                : await notaService.create(formData);

            if (response.success) {
                setAlert({
                    type: 'success',
                    message: editing
                        ? 'Nota actualizada exitosamente'
                        : 'Nota registrada exitosamente'
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
        if (!window.confirm('¿Estás seguro de eliminar esta nota?')) return;

        try {
            const response = await notaService.delete(id);

            if (response.success) {
                setAlert({
                    type: 'success',
                    message: 'Nota eliminada exitosamente'
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

    const handleEdit = (nota) => {
        setEditing(nota.idNota);

        setFormData({
            matricula: { idMatricula: nota.matricula?.idMatricula || '' },
            curso: { idCurso: nota.curso?.idCurso || '' },
            periodoAcademico: { idPeriodoAcademico: nota.periodoAcademico?.idPeriodoAcademico || '' },
            bimestre: nota.bimestre || 1,
            nota: nota.nota || '',
            observacion: nota.observacion || ''
        });

        setModalOpen(true);
    };

    const resetForm = () => {
        setEditing(null);
        setFormData({
            matricula: { idMatricula: '' },
            curso: { idCurso: '' },
            periodoAcademico: { idPeriodoAcademico: '' },
            bimestre: 1,
            nota: '',
            observacion: ''
        });
    };

    const getNotaColor = (nota) => {
        if (nota >= 18) return 'text-green-700 bg-green-100';
        if (nota >= 14) return 'text-blue-700 bg-blue-100';
        if (nota >= 11) return 'text-yellow-700 bg-yellow-100';
        return 'text-red-700 bg-red-100';
    };

    const notasFiltradas = notas.filter((nota) => {
        const texto = busqueda.toLowerCase().trim();

        if (!texto) return true;

        const estudiante = getEstudianteNombre(nota).toLowerCase();
        const codigo = nota.matricula?.estudiante?.codigo?.toLowerCase() || '';
        const dni = nota.matricula?.estudiante?.dni?.toLowerCase() || '';
        const curso = nota.curso?.nombre?.toLowerCase() || '';
        const bimestre = `bimestre ${nota.bimestre}`.toLowerCase();
        const notaTexto = String(nota.nota || '').toLowerCase();
        const observacion = nota.observacion?.toLowerCase() || '';
        const periodo = String(nota.periodoAcademico?.anio || '').toLowerCase();

        return (
            estudiante.includes(texto) ||
            codigo.includes(texto) ||
            dni.includes(texto) ||
            curso.includes(texto) ||
            bimestre.includes(texto) ||
            notaTexto.includes(texto) ||
            observacion.includes(texto) ||
            periodo.includes(texto)
        );
    });

    const notasAprobadas = notas.filter(n => Number(n.nota) >= 11).length;
    const notasDesaprobadas = notas.filter(n => Number(n.nota) < 11).length;

    const promedioGeneral = notas.length > 0
        ? notas.reduce((sum, n) => sum + Number(n.nota || 0), 0) / notas.length
        : 0;

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
                                Notas
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Registra y consulta las calificaciones por estudiante, curso, bimestre y período académico.
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
                            <span>Registrar Nota</span>
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
                    <p className="text-sm text-slate-500">Total notas</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{notas.length}</p>
                </div>

                <div className="bg-green-50 rounded-2xl shadow-sm border border-green-100 p-5">
                    <p className="text-sm text-green-700">Notas aprobadas</p>
                    <p className="text-3xl font-black text-green-700 mt-1">{notasAprobadas}</p>
                </div>

                <div className="bg-blue-50 rounded-2xl shadow-sm border border-blue-100 p-5">
                    <p className="text-sm text-blue-700">Promedio general</p>
                    <p className="text-3xl font-black text-blue-700 mt-1">{promedioGeneral.toFixed(1)}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                    Buscar nota
                </label>

                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        🔍
                    </span>

                    <input
                        type="text"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar por Estudiante, Código, DNI, Curso, Bimestre, Nota, Observación o Período..."
                        className="w-full border border-slate-300 rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                    />
                </div>

                <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-slate-500">
                        Resultados encontrados: {notasFiltradas.length}
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
                            Registro de notas
                        </h2>
                        <p className="text-sm text-slate-500">
                            Calificaciones registradas por estudiante, curso y bimestre.
                        </p>
                    </div>
                </div>

                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Estudiante</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Curso</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Bimestre</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Nota</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Observación</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Acciones</th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-slate-100">
                        {notasFiltradas.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                    {busqueda
                                        ? 'No se encontraron notas con ese criterio de búsqueda.'
                                        : 'No hay notas registradas.'}
                                </td>
                            </tr>
                        ) : (
                            notasFiltradas.map((nota) => (
                                <tr key={nota.idNota} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        <span className="font-bold text-slate-900">
                                            {getEstudianteNombre(nota)}
                                        </span>
                                        <div className="text-xs text-slate-500">
                                            Código: {nota.matricula?.estudiante?.codigo || '-'}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        {nota.curso?.nombre || '-'}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        Bimestre {nota.bimestre}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${getNotaColor(nota.nota)}`}>
                                            {nota.nota}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                                        {nota.observacion || '-'}
                                    </td>

                                    <td className="px-6 py-4 text-sm font-medium">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(nota)}
                                                className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition"
                                            >
                                                Editar
                                            </button>

                                            <button
                                                onClick={() => handleDelete(nota.idNota)}
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
                title={editing ? 'Editar Nota' : 'Registrar Nota'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                        <h3 className="text-lg font-black text-slate-800 mb-1">
                            Datos de la Nota
                        </h3>
                        <p className="text-sm text-slate-500 mb-4">
                            Seleccione matrícula, curso, período y registre la calificación correspondiente.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Matrícula *</label>
                                <select
                                    name="matriculaId"
                                    value={formData.matricula.idMatricula}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Seleccionar matrícula</option>
                                    {matriculas.map(m => (
                                        <option key={m.idMatricula} value={m.idMatricula}>
                                            {m.estudiante?.nombres} {m.estudiante?.apellidos} - {m.gradoSeccion?.grado} {m.gradoSeccion?.seccion}
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
                                    className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Seleccionar curso</option>
                                    {cursos.map(c => (
                                        <option key={c.idCurso} value={c.idCurso}>{c.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Período *</label>
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
                                            {p.anio}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Bimestre *</label>
                                <select
                                    name="bimestre"
                                    value={formData.bimestre}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {bimestres.map(b => (
                                        <option key={b} value={b}>Bimestre {b}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Nota * (0 - 20)</label>
                                <input
                                    type="number"
                                    name="nota"
                                    value={formData.nota}
                                    onChange={handleInputChange}
                                    required
                                    step="0.01"
                                    min="0"
                                    max="20"
                                    className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-slate-700 mb-1">Observación</label>
                                <textarea
                                    name="observacion"
                                    value={formData.observacion}
                                    onChange={handleInputChange}
                                    rows="2"
                                    className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Observaciones sobre el rendimiento del estudiante..."
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

export default Notas;