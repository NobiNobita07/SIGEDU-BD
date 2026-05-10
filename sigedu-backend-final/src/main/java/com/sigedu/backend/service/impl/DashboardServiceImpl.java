package com.sigedu.backend.service.impl;

import com.sigedu.backend.entity.Asistencia;
import com.sigedu.backend.entity.Nota;
import com.sigedu.backend.entity.Pago;
import com.sigedu.backend.repository.*;
import com.sigedu.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor // Reemplaza los @Autowired manuales, es más limpio
public class DashboardServiceImpl implements DashboardService {

    private final EstudianteRepository estudianteRepository;
    private final DocenteRepository docenteRepository;
    private final CursoRepository cursoRepository;
    private final MatriculaRepository matriculaRepository;
    private final NotaRepository notaRepository;
    private final AsistenciaRepository asistenciaRepository;
    private final PagoRepository pagoRepository;
    private final PeriodoAcademicoRepository periodoAcademicoRepository;
    private final GradoSeccionRepository gradoSeccionRepository;

    @Override
    public long getTotalEstudiantes() {
        return estudianteRepository.count();
    }

    @Override
    public long getTotalEstudiantesActivos() {
        return estudianteRepository.findByEstado(true).size();
    }

    @Override
    public long getTotalDocentes() {
        return docenteRepository.count();
    }

    @Override
    public long getTotalCursos() {
        return cursoRepository.count();
    }

    @Override
    public long getTotalMatriculasAnioActual() {
        int anioActual = LocalDate.now().getYear();
        return matriculaRepository.findByPeriodoAcademicoAnio(anioActual).size();
    }

    @Override
    public Map<String, Long> getEstudiantesPorGrado() {
        List<Object[]> results = gradoSeccionRepository.countEstudiantesByGrado();
        Map<String, Long> mapa = new LinkedHashMap<>();
        for (Object[] result : results) {
            mapa.put((String) result[0], ((Number) result[1]).longValue());
        }
        return mapa;
    }

    @Override
    public Map<String, Long> getEstudiantesPorNivel() {
        List<Object[]> results = gradoSeccionRepository.countEstudiantesByNivel();
        Map<String, Long> mapa = new LinkedHashMap<>();
        for (Object[] result : results) {
            mapa.put((String) result[0], ((Number) result[1]).longValue());
        }
        return mapa;
    }

    @Override
    public Map<String, Double> getPromedioNotasPorCurso(Integer idPeriodoAcademico, Integer bimestre) {
        List<Object[]> results = notaRepository.getPromedioNotasByCurso(idPeriodoAcademico, bimestre);
        Map<String, Double> mapa = new LinkedHashMap<>();
        for (Object[] result : results) {
            mapa.put((String) result[0], ((Number) result[1]).doubleValue());
        }
        return mapa;
    }

    @Override
    public Map<String, Long> getAsistenciaPorEstado(Integer idGradoSeccion, LocalDate fecha) {
        List<Asistencia> asistencias = asistenciaRepository.findByGradoSeccionAndFecha(idGradoSeccion, fecha);
        return asistencias.stream()
                .collect(Collectors.groupingBy(Asistencia::getEstado, Collectors.counting()));
    }

