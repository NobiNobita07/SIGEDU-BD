package com.sigedu.backend.controller;

import com.sigedu.backend.dto.response.ApiResponse;
import com.sigedu.backend.entity.Curso;
import com.sigedu.backend.service.CursoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cursos")
public class CursoController {

    @Autowired
    private CursoService cursoService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Curso>>> findAll() {
        List<Curso> cursos = cursoService.findAll();
        return ResponseEntity.ok(ApiResponse.success(cursos));
    }

    @GetMapping("/activos")
    public ResponseEntity<ApiResponse<List<Curso>>> findActivos() {
        List<Curso> cursosActivos = cursoService.findAllActivos();
        return ResponseEntity.ok(ApiResponse.success(cursosActivos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Curso>> findById(@PathVariable Integer id) {
        return cursoService.findById(id)
                .map(curso -> ResponseEntity.ok(ApiResponse.success(curso)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Curso no encontrado con id: " + id)));
    }

    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<ApiResponse<Curso>> findByNombre(@PathVariable String nombre) {
        return cursoService.findByNombre(nombre)
                .map(curso -> ResponseEntity.ok(ApiResponse.success(curso)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Curso no encontrado con nombre: " + nombre)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Curso>> create(@Valid @RequestBody Curso curso) {
        try {
            Curso nuevoCurso = cursoService.save(curso);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Curso creado exitosamente", nuevoCurso));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Curso>> update(@PathVariable Integer id, @Valid @RequestBody Curso curso) {
        try {
            Curso cursoActualizado = cursoService.update(id, curso);
            return ResponseEntity.ok(ApiResponse.success("Curso actualizado exitosamente", cursoActualizado));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/{id}/reactivar")
    public ResponseEntity<ApiResponse<Void>> reactivar(@PathVariable Integer id) {
        try {
            cursoService.reactivar(id);
            return ResponseEntity.ok(ApiResponse.success("Curso reactivado exitosamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        try {
            cursoService.delete(id);
            return ResponseEntity.ok(ApiResponse.success("Curso eliminado exitosamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}