package com.sigedu.backend.service.impl;

import com.sigedu.backend.entity.DocenteCurso;
import com.sigedu.backend.repository.DocenteCursoRepository;
import com.sigedu.backend.service.DocenteCursoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class DocenteCursoServiceImpl implements DocenteCursoService {

    @Autowired
    private DocenteCursoRepository docenteCursoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<DocenteCurso> findAll() {
        return docenteCursoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<DocenteCurso> findById(Integer id) {
        return docenteCursoRepository.findById(id);
    }

    @Override
    public DocenteCurso save(DocenteCurso docenteCurso) {
        // Validar que no exista una asignación duplicada
        if (docenteCursoRepository.existsByDocenteAndCursoAndGradoSeccionAndPeriodoAcademico(
                docenteCurso.getDocente().getIdDocente(),
                docenteCurso.getCurso().getIdCurso(),
                docenteCurso.getGradoSeccion().getIdGradoSeccion(),
                docenteCurso.getPeriodoAcademico().getIdPeriodoAcademico())) {
            throw new RuntimeException("Ya existe una asignación del curso " +
                    docenteCurso.getCurso().getNombre() + " para este docente en el grado y período indicado");
        }
        return docenteCursoRepository.save(docenteCurso);
    }

    @Override
    public DocenteCurso update(Integer id, DocenteCurso docenteCurso) {
        DocenteCurso existing = docenteCursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asignación docente-curso no encontrada con id: " + id));

        existing.setDocente(docenteCurso.getDocente());
        existing.setCurso(docenteCurso.getCurso());
        existing.setGradoSeccion(docenteCurso.getGradoSeccion());
        existing.setPeriodoAcademico(docenteCurso.getPeriodoAcademico());

        return docenteCursoRepository.save(existing);
    }

    @Override
    public void delete(Integer id) {
        docenteCursoRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocenteCurso> findByDocente(Integer idDocente) {
        return docenteCursoRepository.findByDocenteIdDocente(idDocente);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocenteCurso> findByCurso(Integer idCurso) {
        return docenteCursoRepository.findByCursoIdCurso(idCurso);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocenteCurso> findByGradoSeccion(Integer idGradoSeccion) {
        return docenteCursoRepository.findByGradoSeccionIdGradoSeccion(idGradoSeccion);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocenteCurso> findByPeriodoAcademico(Integer idPeriodoAcademico) {
        return docenteCursoRepository.findByPeriodoAcademicoIdPeriodoAcademico(idPeriodoAcademico);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocenteCurso> findByDocenteAndPeriodo(Integer idDocente, Integer idPeriodoAcademico) {
        return docenteCursoRepository.findByDocenteIdDocenteAndPeriodoAcademicoIdPeriodoAcademico(
                idDocente, idPeriodoAcademico);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<DocenteCurso> findByDocenteAndCursoAndGradoAndPeriodo(
            Integer idDocente, Integer idCurso, Integer idGradoSeccion, Integer idPeriodoAcademico) {
        return docenteCursoRepository.findByDocenteIdDocenteAndCursoIdCursoAndGradoSeccionIdGradoSeccionAndPeriodoAcademicoIdPeriodoAcademico(
                idDocente, idCurso, idGradoSeccion, idPeriodoAcademico);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isDocenteAsignado(Integer idDocente, Integer idCurso, Integer idGradoSeccion, Integer idPeriodoAcademico) {
        return docenteCursoRepository.existsByDocenteAndCursoAndGradoSeccionAndPeriodoAcademico(
                idDocente, idCurso, idGradoSeccion, idPeriodoAcademico);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocenteCurso> findCursosByDocenteAndPeriodo(Integer idDocente, Integer idPeriodoAcademico) {
        return docenteCursoRepository.findByDocenteIdDocenteAndPeriodoAcademicoIdPeriodoAcademico(
                idDocente, idPeriodoAcademico);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocenteCurso> findDocentesByCursoAndGradoAndPeriodo(Integer idCurso, Integer idGradoSeccion, Integer idPeriodoAcademico) {
        return docenteCursoRepository.findByCursoIdCursoAndGradoSeccionIdGradoSeccionAndPeriodoAcademicoIdPeriodoAcademico(
                idCurso, idGradoSeccion, idPeriodoAcademico);
    }
}