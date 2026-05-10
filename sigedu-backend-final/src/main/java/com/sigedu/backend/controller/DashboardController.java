package com.sigedu.backend.controller;

import com.sigedu.backend.dto.response.ApiResponse;
import com.sigedu.backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    // ========== ESTADÍSTICAS GENERALES ==========

    @GetMapping("/stats/generales")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getEstadisticasGenerales() {
        Map<String, Long> stats = Map.of(
                "totalEstudiantes", dashboardService.getTotalEstudiantes(),
                "totalEstudiantesActivos", dashboardService.getTotalEstudiantesActivos(),
                "totalDocentes", dashboardService.getTotalDocentes(),
                "totalCursos", dashboardService.getTotalCursos(),
                "totalMatriculasAnioActual", dashboardService.getTotalMatriculasAnioActual()
        );
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    // ========== ESTADÍSTICAS POR GRADO ==========

    @GetMapping("/stats/estudiantes-por-grado")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getEstudiantesPorGrado() {
        Map<String, Long> stats = dashboardService.getEstudiantesPorGrado();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/stats/estudiantes-por-nivel")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getEstudiantesPorNivel() {
        Map<String, Long> stats = dashboardService.getEstudiantesPorNivel();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    // ========== ESTADÍSTICAS ACADÉMICAS ==========

    @GetMapping("/stats/promedio-notas")
    public ResponseEntity<ApiResponse<Map<String, Double>>> getPromedioNotasPorCurso(
            @RequestParam Integer idPeriodoAcademico,
            @RequestParam Integer bimestre) {
        Map<String, Double> promedios = dashboardService.getPromedioNotasPorCurso(idPeriodoAcademico, bimestre);
        return ResponseEntity.ok(ApiResponse.success(promedios));
    }

    @GetMapping("/stats/asistencia")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getAsistenciaPorEstado(
            @RequestParam Integer idGradoSeccion,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        Map<String, Long> asistencias = dashboardService.getAsistenciaPorEstado(idGradoSeccion, fecha);
        return ResponseEntity.ok(ApiResponse.success(asistencias));
    }

    // ========== ESTADÍSTICAS FINANCIERAS ==========

    @GetMapping("/stats/ingresos/periodo/{idPeriodoAcademico}")
    public ResponseEntity<ApiResponse<BigDecimal>> getTotalIngresosPorPeriodo(@PathVariable Integer idPeriodoAcademico) {
        BigDecimal ingresos = dashboardService.getTotalIngresosPorPeriodo(idPeriodoAcademico);
        return ResponseEntity.ok(ApiResponse.success(ingresos));
    }

    @GetMapping("/stats/deudas/total")
    public ResponseEntity<ApiResponse<BigDecimal>> getTotalDeudasPendientes() {
        BigDecimal deudas = dashboardService.getTotalDeudasPendientes();
        return ResponseEntity.ok(ApiResponse.success(deudas));
    }

    @GetMapping("/stats/ingresos-por-mes/{anio}")
    public ResponseEntity<ApiResponse<Map<String, BigDecimal>>> getIngresosPorMes(@PathVariable Integer anio) {
        Map<String, BigDecimal> ingresos = dashboardService.getIngresosPorMes(anio);
        return ResponseEntity.ok(ApiResponse.success(ingresos));
    }

    @GetMapping("/stats/top-deudores")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getTopDeudores(
            @RequestParam(defaultValue = "10") int limite) {
        List<Map<String, Object>> deudores = dashboardService.getTopDeudores(limite);
        return ResponseEntity.ok(ApiResponse.success(deudores));
    }

    // ========== REPORTES ==========

    @GetMapping("/reportes/notas/estudiante/{idEstudiante}")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getReporteNotasEstudiante(
            @PathVariable Integer idEstudiante,
            @RequestParam Integer idPeriodoAcademico) {
        List<Map<String, Object>> reporte = dashboardService.getReporteNotasEstudiante(idEstudiante, idPeriodoAcademico);
        return ResponseEntity.ok(ApiResponse.success(reporte));
    }

    @GetMapping("/reportes/pagos/estudiante/{idEstudiante}")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getReportePagosEstudiante(
            @PathVariable Integer idEstudiante,
            @RequestParam Integer idPeriodoAcademico) {
        List<Map<String, Object>> reporte = dashboardService.getReportePagosEstudiante(idEstudiante, idPeriodoAcademico);
        return ResponseEntity.ok(ApiResponse.success(reporte));
    }

    @GetMapping("/reportes/asistencia/grado/{idGradoSeccion}")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getReporteAsistenciaGrado(
            @PathVariable Integer idGradoSeccion,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        List<Map<String, Object>> reporte = dashboardService.getReporteAsistenciaGrado(
                idGradoSeccion, fechaInicio, fechaFin);
        return ResponseEntity.ok(ApiResponse.success(reporte));
    }

    // ========== REPORTES PROFESIONALES - PASO 12 ==========

    @GetMapping("/reportes/resumen-ejecutivo/{idPeriodoAcademico}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getResumenEjecutivo(
            @PathVariable Integer idPeriodoAcademico) {
        Map<String, Object> resumen = dashboardService.getResumenEjecutivo(idPeriodoAcademico);
        return ResponseEntity.ok(ApiResponse.success(resumen));
    }

    @GetMapping("/reportes/notas/estudiante/{idEstudiante}/resumen")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getResumenNotasEstudiante(
            @PathVariable Integer idEstudiante,
            @RequestParam Integer idPeriodoAcademico) {
        Map<String, Object> resumen = dashboardService.getResumenNotasEstudiante(idEstudiante, idPeriodoAcademico);
        return ResponseEntity.ok(ApiResponse.success(resumen));
    }

    @GetMapping("/reportes/asistencia/estudiante/{idEstudiante}/resumen")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getResumenAsistenciaEstudiante(
            @PathVariable Integer idEstudiante,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        Map<String, Object> resumen = dashboardService.getResumenAsistenciaEstudiante(idEstudiante, fechaInicio, fechaFin);
        return ResponseEntity.ok(ApiResponse.success(resumen));
    }

    @GetMapping("/reportes/asistencia/resumen-general")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getResumenAsistenciaGeneral(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        Map<String, Long> resumen = dashboardService.getResumenAsistenciaGeneral(fechaInicio, fechaFin);
        return ResponseEntity.ok(ApiResponse.success(resumen));
    }

    @GetMapping("/reportes/pagos/pendientes")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getPagosPendientes(
            @RequestParam(required = false) Integer idPeriodoAcademico) {
        List<Map<String, Object>> reporte = dashboardService.getPagosPendientes(idPeriodoAcademico);
        return ResponseEntity.ok(ApiResponse.success(reporte));
    }

    @GetMapping("/reportes/pagos/resumen-estado/{idPeriodoAcademico}")
    public ResponseEntity<ApiResponse<Map<String, BigDecimal>>> getResumenPagosPorEstado(
            @PathVariable Integer idPeriodoAcademico) {
        Map<String, BigDecimal> resumen = dashboardService.getResumenPagosPorEstado(idPeriodoAcademico);
        return ResponseEntity.ok(ApiResponse.success(resumen));
    }
}
