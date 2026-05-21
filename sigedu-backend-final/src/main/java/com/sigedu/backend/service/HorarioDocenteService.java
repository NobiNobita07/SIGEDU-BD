package com.sigedu.backend.service;

import com.sigedu.backend.entity.HorarioDocente;

import java.util.List;
import java.util.Optional;

public interface HorarioDocenteService {

    List<HorarioDocente> findAll();

    List<HorarioDocente> findActivos();

    Optional<HorarioDocente> findById(Integer id);

    List<HorarioDocente> findByDocente(Integer idDocente);

    HorarioDocente save(HorarioDocente horarioDocente);

    HorarioDocente update(Integer id, HorarioDocente horarioDocente);

    void delete(Integer id);

    void reactivar(Integer id);
}