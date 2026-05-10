package com.sigedu.backend.controller;

import com.sigedu.backend.dto.response.ApiResponse;
import com.sigedu.backend.entity.DocenteCurso;
import com.sigedu.backend.service.DocenteCursoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/docente-cursos")
public class DocenteCursoController {

    @Autowired
    private DocenteCursoService docenteCursoService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DocenteCurso>>> findAll() {
        List<DocenteCurso> asignaciones = docenteCursoService.findAll();
        return ResponseEntity.ok(ApiResponse.success(asignaciones));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DocenteCurso>> findById(@PathVariable Integer id) {
        return docenteCursoService.findById(id)
                .map(asignacion -> ResponseEntity.ok(ApiResponse.success(asignacion)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Asignación no encontrada con id: " + id)));
    }

    @GetMapping("/docente/{idDocente}")
    public ResponseEntity<ApiResponse<List<DocenteCurso>>> findByDocente(@PathVariable Integer idDocente) {
        List<DocenteCurso> asignaciones = docenteCursoService.findByDocente(idDocente);
        return ResponseEntity.ok(ApiResponse.success(asignaciones));
    }

    @GetMapping("/docente/{idDocente}/periodo/{idPeriodo}")
    public ResponseEntity<ApiResponse<List<DocenteCurso>>> findByDocenteAndPeriodo(
            @PathVariable Integer idDocente,
            @PathVariable Integer idPeriodo) {
        List<DocenteCurso> asignaciones = docenteCursoService.findByDocenteAndPeriodo(idDocente, idPeriodo);
        return ResponseEntity.ok(ApiResponse.success(asignaciones));
    }

    @GetMapping("/curso/{idCurso}")
    public ResponseEntity<ApiResponse<List<DocenteCurso>>> findByCurso(@PathVariable Integer idCurso) {
        List<DocenteCurso> asignaciones = docenteCursoService.findByCurso(idCurso);
        return ResponseEntity.ok(ApiResponse.success(asignaciones));
    }

    @GetMapping("/grado/{idGradoSeccion}")
    public ResponseEntity<ApiResponse<List<DocenteCurso>>> findByGradoSeccion(@PathVariable Integer idGradoSeccion) {
        List<DocenteCurso> asignaciones = docenteCursoService.findByGradoSeccion(idGradoSeccion);
        return ResponseEntity.ok(ApiResponse.success(asignaciones));
    }

    @GetMapping("/periodo/{idPeriodoAcademico}")
    public ResponseEntity<ApiResponse<List<DocenteCurso>>> findByPeriodo(@PathVariable Integer idPeriodoAcademico) {
        List<DocenteCurso> asignaciones = docenteCursoService.findByPeriodoAcademico(idPeriodoAcademico);
        return ResponseEntity.ok(ApiResponse.success(asignaciones));
    }

    @GetMapping("/verificar")
    public ResponseEntity<ApiResponse<Boolean>> verificarAsignacion(
            @RequestParam Integer idDocente,
            @RequestParam Integer idCurso,
            @RequestParam Integer idGradoSeccion,
            @RequestParam Integer idPeriodoAcademico) {
        boolean asignado = docenteCursoService.isDocenteAsignado(
                idDocente, idCurso, idGradoSeccion, idPeriodoAcademico);
        return ResponseEntity.ok(ApiResponse.success(asignado));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DocenteCurso>> create(@Valid @RequestBody DocenteCurso docenteCurso) {
        try {
            DocenteCurso nuevaAsignacion = docenteCursoService.save(docenteCurso);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Asignación creada exitosamente", nuevaAsignacion));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DocenteCurso>> update(@PathVariable Integer id, @Valid @RequestBody DocenteCurso docenteCurso) {
        try {
            DocenteCurso asignacionActualizada = docenteCursoService.update(id, docenteCurso);
            return ResponseEntity.ok(ApiResponse.success("Asignación actualizada exitosamente", asignacionActualizada));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        try {
            docenteCursoService.delete(id);
            return ResponseEntity.ok(ApiResponse.success("Asignación eliminada exitosamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}