import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { dashboardService } from '../api/dashboardService';
import { estudianteService } from '../api/estudianteService';
import { gradoSeccionService } from '../api/gradoSeccionService';
import { periodoAcademicoService } from '../api/periodoAcademicoService';
import { useAuth } from '../context/AuthContext';

const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const Reportes = () => {
    const { user } = useAuth();
    const canViewPagos = user?.rol === 'ADMIN' || user?.rol === 'SECRETARIA';

    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [estudiantes, setEstudiantes] = useState([]);
    const [grados, setGrados] = useState([]);
    const [periodos, setPeriodos] = useState([]);
    const [reporteNotas, setReporteNotas] = useState([]);
    const [reportePagos, setReportePagos] = useState([]);
    const [reporteAsistencia, setReporteAsistencia] = useState([]);
    const [filtrosNotas, setFiltrosNotas] = useState({ idEstudiante: '', idPeriodoAcademico: '' });
    const [filtrosPagos, setFiltrosPagos] = useState({ idEstudiante: '', idPeriodoAcademico: '' });
    const [filtrosAsistencia, setFiltrosAsistencia] = useState({ idGradoSeccion: '', fechaInicio: '', fechaFin: '' });
    const [reporteActivo, setReporteActivo] = useState('notas');

    useEffect(() => {
        cargarDatosIniciales();
    }, []);

    useEffect(() => {
        if (!canViewPagos && reporteActivo === 'pagos') {
            setReporteActivo('notas');
        }
    }, [canViewPagos, reporteActivo]);

    const cargarDatosIniciales = async () => {
        try {
            setLoading(true);

            const [estudiantesRes, gradosRes, periodosRes] = await Promise.all([
                estudianteService.getAll(),
                gradoSeccionService.getAll(),
                periodoAcademicoService.getAll()
            ]);

            if (estudiantesRes.success) setEstudiantes(estudiantesRes.data || []);
            if (gradosRes.success) setGrados(gradosRes.data || []);
            if (periodosRes.success) setPeriodos(periodosRes.data || []);
        } catch (error) {
            setAlert({ type: 'error', message: 'Error al cargar datos iniciales' });
        } finally {
            setLoading(false);
        }
    };

    const generarReporteNotas = async () => {
        if (!filtrosNotas.idEstudiante || !filtrosNotas.idPeriodoAcademico) {
            setAlert({ type: 'warning', message: 'Seleccione estudiante y período académico' });
            return;
        }

        try {
            setLoading(true);

            const response = await dashboardService.getReporteNotas(
                filtrosNotas.idEstudiante,
                filtrosNotas.idPeriodoAcademico
            );

            if (response.success) {
                setReporteNotas(response.data || []);
                setAlert({ type: 'success', message: 'Reporte de notas generado exitosamente' });
            }
        } catch (error) {
            setAlert({ type: 'error', message: 'Error al generar reporte de notas' });
        } finally {
            setLoading(false);
        }
    };

    const generarReportePagos = async () => {
        if (!canViewPagos) {
            setAlert({ type: 'error', message: 'No tienes permisos para ver reportes de pagos' });
            return;
        }

        if (!filtrosPagos.idEstudiante || !filtrosPagos.idPeriodoAcademico) {
            setAlert({ type: 'warning', message: 'Seleccione estudiante y período académico' });
            return;
        }

        try {
            setLoading(true);

            const response = await dashboardService.getReportePagos(
                filtrosPagos.idEstudiante,
                filtrosPagos.idPeriodoAcademico
            );

            if (response.success) {
                setReportePagos(response.data || []);
                setAlert({ type: 'success', message: 'Reporte de pagos generado exitosamente' });
            }
        } catch (error) {
            setAlert({ type: 'error', message: 'Error al generar reporte de pagos' });
        } finally {
            setLoading(false);
        }
    };

    const generarReporteAsistencia = async () => {
        if (!filtrosAsistencia.idGradoSeccion || !filtrosAsistencia.fechaInicio || !filtrosAsistencia.fechaFin) {
            setAlert({ type: 'warning', message: 'Complete todos los campos' });
            return;
        }

        try {
            setLoading(true);

            const response = await dashboardService.getReporteAsistencia(
                filtrosAsistencia.idGradoSeccion,
                filtrosAsistencia.fechaInicio,
                filtrosAsistencia.fechaFin
            );

            if (response.success) {
                setReporteAsistencia(response.data || []);
                setAlert({ type: 'success', message: 'Reporte de asistencia generado exitosamente' });
            }
        } catch (error) {
            setAlert({ type: 'error', message: 'Error al generar reporte de asistencia' });
        } finally {
            setLoading(false);
        }
    };

    const calcularPromedio = (curso) => {
        return curso.promedio || 0;
    };

    const getNotaBadge = (nota) => {
        if (!nota) return 'bg-slate-100 text-slate-500';
        if (nota >= 18) return 'bg-green-100 text-green-700';
        if (nota >= 14) return 'bg-blue-100 text-blue-700';
        if (nota >= 11) return 'bg-yellow-100 text-yellow-700';
        return 'bg-red-100 text-red-700';
    };

    const estudianteSeleccionadoNotas = estudiantes.find(
        e => e.idEstudiante === parseInt(filtrosNotas.idEstudiante)
    );

    const estudianteSeleccionadoPagos = estudiantes.find(
        e => e.idEstudiante === parseInt(filtrosPagos.idEstudiante)
    );

    const periodoSeleccionadoNotas = periodos.find(
        p => p.idPeriodoAcademico === parseInt(filtrosNotas.idPeriodoAcademico)
    );

    const periodoSeleccionadoPagos = periodos.find(
        p => p.idPeriodoAcademico === parseInt(filtrosPagos.idPeriodoAcademico)
    );

    const gradoSeleccionado = grados.find(
        g => g.idGradoSeccion === parseInt(filtrosAsistencia.idGradoSeccion)
    );

    const crearBasePDF = (titulo, subtitulo) => {
        const doc = new jsPDF('p', 'mm', 'a4');

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('SIGEDU-BD', 14, 15);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Sistema de Gestión Educativa', 14, 21);

        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text(titulo, 14, 33);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(subtitulo, 14, 40);

        const fecha = new Date().toLocaleString('es-PE');
        doc.text(`Fecha de generación: ${fecha}`, 14, 47);

        return doc;
    };

    const descargarPDFNotas = () => {
        if (!reporteNotas.length) {
            setAlert({ type: 'warning', message: 'Primero genere el reporte de notas' });
            return;
        }

        const estudiante = estudianteSeleccionadoNotas;
        const periodo = periodoSeleccionadoNotas;

        const doc = crearBasePDF(
            'Boletín de Notas',
            `Estudiante: ${estudiante?.nombres || ''} ${estudiante?.apellidos || ''} | Período: ${periodo?.anio || ''}`
        );

        const body = reporteNotas.map((curso) => [
            curso.curso || '-',
            curso.bimestre1 || '-',
            curso.bimestre2 || '-',
            curso.bimestre3 || '-',
            curso.bimestre4 || '-',
            calcularPromedio(curso).toFixed(1)
        ]);

        autoTable(doc, {
            startY: 55,
            head: [['Curso', 'Bim. 1', 'Bim. 2', 'Bim. 3', 'Bim. 4', 'Promedio']],
            body,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [37, 99, 235] }
        });

        doc.save(`reporte_notas_${estudiante?.codigo || 'estudiante'}.pdf`);
    };

    const descargarPDFPagos = () => {
        if (!canViewPagos) {
            setAlert({ type: 'error', message: 'No tienes permisos para descargar reportes de pagos' });
            return;
        }

        if (!reportePagos.length) {
            setAlert({ type: 'warning', message: 'Primero genere el reporte de pagos' });
            return;
        }

        const estudiante = estudianteSeleccionadoPagos;
        const periodo = periodoSeleccionadoPagos;

        const doc = crearBasePDF(
            'Reporte de Pagos',
            `Estudiante: ${estudiante?.nombres || ''} ${estudiante?.apellidos || ''} | Período: ${periodo?.anio || ''}`
        );

        const body = reportePagos.map((pago) => [
            pago.concepto || '-',
            meses[(pago.mes || 1) - 1] || '-',
            `S/ ${parseFloat(pago.montoTotal || 0).toFixed(2)}`,
            `S/ ${parseFloat(pago.montoPagado || 0).toFixed(2)}`,
            `S/ ${parseFloat(pago.saldoPendiente || 0).toFixed(2)}`,
            pago.estado || '-',
            pago.fechaVencimiento || '-'
        ]);

        autoTable(doc, {
            startY: 55,
            head: [['Concepto', 'Mes', 'Monto Total', 'Pagado', 'Saldo', 'Estado', 'Vencimiento']],
            body,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [22, 163, 74] }
        });

        doc.save(`reporte_pagos_${estudiante?.codigo || 'estudiante'}.pdf`);
    };

    const descargarPDFAsistencia = () => {
        if (!reporteAsistencia.length) {
            setAlert({ type: 'warning', message: 'Primero genere el reporte de asistencia' });
            return;
        }

        const doc = crearBasePDF(
            'Reporte de Asistencia',
            `Grado/Sección: ${gradoSeleccionado?.grado || ''} ${gradoSeleccionado?.seccion || ''} | Del ${filtrosAsistencia.fechaInicio} al ${filtrosAsistencia.fechaFin}`
        );

        const body = reporteAsistencia.map((est) => [
            est.codigo || '-',
            `${est.nombres || ''} ${est.apellidos || ''}`,
            est.presente || 0,
            est.tarde || 0,
            est.falta || 0,
            est.justificado || 0,
            est.total || 0
        ]);

        autoTable(doc, {
            startY: 55,
            head: [['Código', 'Estudiante', 'Presente', 'Tarde', 'Falta', 'Justificado', 'Total']],
            body,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [234, 88, 12] }
        });

        doc.save(`reporte_asistencia_${gradoSeleccionado?.grado || 'grado'}_${gradoSeleccionado?.seccion || 'seccion'}.pdf`);
    };

    if (loading && !reporteNotas.length && !reportePagos.length && !reporteAsistencia.length) {
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
                    <div>
                        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-1">
                            Reportes institucionales
                        </p>
                        <h1 className="text-3xl font-black text-slate-900">
                            Informes
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Genera reportes académicos, administrativos y financieros en formato PDF.
                        </p>
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

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setReporteActivo('notas')}
                        className={`px-5 py-3 rounded-2xl font-bold text-sm transition ${
                            reporteActivo === 'notas'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        📖 Reporte de Notas
                    </button>

                    {canViewPagos && (
                        <button
                            onClick={() => setReporteActivo('pagos')}
                            className={`px-5 py-3 rounded-2xl font-bold text-sm transition ${
                                reporteActivo === 'pagos'
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            💰 Reporte de Pagos
                        </button>
                    )}

                    <button
                        onClick={() => setReporteActivo('asistencia')}
                        className={`px-5 py-3 rounded-2xl font-bold text-sm transition ${
                            reporteActivo === 'asistencia'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        ✅ Reporte de Asistencia
                    </button>
                </div>
            </div>

            {reporteActivo === 'notas' && (
                <div>
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-6">
                        <div className="mb-5">
                            <h2 className="text-xl font-black text-slate-800">Reporte de Notas</h2>
                            <p className="text-sm text-slate-500">
                                Selecciona un estudiante y un período académico para generar su boletín.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Estudiante *</label>
                                <select
                                    value={filtrosNotas.idEstudiante}
                                    onChange={(e) => setFiltrosNotas({ ...filtrosNotas, idEstudiante: e.target.value })}
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
                                <label className="block text-sm font-bold text-slate-700 mb-1">Período Académico *</label>
                                <select
                                    value={filtrosNotas.idPeriodoAcademico}
                                    onChange={(e) => setFiltrosNotas({ ...filtrosNotas, idPeriodoAcademico: e.target.value })}
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
                        </div>

                        <div className="mt-5 flex gap-3">
                            <button
                                onClick={generarReporteNotas}
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition disabled:opacity-50"
                            >
                                {loading ? 'Generando...' : 'Generar Reporte'}
                            </button>

                            {reporteNotas.length > 0 && (
                                <button
                                    onClick={descargarPDFNotas}
                                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold transition"
                                >
                                    Descargar PDF
                                </button>
                            )}
                        </div>
                    </div>

                    {reporteNotas.length > 0 && (
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-5 border-b border-slate-100 bg-slate-50">
                                <h2 className="text-lg font-black text-slate-800">
                                    Boletín de Notas - {estudianteSeleccionadoNotas?.nombres} {estudianteSeleccionadoNotas?.apellidos}
                                </h2>
                                <p className="text-sm text-slate-500">Período: {periodoSeleccionadoNotas?.anio}</p>
                            </div>

                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Curso</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Bim. 1</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Bim. 2</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Bim. 3</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Bim. 4</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Promedio</th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-slate-100">
                                    {reporteNotas.map((curso, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50 transition">
                                            <td className="px-6 py-4 text-sm font-bold text-slate-800">{curso.curso}</td>
                                            {[curso.bimestre1, curso.bimestre2, curso.bimestre3, curso.bimestre4].map((nota, i) => (
                                                <td key={i} className="px-6 py-4 text-sm text-center">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getNotaBadge(nota)}`}>
                                                        {nota || '-'}
                                                    </span>
                                                </td>
                                            ))}
                                            <td className="px-6 py-4 text-sm text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getNotaBadge(calcularPromedio(curso))}`}>
                                                    {calcularPromedio(curso).toFixed(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {canViewPagos && reporteActivo === 'pagos' && (
                <div>
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-6">
                        <div className="mb-5">
                            <h2 className="text-xl font-black text-slate-800">Reporte de Pagos</h2>
                            <p className="text-sm text-slate-500">
                                Consulta el historial económico de un estudiante según el período.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Estudiante *</label>
                                <select
                                    value={filtrosPagos.idEstudiante}
                                    onChange={(e) => setFiltrosPagos({ ...filtrosPagos, idEstudiante: e.target.value })}
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
                                <label className="block text-sm font-bold text-slate-700 mb-1">Período Académico *</label>
                                <select
                                    value={filtrosPagos.idPeriodoAcademico}
                                    onChange={(e) => setFiltrosPagos({ ...filtrosPagos, idPeriodoAcademico: e.target.value })}
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
                        </div>

                        <div className="mt-5 flex gap-3">
                            <button
                                onClick={generarReportePagos}
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition disabled:opacity-50"
                            >
                                {loading ? 'Generando...' : 'Generar Reporte'}
                            </button>

                            {reportePagos.length > 0 && (
                                <button
                                    onClick={descargarPDFPagos}
                                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold transition"
                                >
                                    Descargar PDF
                                </button>
                            )}
                        </div>
                    </div>

                    {reportePagos.length > 0 && (
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-5 border-b border-slate-100 bg-slate-50">
                                <h2 className="text-lg font-black text-slate-800">
                                    Historial de Pagos - {estudianteSeleccionadoPagos?.nombres} {estudianteSeleccionadoPagos?.apellidos}
                                </h2>
                                <p className="text-sm text-slate-500">Período: {periodoSeleccionadoPagos?.anio}</p>
                            </div>

                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Concepto</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Mes</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">Total</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">Pagado</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">Saldo</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Estado</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Vencimiento</th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-slate-100">
                                    {reportePagos.map((pago, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50 transition">
                                            <td className="px-6 py-4 text-sm text-slate-800 font-semibold">{pago.concepto}</td>
                                            <td className="px-6 py-4 text-sm text-slate-700">{meses[(pago.mes || 1) - 1]}</td>
                                            <td className="px-6 py-4 text-sm text-right text-slate-700">S/ {parseFloat(pago.montoTotal || 0).toFixed(2)}</td>
                                            <td className="px-6 py-4 text-sm text-right text-green-700 font-bold">S/ {parseFloat(pago.montoPagado || 0).toFixed(2)}</td>
                                            <td className="px-6 py-4 text-sm text-right text-red-700 font-bold">S/ {parseFloat(pago.saldoPendiente || 0).toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                                                    {pago.estado}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{pago.fechaVencimiento}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {reporteActivo === 'asistencia' && (
                <div>
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-6">
                        <div className="mb-5">
                            <h2 className="text-xl font-black text-slate-800">Reporte de Asistencia</h2>
                            <p className="text-sm text-slate-500">
                                Consulta la asistencia agrupada por grado/sección y rango de fechas.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Grado/Sección *</label>
                                <select
                                    value={filtrosAsistencia.idGradoSeccion}
                                    onChange={(e) => setFiltrosAsistencia({ ...filtrosAsistencia, idGradoSeccion: e.target.value })}
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
                                <label className="block text-sm font-bold text-slate-700 mb-1">Fecha Inicio *</label>
                                <input
                                    type="date"
                                    value={filtrosAsistencia.fechaInicio}
                                    onChange={(e) => setFiltrosAsistencia({ ...filtrosAsistencia, fechaInicio: e.target.value })}
                                    className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Fecha Fin *</label>
                                <input
                                    type="date"
                                    value={filtrosAsistencia.fechaFin}
                                    onChange={(e) => setFiltrosAsistencia({ ...filtrosAsistencia, fechaFin: e.target.value })}
                                    className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="mt-5 flex gap-3">
                            <button
                                onClick={generarReporteAsistencia}
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition disabled:opacity-50"
                            >
                                {loading ? 'Generando...' : 'Generar Reporte'}
                            </button>

                            {reporteAsistencia.length > 0 && (
                                <button
                                    onClick={descargarPDFAsistencia}
                                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold transition"
                                >
                                    Descargar PDF
                                </button>
                            )}
                        </div>
                    </div>

                    {reporteAsistencia.length > 0 && (
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-5 border-b border-slate-100 bg-slate-50">
                                <h2 className="text-lg font-black text-slate-800">
                                    Reporte de Asistencia - {gradoSeleccionado?.grado} {gradoSeleccionado?.seccion}
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Período: {filtrosAsistencia.fechaInicio} al {filtrosAsistencia.fechaFin}
                                </p>
                            </div>

                            <table className="min-w-full divide-y divide-slate-100">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Código</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Estudiante</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Presente</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Tarde</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Falta</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Justificado</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Total</th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-slate-100">
                                    {reporteAsistencia.map((est, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50 transition">
                                            <td className="px-6 py-4 text-sm text-slate-600">{est.codigo}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-slate-800">{est.nombres} {est.apellidos}</td>
                                            <td className="px-6 py-4 text-sm text-center text-green-700 font-bold">{est.presente || 0}</td>
                                            <td className="px-6 py-4 text-sm text-center text-yellow-700 font-bold">{est.tarde || 0}</td>
                                            <td className="px-6 py-4 text-sm text-center text-red-700 font-bold">{est.falta || 0}</td>
                                            <td className="px-6 py-4 text-sm text-center text-blue-700 font-bold">{est.justificado || 0}</td>
                                            <td className="px-6 py-4 text-sm text-center font-black text-slate-800">{est.total || 0}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default Reportes;