package com.sigedu.backend.service.impl;

import com.sigedu.backend.entity.Estudiante;
import com.sigedu.backend.repository.EstudianteRepository;
import com.sigedu.backend.service.EstudianteService;
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
public class EstudianteServiceImpl implements EstudianteService {

    @Autowired
    private EstudianteRepository estudianteRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Estudiante> findAll() {
        return estudianteRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Estudiante> findAll(Pageable pageable) {
        return estudianteRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Estudiante> findAllActivos() {
        return estudianteRepository.findAll().stream()
                .filter(Estudiante::getEstado)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Estudiante> findById(Integer id) {
        return estudianteRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Estudiante> findByDni(String dni) {
        return estudianteRepository.findByDni(dni);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Estudiante> findByCodigo(String codigo) {
        return estudianteRepository.findByCodigo(codigo);
    }

    @Override
    public Estudiante save(Estudiante estudiante) {
        if (estudianteRepository.findByDni(estudiante.getDni()).isPresent()) {
            throw new RuntimeException("Ya existe un estudiante con DNI: " + estudiante.getDni());
        }
        if (estudianteRepository.findByCodigo(estudiante.getCodigo()).isPresent()) {
            throw new RuntimeException("Ya existe un estudiante con código: " + estudiante.getCodigo());
        }
        return estudianteRepository.save(estudiante);
    }

    @Override
    public Estudiante update(Integer id, Estudiante estudiante) {
        Estudiante existing = estudianteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado con id: " + id));

        existing.setCodigo(estudiante.getCodigo());
        existing.setNombres(estudiante.getNombres());
        existing.setApellidos(estudiante.getApellidos());
        existing.setDni(estudiante.getDni());
        existing.setFechaNacimiento(estudiante.getFechaNacimiento());
        existing.setDireccion(estudiante.getDireccion());
        existing.setTelefono(estudiante.getTelefono());
        existing.setEmail(estudiante.getEmail());
        existing.setApoderado(estudiante.getApoderado());
        existing.setEstado(estudiante.getEstado());

        return estudianteRepository.save(existing);
    }

    @Override
    public void delete(Integer id) {
        Estudiante estudiante = estudianteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado con id: " + id));
        estudiante.setEstado(false);
        estudianteRepository.save(estudiante);
    }

    @Override
    public void reactivar(Integer id) {
        Estudiante estudiante = estudianteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado con id: " + id));

        if (estudiante.getEstado()) {
            throw new RuntimeException("El estudiante ya está activo");
        }

        estudiante.setEstado(true);
        estudianteRepository.save(estudiante);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Estudiante> buscarPorNombreOApellido(String nombre, String apellido) {
        return estudianteRepository.buscarPorNombreOApellido(nombre, apellido);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Estudiante> buscarPaginado(String termino, Boolean estado, Pageable pageable) {
        return estudianteRepository.buscarPaginado(termino, estado, pageable);
    }
}