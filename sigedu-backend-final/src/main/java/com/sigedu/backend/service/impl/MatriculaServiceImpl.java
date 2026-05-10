package com.sigedu.backend.service.impl;

import com.sigedu.backend.entity.Matricula;
import com.sigedu.backend.repository.MatriculaRepository;
import com.sigedu.backend.service.MatriculaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MatriculaServiceImpl implements MatriculaService {

    @Autowired
    private MatriculaRepository matriculaRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Matricula> findAll() {
        return matriculaRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Matricula> findById(Integer id) {
        return matriculaRepository.findById(id);
    }

    @Override
    public Matricula save(Matricula matricula) {
        return matriculaRepository.save(matricula);
    }

    @Override
    public Matricula update(Integer id, Matricula matricula) {
        Matricula existing = matriculaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Matrícula no encontrada con id: " + id));

        existing.setGradoSeccion(matricula.getGradoSeccion());
        existing.setPeriodoAcademico(matricula.getPeriodoAcademico());
        existing.setEstado(matricula.getEstado());

        return matriculaRepository.save(existing);
    }

    @Override
    public void delete(Integer id) {
        Matricula matricula = matriculaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Matrícula no encontrada con id: " + id));
        matricula.setEstado("Retirado");
        matriculaRepository.save(matricula);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Matricula> findByEstudiante(Integer idEstudiante) {
        return matriculaRepository.findByEstudianteIdEstudiante(idEstudiante);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Matricula> findByGradoSeccion(Integer idGradoSeccion) {
        return matriculaRepository.findByGradoSeccionIdGradoSeccion(idGradoSeccion);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Matricula> findByPeriodo(Integer anio) {
        return matriculaRepository.findByPeriodoAcademicoAnio(anio);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Matricula> findMatriculaActivaByEstudiante(Integer idEstudiante) {
        return matriculaRepository.findMatriculaActivaByEstudiante(idEstudiante);
    }
}