package com.sigedu.backend.service.impl;

import com.sigedu.backend.entity.PeriodoAcademico;
import com.sigedu.backend.repository.PeriodoAcademicoRepository;
import com.sigedu.backend.service.PeriodoAcademicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PeriodoAcademicoServiceImpl implements PeriodoAcademicoService {

    @Autowired
    private PeriodoAcademicoRepository periodoAcademicoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<PeriodoAcademico> findAll() {
        return periodoAcademicoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PeriodoAcademico> findById(Integer id) {
        return periodoAcademicoRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PeriodoAcademico> findByAnio(Integer anio) {
        return periodoAcademicoRepository.findByAnio(anio);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PeriodoAcademico> findPeriodoActivo() {
        return periodoAcademicoRepository.findByEstado("Activo");
    }

    @Override
    public PeriodoAcademico save(PeriodoAcademico periodoAcademico) {
        // Validar que no exista otro período con el mismo año
        if (periodoAcademicoRepository.findByAnio(periodoAcademico.getAnio()).isPresent()) {
            throw new RuntimeException("Ya existe un período académico para el año: " + periodoAcademico.getAnio());
        }

        // Validar fechas
        if (periodoAcademico.getFechaInicio().isAfter(periodoAcademico.getFechaFin())) {
            throw new RuntimeException("La fecha de inicio no puede ser posterior a la fecha de fin");
        }

        // Si se está creando como activo, desactivar otros períodos activos
        if ("Activo".equals(periodoAcademico.getEstado())) {
            periodoAcademicoRepository.findByEstado("Activo").ifPresent(activo -> {
                activo.setEstado("Finalizado");
                periodoAcademicoRepository.save(activo);
            });
        }

        return periodoAcademicoRepository.save(periodoAcademico);
    }

    @Override
    public PeriodoAcademico update(Integer id, PeriodoAcademico periodoAcademico) {
        PeriodoAcademico existing = periodoAcademicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Período académico no encontrado con id: " + id));

        // Validar fechas
        if (periodoAcademico.getFechaInicio().isAfter(periodoAcademico.getFechaFin())) {
            throw new RuntimeException("La fecha de inicio no puede ser posterior a la fecha de fin");
        }

        existing.setAnio(periodoAcademico.getAnio());
        existing.setFechaInicio(periodoAcademico.getFechaInicio());
        existing.setFechaFin(periodoAcademico.getFechaFin());

        return periodoAcademicoRepository.save(existing);
    }

    @Override
    public void delete(Integer id) {
        PeriodoAcademico periodo = periodoAcademicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Período académico no encontrado con id: " + id));
        periodo.setEstado("Finalizado");
        periodoAcademicoRepository.save(periodo);
    }

    @Override
    public void activarPeriodo(Integer id) {
        PeriodoAcademico periodo = periodoAcademicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Período académico no encontrado con id: " + id));

        // Desactivar otros períodos activos
        periodoAcademicoRepository.findByEstado("Activo").ifPresent(activo -> {
            if (!activo.getIdPeriodoAcademico().equals(id)) {
                activo.setEstado("Finalizado");
                periodoAcademicoRepository.save(activo);
            }
        });

        periodo.setEstado("Activo");
        periodoAcademicoRepository.save(periodo);
    }

    @Override
    public void finalizarPeriodo(Integer id) {
        PeriodoAcademico periodo = periodoAcademicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Período académico no encontrado con id: " + id));
        periodo.setEstado("Finalizado");
        periodoAcademicoRepository.save(periodo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PeriodoAcademico> findByEstado(String estado) {
        return periodoAcademicoRepository.findAll().stream()
                .filter(p -> p.getEstado().equals(estado))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isPeriodoActivo(Integer anio) {
        return periodoAcademicoRepository.findByAnio(anio)
                .map(p -> "Activo".equals(p.getEstado()))
                .orElse(false);
    }
}