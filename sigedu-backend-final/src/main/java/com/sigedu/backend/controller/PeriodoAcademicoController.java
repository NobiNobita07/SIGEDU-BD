package com.sigedu.backend.controller;

import com.sigedu.backend.dto.response.ApiResponse;
import com.sigedu.backend.entity.PeriodoAcademico;
import com.sigedu.backend.service.PeriodoAcademicoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/periodos-academicos")
public class PeriodoAcademicoController {

    @Autowired
    private PeriodoAcademicoService periodoAcademicoService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PeriodoAcademico>>> findAll() {
        List<PeriodoAcademico> periodos = periodoAcademicoService.findAll();
        return ResponseEntity.ok(ApiResponse.success(periodos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PeriodoAcademico>> findById(@PathVariable Integer id) {
        return periodoAcademicoService.findById(id)
                .map(periodo -> ResponseEntity.ok(ApiResponse.success(periodo)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Período académico no encontrado con id: " + id)));
    }

    @GetMapping("/anio/{anio}")
    public ResponseEntity<ApiResponse<PeriodoAcademico>> findByAnio(@PathVariable Integer anio) {
        return periodoAcademicoService.findByAnio(anio)
                .map(periodo -> ResponseEntity.ok(ApiResponse.success(periodo)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("No existe período académico para el año: " + anio)));
    }

    @GetMapping("/activo")
    public ResponseEntity<ApiResponse<PeriodoAcademico>> findActivo() {
        return periodoAcademicoService.findPeriodoActivo()
                .map(periodo -> ResponseEntity.ok(ApiResponse.success(periodo)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("No hay un período académico activo")));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PeriodoAcademico>> create(@Valid @RequestBody PeriodoAcademico periodo) {
        try {
            PeriodoAcademico nuevoPeriodo = periodoAcademicoService.save(periodo);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Período académico creado exitosamente", nuevoPeriodo));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PeriodoAcademico>> update(@PathVariable Integer id, @Valid @RequestBody PeriodoAcademico periodo) {
        try {
            PeriodoAcademico periodoActualizado = periodoAcademicoService.update(id, periodo);
            return ResponseEntity.ok(ApiResponse.success("Período académico actualizado exitosamente", periodoActualizado));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/{id}/activar")
    public ResponseEntity<ApiResponse<Void>> activar(@PathVariable Integer id) {
        try {
            periodoAcademicoService.activarPeriodo(id);
            return ResponseEntity.ok(ApiResponse.success("Período académico activado exitosamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/{id}/finalizar")
    public ResponseEntity<ApiResponse<Void>> finalizar(@PathVariable Integer id) {
        try {
            periodoAcademicoService.finalizarPeriodo(id);
            return ResponseEntity.ok(ApiResponse.success("Período académico finalizado exitosamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        try {
            periodoAcademicoService.delete(id);
            return ResponseEntity.ok(ApiResponse.success("Período académico eliminado exitosamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}