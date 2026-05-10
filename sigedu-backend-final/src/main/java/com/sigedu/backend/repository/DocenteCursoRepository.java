package com.sigedu.backend.repository;

import com.sigedu.backend.entity.DocenteCurso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DocenteCursoRepository extends JpaRepository<DocenteCurso, Integer> {

    List<DocenteCurso> findByDocenteIdDocente(Integer idDocente);
    List<DocenteCurso> findByCursoIdCurso(Integer idCurso);
    List<DocenteCurso> findByGradoSeccionIdGradoSeccion(Integer idGradoSeccion);
    List<DocenteCurso> findByPeriodoAcademicoIdPeriodoAcademico(Integer idPeriodoAcademico);

    List<DocenteCurso> findByDocenteIdDocenteAndPeriodoAcademicoIdPeriodoAcademico(
            Integer idDocente, Integer idPeriodoAcademico);

    Optional<DocenteCurso> findByDocenteIdDocenteAndCursoIdCursoAndGradoSeccionIdGradoSeccionAndPeriodoAcademicoIdPeriodoAcademico(
            Integer idDocente, Integer idCurso, Integer idGradoSeccion, Integer idPeriodoAcademico);

    List<DocenteCurso> findByCursoIdCursoAndGradoSeccionIdGradoSeccionAndPeriodoAcademicoIdPeriodoAcademico(
            Integer idCurso, Integer idGradoSeccion, Integer idPeriodoAcademico);

    @Query("SELECT CASE WHEN COUNT(dc) > 0 THEN true ELSE false END FROM DocenteCurso dc " +
            "WHERE dc.docente.idDocente = :idDocente AND dc.curso.idCurso = :idCurso " +
            "AND dc.gradoSeccion.idGradoSeccion = :idGradoSeccion " +
            "AND dc.periodoAcademico.idPeriodoAcademico = :idPeriodoAcademico")
    boolean existsByDocenteAndCursoAndGradoSeccionAndPeriodoAcademico(
            @Param("idDocente") Integer idDocente,
            @Param("idCurso") Integer idCurso,
            @Param("idGradoSeccion") Integer idGradoSeccion,
            @Param("idPeriodoAcademico") Integer idPeriodoAcademico);
}