package com.sigedu.backend.repository;

import com.sigedu.backend.entity.Docente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DocenteRepository extends JpaRepository<Docente, Integer> {
    Optional<Docente> findByDni(String dni);
    Optional<Docente> findByCodigo(String codigo);
    List<Docente> findByEspecialidad(String especialidad);
    List<Docente> findByEstado(Boolean estado);

    @Query("""
            SELECT d FROM Docente d
            WHERE (:estado IS NULL OR d.estado = :estado)
              AND (:termino IS NULL OR :termino = ''
                   OR LOWER(d.nombres) LIKE LOWER(CONCAT('%', :termino, '%'))
                   OR LOWER(d.apellidos) LIKE LOWER(CONCAT('%', :termino, '%'))
                   OR LOWER(d.dni) LIKE LOWER(CONCAT('%', :termino, '%'))
                   OR LOWER(d.codigo) LIKE LOWER(CONCAT('%', :termino, '%'))
                   OR LOWER(d.especialidad) LIKE LOWER(CONCAT('%', :termino, '%')))
            """)
    Page<Docente> buscarPaginado(@Param("termino") String termino,
                                 @Param("estado") Boolean estado,
                                 Pageable pageable);
}