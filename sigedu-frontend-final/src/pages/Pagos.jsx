import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { pagoService } from '../api/pagoService';
import { matriculaService } from '../api/matriculaService';
import { tipoPagoService } from '../api/tipoPagoService';
import { estudianteService } from '../api/estudianteService';

const Pagos = () => {
    const [pagos, setPagos] = useState([]);
    const [matriculas, setMatriculas] = useState([]);
    const [tiposPago, setTiposPago] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalPagoOpen, setModalPagoOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [selectedPago, setSelectedPago] = useState(null);
    const [alert, setAlert] = useState(null);
    const [filtroEstado, setFiltroEstado] = useState('');
    const [filtroEstudiante, setFiltroEstudiante] = useState('');
    const [busqueda, setBusqueda] = useState('');

    const [formData, setFormData] = useState({
        matricula: { idMatricula: '' },
        tipoPago: { idTipoPago: '' },
        mes: new Date().getMonth() + 1,
        montoTotal: '',
        fechaVencimiento: new Date().toISOString().split('T')[0]
    });

    const [pagoData, setPagoData] = useState({
        montoPagado: '',
        medioPago: 'Efectivo',
        numeroOperacion: ''
    });

    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const mediosPago = ['Efectivo', 'Yape', 'Transferencia BCP', 'Depósito BCP'];

    const infoMetodoPago = {
        Yape: {
            titulo: 'Pago mediante Yape',
            qr: '/yape_qr.png',
            texto: 'Escanea el código QR desde Yape y registra el número de operación.',
            extra: 'Número Yape: 938 666 927'
        },
        'Transferencia BCP': {
            titulo: 'Transferencia Bancaria BCP',
            qr: null,
            texto: 'Realiza la transferencia bancaria y registra el número de operación.',
            extra: 'Cuenta BCP: 22092223790043 | CCI: 00222019222379004320 | Titular: Edson Alexander Gomez Guevara | Moneda: Soles'
        },
        'Depósito BCP': {
            titulo: 'Depósito Bancario BCP',
            qr: null,
            texto: 'Realiza el depósito a la cuenta BCP y registra el número de operación o voucher.',
            extra: 'Cuenta BCP: 22092223790043 | CCI: 00222019222379004320 | Titular: Edson Alexander Gomez Guevara | Moneda: Soles'
        }
    };

    const estadosPago = ['Pagado', 'Pendiente', 'Deuda', 'Anulado'];

    const estadoColors = {
        Pagado: 'bg-green-100 text-green-700',
        Pendiente: 'bg-yellow-100 text-yellow-700',
        Deuda: 'bg-red-100 text-red-700',
        Anulado: 'bg-gray-100 text-gray-700'
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setLoading(true);

            const [pagosRes, matriculasRes, tiposRes, estudiantesRes] = await Promise.all([
                pagoService.getAll(),
                matriculaService.getAll(),
                tipoPagoService.getAll(),
                estudianteService.getAll()
            ]);

            if (pagosRes.success) setPagos(pagosRes.data || []);
            if (matriculasRes.success) setMatriculas(matriculasRes.data || []);
            if (tiposRes.success) setTiposPago(tiposRes.data || []);
            if (estudiantesRes.success) setEstudiantes(estudiantesRes.data || []);
        } catch (error) {
            setAlert({
                type: 'error',
                message: error.response?.data?.message || 'Error al cargar datos'
            });
        } finally {
            setLoading(false);
        }
    };

    const getEstudianteNombre = (pago) => {
        return `${pago.matricula?.estudiante?.nombres || ''} ${pago.matricula?.estudiante?.apellidos || ''}`.trim();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'matriculaId') {
            setFormData({ ...formData, matricula: { idMatricula: parseInt(value) } });
        } else if (name === 'tipoPagoId') {
            const tipo = tiposPago.find(t => t.idTipoPago === parseInt(value));
            setFormData({
                ...formData,
                tipoPago: { idTipoPago: parseInt(value) },
                montoTotal: tipo ? tipo.montoBase : ''
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handlePagoInputChange = (e) => {
        const { name, value } = e.target;
        setPagoData({ ...pagoData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = editing
                ? await pagoService.update(editing, formData)
                : await pagoService.create(formData);

            if (response.success) {
                setAlert({
                    type: 'success',
                    message: editing ? 'Pago actualizado exitosamente' : 'Pago creado exitosamente'
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

    const handleRegistrarPago = async (e) => {
        e.preventDefault();

        if (!selectedPago) return;

        const monto = parseFloat(pagoData.montoPagado);

        if (isNaN(monto) || monto <= 0) {
            setAlert({ type: 'error', message: 'Ingrese un monto válido' });
            return;
        }

        try {
            const response = await pagoService.registrarPago(selectedPago.idPago, {
                montoPagado: monto,
                medioPago: pagoData.medioPago,
                numeroOperacion: pagoData.numeroOperacion
            });

            if (response.success) {
                setAlert({
                    type: 'success',
                    message: 'Pago registrado exitosamente'
                });

                setModalPagoOpen(false);
                setSelectedPago(null);
                setPagoData({
                    montoPagado: '',
                    medioPago: 'Efectivo',
                    numeroOperacion: ''
                });
                cargarDatos();
            }
        } catch (error) {
            setAlert({
                type: 'error',
                message: error.response?.data?.message || 'Error al registrar pago'
            });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de anular este pago?')) return;

        try {
            const response = await pagoService.delete(id);

            if (response.success) {
                setAlert({
                    type: 'success',
                    message: 'Pago anulado exitosamente'
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

    const handleEdit = (pago) => {
        setEditing(pago.idPago);

        setFormData({
            matricula: { idMatricula: pago.matricula.idMatricula },
            tipoPago: { idTipoPago: pago.tipoPago.idTipoPago },
            mes: pago.mes,
            montoTotal: pago.montoTotal,
            fechaVencimiento: pago.fechaVencimiento
        });

        setModalOpen(true);
    };

    const handleAbrirModalPago = (pago) => {
        setSelectedPago(pago);
        setPagoData({
            montoPagado: '',
            medioPago: 'Efectivo',
            numeroOperacion: ''
        });
        setModalPagoOpen(true);
    };

    const resetForm = () => {
        setEditing(null);
        setFormData({
            matricula: { idMatricula: '' },
            tipoPago: { idTipoPago: '' },
            mes: new Date().getMonth() + 1,
            montoTotal: '',
            fechaVencimiento: new Date().toISOString().split('T')[0]
        });
    };

    const pagosFiltrados = pagos.filter(p => {
        if (filtroEstado && p.estado !== filtroEstado) return false;
        if (filtroEstudiante && p.matricula?.estudiante?.idEstudiante !== parseInt(filtroEstudiante)) return false;

        const texto = busqueda.toLowerCase().trim();

        if (!texto) return true;

        const estudiante = getEstudianteNombre(p).toLowerCase();
        const codigo = p.matricula?.estudiante?.codigo?.toLowerCase() || '';
        const dni = p.matricula?.estudiante?.dni?.toLowerCase() || '';
        const concepto = p.tipoPago?.concepto?.toLowerCase() || '';
        const mes = meses[(p.mes || 1) - 1]?.toLowerCase() || '';
        const montoTotal = String(p.montoTotal || '').toLowerCase();
        const montoPagado = String(p.montoPagado || '').toLowerCase();
        const saldo = String(p.saldoPendiente || '').toLowerCase();
        const estado = p.estado?.toLowerCase() || '';
        const vencimiento = p.fechaVencimiento?.toLowerCase() || '';

        return (
            estudiante.includes(texto) ||
            codigo.includes(texto) ||
            dni.includes(texto) ||
            concepto.includes(texto) ||
            mes.includes(texto) ||
            montoTotal.includes(texto) ||
            montoPagado.includes(texto) ||
            saldo.includes(texto) ||
            estado.includes(texto) ||
            vencimiento.includes(texto)
        );
    });

    const totalDeudas = pagosFiltrados
        .filter(p => p.estado === 'Deuda' || p.estado === 'Pendiente')
        .reduce((sum, p) => sum + parseFloat(p.saldoPendiente || 0), 0);

    const totalPagado = pagosFiltrados
        .reduce((sum, p) => sum + parseFloat(p.montoPagado || 0), 0);

    const pagosPendientes = pagosFiltrados.filter(
        p => p.estado === 'Deuda' || p.estado === 'Pendiente'
    ).length;

    const pagosCompletos = pagosFiltrados.filter(p => p.estado === 'Pagado').length;

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
                                Gestión económica
                            </p>
                            <h1 className="text-3xl font-black text-slate-900">
                                Pagos
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Administra deudas, pagos, saldos pendientes y métodos de pago institucionales.
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
                            <span>Crear Deuda</span>
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
                    <p className="text-3xl font-black text-slate-900 mt-1">{pagosFiltrados.length}</p>
                </div>

                <div className="bg-green-50 rounded-2xl shadow-sm border border-green-100 p-5">
                    <p className="text-sm text-green-700">Total pagado</p>
                    <p className="text-3xl font-black text-green-700 mt-1">S/ {totalPagado.toFixed(2)}</p>
                </div>

                <div className="bg-red-50 rounded-2xl shadow-sm border border-red-100 p-5">
                    <p className="text-sm text-red-700">Deuda pendiente</p>
                    <p className="text-3xl font-black text-red-700 mt-1">S/ {totalDeudas.toFixed(2)}</p>
                </div>

                <div className="bg-yellow-50 rounded-2xl shadow-sm border border-yellow-100 p-5">
                    <p className="text-sm text-yellow-700">Pagos pendientes</p>
                    <p className="text-3xl font-black text-yellow-700 mt-1">{pagosPendientes}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">
                            Filtrar por Estado
                        </label>

                        <select
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                            className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todos los estados</option>
                            {estadosPago.map(e => (
                                <option key={e} value={e}>{e}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">
                            Filtrar por Estudiante
                        </label>

                        <select
                            value={filtroEstudiante}
                            onChange={(e) => setFiltroEstudiante(e.target.value)}
                            className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todos los estudiantes</option>
                            {estudiantes.map(e => (
                                <option key={e.idEstudiante} value={e.idEstudiante}>
                                    {e.codigo} - {e.nombres} {e.apellidos}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">
                            Búsqueda general
                        </label>

                        <input
                            type="text"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Buscar Estudiante, Concepto, Mes o Estado..."
                            className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-slate-500">
                        Resultados encontrados: {pagosFiltrados.length}
                    </p>

                    {(busqueda || filtroEstado || filtroEstudiante) && (
                        <button
                            onClick={() => {
                                setBusqueda('');
                                setFiltroEstado('');
                                setFiltroEstudiante('');
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
                            Registro de pagos
                        </h2>
                        <p className="text-sm text-slate-500">
                            Control de obligaciones económicas, deudas y pagos realizados.
                        </p>
                    </div>
                </div>

                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Estudiante</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Concepto</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Mes</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Total</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Pagado</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Saldo</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Estado</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Vencimiento</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Acciones</th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-slate-100">
                        {pagosFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="px-6 py-12 text-center text-slate-500">
                                    {busqueda || filtroEstado || filtroEstudiante
                                        ? 'No se encontraron pagos con los filtros aplicados.'
                                        : 'No hay pagos registrados.'}
                                </td>
                            </tr>
                        ) : (
                            pagosFiltrados.map((pago) => (
                                <tr key={pago.idPago} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        <span className="font-bold text-slate-900">
                                            {getEstudianteNombre(pago)}
                                        </span>
                                        <div className="text-xs text-slate-500">
                                            Código: {pago.matricula?.estudiante?.codigo}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-slate-700">{pago.tipoPago?.concepto}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700">{meses[pago.mes - 1]}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700">S/ {parseFloat(pago.montoTotal).toFixed(2)}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-green-700">S/ {parseFloat(pago.montoPagado || 0).toFixed(2)}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-red-700">S/ {parseFloat(pago.saldoPendiente || 0).toFixed(2)}</td>

                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${estadoColors[pago.estado]}`}>
                                            {pago.estado}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-slate-600">{pago.fechaVencimiento}</td>

                                    <td className="px-6 py-4 text-sm font-medium">
                                        <div className="flex gap-2">
                                            {pago.estado !== 'Pagado' && pago.estado !== 'Anulado' && (
                                                <button
                                                    onClick={() => handleAbrirModalPago(pago)}
                                                    className="px-3 py-1.5 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 font-semibold transition"
                                                >
                                                    Pagar
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handleEdit(pago)}
                                                className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition"
                                            >
                                                Editar
                                            </button>

                                            <button
                                                onClick={() => handleDelete(pago.idPago)}
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

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Deuda' : 'Crear Deuda'} size="lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                        <h3 className="text-lg font-black text-slate-800 mb-1">
                            Datos de la Deuda
                        </h3>
                        <p className="text-sm text-slate-500 mb-4">
                            Registre la obligación económica asociada a una matrícula.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Estudiante *</label>
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
                                <label className="block text-sm font-bold text-slate-700 mb-1">Concepto *</label>
                                <select
                                    name="tipoPagoId"
                                    value={formData.tipoPago.idTipoPago}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Seleccionar concepto</option>
                                    {tiposPago.map(t => (
                                        <option key={t.idTipoPago} value={t.idTipoPago}>
                                            {t.concepto} - S/ {t.montoBase}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Mes *</label>
                                <select
                                    name="mes"
                                    value={formData.mes}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {meses.map((m, i) => (
                                        <option key={i + 1} value={i + 1}>{m}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Monto Total *</label>
                                <input
                                    type="number"
                                    name="montoTotal"
                                    value={formData.montoTotal}
                                    onChange={handleInputChange}
                                    required
                                    step="0.01"
                                    min="0"
                                    className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-slate-700 mb-1">Fecha Vencimiento *</label>
                                <input
                                    type="date"
                                    name="fechaVencimiento"
                                    value={formData.fechaVencimiento}
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

            <Modal
                isOpen={modalPagoOpen}
                onClose={() => { setModalPagoOpen(false); setSelectedPago(null); }}
                title="Registrar Pago"
                size="md"
            >
                {selectedPago && (
                    <form onSubmit={handleRegistrarPago} className="space-y-6">
                        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
                            <h3 className="text-lg font-black text-slate-800 mb-3">
                                Resumen de deuda
                            </h3>
                            <p className="text-sm text-slate-600">
                                Estudiante:
                                <span className="font-bold text-slate-800"> {selectedPago.matricula?.estudiante?.nombres} {selectedPago.matricula?.estudiante?.apellidos}</span>
                            </p>
                            <p className="text-sm text-slate-600">
                                Concepto:
                                <span className="font-bold text-slate-800"> {selectedPago.tipoPago?.concepto}</span>
                            </p>
                            <p className="text-sm text-slate-600">
                                Saldo pendiente:
                                <span className="font-black text-red-600"> S/ {parseFloat(selectedPago.saldoPendiente || 0).toFixed(2)}</span>
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Monto a Pagar *</label>
                            <input
                                type="number"
                                name="montoPagado"
                                value={pagoData.montoPagado}
                                onChange={handlePagoInputChange}
                                required
                                step="0.01"
                                min="0.01"
                                max={selectedPago.saldoPendiente}
                                className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                Máximo: S/ {parseFloat(selectedPago.saldoPendiente || 0).toFixed(2)}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Método de Pago *</label>
                            <select
                                name="medioPago"
                                value={pagoData.medioPago}
                                onChange={handlePagoInputChange}
                                required
                                className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {mediosPago.map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>

                        {infoMetodoPago[pagoData.medioPago] && (
                            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 shadow-sm">
                                <div className="flex flex-col md:flex-row gap-5 items-center">
                                    {infoMetodoPago[pagoData.medioPago].qr && (
                                        <img
                                            src={infoMetodoPago[pagoData.medioPago].qr}
                                            alt={infoMetodoPago[pagoData.medioPago].titulo}
                                            className="w-52 h-52 object-contain bg-white border rounded-2xl p-2 shadow"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    )}

                                    <div className="flex-1">
                                        <h3 className="text-lg font-black text-blue-900 mb-2">
                                            {infoMetodoPago[pagoData.medioPago].titulo}
                                        </h3>

                                        <p className="text-sm text-slate-700 mb-3">
                                            {infoMetodoPago[pagoData.medioPago].texto}
                                        </p>

                                        <div className="bg-white border rounded-xl p-3">
                                            <p className="text-sm font-bold text-slate-800">
                                                Datos de pago:
                                            </p>
                                            <p className="text-sm text-slate-700">
                                                {infoMetodoPago[pagoData.medioPago].extra}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Número de Operación</label>
                            <input
                                type="text"
                                name="numeroOperacion"
                                value={pagoData.numeroOperacion}
                                onChange={handlePagoInputChange}
                                className="w-full border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ejemplo: 874512963"
                            />
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={() => { setModalPagoOpen(false); setSelectedPago(null); }}
                                className="px-5 py-2.5 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-bold"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold shadow-lg shadow-green-900/20"
                            >
                                Registrar Pago
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
        </>
    );
};

export default Pagos;