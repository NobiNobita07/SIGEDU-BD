package com.sigedu.backend.service.impl;

import com.sigedu.backend.entity.Asistencia;
import com.sigedu.backend.repository.AsistenciaRepository;
import com.sigedu.backend.service.AsistenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AsistenciaServiceImpl implements AsistenciaService {

    @Autowired
    private AsistenciaRepository asistenciaRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Asistencia> findAll() {
        return asistenciaRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Asistencia> findById(Integer id) {
        return asistenciaRepository.findById(id);
    }

    @Override
    public Asistencia save(Asistencia asistencia) {
        return asistenciaRepository.save(asistencia);
    }

    @Override
    public Asistencia update(Integer id, Asistencia asistencia) {
        Asistencia existing = asistenciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asistencia no encontrada con id: " + id));

        existing.setEstado(asistencia.getEstado());
        existing.setObservacion(asistencia.getObservacion());

        return asistenciaRepository.save(existing);
    }

    @Override
    public void delete(Integer id) {
        asistenciaRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Asistencia> findByMatricula(Integer idMatricula) {
        return asistenciaRepository.findByMatriculaIdMatricula(idMatricula);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Asistencia> findByFecha(LocalDate fecha) {
        return asistenciaRepository.findByFecha(fecha);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Asistencia> findByGradoSeccionAndFecha(Integer idGradoSeccion, LocalDate fecha) {
        return asistenciaRepository.findByGradoSeccionAndFecha(idGradoSeccion, fecha);
    }

    @Override
    @Transactional(readOnly = true)
    public Long countByMatriculaAndEstado(Integer idMatricula, String estado) {
        return asistenciaRepository.countByMatriculaAndEstado(idMatricula, estado);
    }

    @Override
    @Transactional(readOnly = true)
    public Double calcularPorcentajeAsistencia(Integer idMatricula) {
        Long totalPresentes = asistenciaRepository.countByMatriculaAndEstado(idMatricula, "Presente");
        Long totalTardes = asistenciaRepository.countByMatriculaAndEstado(idMatricula, "Tarde");
        List<Asistencia> todas = asistenciaRepository.findByMatriculaIdMatricula(idMatricula);

        if (todas.isEmpty()) {
            return 0.0;
        }

        Long totalAsistencias = totalPresentes + totalTardes;
        return (totalAsistencias.doubleValue() / todas.size()) * 100;
    }
}