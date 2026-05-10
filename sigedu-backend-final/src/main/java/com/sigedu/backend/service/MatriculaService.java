package com.sigedu.backend.service;

import com.sigedu.backend.entity.Matricula;
import java.util.List;
import java.util.Optional;

public interface MatriculaService {
    List<Matricula> findAll();
    Optional<Matricula> findById(Integer id);
    Matricula save(Matricula matricula);
    Matricula update(Integer id, Matricula matricula);
    void delete(Integer id);
    List<Matricula> findByEstudiante(Integer idEstudiante);
    List<Matricula> findByGradoSeccion(Integer idGradoSeccion);
    List<Matricula> findByPeriodo(Integer anio);
    Optional<Matricula> findMatriculaActivaByEstudiante(Integer idEstudiante);
}