package com.sigedu.backend.controller;

import com.sigedu.backend.dto.request.LoginRequest;
import com.sigedu.backend.dto.response.ApiResponse;
import com.sigedu.backend.dto.response.LoginResponse;
import com.sigedu.backend.entity.Usuario;
import com.sigedu.backend.repository.UsuarioRepository;
import com.sigedu.backend.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            Usuario usuario = usuarioRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            if (Boolean.FALSE.equals(usuario.getEstado())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("El usuario está inactivo"));
            }

            Map<String, Object> claims = new HashMap<>();
            String rol = usuario.getRol() != null ? usuario.getRol().getNombreRol() : "USER";
            claims.put("rol", rol);
            claims.put("idUsuario", usuario.getIdUsuario());

            String token = jwtService.generateToken(userDetails, claims);

            usuario.setUltimoAcceso(LocalDateTime.now());
            usuarioRepository.save(usuario);

            LoginResponse response = new LoginResponse(
                    token,
                    usuario.getIdUsuario(),
                    usuario.getUsername(),
                    usuario.getEmail(),
                    rol
            );

            return ResponseEntity.ok(ApiResponse.success("Inicio de sesión exitoso", response));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Usuario o contraseña incorrectos"));
        }
    }
}
