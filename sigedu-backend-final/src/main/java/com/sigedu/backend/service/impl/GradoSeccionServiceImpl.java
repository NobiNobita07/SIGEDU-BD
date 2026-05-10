package com.sigedu.backend.service.impl;

import com.sigedu.backend.entity.GradoSeccion;
import com.sigedu.backend.repository.GradoSeccionRepository;
import com.sigedu.backend.service.GradoSeccionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class GradoSeccionServiceImpl implements GradoSeccionService {

    @Autowired
    private GradoSeccionRepository gradoSeccionRepository;

    @Override
    @Transactional(readOnly = true)
    public List<GradoSeccion> findAll() {
        return gradoSeccionRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<GradoSeccion> findAllActivos() {
        return gradoSeccionRepository.findAll().stream()
                .filter(GradoSeccion::getEstado)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<GradoSeccion> findById(Integer id) {
        return gradoSeccionRepository.findById(id);
    }

    @Override
    public GradoSeccion save(GradoSeccion gradoSeccion) {
        Optional<GradoSeccion> existing = gradoSeccionRepository.findByGradoAndSeccionAndNivel(
                gradoSeccion.getGrado(),
                gradoSeccion.getSeccion(),
                gradoSeccion.getNivel()
        );
        if (existing.isPresent() && existing.get().getEstado()) {
            throw new RuntimeException("Ya existe el grado " + gradoSeccion.getGrado() +
                    " sección " + gradoSeccion.getSeccion() + " para el nivel " + gradoSeccion.getNivel());
        }
        return gradoSeccionRepository.save(gradoSeccion);
    }

    @Override
    public GradoSeccion update(Integer id, GradoSeccion gradoSeccion) {
        GradoSeccion existing = gradoSeccionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grado/Sección no encontrado con id: " + id));

        existing.setGrado(gradoSeccion.getGrado());
        existing.setSeccion(gradoSeccion.getSeccion());
        existing.setNivel(gradoSeccion.getNivel());
        existing.setTurno(gradoSeccion.getTurno());
        existing.setDocenteTutor(gradoSeccion.getDocenteTutor());
        existing.setEstado(gradoSeccion.getEstado());

        return gradoSeccionRepository.save(existing);
    }

    @Override
    public void delete(Integer id) {
        GradoSeccion gradoSeccion = gradoSeccionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grado/Sección no encontrado con id: " + id));
        gradoSeccion.setEstado(false);
        gradoSeccionRepository.save(gradoSeccion);
    }

    @Override
    public void reactivar(Integer id) {
        GradoSeccion gradoSeccion = gradoSeccionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grado/Sección no encontrado con id: " + id));

        if (gradoSeccion.getEstado()) {
            throw new RuntimeException("El grado/sección ya está activo");
        }

        gradoSeccion.setEstado(true);
        gradoSeccionRepository.save(gradoSeccion);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GradoSeccion> findByNivel(String nivel) {
        return gradoSeccionRepository.findByNivel(nivel);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GradoSeccion> findByTurno(String turno) {
        return gradoSeccionRepository.findByTurno(turno);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<GradoSeccion> findByGradoAndSeccionAndNivel(String grado, String seccion, String nivel) {
        return gradoSeccionRepository.findByGradoAndSeccionAndNivel(grado, seccion, nivel);
    }
}