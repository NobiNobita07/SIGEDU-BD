package com.sigedu.backend.config;

import com.sigedu.backend.entity.Rol;
import com.sigedu.backend.entity.Usuario;
import com.sigedu.backend.repository.RolRepository;
import com.sigedu.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.LinkedHashMap;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initData() {
        return args -> {
            Map<String, String> roles = new LinkedHashMap<>();
            roles.put("ADMIN", "Administrador general del sistema SIGEDU");
            roles.put("SECRETARIA", "Personal administrativo para matrículas, pagos y registros");
            roles.put("DOCENTE", "Docente responsable de notas, cursos y asistencias");
            roles.put("APODERADO", "Apoderado que consulta información académica y pagos");
            roles.put("ESTUDIANTE", "Estudiante que consulta notas, asistencia y datos académicos");

            Map<String, Rol> rolesCreados = new LinkedHashMap<>();
            roles.forEach((nombre, descripcion) -> {
                Rol rol = rolRepository.findByNombreRol(nombre)
                        .orElseGet(() -> {
                            Rol nuevoRol = new Rol();
                            nuevoRol.setNombreRol(nombre);
                            nuevoRol.setDescripcion(descripcion);
                            nuevoRol.setEstado(true);
                            return rolRepository.save(nuevoRol);
                        });
                rolesCreados.put(nombre, rol);
            });

            crearUsuarioSiNoExiste("admin", "admin@sigedu.com", "123456", rolesCreados.get("ADMIN"));
            crearUsuarioSiNoExiste("secretaria", "secretaria@sigedu.com", "123456", rolesCreados.get("SECRETARIA"));
            crearUsuarioSiNoExiste("docente", "docente@sigedu.com", "123456", rolesCreados.get("DOCENTE"));
            crearUsuarioSiNoExiste("apoderado", "apoderado@sigedu.com", "123456", rolesCreados.get("APODERADO"));
            crearUsuarioSiNoExiste("estudiante", "estudiante@sigedu.com", "123456", rolesCreados.get("ESTUDIANTE"));
        };
    }

    private void crearUsuarioSiNoExiste(String username, String email, String password, Rol rol) {
        if (!usuarioRepository.existsByUsername(username)) {
            Usuario usuario = new Usuario();
            usuario.setUsername(username);
            usuario.setEmail(email);
            usuario.setPassword(passwordEncoder.encode(password));
            usuario.setRol(rol);
            usuario.setEstado(true);
            usuarioRepository.save(usuario);
        }
    }
}
