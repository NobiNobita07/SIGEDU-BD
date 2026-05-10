package com.sigedu.backend.repository;

import com.sigedu.backend.entity.Matricula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MatriculaRepository extends JpaRepository<Matricula, Integer> {
    List<Matricula> findByEstudianteIdEstudiante(Integer idEstudiante);
    List<Matricula> findByGradoSeccionIdGradoSeccion(Integer idGradoSeccion);
    List<Matricula> findByPeriodoAcademicoAnio(Integer anio);
    List<Matricula> findByEstado(String estado);

    @Query("SELECT m FROM Matricula m WHERE m.estudiante.idEstudiante = :idEstudiante AND m.periodoAcademico.estado = 'Activo'")
    Optional<Matricula> findMatriculaActivaByEstudiante(@Param("idEstudiante") Integer idEstudiante);

    @Query("SELECT m FROM Matricula m WHERE m.gradoSeccion.idGradoSeccion = :idGradoSeccion AND m.periodoAcademico.estado = 'Activo'")
    List<Matricula> findMatriculasActivasByGradoSeccion(@Param("idGradoSeccion") Integer idGradoSeccion);
}