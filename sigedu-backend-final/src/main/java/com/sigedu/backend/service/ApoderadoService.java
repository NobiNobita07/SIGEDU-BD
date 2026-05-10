package com.sigedu.backend.service;

import com.sigedu.backend.entity.Apoderado;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

public interface ApoderadoService {
    List<Apoderado> findAll();
    Page<Apoderado> findAll(Pageable pageable);
    List<Apoderado> findAllActivos();  // NUEVO
    Optional<Apoderado> findById(Integer id);
    Optional<Apoderado> findByDni(String dni);
    Optional<Apoderado> findByEmail(String email);
    Apoderado save(Apoderado apoderado);
    Apoderado update(Integer id, Apoderado apoderado);
    void delete(Integer id);
    void reactivar(Integer id);  // NUEVO
    Page<Apoderado> buscarPaginado(String termino, Boolean estado, Pageable pageable);
}