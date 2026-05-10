package com.sigedu.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String tipoToken = "Bearer";
    private Integer idUsuario;
    private String username;
    private String email;
    private String rol;

    public LoginResponse(String token, Integer idUsuario, String username, String email, String rol) {
        this.token = token;
        this.idUsuario = idUsuario;
        this.username = username;
        this.email = email;
        this.rol = rol;
    }
}
