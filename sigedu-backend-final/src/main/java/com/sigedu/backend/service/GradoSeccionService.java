package com.sigedu.backend.service;

import com.sigedu.backend.entity.GradoSeccion;
import java.util.List;
import java.util.Optional;

public interface GradoSeccionService {
    List<GradoSeccion> findAll();
    List<GradoSeccion> findAllActivos();  // ← Asegurar que existe
    Optional<GradoSeccion> findById(Integer id);
    GradoSeccion save(GradoSeccion gradoSeccion);
    GradoSeccion update(Integer id, GradoSeccion gradoSeccion);
    void delete(Integer id);
    void reactivar(Integer id);  // ← Asegurar que existe
    List<GradoSeccion> findByNivel(String nivel);
    List<GradoSeccion> findByTurno(String turno);
    Optional<GradoSeccion> findByGradoAndSeccionAndNivel(String grado, String seccion, String nivel);
}