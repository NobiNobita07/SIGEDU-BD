package com.sigedu.backend.service;

import com.sigedu.backend.entity.Nota;
import java.util.List;
import java.util.Optional;

public interface NotaService {
    List<Nota> findAll();
    Optional<Nota> findById(Integer id);
    Nota save(Nota nota);
    Nota update(Integer id, Nota nota);
    void delete(Integer id);
    List<Nota> findByMatricula(Integer idMatricula);
    List<Nota> findByCurso(Integer idCurso);
    List<Nota> findByMatriculaAndBimestre(Integer idMatricula, Integer bimestre);
    List<Nota> findNotasByEstudianteAndAnio(Integer idEstudiante, Integer anio);
    Double calcularPromedioByMatriculaAndBimestre(Integer idMatricula, Integer bimestre);
}