package com.sigedu.backend.service;

import com.sigedu.backend.entity.Usuario;
import java.util.List;
import java.util.Optional;

public interface UsuarioService {
    List<Usuario> findAll();
    List<Usuario> findAllActivos();  // NUEVO
    Optional<Usuario> findById(Integer id);
    Optional<Usuario> findByUsername(String username);
    Optional<Usuario> findByEmail(String email);
    Usuario save(Usuario usuario);
    Usuario update(Integer id, Usuario usuario);
    void delete(Integer id);
    void reactivar(Integer id);  // NUEVO
    void cambiarPassword(Integer id, String nuevaPassword);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}