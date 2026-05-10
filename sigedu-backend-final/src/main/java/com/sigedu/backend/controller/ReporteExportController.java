package com.sigedu.backend.controller;

import com.sigedu.backend.entity.Asistencia;
import com.sigedu.backend.entity.Nota;
import com.sigedu.backend.entity.Pago;
import com.sigedu.backend.repository.AsistenciaRepository;
import com.sigedu.backend.repository.NotaRepository;
import com.sigedu.backend.repository.PagoRepository;
import com.sigedu.backend.util.CsvExportUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/reportes/exportar")
@Tag(name = "Exportación de reportes", description = "Endpoints para descargar reportes administrativos en formato CSV compatible con Excel")
public class ReporteExportController {

    private final PagoRepository pagoRepository;
    private final AsistenciaRepository asistenciaRepository;
    private final NotaRepository notaRepository;

    public ReporteExportController(PagoRepository pagoRepository,
                                   AsistenciaRepository asistenciaRepository,
                                   NotaRepository notaRepository) {
        this.pagoRepository = pagoRepository;
        this.asistenciaRepository = asistenciaRepository;
        this.notaRepository = notaRepository;
    }

    @GetMapping("/pagos-pendientes")
    @Operation(summary = "Exportar pagos pendientes", description = "Descarga un CSV con pagos pendientes o en deuda")
    public ResponseEntity<byte[]> exportarPagosPendientes(
            @RequestParam(required = false) Integer idPeriodoAcademico) {

        List<Pago> pagos = idPeriodoAcademico == null
                ? pagoRepository.findPagosPendientesOrdenados()
                : pagoRepository.findPagosPendientesByPeriodo(idPeriodoAcademico);

        List<String> headers = Arrays.asList(
                "ID Pago", "Estudiante", "DNI", "Concepto", "Mes", "Monto total",
                "Monto pagado", "Saldo pendiente", "Estado", "Fecha vencimiento"
        );

        List<List<String>> rows = pagos.stream()
                .map(p -> Arrays.asList(
                        texto(p.getIdPago()),
                        estudiante(p),
                        p.getMatricula() != null && p.getMatricula().getEstudiante() != null ? p.getMatricula().getEstudiante().getDni() : "",
                        p.getTipoPago() != null ? p.getTipoPago().getConcepto() : "",
                        texto(p.getMes()),
                        texto(p.getMontoTotal()),
                        texto(p.getMontoPagado()),
                        texto(p.getSaldoPendiente()),
                        p.getEstado(),
                        texto(p.getFechaVencimiento())
                ))
                .collect(Collectors.toList());

        return csv("pagos_pendientes.csv", headers, rows);
    }

    @GetMapping("/asistencias")
    @Operation(summary = "Exportar asistencias por rango de fechas", description = "Descarga un CSV con asistencias registradas entre dos fechas")
    public ResponseEntity<byte[]> exportarAsistencias(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {

        List<Asistencia> asistencias = asistenciaRepository.findAll().stream()
                .filter(a -> a.getFecha() != null
                        && !a.getFecha().isBefore(fechaInicio)
                        && !a.getFecha().isAfter(fechaFin))
                .collect(Collectors.toList());

        List<String> headers = Arrays.asList(
                "ID Asistencia", "Fecha", "Estudiante", "DNI", "Curso", "Estado", "Observación"
        );

        List<List<String>> rows = asistencias.stream()
                .map(a -> Arrays.asList(
                        texto(a.getIdAsistencia()),
                        texto(a.getFecha()),
                        estudiante(a),
                        a.getMatricula() != null && a.getMatricula().getEstudiante() != null ? a.getMatricula().getEstudiante().getDni() : "",
                        a.getCurso() != null ? a.getCurso().getNombre() : "",
                        a.getEstado(),
                        a.getObservacion()
                ))
                .collect(Collectors.toList());

        return csv("asistencias.csv", headers, rows);
    }

    @GetMapping("/notas-estudiante")
    @Operation(summary = "Exportar notas por estudiante", description = "Descarga un CSV con las notas de un estudiante en un periodo académico")
    public ResponseEntity<byte[]> exportarNotasEstudiante(
            @RequestParam Integer idEstudiante,
            @RequestParam Integer idPeriodoAcademico) {

        List<Nota> notas = notaRepository.findByEstudianteAndPeriodo(idEstudiante, idPeriodoAcademico);

        List<String> headers = Arrays.asList(
                "ID Nota", "Estudiante", "DNI", "Curso", "Periodo", "Bimestre", "Nota", "Observación"
        );

        List<List<String>> rows = notas.stream()
                .map(n -> Arrays.asList(
                        texto(n.getIdNota()),
                        estudiante(n),
                        n.getMatricula() != null && n.getMatricula().getEstudiante() != null ? n.getMatricula().getEstudiante().getDni() : "",
                        n.getCurso() != null ? n.getCurso().getNombre() : "",
                        n.getPeriodoAcademico() != null ? texto(n.getPeriodoAcademico().getAnio()) : "",
                        texto(n.getBimestre()),
                        texto(n.getNota()),
                        n.getObservacion()
                ))
                .collect(Collectors.toList());

        return csv("notas_estudiante.csv", headers, rows);
    }

    private ResponseEntity<byte[]> csv(String filename, List<String> headers, List<List<String>> rows) {
        byte[] body = CsvExportUtil.toCsvBytes(headers, rows);
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.setContentType(new MediaType("text", "csv"));
        responseHeaders.setContentDisposition(ContentDisposition.attachment().filename(filename).build());
        responseHeaders.setContentLength(body.length);
        return ResponseEntity.ok().headers(responseHeaders).body(body);
    }

    private String estudiante(Pago pago) {
        if (pago == null || pago.getMatricula() == null || pago.getMatricula().getEstudiante() == null) return "";
        return pago.getMatricula().getEstudiante().getNombres() + " " + pago.getMatricula().getEstudiante().getApellidos();
    }

    private String estudiante(Asistencia asistencia) {
        if (asistencia == null || asistencia.getMatricula() == null || asistencia.getMatricula().getEstudiante() == null) return "";
        return asistencia.getMatricula().getEstudiante().getNombres() + " " + asistencia.getMatricula().getEstudiante().getApellidos();
    }

    private String estudiante(Nota nota) {
        if (nota == null || nota.getMatricula() == null || nota.getMatricula().getEstudiante() == null) return "";
        return nota.getMatricula().getEstudiante().getNombres() + " " + nota.getMatricula().getEstudiante().getApellidos();
    }

    private String texto(Object value) {
        return value == null ? "" : String.valueOf(value);
    }
}
