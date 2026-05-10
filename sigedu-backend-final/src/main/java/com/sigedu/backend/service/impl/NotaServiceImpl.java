package com.sigedu.backend.service.impl;

import com.sigedu.backend.entity.Nota;
import com.sigedu.backend.repository.NotaRepository;
import com.sigedu.backend.service.NotaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class NotaServiceImpl implements NotaService {

    @Autowired
    private NotaRepository notaRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Nota> findAll() {
        return notaRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Nota> findById(Integer id) {
        return notaRepository.findById(id);
    }

    @Override
    public Nota save(Nota nota) {
        // Validar que la nota esté entre 0 y 20
        if (nota.getNota().compareTo(BigDecimal.ZERO) < 0 ||
                nota.getNota().compareTo(new BigDecimal("20")) > 0) {
            throw new RuntimeException("La nota debe estar entre 0 y 20");
        }
        return notaRepository.save(nota);
    }

    @Override
    public Nota update(Integer id, Nota nota) {
        Nota existing = notaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nota no encontrada con id: " + id));

        if (nota.getNota().compareTo(BigDecimal.ZERO) < 0 ||
                nota.getNota().compareTo(new BigDecimal("20")) > 0) {
            throw new RuntimeException("La nota debe estar entre 0 y 20");
        }

        existing.setNota(nota.getNota());
        existing.setObservacion(nota.getObservacion());

        return notaRepository.save(existing);
    }

    @Override
    public void delete(Integer id) {
        notaRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Nota> findByMatricula(Integer idMatricula) {
        return notaRepository.findByMatriculaIdMatricula(idMatricula);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Nota> findByCurso(Integer idCurso) {
        return notaRepository.findByCursoIdCurso(idCurso);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Nota> findByMatriculaAndBimestre(Integer idMatricula, Integer bimestre) {
        return notaRepository.findByMatriculaAndBimestre(idMatricula, bimestre);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Nota> findNotasByEstudianteAndAnio(Integer idEstudiante, Integer anio) {
        return notaRepository.findNotasByEstudianteAndAnio(idEstudiante, anio);
    }

    @Override
    @Transactional(readOnly = true)
    public Double calcularPromedioByMatriculaAndBimestre(Integer idMatricula, Integer bimestre) {
        List<Nota> notas = notaRepository.findByMatriculaAndBimestre(idMatricula, bimestre);

        if (notas.isEmpty()) {
            return 0.0;
        }

        BigDecimal suma = notas.stream()
                .map(Nota::getNota)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return suma.divide(new BigDecimal(notas.size()), 2, RoundingMode.HALF_UP).doubleValue();
    }
}