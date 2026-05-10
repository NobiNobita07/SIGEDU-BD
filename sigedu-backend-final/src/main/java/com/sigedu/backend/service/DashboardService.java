package com.sigedu.backend.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface DashboardService {

    // Estadísticas generales
    long getTotalEstudiantes();
    long getTotalEstudiantesActivos();
    long getTotalDocentes();
    long getTotalCursos();
    long getTotalMatriculasAnioActual();

    // Estadísticas por grado
    Map<String, Long> getEstudiantesPorGrado();
    Map<String, Long> getEstudiantesPorNivel();

    // Estadísticas académicas
    Map<String, Double> getPromedioNotasPorCurso(Integer idPeriodoAcademico, Integer bimestre);
    Map<String, Long> getAsistenciaPorEstado(Integer idGradoSeccion, LocalDate fecha);

    // Estadísticas financieras
    BigDecimal getTotalIngresosPorPeriodo(Integer idPeriodoAcademico);
    BigDecimal getTotalDeudasPendientes();
    Map<String, BigDecimal> getIngresosPorMes(Integer anio);
    List<Map<String, Object>> getTopDeudores(int limite);

    // Reportes existentes
    List<Map<String, Object>> getReporteNotasEstudiante(Integer idEstudiante, Integer idPeriodoAcademico);
    List<Map<String, Object>> getReportePagosEstudiante(Integer idEstudiante, Integer idPeriodoAcademico);
    List<Map<String, Object>> getReporteAsistenciaGrado(Integer idGradoSeccion, LocalDate fechaInicio, LocalDate fechaFin);

    // Reportes profesionales agregados en el Paso 12
    Map<String, Object> getResumenEjecutivo(Integer idPeriodoAcademico);
    Map<String, Object> getResumenNotasEstudiante(Integer idEstudiante, Integer idPeriodoAcademico);
    Map<String, Object> getResumenAsistenciaEstudiante(Integer idEstudiante, LocalDate fechaInicio, LocalDate fechaFin);
    List<Map<String, Object>> getPagosPendientes(Integer idPeriodoAcademico);
    Map<String, BigDecimal> getResumenPagosPorEstado(Integer idPeriodoAcademico);
    Map<String, Long> getResumenAsistenciaGeneral(LocalDate fechaInicio, LocalDate fechaFin);
}