    @Override
    public BigDecimal getTotalIngresosPorPeriodo(Integer idPeriodoAcademico) {
        return pagoRepository.findAll().stream()
                .filter(p -> p.getMatricula().getPeriodoAcademico().getIdPeriodoAcademico().equals(idPeriodoAcademico))
                .filter(p -> "Pagado".equals(p.getEstado()))
                .map(Pago::getMontoPagado)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    public BigDecimal getTotalDeudasPendientes() {
        List<Pago> deudas = pagoRepository.findByEstado("Deuda");
        deudas.addAll(pagoRepository.findByEstado("Pendiente"));
        return deudas.stream()
                .map(Pago::getSaldoPendiente)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    public Map<String, BigDecimal> getIngresosPorMes(Integer anio) {
        Map<String, BigDecimal> ingresosPorMes = new LinkedHashMap<>();
        List<Pago> todosLosPagos = pagoRepository.findAll();

        for (int mes = 1; mes <= 12; mes++) {
            final int mesActual = mes;
            BigDecimal totalMes = todosLosPagos.stream()
                    .filter(p -> "Pagado".equals(p.getEstado()))
                    .filter(p -> p.getFechaVencimiento() != null)
                    .filter(p -> p.getFechaVencimiento().getYear() == anio)
                    .filter(p -> p.getFechaVencimiento().getMonthValue() == mesActual)
                    .map(Pago::getMontoPagado)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            ingresosPorMes.put(obtenerNombreMes(mes), totalMes);
        }
        return ingresosPorMes;
    }

    @Override
    public List<Map<String, Object>> getTopDeudores(int limite) {
        List<Pago> deudas = pagoRepository.findByEstado("Deuda");
        deudas.addAll(pagoRepository.findByEstado("Pendiente"));

        Map<Integer, BigDecimal> deudasPorEstudiante = new HashMap<>();
        for (Pago pago : deudas) {
            Integer idEstudiante = pago.getMatricula().getEstudiante().getIdEstudiante();
            deudasPorEstudiante.merge(idEstudiante, pago.getSaldoPendiente(), BigDecimal::add);
        }

        return deudasPorEstudiante.entrySet().stream()
                .sorted(Map.Entry.<Integer, BigDecimal>comparingByValue().reversed())
                .limit(limite)
                .map(entry -> {
                    Map<String, Object> mapa = new HashMap<>();
                    estudianteRepository.findById(entry.getKey()).ifPresent(estudiante -> {
                        mapa.put("idEstudiante", estudiante.getIdEstudiante());
                        mapa.put("codigo", estudiante.getCodigo());
                        mapa.put("nombres", estudiante.getNombres());
                        mapa.put("apellidos", estudiante.getApellidos());
                        mapa.put("totalDeuda", entry.getValue());
                    });
                    return mapa;
                })
                .filter(mapa -> !mapa.isEmpty())
                .toList();
    }

    @Override
    public List<Map<String, Object>> getReporteNotasEstudiante(Integer idEstudiante, Integer idPeriodoAcademico) {
        Integer anio = periodoAcademicoRepository.findById(idPeriodoAcademico)
                .map(p -> p.getAnio()).orElse(LocalDate.now().getYear());

        List<Nota> notas = notaRepository.findNotasByEstudianteAndAnio(idEstudiante, anio);
        Map<Integer, Map<String, Object>> reporte = new LinkedHashMap<>();

        for (Nota nota : notas) {
            Map<String, Object> cursoData = reporte.computeIfAbsent(nota.getCurso().getIdCurso(), k -> {
                Map<String, Object> data = new LinkedHashMap<>();
                data.put("curso", nota.getCurso().getNombre());
                for(int i=1; i<=4; i++) data.put("bimestre" + i, null);
                data.put("promedio", 0.0);
                return data;
            });

            cursoData.put("bimestre" + nota.getBimestre(), nota.getNota());

            double suma = 0; int count = 0;
            for (int i = 1; i <= 4; i++) {
                BigDecimal val = (BigDecimal) cursoData.get("bimestre" + i);
                if (val != null) { suma += val.doubleValue(); count++; }
            }
            double promedio = count > 0 ? suma / count : 0;
            cursoData.put("promedio", Math.round(promedio * 100) / 100.0);
        }
        return new ArrayList<>(reporte.values());
    }

    @Override
    public List<Map<String, Object>> getReportePagosEstudiante(Integer idEstudiante, Integer idPeriodoAcademico) {
        List<Pago> pagos = pagoRepository.findDeudasByEstudiante(idEstudiante);
        matriculaRepository.findMatriculaActivaByEstudiante(idEstudiante)
                .ifPresent(m -> pagos.addAll(pagoRepository.findByMatriculaIdMatricula(m.getIdMatricula())));

        return pagos.stream()
                .filter(p -> p.getMatricula().getPeriodoAcademico().getIdPeriodoAcademico().equals(idPeriodoAcademico))
                .distinct() // Evitar duplicados si la consulta devuelve lo mismo
                .map(p -> {
                    Map<String, Object> mapa = new LinkedHashMap<>();
                    mapa.put("concepto", p.getTipoPago().getConcepto());
                    mapa.put("mes", p.getMes());
                    mapa.put("montoTotal", p.getMontoTotal());
                    mapa.put("montoPagado", p.getMontoPagado());
                    mapa.put("saldoPendiente", p.getSaldoPendiente());
                    mapa.put("estado", p.getEstado());
                    mapa.put("fechaVencimiento", p.getFechaVencimiento());
                    return mapa;
                }).toList();
    }

    @Override
    public List<Map<String, Object>> getReporteAsistenciaGrado(Integer idGradoSeccion, LocalDate fechaInicio, LocalDate fechaFin) {
        Map<Integer, Map<String, Object>> reportePorEstudiante = new LinkedHashMap<>();

        LocalDate fechaActual = fechaInicio;
        while (!fechaActual.isAfter(fechaFin)) {
            List<Asistencia> asistencias = asistenciaRepository.findByGradoSeccionAndFecha(idGradoSeccion, fechaActual);
            for (Asistencia asistencia : asistencias) {
                Integer idEstudiante = asistencia.getMatricula().getEstudiante().getIdEstudiante();
                Map<String, Object> data = reportePorEstudiante.computeIfAbsent(idEstudiante, k -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("codigo", asistencia.getMatricula().getEstudiante().getCodigo());
                    row.put("nombres", asistencia.getMatricula().getEstudiante().getNombres());
                    row.put("apellidos", asistencia.getMatricula().getEstudiante().getApellidos());
                    row.put("presente", 0L); row.put("tarde", 0L); row.put("falta", 0L); row.put("justificado", 0L);
                    row.put("total", 0L);
                    return row;
                });

                String estado = asistencia.getEstado().toLowerCase();
                if (data.containsKey(estado)) {
                    data.put(estado, (Long) data.get(estado) + 1L);
                }
                data.put("total", (Long) data.get("total") + 1L);
            }
            fechaActual = fechaActual.plusDays(1);
        }
        return new ArrayList<>(reportePorEstudiante.values());
    }


    @Override
    public Map<String, Object> getResumenEjecutivo(Integer idPeriodoAcademico) {
        Map<String, Object> resumen = new LinkedHashMap<>();
        resumen.put("totalEstudiantes", getTotalEstudiantes());
        resumen.put("totalEstudiantesActivos", getTotalEstudiantesActivos());
        resumen.put("totalDocentes", getTotalDocentes());
        resumen.put("totalCursos", getTotalCursos());
        resumen.put("totalIngresos", getTotalIngresosPorPeriodo(idPeriodoAcademico));
        resumen.put("totalDeudasPendientes", getTotalDeudasPendientes());
        resumen.put("pagosPorEstado", getResumenPagosPorEstado(idPeriodoAcademico));
        resumen.put("promedioGeneralPorCurso", notaRepository.getPromedioGeneralNotasByCurso(idPeriodoAcademico).stream()
                .collect(Collectors.toMap(
                        row -> (String) row[0],
                        row -> Math.round(((Number) row[1]).doubleValue() * 100.0) / 100.0,
                        (a, b) -> a,
                        LinkedHashMap::new
                )));
        return resumen;
    }

    @Override
    public Map<String, Object> getResumenNotasEstudiante(Integer idEstudiante, Integer idPeriodoAcademico) {
        Map<String, Object> resumen = new LinkedHashMap<>();
        Double promedio = notaRepository.getPromedioGeneralEstudiante(idEstudiante, idPeriodoAcademico);
        List<Map<String, Object>> detalle = getReporteNotasEstudiante(idEstudiante, idPeriodoAcademico);

        resumen.put("idEstudiante", idEstudiante);
        resumen.put("idPeriodoAcademico", idPeriodoAcademico);
        resumen.put("promedioGeneral", promedio == null ? 0.0 : Math.round(promedio * 100.0) / 100.0);
        resumen.put("situacion", promedio != null && promedio >= 11.0 ? "Aprobado" : "En riesgo");
        resumen.put("totalCursosEvaluados", detalle.size());
        resumen.put("detalleCursos", detalle);
        return resumen;
    }

    @Override
    public Map<String, Object> getResumenAsistenciaEstudiante(Integer idEstudiante, LocalDate fechaInicio, LocalDate fechaFin) {
        Map<String, Long> estados = new LinkedHashMap<>();
        estados.put("Presente", 0L);
        estados.put("Tarde", 0L);
        estados.put("Falta", 0L);
        estados.put("Justificado", 0L);

        for (Object[] row : asistenciaRepository.countEstadosByEstudianteAndRangoFechas(idEstudiante, fechaInicio, fechaFin)) {
            estados.put(String.valueOf(row[0]), ((Number) row[1]).longValue());
        }

        long total = estados.values().stream().mapToLong(Long::longValue).sum();
        long asistenciasValidas = estados.getOrDefault("Presente", 0L) + estados.getOrDefault("Tarde", 0L) + estados.getOrDefault("Justificado", 0L);
        double porcentajeAsistencia = total == 0 ? 0.0 : (asistenciasValidas * 100.0) / total;

        Map<String, Object> resumen = new LinkedHashMap<>();
        resumen.put("idEstudiante", idEstudiante);
        resumen.put("fechaInicio", fechaInicio);
        resumen.put("fechaFin", fechaFin);
        resumen.put("totalRegistros", total);
        resumen.put("conteoPorEstado", estados);
        resumen.put("porcentajeAsistencia", Math.round(porcentajeAsistencia * 100.0) / 100.0);
        resumen.put("situacion", porcentajeAsistencia >= 80.0 ? "Regular" : "Requiere seguimiento");
        return resumen;
    }

    @Override
    public List<Map<String, Object>> getPagosPendientes(Integer idPeriodoAcademico) {
        List<Pago> pagos = idPeriodoAcademico == null
                ? pagoRepository.findPagosPendientesOrdenados()
                : pagoRepository.findPagosPendientesByPeriodo(idPeriodoAcademico);

        return pagos.stream().map(p -> {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("idPago", p.getIdPago());
            row.put("idEstudiante", p.getMatricula().getEstudiante().getIdEstudiante());
            row.put("codigo", p.getMatricula().getEstudiante().getCodigo());
            row.put("estudiante", p.getMatricula().getEstudiante().getNombres() + " " + p.getMatricula().getEstudiante().getApellidos());
            row.put("concepto", p.getTipoPago().getConcepto());
            row.put("mes", p.getMes());
            row.put("montoTotal", p.getMontoTotal());
            row.put("montoPagado", p.getMontoPagado());
            row.put("saldoPendiente", p.getSaldoPendiente());
            row.put("estado", p.getEstado());
            row.put("fechaVencimiento", p.getFechaVencimiento());
            return row;
        }).toList();
    }

    @Override
    public Map<String, BigDecimal> getResumenPagosPorEstado(Integer idPeriodoAcademico) {
        Map<String, BigDecimal> resumen = new LinkedHashMap<>();
        for (Object[] row : pagoRepository.resumenPagosByPeriodo(idPeriodoAcademico)) {
            String estado = String.valueOf(row[0]);
            BigDecimal totalSaldo = row[2] instanceof BigDecimal ? (BigDecimal) row[2] : new BigDecimal(String.valueOf(row[2]));
            resumen.put(estado, totalSaldo);
        }
        return resumen;
    }

    @Override
    public Map<String, Long> getResumenAsistenciaGeneral(LocalDate fechaInicio, LocalDate fechaFin) {
        Map<String, Long> resumen = new LinkedHashMap<>();
        resumen.put("Presente", 0L);
        resumen.put("Tarde", 0L);
        resumen.put("Falta", 0L);
        resumen.put("Justificado", 0L);

        for (Object[] row : asistenciaRepository.countEstadosByRangoFechas(fechaInicio, fechaFin)) {
            resumen.put(String.valueOf(row[0]), ((Number) row[1]).longValue());
        }
        return resumen;
    }

    private String obtenerNombreMes(int mes) {
        return new String[]{"Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"}[mes - 1];
    }
}