package com.sigedu.backend.dto.response;

import com.sigedu.backend.entity.Usuario;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioResponse {
    private Integer idUsuario;
    private String username;
    private String email;
    private String rol;
    private Boolean estado;
    private LocalDateTime ultimoAcceso;

    public static UsuarioResponse fromEntity(Usuario usuario) {
        if (usuario == null) {
            return null;
        }
        return new UsuarioResponse(
                usuario.getIdUsuario(),
                usuario.getUsername(),
                usuario.getEmail(),
                usuario.getRol() != null ? usuario.getRol().getNombreRol() : null,
                usuario.getEstado(),
                usuario.getUltimoAcceso()
        );
    }
}