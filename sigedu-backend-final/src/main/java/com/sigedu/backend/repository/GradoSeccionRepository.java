package com.sigedu.backend.repository;

import com.sigedu.backend.entity.GradoSeccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface GradoSeccionRepository extends JpaRepository<GradoSeccion, Integer> {
    List<GradoSeccion> findByNivel(String nivel);
    List<GradoSeccion> findByTurno(String turno);
    Optional<GradoSeccion> findByGradoAndSeccionAndNivel(String grado, String seccion, String nivel);
    List<GradoSeccion> findByEstado(Boolean estado);

    @Query("SELECT g.grado, COUNT(m) FROM GradoSeccion g LEFT JOIN Matricula m ON g.idGradoSeccion = m.gradoSeccion.idGradoSeccion AND m.estado = 'Activa' GROUP BY g.grado")
    List<Object[]> countEstudiantesByGrado();

    @Query("SELECT g.nivel, COUNT(m) FROM GradoSeccion g LEFT JOIN Matricula m ON g.idGradoSeccion = m.gradoSeccion.idGradoSeccion AND m.estado = 'Activa' GROUP BY g.nivel")
    List<Object[]> countEstudiantesByNivel();
}