package com.sigedu.backend.controller;

import com.sigedu.backend.dto.request.CambiarPasswordRequest;
import com.sigedu.backend.dto.response.ApiResponse;
import com.sigedu.backend.dto.response.UsuarioResponse;
import com.sigedu.backend.entity.Usuario;
import com.sigedu.backend.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UsuarioResponse>>> findAll() {
        List<UsuarioResponse> usuarios = usuarioService.findAll().stream()
                .map(UsuarioResponse::fromEntity)
                .toList();
        return ResponseEntity.ok(ApiResponse.success(usuarios));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UsuarioResponse>> findById(@PathVariable Integer id) {
        return usuarioService.findById(id)
                .map(usuario -> ResponseEntity.ok(ApiResponse.success(UsuarioResponse.fromEntity(usuario))))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Usuario no encontrado con id: " + id)));
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<ApiResponse<UsuarioResponse>> findByUsername(@PathVariable String username) {
        return usuarioService.findByUsername(username)
                .map(usuario -> ResponseEntity.ok(ApiResponse.success(UsuarioResponse.fromEntity(usuario))))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Usuario no encontrado con username: " + username)));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse<UsuarioResponse>> findByEmail(@PathVariable String email) {
        return usuarioService.findByEmail(email)
                .map(usuario -> ResponseEntity.ok(ApiResponse.success(UsuarioResponse.fromEntity(usuario))))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Usuario no encontrado con email: " + email)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UsuarioResponse>> create(@Valid @RequestBody Usuario usuario) {
        Usuario nuevoUsuario = usuarioService.save(usuario);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Usuario creado exitosamente", UsuarioResponse.fromEntity(nuevoUsuario)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UsuarioResponse>> update(@PathVariable Integer id, @Valid @RequestBody Usuario usuario) {
        Usuario usuarioActualizado = usuarioService.update(id, usuario);
        return ResponseEntity.ok(ApiResponse.success("Usuario actualizado exitosamente", UsuarioResponse.fromEntity(usuarioActualizado)));
    }

    @PatchMapping("/{id}/password")
    public ResponseEntity<ApiResponse<Void>> cambiarPassword(
            @PathVariable Integer id,
            @Valid @RequestBody CambiarPasswordRequest request) {
        usuarioService.cambiarPassword(id, request.getNuevaPassword());
        return ResponseEntity.ok(ApiResponse.success("Contraseña actualizada exitosamente", null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        usuarioService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Usuario eliminado exitosamente", null));
    }

    @GetMapping("/activos")
    public ResponseEntity<ApiResponse<List<UsuarioResponse>>> findActivos() {
        List<UsuarioResponse> usuariosActivos = usuarioService.findAllActivos().stream()
                .map(UsuarioResponse::fromEntity)
                .toList();
        return ResponseEntity.ok(ApiResponse.success(usuariosActivos));
    }

    @PatchMapping("/{id}/reactivar")
    public ResponseEntity<ApiResponse<Void>> reactivar(@PathVariable Integer id) {
        usuarioService.reactivar(id);
        return ResponseEntity.ok(ApiResponse.success("Usuario reactivado exitosamente", null));
    }
}
