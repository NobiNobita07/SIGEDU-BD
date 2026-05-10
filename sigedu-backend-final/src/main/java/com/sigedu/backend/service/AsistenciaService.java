package com.sigedu.backend.service;

import com.sigedu.backend.entity.Asistencia;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AsistenciaService {
    List<Asistencia> findAll();
    Optional<Asistencia> findById(Integer id);
    Asistencia save(Asistencia asistencia);
    Asistencia update(Integer id, Asistencia asistencia);
    void delete(Integer id);
    List<Asistencia> findByMatricula(Integer idMatricula);
    List<Asistencia> findByFecha(LocalDate fecha);
    List<Asistencia> findByGradoSeccionAndFecha(Integer idGradoSeccion, LocalDate fecha);
    Long countByMatriculaAndEstado(Integer idMatricula, String estado);
    Double calcularPorcentajeAsistencia(Integer idMatricula);
}