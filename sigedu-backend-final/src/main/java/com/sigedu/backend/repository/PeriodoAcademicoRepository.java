package com.sigedu.backend.repository;

import com.sigedu.backend.entity.PeriodoAcademico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PeriodoAcademicoRepository extends JpaRepository<PeriodoAcademico, Integer> {
    Optional<PeriodoAcademico> findByAnio(Integer anio);
    Optional<PeriodoAcademico> findByEstado(String estado);
}