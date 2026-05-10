package com.sigedu.backend.controller;

import com.sigedu.backend.dto.response.ApiResponse;
import com.sigedu.backend.entity.GradoSeccion;
import com.sigedu.backend.service.GradoSeccionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/grados-secciones")
public class GradoSeccionController {

    @Autowired
    private GradoSeccionService gradoSeccionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<GradoSeccion>>> findAll() {
        List<GradoSeccion> grados = gradoSeccionService.findAll();
        return ResponseEntity.ok(ApiResponse.success(grados));
    }

    @GetMapping("/activos")
    public ResponseEntity<ApiResponse<List<GradoSeccion>>> findActivos() {
        List<GradoSeccion> gradosActivos = gradoSeccionService.findAllActivos();
        return ResponseEntity.ok(ApiResponse.success(gradosActivos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GradoSeccion>> findById(@PathVariable Integer id) {
        return gradoSeccionService.findById(id)
                .map(grado -> ResponseEntity.ok(ApiResponse.success(grado)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Grado/Sección no encontrado con id: " + id)));
    }

    @GetMapping("/nivel/{nivel}")
    public ResponseEntity<ApiResponse<List<GradoSeccion>>> findByNivel(@PathVariable String nivel) {
        List<GradoSeccion> grados = gradoSeccionService.findByNivel(nivel);
        return ResponseEntity.ok(ApiResponse.success(grados));
    }

    @GetMapping("/turno/{turno}")
    public ResponseEntity<ApiResponse<List<GradoSeccion>>> findByTurno(@PathVariable String turno) {
        List<GradoSeccion> grados = gradoSeccionService.findByTurno(turno);
        return ResponseEntity.ok(ApiResponse.success(grados));
    }

    @GetMapping("/buscar")
    public ResponseEntity<ApiResponse<GradoSeccion>> buscar(
            @RequestParam String grado,
            @RequestParam String seccion,
            @RequestParam String nivel) {
        return gradoSeccionService.findByGradoAndSeccionAndNivel(grado, seccion, nivel)
                .map(gradoSeccion -> ResponseEntity.ok(ApiResponse.success(gradoSeccion)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("No se encontró el grado/sección especificado")));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<GradoSeccion>> create(@Valid @RequestBody GradoSeccion gradoSeccion) {
        try {
            GradoSeccion nuevoGrado = gradoSeccionService.save(gradoSeccion);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Grado/Sección creado exitosamente", nuevoGrado));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GradoSeccion>> update(@PathVariable Integer id, @Valid @RequestBody GradoSeccion gradoSeccion) {
        try {
            GradoSeccion gradoActualizado = gradoSeccionService.update(id, gradoSeccion);
            return ResponseEntity.ok(ApiResponse.success("Grado/Sección actualizado exitosamente", gradoActualizado));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/{id}/reactivar")
    public ResponseEntity<ApiResponse<Void>> reactivar(@PathVariable Integer id) {
        try {
            gradoSeccionService.reactivar(id);
            return ResponseEntity.ok(ApiResponse.success("Grado/Sección reactivado exitosamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        try {
            gradoSeccionService.delete(id);
            return ResponseEntity.ok(ApiResponse.success("Grado/Sección eliminado exitosamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}