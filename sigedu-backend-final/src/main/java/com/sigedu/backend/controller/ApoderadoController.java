package com.sigedu.backend.controller;

import com.sigedu.backend.dto.request.ApoderadoConEstudianteRequest;
import com.sigedu.backend.dto.response.ApiResponse;
import com.sigedu.backend.entity.Apoderado;
import com.sigedu.backend.entity.Estudiante;
import com.sigedu.backend.service.ApoderadoService;
import com.sigedu.backend.service.EstudianteService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/apoderados")
public class ApoderadoController {

    @Autowired
    private ApoderadoService apoderadoService;

    @Autowired
    private EstudianteService estudianteService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Apoderado>>> findAll() {
        List<Apoderado> apoderados = apoderadoService.findAll();
        return ResponseEntity.ok(ApiResponse.success(apoderados));
    }

    @GetMapping("/paginado")
    public ResponseEntity<ApiResponse<Page<Apoderado>>> findAllPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "idApoderado") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(ApiResponse.success(apoderadoService.findAll(pageable)));
    }

    @GetMapping("/activos")
    public ResponseEntity<ApiResponse<List<Apoderado>>> findActivos() {
        List<Apoderado> apoderadosActivos = apoderadoService.findAllActivos();
        return ResponseEntity.ok(ApiResponse.success(apoderadosActivos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Apoderado>> findById(@PathVariable Integer id) {
        return apoderadoService.findById(id)
                .map(apoderado -> ResponseEntity.ok(ApiResponse.success(apoderado)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Apoderado no encontrado con id: " + id)));
    }

    @GetMapping("/dni/{dni}")
    public ResponseEntity<ApiResponse<Apoderado>> findByDni(@PathVariable String dni) {
        return apoderadoService.findByDni(dni)
                .map(apoderado -> ResponseEntity.ok(ApiResponse.success(apoderado)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Apoderado no encontrado con DNI: " + dni)));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse<Apoderado>> findByEmail(@PathVariable String email) {
        return apoderadoService.findByEmail(email)
                .map(apoderado -> ResponseEntity.ok(ApiResponse.success(apoderado)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Apoderado no encontrado con email: " + email)));
    }

    @GetMapping("/buscar-paginado")
    public ResponseEntity<ApiResponse<Page<Apoderado>>> buscarPaginado(
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
        return ResponseEntity.ok(ApiResponse.success(apoderadoService.buscarPaginado(termino, estado, pageable)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Apoderado>> create(@Valid @RequestBody Apoderado apoderado) {
        try {
            Apoderado nuevoApoderado = apoderadoService.save(apoderado);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Apoderado creado exitosamente", nuevoApoderado));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @Transactional
    @PostMapping("/con-estudiante")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createConEstudiante(
            @Valid @RequestBody ApoderadoConEstudianteRequest request) {
        try {
            Apoderado apoderadoGuardado = apoderadoService.save(request.getApoderado());

            Estudiante estudiante = request.getEstudiante();
            estudiante.setApoderado(apoderadoGuardado);

            Estudiante estudianteGuardado = estudianteService.save(estudiante);

            Map<String, Object> data = new LinkedHashMap<>();
            data.put("apoderado", apoderadoGuardado);
            data.put("estudiante", estudianteGuardado);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Apoderado y estudiante creados exitosamente", data));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Apoderado>> update(
            @PathVariable Integer id,
            @Valid @RequestBody Apoderado apoderado) {
        try {
            Apoderado apoderadoActualizado = apoderadoService.update(id, apoderado);
            return ResponseEntity.ok(ApiResponse.success("Apoderado actualizado exitosamente", apoderadoActualizado));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/{id}/reactivar")
    public ResponseEntity<ApiResponse<Void>> reactivar(@PathVariable Integer id) {
        try {
            apoderadoService.reactivar(id);
            return ResponseEntity.ok(ApiResponse.success("Apoderado reactivado exitosamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        try {
            apoderadoService.delete(id);
            return ResponseEntity.ok(ApiResponse.success("Apoderado eliminado exitosamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}