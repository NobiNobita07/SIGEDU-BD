package com.sigedu.backend.controller;

import com.sigedu.backend.dto.response.ApiResponse;
import com.sigedu.backend.entity.Asistencia;
import com.sigedu.backend.service.AsistenciaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/asistencias")
public class AsistenciaController {

    @Autowired
    private AsistenciaService asistenciaService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Asistencia>>> findAll() {
        List<Asistencia> asistencias = asistenciaService.findAll();
        return ResponseEntity.ok(ApiResponse.success(asistencias));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Asistencia>> findById(@PathVariable Integer id) {
        return asistenciaService.findById(id)
                .map(asistencia -> ResponseEntity.ok(ApiResponse.success(asistencia)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Asistencia no encontrada con id: " + id)));
    }

    @GetMapping("/matricula/{idMatricula}")
    public ResponseEntity<ApiResponse<List<Asistencia>>> findByMatricula(@PathVariable Integer idMatricula) {
        List<Asistencia> asistencias = asistenciaService.findByMatricula(idMatricula);
        return ResponseEntity.ok(ApiResponse.success(asistencias));
    }

    @GetMapping("/fecha/{fecha}")
    public ResponseEntity<ApiResponse<List<Asistencia>>> findByFecha(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        List<Asistencia> asistencias = asistenciaService.findByFecha(fecha);
        return ResponseEntity.ok(ApiResponse.success(asistencias));
    }

    @GetMapping("/grado/{idGradoSeccion}/fecha/{fecha}")
    public ResponseEntity<ApiResponse<List<Asistencia>>> findByGradoAndFecha(
            @PathVariable Integer idGradoSeccion,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        List<Asistencia> asistencias = asistenciaService.findByGradoSeccionAndFecha(idGradoSeccion, fecha);
        return ResponseEntity.ok(ApiResponse.success(asistencias));
    }

    @GetMapping("/matricula/{idMatricula}/estado/{estado}/count")
    public ResponseEntity<ApiResponse<Long>> countByMatriculaAndEstado(
            @PathVariable Integer idMatricula,
            @PathVariable String estado) {
        Long count = asistenciaService.countByMatriculaAndEstado(idMatricula, estado);
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    @GetMapping("/matricula/{idMatricula}/porcentaje")
    public ResponseEntity<ApiResponse<Double>> calcularPorcentajeAsistencia(@PathVariable Integer idMatricula) {
        Double porcentaje = asistenciaService.calcularPorcentajeAsistencia(idMatricula);
        return ResponseEntity.ok(ApiResponse.success(porcentaje));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Asistencia>> create(@Valid @RequestBody Asistencia asistencia) {
        try {
            Asistencia nuevaAsistencia = asistenciaService.save(asistencia);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Asistencia registrada exitosamente", nuevaAsistencia));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<List<Asistencia>>> createBatch(@Valid @RequestBody List<Asistencia> asistencias) {
        try {
            List<Asistencia> nuevasAsistencias = asistencias.stream()
                    .map(asistenciaService::save)
                    .toList();
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Asistencias registradas exitosamente", nuevasAsistencias));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Asistencia>> update(@PathVariable Integer id, @Valid @RequestBody Asistencia asistencia) {
        try {
            Asistencia asistenciaActualizada = asistenciaService.update(id, asistencia);
            return ResponseEntity.ok(ApiResponse.success("Asistencia actualizada exitosamente", asistenciaActualizada));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        try {
            asistenciaService.delete(id);
            return ResponseEntity.ok(ApiResponse.success("Asistencia eliminada exitosamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}