package com.sigedu.backend.controller;

import com.sigedu.backend.dto.response.ApiResponse;
import com.sigedu.backend.entity.Nota;
import com.sigedu.backend.service.NotaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notas")
public class NotaController {

    @Autowired
    private NotaService notaService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Nota>>> findAll() {
        List<Nota> notas = notaService.findAll();
        return ResponseEntity.ok(ApiResponse.success(notas));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Nota>> findById(@PathVariable Integer id) {
        return notaService.findById(id)
                .map(nota -> ResponseEntity.ok(ApiResponse.success(nota)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Nota no encontrada con id: " + id)));
    }

    @GetMapping("/matricula/{idMatricula}")
    public ResponseEntity<ApiResponse<List<Nota>>> findByMatricula(@PathVariable Integer idMatricula) {
        List<Nota> notas = notaService.findByMatricula(idMatricula);
        return ResponseEntity.ok(ApiResponse.success(notas));
    }

    @GetMapping("/matricula/{idMatricula}/bimestre/{bimestre}")
    public ResponseEntity<ApiResponse<List<Nota>>> findByMatriculaAndBimestre(
            @PathVariable Integer idMatricula,
            @PathVariable Integer bimestre) {
        List<Nota> notas = notaService.findByMatriculaAndBimestre(idMatricula, bimestre);
        return ResponseEntity.ok(ApiResponse.success(notas));
    }

    @GetMapping("/matricula/{idMatricula}/bimestre/{bimestre}/promedio")
    public ResponseEntity<ApiResponse<Double>> calcularPromedio(
            @PathVariable Integer idMatricula,
            @PathVariable Integer bimestre) {
        Double promedio = notaService.calcularPromedioByMatriculaAndBimestre(idMatricula, bimestre);
        return ResponseEntity.ok(ApiResponse.success(promedio));
    }

    @GetMapping("/curso/{idCurso}")
    public ResponseEntity<ApiResponse<List<Nota>>> findByCurso(@PathVariable Integer idCurso) {
        List<Nota> notas = notaService.findByCurso(idCurso);
        return ResponseEntity.ok(ApiResponse.success(notas));
    }

    @GetMapping("/estudiante/{idEstudiante}/anio/{anio}")
    public ResponseEntity<ApiResponse<List<Nota>>> findByEstudianteAndAnio(
            @PathVariable Integer idEstudiante,
            @PathVariable Integer anio) {
        List<Nota> notas = notaService.findNotasByEstudianteAndAnio(idEstudiante, anio);
        return ResponseEntity.ok(ApiResponse.success(notas));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Nota>> create(@Valid @RequestBody Nota nota) {
        try {
            Nota nuevaNota = notaService.save(nota);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Nota registrada exitosamente", nuevaNota));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Nota>> update(@PathVariable Integer id, @Valid @RequestBody Nota nota) {
        try {
            Nota notaActualizada = notaService.update(id, nota);
            return ResponseEntity.ok(ApiResponse.success("Nota actualizada exitosamente", notaActualizada));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        try {
            notaService.delete(id);
            return ResponseEntity.ok(ApiResponse.success("Nota eliminada exitosamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}