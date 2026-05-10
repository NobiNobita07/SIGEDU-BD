package com.sigedu.backend.service.impl;

import com.sigedu.backend.entity.Curso;
import com.sigedu.backend.repository.CursoRepository;
import com.sigedu.backend.service.CursoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CursoServiceImpl implements CursoService {

    @Autowired
    private CursoRepository cursoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Curso> findAll() {
        return cursoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Curso> findAllActivos() {
        return cursoRepository.findAll().stream()
                .filter(Curso::getEstado)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Curso> findById(Integer id) {
        return cursoRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Curso> findByNombre(String nombre) {
        return cursoRepository.findByNombre(nombre);
    }

    @Override
    public Curso save(Curso curso) {
        if (cursoRepository.existsByNombre(curso.getNombre())) {
            throw new RuntimeException("Ya existe un curso con nombre: " + curso.getNombre());
        }
        return cursoRepository.save(curso);
    }

    @Override
    public Curso update(Integer id, Curso curso) {
        Curso existing = cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado con id: " + id));

        existing.setNombre(curso.getNombre());
        existing.setDescripcion(curso.getDescripcion());
        existing.setHorasSemanales(curso.getHorasSemanales());
        existing.setEstado(curso.getEstado());

        return cursoRepository.save(existing);
    }

    @Override
    public void delete(Integer id) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado con id: " + id));
        curso.setEstado(false);
        cursoRepository.save(curso);
    }

    @Override
    public void reactivar(Integer id) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado con id: " + id));

        if (curso.getEstado()) {
            throw new RuntimeException("El curso ya está activo");
        }

        curso.setEstado(true);
        cursoRepository.save(curso);
    }

    @Override
    public boolean existsByNombre(String nombre) {
        return cursoRepository.existsByNombre(nombre);
    }
}