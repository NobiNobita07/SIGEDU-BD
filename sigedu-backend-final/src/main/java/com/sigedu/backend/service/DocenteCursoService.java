package com.sigedu.backend.service;

import com.sigedu.backend.entity.DocenteCurso;
import java.util.List;
import java.util.Optional;

public interface DocenteCursoService {
    List<DocenteCurso> findAll();
    Optional<DocenteCurso> findById(Integer id);
    DocenteCurso save(DocenteCurso docenteCurso);
    DocenteCurso update(Integer id, DocenteCurso docenteCurso);
    void delete(Integer id);
    List<DocenteCurso> findByDocente(Integer idDocente);
    List<DocenteCurso> findByCurso(Integer idCurso);
    List<DocenteCurso> findByGradoSeccion(Integer idGradoSeccion);
    List<DocenteCurso> findByPeriodoAcademico(Integer idPeriodoAcademico);
    List<DocenteCurso> findByDocenteAndPeriodo(Integer idDocente, Integer idPeriodoAcademico);
    Optional<DocenteCurso> findByDocenteAndCursoAndGradoAndPeriodo(
            Integer idDocente, Integer idCurso, Integer idGradoSeccion, Integer idPeriodoAcademico);
    boolean isDocenteAsignado(Integer idDocente, Integer idCurso, Integer idGradoSeccion, Integer idPeriodoAcademico);
    List<DocenteCurso> findCursosByDocenteAndPeriodo(Integer idDocente, Integer idPeriodoAcademico);
    List<DocenteCurso> findDocentesByCursoAndGradoAndPeriodo(Integer idCurso, Integer idGradoSeccion, Integer idPeriodoAcademico);
}