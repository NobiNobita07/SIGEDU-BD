package com.sigedu.backend.service.impl;

import com.sigedu.backend.entity.Rol;
import com.sigedu.backend.repository.RolRepository;
import com.sigedu.backend.service.RolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class RolServiceImpl implements RolService {

    @Autowired
    private RolRepository rolRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Rol> findAll() {
        return rolRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Rol> findById(Integer id) {
        return rolRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Rol> findByNombreRol(String nombreRol) {
        return rolRepository.findByNombreRol(nombreRol);
    }

    @Override
    public Rol save(Rol rol) {
        if (rolRepository.existsByNombreRol(rol.getNombreRol())) {
            throw new RuntimeException("Ya existe un rol con el nombre: " + rol.getNombreRol());
        }
        return rolRepository.save(rol);
    }

    @Override
    public Rol update(Integer id, Rol rol) {
        Rol existingRol = rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado con id: " + id));

        existingRol.setNombreRol(rol.getNombreRol());
        existingRol.setDescripcion(rol.getDescripcion());
        existingRol.setEstado(rol.getEstado());

        return rolRepository.save(existingRol);
    }

    @Override
    public void delete(Integer id) {
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado con id: " + id));
        rol.setEstado(false); // Soft delete
        rolRepository.save(rol);
    }

    @Override
    public void reactivar(Integer id) {  // ← NUEVO MÉTODO
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado con id: " + id));

        if (rol.getEstado()) {
            throw new RuntimeException("El rol ya está activo");
        }

        rol.setEstado(true); // Reactivar
        rolRepository.save(rol);
    }

    @Override
    public boolean existsById(Integer id) {
        return rolRepository.existsById(id);
    }
}