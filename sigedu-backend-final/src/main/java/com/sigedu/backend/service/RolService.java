package com.sigedu.backend.service;

import com.sigedu.backend.entity.Rol;
import java.util.List;
import java.util.Optional;

public interface RolService {
    List<Rol> findAll();
    Optional<Rol> findById(Integer id);
    Optional<Rol> findByNombreRol(String nombreRol);
    Rol save(Rol rol);
    Rol update(Integer id, Rol rol);
    void delete(Integer id);
    void reactivar(Integer id);  // ← NUEVO MÉTODO REACTIVAR ROL
    boolean existsById(Integer id);
}