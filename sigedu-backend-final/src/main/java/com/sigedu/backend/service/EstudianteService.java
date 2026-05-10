package com.sigedu.backend.service;

import com.sigedu.backend.entity.Estudiante;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

public interface EstudianteService {
    List<Estudiante> findAll();
    Page<Estudiante> findAll(Pageable pageable);
    List<Estudiante> findAllActivos();  // NUEVO
    Optional<Estudiante> findById(Integer id);
    Optional<Estudiante> findByDni(String dni);
    Optional<Estudiante> findByCodigo(String codigo);
    Estudiante save(Estudiante estudiante);
    Estudiante update(Integer id, Estudiante estudiante);
    void delete(Integer id);
    void reactivar(Integer id);  // NUEVO
    List<Estudiante> buscarPorNombreOApellido(String nombre, String apellido);
    Page<Estudiante> buscarPaginado(String termino, Boolean estado, Pageable pageable);
}