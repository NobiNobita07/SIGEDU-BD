package com.sigedu.backend.controller;

import com.sigedu.backend.dto.response.ApiResponse;
import com.sigedu.backend.entity.Docente;
import com.sigedu.backend.service.DocenteService;
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

@RestController
@RequestMapping("/docentes")
public class DocenteController {

    @Autowired
    private DocenteService docenteService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Docente>>> findAll() {
        List<Docente> docentes = docenteService.findAll();
        return ResponseEntity.ok(ApiResponse.success(docentes));
    }

    @GetMapping("/paginado")
    public ResponseEntity<ApiResponse<Page<Docente>>> findAllPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "idDocente") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(ApiResponse.success(docenteService.findAll(pageable)));
    }

    @GetMapping("/activos")
    public ResponseEntity<ApiResponse<List<Docente>>> findActivos() {
        List<Docente> docentesActivos = docenteService.findAllActivos();
        return ResponseEntity.ok(ApiResponse.success(docentesActivos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Docente>> findById(@PathVariable Integer id) {
        return docenteService.findById(id)
                .map(docente -> ResponseEntity.ok(ApiResponse.success(docente)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Docente no encontrado con id: " + id)));
    }

    @GetMapping("/dni/{dni}")
    public ResponseEntity<ApiResponse<Docente>> findByDni(@PathVariable String dni) {
        return docenteService.findByDni(dni)
                .map(docente -> ResponseEntity.ok(ApiResponse.success(docente)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Docente no encontrado con DNI: " + dni)));
    }

    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<ApiResponse<Docente>> findByCodigo(@PathVariable String codigo) {
        return docenteService.findByCodigo(codigo)
                .map(docente -> ResponseEntity.ok(ApiResponse.success(docente)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Docente no encontrado con código: " + codigo)));
    }

    @GetMapping("/especialidad/{especialidad}")
    public ResponseEntity<ApiResponse<List<Docente>>> findByEspecialidad(@PathVariable String especialidad) {
        List<Docente> docentes = docenteService.findByEspecialidad(especialidad);
        return ResponseEntity.ok(ApiResponse.success(docentes));
    }


    @GetMapping("/buscar-paginado")
    public ResponseEntity<ApiResponse<Page<Docente>>> buscarPaginado(
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
        return ResponseEntity.ok(ApiResponse.success(docenteService.buscarPaginado(termino, estado, pageable)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Docente>> create(@Valid @RequestBody Docente docente) {
        try {
            Docente nuevoDocente = docenteService.save(docente);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Docente creado exitosamente", nuevoDocente));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Docente>> update(@PathVariable Integer id, @Valid @RequestBody Docente docente) {
        try {
            Docente docenteActualizado = docenteService.update(id, docente);
            return ResponseEntity.ok(ApiResponse.success("Docente actualizado exitosamente", docenteActualizado));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/{id}/reactivar")
    public ResponseEntity<ApiResponse<Void>> reactivar(@PathVariable Integer id) {
        try {
            docenteService.reactivar(id);
            return ResponseEntity.ok(ApiResponse.success("Docente reactivado exitosamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        try {
            docenteService.delete(id);
            return ResponseEntity.ok(ApiResponse.success("Docente eliminado exitosamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}