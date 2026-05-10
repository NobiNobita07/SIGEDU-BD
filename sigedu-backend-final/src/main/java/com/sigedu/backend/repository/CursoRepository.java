package com.sigedu.backend.repository;

import com.sigedu.backend.entity.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Integer> {
    Optional<Curso> findByNombre(String nombre);
    boolean existsByNombre(String nombre);
}