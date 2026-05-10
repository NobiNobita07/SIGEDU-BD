package com.sigedu.backend.service.impl;

import com.sigedu.backend.entity.Apoderado;
import com.sigedu.backend.repository.ApoderadoRepository;
import com.sigedu.backend.service.ApoderadoService;
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
public class ApoderadoServiceImpl implements ApoderadoService {

    @Autowired
    private ApoderadoRepository apoderadoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Apoderado> findAll() {
        return apoderadoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Apoderado> findAll(Pageable pageable) {
        return apoderadoRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Apoderado> findAllActivos() {
        return apoderadoRepository.findAll().stream()
                .filter(Apoderado::getEstado)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Apoderado> findById(Integer id) {
        return apoderadoRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Apoderado> findByDni(String dni) {
        return apoderadoRepository.findByDni(dni);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Apoderado> findByEmail(String email) {
        return apoderadoRepository.findByEmail(email);
    }

    @Override
    public Apoderado save(Apoderado apoderado) {
        if (apoderadoRepository.existsByDni(apoderado.getDni())) {
            throw new RuntimeException("Ya existe un apoderado con DNI: " + apoderado.getDni());
        }
        return apoderadoRepository.save(apoderado);
    }

    @Override
    public Apoderado update(Integer id, Apoderado apoderado) {
        Apoderado existing = apoderadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Apoderado no encontrado con id: " + id));

        existing.setNombres(apoderado.getNombres());
        existing.setApellidos(apoderado.getApellidos());
        existing.setDni(apoderado.getDni());
        existing.setTelefono(apoderado.getTelefono());
        existing.setEmail(apoderado.getEmail());
        existing.setParentesco(apoderado.getParentesco());
        existing.setDireccion(apoderado.getDireccion());
        existing.setEstado(apoderado.getEstado());

        return apoderadoRepository.save(existing);
    }

    @Override
    public void delete(Integer id) {
        Apoderado apoderado = apoderadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Apoderado no encontrado con id: " + id));
        apoderado.setEstado(false);
        apoderadoRepository.save(apoderado);
    }

    @Override
    public void reactivar(Integer id) {
        Apoderado apoderado = apoderadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Apoderado no encontrado con id: " + id));

        if (apoderado.getEstado()) {
            throw new RuntimeException("El apoderado ya está activo");
        }

        apoderado.setEstado(true);
        apoderadoRepository.save(apoderado);
    }


    @Override
    @Transactional(readOnly = true)
    public Page<Apoderado> buscarPaginado(String termino, Boolean estado, Pageable pageable) {
        return apoderadoRepository.buscarPaginado(termino, estado, pageable);
    }
}
