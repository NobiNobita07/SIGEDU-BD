package com.sigedu.backend.repository;

import com.sigedu.backend.entity.Asistencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface AsistenciaRepository extends JpaRepository<Asistencia, Integer> {
    List<Asistencia> findByMatriculaIdMatricula(Integer idMatricula);
    List<Asistencia> findByFecha(LocalDate fecha);

    @Query("SELECT a FROM Asistencia a WHERE a.matricula.gradoSeccion.idGradoSeccion = :idGradoSeccion AND a.fecha = :fecha")
    List<Asistencia> findByGradoSeccionAndFecha(@Param("idGradoSeccion") Integer idGradoSeccion, @Param("fecha") LocalDate fecha);

    @Query("SELECT COUNT(a) FROM Asistencia a WHERE a.matricula.idMatricula = :idMatricula AND a.estado = :estado")
    Long countByMatriculaAndEstado(@Param("idMatricula") Integer idMatricula, @Param("estado") String estado);

    @Query("SELECT a FROM Asistencia a WHERE a.matricula.estudiante.idEstudiante = :idEstudiante AND a.fecha BETWEEN :fechaInicio AND :fechaFin ORDER BY a.fecha ASC")
    List<Asistencia> findByEstudianteAndRangoFechas(@Param("idEstudiante") Integer idEstudiante,
                                                     @Param("fechaInicio") LocalDate fechaInicio,
                                                     @Param("fechaFin") LocalDate fechaFin);

    @Query("SELECT a.estado, COUNT(a) FROM Asistencia a WHERE a.matricula.estudiante.idEstudiante = :idEstudiante AND a.fecha BETWEEN :fechaInicio AND :fechaFin GROUP BY a.estado")
    List<Object[]> countEstadosByEstudianteAndRangoFechas(@Param("idEstudiante") Integer idEstudiante,
                                                           @Param("fechaInicio") LocalDate fechaInicio,
                                                           @Param("fechaFin") LocalDate fechaFin);

    @Query("SELECT a.estado, COUNT(a) FROM Asistencia a WHERE a.fecha BETWEEN :fechaInicio AND :fechaFin GROUP BY a.estado")
    List<Object[]> countEstadosByRangoFechas(@Param("fechaInicio") LocalDate fechaInicio,
                                              @Param("fechaFin") LocalDate fechaFin);
}
