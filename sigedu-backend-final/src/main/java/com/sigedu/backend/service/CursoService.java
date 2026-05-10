package com.sigedu.backend.service;

import com.sigedu.backend.entity.Curso;
import java.util.List;
import java.util.Optional;

public interface CursoService {
    List<Curso> findAll();
    List<Curso> findAllActivos();  // NUEVO
    Optional<Curso> findById(Integer id);
    Optional<Curso> findByNombre(String nombre);
    Curso save(Curso curso);
    Curso update(Integer id, Curso curso);
    void delete(Integer id);
    void reactivar(Integer id);  // NUEVO
    boolean existsByNombre(String nombre);
}