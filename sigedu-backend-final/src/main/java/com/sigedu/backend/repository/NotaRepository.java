package com.sigedu.backend.repository;

import com.sigedu.backend.entity.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotaRepository extends JpaRepository<Nota, Integer> {
    List<Nota> findByMatriculaIdMatricula(Integer idMatricula);
    List<Nota> findByCursoIdCurso(Integer idCurso);

    @Query("SELECT n FROM Nota n WHERE n.matricula.idMatricula = :idMatricula AND n.bimestre = :bimestre")
    List<Nota> findByMatriculaAndBimestre(@Param("idMatricula") Integer idMatricula, @Param("bimestre") Integer bimestre);

    @Query("SELECT n FROM Nota n WHERE n.matricula.estudiante.idEstudiante = :idEstudiante AND n.periodoAcademico.anio = :anio")
    List<Nota> findNotasByEstudianteAndAnio(@Param("idEstudiante") Integer idEstudiante, @Param("anio") Integer anio);

    @Query("SELECT c.nombre, AVG(n.nota) FROM Nota n JOIN n.curso c WHERE n.periodoAcademico.idPeriodoAcademico = :idPeriodoAcademico AND n.bimestre = :bimestre GROUP BY c.nombre")
    List<Object[]> getPromedioNotasByCurso(@Param("idPeriodoAcademico") Integer idPeriodoAcademico, @Param("bimestre") Integer bimestre);

    @Query("SELECT n FROM Nota n WHERE n.matricula.estudiante.idEstudiante = :idEstudiante AND n.periodoAcademico.idPeriodoAcademico = :idPeriodoAcademico ORDER BY n.curso.nombre ASC, n.bimestre ASC")
    List<Nota> findByEstudianteAndPeriodo(@Param("idEstudiante") Integer idEstudiante,
                                           @Param("idPeriodoAcademico") Integer idPeriodoAcademico);

    @Query("SELECT c.nombre, AVG(n.nota) FROM Nota n JOIN n.curso c WHERE n.periodoAcademico.idPeriodoAcademico = :idPeriodoAcademico GROUP BY c.nombre ORDER BY c.nombre ASC")
    List<Object[]> getPromedioGeneralNotasByCurso(@Param("idPeriodoAcademico") Integer idPeriodoAcademico);

    @Query("SELECT AVG(n.nota) FROM Nota n WHERE n.matricula.estudiante.idEstudiante = :idEstudiante AND n.periodoAcademico.idPeriodoAcademico = :idPeriodoAcademico")
    Double getPromedioGeneralEstudiante(@Param("idEstudiante") Integer idEstudiante,
                                         @Param("idPeriodoAcademico") Integer idPeriodoAcademico);
}
