package com.sigedu.backend.controller;

import com.sigedu.backend.dto.response.ApiResponse;
import com.sigedu.backend.dto.response.EstudianteResponse;
import com.sigedu.backend.entity.Estudiante;
import com.sigedu.backend.service.EstudianteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/estudiantes")
public class EstudianteController {

    @Autowired
    private EstudianteService estudianteService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<EstudianteResponse>>> findAll() {
        List<EstudianteResponse> estudiantes = estudianteService.findAll()
                .stream()
                .map(EstudianteResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(estudiantes));
    }

    @GetMapping("/activos")
    public ResponseEntity<ApiResponse<List<EstudianteResponse>>> findActivos() {
        List<EstudianteResponse> estudiantesActivos = estudianteService.findAllActivos()
                .stream()
                .map(EstudianteResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(estudiantesActivos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EstudianteResponse>> findById(@PathVariable Integer id) {
        return estudianteService.findById(id)
                .map(estudiante -> ResponseEntity.ok(ApiResponse.success(EstudianteResponse.fromEntity(estudiante))))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Estudiante no encontrado con id: " + id)));
    }

    @GetMapping("/dni/{dni}")
    public ResponseEntity<ApiResponse<EstudianteResponse>> findByDni(@PathVariable String dni) {
        return estudianteService.findByDni(dni)
                .map(estudiante -> ResponseEntity.ok(ApiResponse.success(EstudianteResponse.fromEntity(estudiante))))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Estudiante no encontrado con DNI: " + dni)));
    }

    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<ApiResponse<EstudianteResponse>> findByCodigo(@PathVariable String codigo) {
        return estudianteService.findByCodigo(codigo)
                .map(estudiante -> ResponseEntity.ok(ApiResponse.success(EstudianteResponse.fromEntity(estudiante))))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Estudiante no encontrado con código: " + codigo)));
    }

    @GetMapping("/buscar")
    public ResponseEntity<ApiResponse<List<EstudianteResponse>>> buscar(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String apellido) {

        List<EstudianteResponse> estudiantes = estudianteService.buscarPorNombreOApellido(
                        nombre != null ? nombre : "",
                        apellido != null ? apellido : ""
                )
                .stream()
                .map(EstudianteResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(estudiantes));
    }

    @GetMapping("/paginado")
    public ResponseEntity<ApiResponse<Page<Estudiante>>> findAllPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "idEstudiante") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(ApiResponse.success(estudianteService.findAll(pageable)));
    }

    @GetMapping("/buscar-paginado")
    public ResponseEntity<ApiResponse<Page<Estudiante>>> buscarPaginado(
            @RequestParam(required = false) String termino,
            @RequestParam(required = false) Boolean estado,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "apellidos") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(ApiResponse.success(estudianteService.buscarPaginado(termino, estado, pageable)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Estudiante>> create(@Valid @RequestBody Estudiante estudiante) {
        try {
            Estudiante nuevoEstudiante = estudianteService.save(estudiante);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Estudiante creado exitosamente", nuevoEstudiante));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Estudiante>> update(
            @PathVariable Integer id,
            @Valid @RequestBody Estudiante estudiante) {
        try {
            Estudiante estudianteActualizado = estudianteService.update(id, estudiante);
            return ResponseEntity.ok(ApiResponse.success("Estudiante actualizado exitosamente", estudianteActualizado));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/{id}/reactivar")
    public ResponseEntity<ApiResponse<Void>> reactivar(@PathVariable Integer id) {
        try {
            estudianteService.reactivar(id);
            return ResponseEntity.ok(ApiResponse.success("Estudiante reactivado exitosamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        try {
            estudianteService.delete(id);
            return ResponseEntity.ok(ApiResponse.success("Estudiante eliminado exitosamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}