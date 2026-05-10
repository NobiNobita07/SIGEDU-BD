package com.sigedu.backend.security;

import com.sigedu.backend.entity.Usuario;
import com.sigedu.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

        String nombreRol = usuario.getRol() != null ? usuario.getRol().getNombreRol() : "USER";
        String authority = nombreRol.startsWith("ROLE_") ? nombreRol : "ROLE_" + nombreRol;

        return User.builder()
                .username(usuario.getUsername())
                .password(usuario.getPassword())
                .disabled(Boolean.FALSE.equals(usuario.getEstado()))
                .authorities(List.of(new SimpleGrantedAuthority(authority)))
                .build();
    }
}
