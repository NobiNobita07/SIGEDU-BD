import React, { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';
import { dashboardService } from '../api/dashboardService';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [estudiantesPorGrado, setEstudiantesPorGrado] = useState({});
    const [ingresosPorMes, setIngresosPorMes] = useState({});
    const [topDeudores, setTopDeudores] = useState([]);

    useEffect(() => {
        cargarDashboard();
    }, []);

    const cargarDashboard = async () => {
        try {
            setLoading(true);

            const [statsRes, gradoRes, ingresosRes, deudoresRes] = await Promise.all([
                dashboardService.getEstadisticasGenerales(),
                dashboardService.getEstudiantesPorGrado(),
                dashboardService.getIngresosPorMes(2025),
                dashboardService.getTopDeudores(5)
            ]);

            if (statsRes.success) setStats(statsRes.data || {});
            if (gradoRes.success) setEstudiantesPorGrado(gradoRes.data || {});
            if (ingresosRes.success) setIngresosPorMes(ingresosRes.data || {});
            if (deudoresRes.success) setTopDeudores(deudoresRes.data || []);
        } catch (error) {
            console.error('Error cargando dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalEstudiantes = stats?.totalEstudiantes || 0;
    const totalEstudiantesActivos = stats?.totalEstudiantesActivos || 0;
    const totalDocentes = stats?.totalDocentes || 0;
    const totalCursos = stats?.totalCursos || 0;

    const totalIngresos = Object.values(ingresosPorMes || {}).reduce(
        (sum, value) => sum + Number(value || 0),
        0
    );

    const totalDeudaPendiente = topDeudores.reduce(
        (sum, item) => sum + Number(item.totalDeuda || 0),
        0
    );

    const maxIngreso = Math.max(...Object.values(ingresosPorMes || {}).map(v => Number(v || 0)), 1);

    const cardStats = [
        {
            title: 'Total estudiantes',
            value: totalEstudiantes,
            subtitle: 'Registros académicos',
            icon: '🎓',
            bg: 'bg-blue-50',
            iconBg: 'bg-blue-600',
            text: 'text-blue-700'
        },
        {
            title: 'Estudiantes activos',
            value: totalEstudiantesActivos,
            subtitle: 'Actualmente matriculados',
            icon: '✅',
            bg: 'bg-emerald-50',
            iconBg: 'bg-emerald-600',
            text: 'text-emerald-700'
        },
        {
            title: 'Total docentes',
            value: totalDocentes,
            subtitle: 'Personal académico',
            icon: '👨‍🏫',
            bg: 'bg-purple-50',
            iconBg: 'bg-purple-600',
            text: 'text-purple-700'
        },
        {
            title: 'Total cursos',
            value: totalCursos,
            subtitle: 'Cursos registrados',
            icon: '📚',
            bg: 'bg-amber-50',
            iconBg: 'bg-amber-500',
            text: 'text-amber-700'
        }
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner />
            </div>
        );
    }

    return (
        <>
            <div className="mb-8">
                <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl shadow-xl p-8 text-white">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <p className="text-blue-100 text-sm font-semibold uppercase tracking-wide mb-2">
                                SIGEDU-BD
                            </p>
                            <h1 className="text-3xl font-black mb-2">
                                Panel de control institucional
                            </h1>
                            <p className="text-blue-100 max-w-2xl">
                                Resumen general de la gestión académica, administrativa y económica de la institución educativa.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 min-w-[280px]">
                            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
                                <p className="text-xs text-blue-100">Ingresos 2025</p>
                                <p className="text-xl font-bold">S/ {totalIngresos.toFixed(2)}</p>
                            </div>

                            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
                                <p className="text-xs text-blue-100">Deuda pendiente</p>
                                <p className="text-xl font-bold text-red-200">S/ {totalDeudaPendiente.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cards principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                {cardStats.map((card) => (
                    <div
                        key={card.title}
                        className={`${card.bg} bg-white rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-lg transition-all`}
                    >
                        <div className="flex items-center justify-between mb-5">
                            <div className={`w-14 h-14 ${card.iconBg} rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg`}>
                                {card.icon}
                            </div>
                            <span className={`text-xs font-bold ${card.text} bg-white px-3 py-1 rounded-full`}>
                                Activo
                            </span>
                        </div>

                        <p className="text-sm text-slate-500 font-medium">{card.title}</p>
                        <p className="text-4xl font-black text-slate-900 mt-1">{card.value}</p>
                        <p className="text-xs text-slate-500 mt-2">{card.subtitle}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                {/* Estudiantes por grado */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-black text-slate-800">
                                Estudiantes por grado
                            </h2>
                            <p className="text-sm text-slate-500">
                                Distribución de estudiantes según nivel o grado académico.
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl">
                            📊
                        </div>
                    </div>

                    {Object.keys(estudiantesPorGrado || {}).length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            <p className="text-lg font-semibold">No hay datos registrados</p>
                            <p className="text-sm">Los datos aparecerán cuando existan matrículas.</p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {Object.entries(estudiantesPorGrado).map(([grado, cantidad]) => {
                                const porcentaje = totalEstudiantes > 0
                                    ? (cantidad / totalEstudiantes) * 100
                                    : 0;

                                return (
                                    <div key={grado}>
                                        <div className="flex justify-between items-center text-sm mb-2">
                                            <span className="font-bold text-slate-700">{grado}</span>
                                            <span className="text-slate-500">
                                                {cantidad} estudiante{cantidad !== 1 ? 's' : ''}
                                            </span>
                                        </div>

                                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all"
                                                style={{ width: `${Math.min(porcentaje, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Pagos pendientes destacados */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-black text-slate-800">
                                Pagos pendientes destacados
                            </h2>
                            <p className="text-sm text-slate-500">
                                Estudiantes con saldos pendientes más relevantes.
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-2xl">
                            💰
                        </div>
                    </div>

                    {topDeudores.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            <p className="text-lg font-semibold">No hay pagos pendientes</p>
                            <p className="text-sm">La institución no registra deudas activas.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {topDeudores.map((deudor, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-black">
                                            {index + 1}
                                        </div>

                                        <div>
                                            <p className="font-bold text-slate-800">
                                                {deudor.nombres} {deudor.apellidos}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Código: {deudor.codigo}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-red-600 font-black">
                                            S/ {Number(deudor.totalDeuda || 0).toFixed(2)}
                                        </p>
                                        <p className="text-xs text-slate-400">Pendiente</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Ingresos por mes */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-black text-slate-800">
                            Ingresos mensuales - 2025
                        </h2>
                        <p className="text-sm text-slate-500">
                            Resumen visual de ingresos registrados por mes.
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-xs text-slate-500">Total anual</p>
                        <p className="text-2xl font-black text-blue-700">
                            S/ {totalIngresos.toFixed(2)}
                        </p>
                    </div>
                </div>

                {Object.keys(ingresosPorMes || {}).length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <p className="text-lg font-semibold">No hay ingresos registrados</p>
                        <p className="text-sm">Los ingresos aparecerán cuando existan pagos confirmados.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-6 md:grid-cols-12 gap-3 items-end">
                        {Object.entries(ingresosPorMes).map(([mes, monto]) => {
                            const altura = maxIngreso > 0
                                ? Math.max((Number(monto || 0) / maxIngreso) * 100, 4)
                                : 4;

                            return (
                                <div key={mes} className="text-center">
                                    <div className="h-36 bg-slate-100 rounded-2xl flex items-end overflow-hidden border border-slate-100">
                                        <div
                                            className="w-full bg-gradient-to-t from-blue-700 to-blue-400 rounded-2xl transition-all"
                                            style={{ height: `${altura}%` }}
                                        />
                                    </div>

                                    <p className="text-xs mt-2 font-bold text-slate-700">
                                        {mes.substring(0, 3)}
                                    </p>
                                    <p className="text-[11px] text-slate-500">
                                        S/ {Number(monto || 0).toFixed(0)}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
};

export default Dashboard;