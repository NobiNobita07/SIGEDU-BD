package com.sigedu.backend.service.impl;

import com.sigedu.backend.entity.*;
import com.sigedu.backend.repository.*;
import com.sigedu.backend.service.HorarioDocenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class HorarioDocenteServiceImpl implements HorarioDocenteService {

    @Autowired
    private HorarioDocenteRepository horarioDocenteRepository;

    @Autowired
    private DocenteRepository docenteRepository;

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private GradoSeccionRepository gradoSeccionRepository;

    @Autowired
    private PeriodoAcademicoRepository periodoAcademicoRepository;

    @Override
    public List<HorarioDocente> findAll() {
        return horarioDocenteRepository.findAll();
    }

    @Override
    public List<HorarioDocente> findActivos() {
        return horarioDocenteRepository.findByEstadoTrue();
    }

    @Override
    public Optional<HorarioDocente> findById(Integer id) {
        return horarioDocenteRepository.findById(id);
    }

    @Override
    public List<HorarioDocente> findByDocente(Integer idDocente) {
        return horarioDocenteRepository.findByDocente_IdDocente(idDocente);
    }

    @Override
    public HorarioDocente save(HorarioDocente horarioDocente) {
        validarDatosHorario(horarioDocente);
        cargarRelaciones(horarioDocente);
        validarCruces(horarioDocente, null);

        horarioDocente.setEstado(true);
        return horarioDocenteRepository.save(horarioDocente);
    }

    @Override
    public HorarioDocente update(Integer id, HorarioDocente horarioDocente) {
        HorarioDocente existente = horarioDocenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Horario no encontrado con id: " + id));

        horarioDocente.setIdHorarioDocente(id);
        validarDatosHorario(horarioDocente);
        cargarRelaciones(horarioDocente);
        validarCruces(horarioDocente, id);

        existente.setDocente(horarioDocente.getDocente());
        existente.setCurso(horarioDocente.getCurso());
        existente.setGradoSeccion(horarioDocente.getGradoSeccion());
        existente.setPeriodoAcademico(horarioDocente.getPeriodoAcademico());
        existente.setDiaSemana(horarioDocente.getDiaSemana());
        existente.setHoraInicio(horarioDocente.getHoraInicio());
        existente.setHoraFin(horarioDocente.getHoraFin());
        existente.setAula(horarioDocente.getAula());
        existente.setEstado(horarioDocente.getEstado() != null ? horarioDocente.getEstado() : existente.getEstado());

        return horarioDocenteRepository.save(existente);
    }

    @Override
    public void delete(Integer id) {
        HorarioDocente horario = horarioDocenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Horario no encontrado con id: " + id));

        horario.setEstado(false);
        horarioDocenteRepository.save(horario);
    }

    @Override
    public void reactivar(Integer id) {
        HorarioDocente horario = horarioDocenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Horario no encontrado con id: " + id));

        validarCruces(horario, id);
        horario.setEstado(true);
        horarioDocenteRepository.save(horario);
    }

    private void validarDatosHorario(HorarioDocente horario) {
        if (horario.getDocente() == null || horario.getDocente().getIdDocente() == null) {
            throw new RuntimeException("Debe seleccionar un docente.");
        }

        if (horario.getCurso() == null || horario.getCurso().getIdCurso() == null) {
            throw new RuntimeException("Debe seleccionar un curso.");
        }

        if (horario.getGradoSeccion() == null || horario.getGradoSeccion().getIdGradoSeccion() == null) {
            throw new RuntimeException("Debe seleccionar un grado/sección.");
        }

        if (horario.getPeriodoAcademico() == null || horario.getPeriodoAcademico().getIdPeriodoAcademico() == null) {
            throw new RuntimeException("Debe seleccionar un periodo académico.");
        }

        if (horario.getDiaSemana() == null || horario.getDiaSemana().isBlank()) {
            throw new RuntimeException("Debe seleccionar un día de la semana.");
        }

        LocalTime horaInicio = horario.getHoraInicio();
        LocalTime horaFin = horario.getHoraFin();

        if (horaInicio == null || horaFin == null) {
            throw new RuntimeException("Debe ingresar hora de inicio y hora de fin.");
        }

        if (!horaInicio.isBefore(horaFin)) {
            throw new RuntimeException("La hora de inicio debe ser menor que la hora de fin.");
        }
    }

    private void cargarRelaciones(HorarioDocente horario) {
        Docente docente = docenteRepository.findById(horario.getDocente().getIdDocente())
                .orElseThrow(() -> new RuntimeException("Docente no encontrado."));

        Curso curso = cursoRepository.findById(horario.getCurso().getIdCurso())
                .orElseThrow(() -> new RuntimeException("Curso no encontrado."));

        GradoSeccion gradoSeccion = gradoSeccionRepository.findById(horario.getGradoSeccion().getIdGradoSeccion())
                .orElseThrow(() -> new RuntimeException("Grado/Sección no encontrado."));

        PeriodoAcademico periodoAcademico = periodoAcademicoRepository.findById(horario.getPeriodoAcademico().getIdPeriodoAcademico())
                .orElseThrow(() -> new RuntimeException("Periodo académico no encontrado."));

        horario.setDocente(docente);
        horario.setCurso(curso);
        horario.setGradoSeccion(gradoSeccion);
        horario.setPeriodoAcademico(periodoAcademico);
    }

    private void validarCruces(HorarioDocente horario, Integer idHorario) {
        int cruceDocente = horarioDocenteRepository.contarCrucesDocente(
                horario.getDocente().getIdDocente(),
                horario.getDiaSemana(),
                horario.getHoraInicio(),
                horario.getHoraFin(),
                idHorario
        );

        if (cruceDocente > 0) {
            throw new RuntimeException("El docente ya tiene un horario asignado en ese rango de horas.");
        }

        int cruceGradoSeccion = horarioDocenteRepository.contarCrucesGradoSeccion(
                horario.getGradoSeccion().getIdGradoSeccion(),
                horario.getDiaSemana(),
                horario.getHoraInicio(),
                horario.getHoraFin(),
                idHorario
        );

        if (cruceGradoSeccion > 0) {
            throw new RuntimeException("El grado/sección ya tiene un horario asignado en ese rango de horas.");
        }

        if (horario.getAula() != null && !horario.getAula().isBlank()) {
            int cruceAula = horarioDocenteRepository.contarCrucesAula(
                    horario.getAula(),
                    horario.getDiaSemana(),
                    horario.getHoraInicio(),
                    horario.getHoraFin(),
                    idHorario
            );

            if (cruceAula > 0) {
                throw new RuntimeException("El aula ya está ocupada en ese rango de horas.");
            }
        }
    }
}