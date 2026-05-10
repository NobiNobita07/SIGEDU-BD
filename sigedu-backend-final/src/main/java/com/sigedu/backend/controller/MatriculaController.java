package com.sigedu.backend.controller;

import com.sigedu.backend.dto.response.ApiResponse;
import com.sigedu.backend.entity.Matricula;
import com.sigedu.backend.service.MatriculaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/matriculas")
public class MatriculaController {

    @Autowired
    private MatriculaService matriculaService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Matricula>>> findAll() {
        List<Matricula> matriculas = matriculaService.findAll();
        return ResponseEntity.ok(ApiResponse.success(matriculas));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Matricula>> findById(@PathVariable Integer id) {
        return matriculaService.findById(id)
                .map(matricula -> ResponseEntity.ok(ApiResponse.success(matricula)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Matrícula no encontrada con id: " + id)));
    }

    @GetMapping("/estudiante/{idEstudiante}")
    public ResponseEntity<ApiResponse<List<Matricula>>> findByEstudiante(@PathVariable Integer idEstudiante) {
        List<Matricula> matriculas = matriculaService.findByEstudiante(idEstudiante);
        return ResponseEntity.ok(ApiResponse.success(matriculas));
    }

    @GetMapping("/estudiante/{idEstudiante}/activa")
    public ResponseEntity<ApiResponse<Matricula>> findMatriculaActiva(@PathVariable Integer idEstudiante) {
        return matriculaService.findMatriculaActivaByEstudiante(idEstudiante)
                .map(matricula -> ResponseEntity.ok(ApiResponse.success(matricula)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("El estudiante no tiene una matrícula activa")));
    }

    @GetMapping("/grado/{idGradoSeccion}")
    public ResponseEntity<ApiResponse<List<Matricula>>> findByGradoSeccion(@PathVariable Integer idGradoSeccion) {
        List<Matricula> matriculas = matriculaService.findByGradoSeccion(idGradoSeccion);
        return ResponseEntity.ok(ApiResponse.success(matriculas));
    }

    @GetMapping("/periodo/{anio}")
    public ResponseEntity<ApiResponse<List<Matricula>>> findByPeriodo(@PathVariable Integer anio) {
        List<Matricula> matriculas = matriculaService.findByPeriodo(anio);
        return ResponseEntity.ok(ApiResponse.success(matriculas));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Matricula>> create(@Valid @RequestBody Matricula matricula) {
        try {
            Matricula nuevaMatricula = matriculaService.save(matricula);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Matrícula creada exitosamente", nuevaMatricula));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Matricula>> update(@PathVariable Integer id, @Valid @RequestBody Matricula matricula) {
        try {
            Matricula matriculaActualizada = matriculaService.update(id, matricula);
            return ResponseEntity.ok(ApiResponse.success("Matrícula actualizada exitosamente", matriculaActualizada));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        try {
            matriculaService.delete(id);
            return ResponseEntity.ok(ApiResponse.success("Matrícula anulada exitosamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}