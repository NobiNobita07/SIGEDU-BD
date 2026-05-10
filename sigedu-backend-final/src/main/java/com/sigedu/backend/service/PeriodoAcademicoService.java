package com.sigedu.backend.service;

import com.sigedu.backend.entity.PeriodoAcademico;
import java.util.List;
import java.util.Optional;

public interface PeriodoAcademicoService {
    List<PeriodoAcademico> findAll();
    Optional<PeriodoAcademico> findById(Integer id);
    Optional<PeriodoAcademico> findByAnio(Integer anio);
    Optional<PeriodoAcademico> findPeriodoActivo();
    PeriodoAcademico save(PeriodoAcademico periodoAcademico);
    PeriodoAcademico update(Integer id, PeriodoAcademico periodoAcademico);
    void delete(Integer id);
    void activarPeriodo(Integer id);
    void finalizarPeriodo(Integer id);
    List<PeriodoAcademico> findByEstado(String estado);
    boolean isPeriodoActivo(Integer anio);
}