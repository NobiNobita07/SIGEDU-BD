package com.sigedu.backend.service;

import com.sigedu.backend.entity.Docente;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

public interface DocenteService {
    List<Docente> findAll();
    Page<Docente> findAll(Pageable pageable);
    List<Docente> findAllActivos();  // NUEVO
    Optional<Docente> findById(Integer id);
    Optional<Docente> findByDni(String dni);
    Optional<Docente> findByCodigo(String codigo);
    Docente save(Docente docente);
    Docente update(Integer id, Docente docente);
    void delete(Integer id);
    void reactivar(Integer id);  // NUEVO
    List<Docente> findByEspecialidad(String especialidad);
    Page<Docente> buscarPaginado(String termino, Boolean estado, Pageable pageable);
}