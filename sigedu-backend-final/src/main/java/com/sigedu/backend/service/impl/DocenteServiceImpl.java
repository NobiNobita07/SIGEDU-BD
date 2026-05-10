package com.sigedu.backend.service.impl;

import com.sigedu.backend.entity.Docente;
import com.sigedu.backend.repository.DocenteRepository;
import com.sigedu.backend.service.DocenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class DocenteServiceImpl implements DocenteService {

    @Autowired
    private DocenteRepository docenteRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Docente> findAll() {
        return docenteRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Docente> findAll(Pageable pageable) {
        return docenteRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Docente> findAllActivos() {
        return docenteRepository.findAll().stream()
                .filter(Docente::getEstado)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Docente> findById(Integer id) {
        return docenteRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Docente> findByDni(String dni) {
        return docenteRepository.findByDni(dni);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Docente> findByCodigo(String codigo) {
        return docenteRepository.findByCodigo(codigo);
    }

    @Override
    public Docente save(Docente docente) {
        if (docenteRepository.findByDni(docente.getDni()).isPresent()) {
            throw new RuntimeException("Ya existe un docente con DNI: " + docente.getDni());
        }
        if (docenteRepository.findByCodigo(docente.getCodigo()).isPresent()) {
            throw new RuntimeException("Ya existe un docente con código: " + docente.getCodigo());
        }
        return docenteRepository.save(docente);
    }

    @Override
    public Docente update(Integer id, Docente docente) {
        Docente existing = docenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Docente no encontrado con id: " + id));

        existing.setCodigo(docente.getCodigo());
        existing.setNombres(docente.getNombres());
        existing.setApellidos(docente.getApellidos());
        existing.setDni(docente.getDni());
        existing.setEspecialidad(docente.getEspecialidad());
        existing.setTelefono(docente.getTelefono());
        existing.setEmail(docente.getEmail());
        existing.setFechaIngreso(docente.getFechaIngreso());
        existing.setEstado(docente.getEstado());

        return docenteRepository.save(existing);
    }

    @Override
    public void delete(Integer id) {
        Docente docente = docenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Docente no encontrado con id: " + id));
        docente.setEstado(false);
        docenteRepository.save(docente);
    }

    @Override
    public void reactivar(Integer id) {
        Docente docente = docenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Docente no encontrado con id: " + id));

        if (docente.getEstado()) {
            throw new RuntimeException("El docente ya está activo");
        }

        docente.setEstado(true);
        docenteRepository.save(docente);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Docente> findByEspecialidad(String especialidad) {
        return docenteRepository.findByEspecialidad(especialidad);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Docente> buscarPaginado(String termino, Boolean estado, Pageable pageable) {
        return docenteRepository.buscarPaginado(termino, estado, pageable);
    }
}