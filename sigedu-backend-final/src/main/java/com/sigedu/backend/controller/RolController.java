package com.sigedu.backend.controller;

import com.sigedu.backend.dto.response.ApiResponse;
import com.sigedu.backend.entity.Rol;
import com.sigedu.backend.service.RolService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
public class RolController {

    @Autowired
    private RolService rolService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Rol>>> findAll() {
        List<Rol> roles = rolService.findAll();
        return ResponseEntity.ok(ApiResponse.success(roles));
    }

    @GetMapping("/activos")  // ← NUEVO ENDPOINT
    public ResponseEntity<ApiResponse<List<Rol>>> findActivos() {
        List<Rol> rolesActivos = rolService.findAll().stream()
                .filter(Rol::getEstado)
                .toList();
        return ResponseEntity.ok(ApiResponse.success(rolesActivos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Rol>> findById(@PathVariable Integer id) {
        return rolService.findById(id)
                .map(rol -> ResponseEntity.ok(ApiResponse.success(rol)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Rol no encontrado con id: " + id)));
    }

    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<ApiResponse<Rol>> findByNombre(@PathVariable String nombre) {
        return rolService.findByNombreRol(nombre)
                .map(rol -> ResponseEntity.ok(ApiResponse.success(rol)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Rol no encontrado con nombre: " + nombre)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Rol>> create(@Valid @RequestBody Rol rol) {
        try {
            Rol nuevoRol = rolService.save(rol);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Rol creado exitosamente", nuevoRol));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Rol>> update(@PathVariable Integer id, @Valid @RequestBody Rol rol) {
        try {
            Rol rolActualizado = rolService.update(id, rol);
            return ResponseEntity.ok(ApiResponse.success("Rol actualizado exitosamente", rolActualizado));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/{id}/reactivar")  // ← NUEVO ENDPOINT
    public ResponseEntity<ApiResponse<Void>> reactivar(@PathVariable Integer id) {
        try {
            rolService.reactivar(id);
            return ResponseEntity.ok(ApiResponse.success("Rol reactivado exitosamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        try {
            rolService.delete(id);
            return ResponseEntity.ok(ApiResponse.success("Rol eliminado exitosamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}