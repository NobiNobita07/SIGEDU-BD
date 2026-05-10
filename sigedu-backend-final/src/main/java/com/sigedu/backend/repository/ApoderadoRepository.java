package com.sigedu.backend.repository;

import com.sigedu.backend.entity.Apoderado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ApoderadoRepository extends JpaRepository<Apoderado, Integer> {
    Optional<Apoderado> findByDni(String dni);
    Optional<Apoderado> findByEmail(String email);
    boolean existsByDni(String dni);

    @Query("""
            SELECT a FROM Apoderado a
            WHERE (:estado IS NULL OR a.estado = :estado)
              AND (:termino IS NULL OR :termino = ''
                   OR LOWER(a.nombres) LIKE LOWER(CONCAT('%', :termino, '%'))
                   OR LOWER(a.apellidos) LIKE LOWER(CONCAT('%', :termino, '%'))
                   OR LOWER(a.dni) LIKE LOWER(CONCAT('%', :termino, '%'))
                   OR LOWER(a.email) LIKE LOWER(CONCAT('%', :termino, '%'))
                   OR LOWER(a.telefono) LIKE LOWER(CONCAT('%', :termino, '%')))
            """)
    Page<Apoderado> buscarPaginado(@Param("termino") String termino,
                                   @Param("estado") Boolean estado,
                                   Pageable pageable);
}