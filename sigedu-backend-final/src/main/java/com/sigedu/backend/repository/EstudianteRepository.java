package com.sigedu.backend.repository;

import com.sigedu.backend.entity.Estudiante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EstudianteRepository extends JpaRepository<Estudiante, Integer> {
    Optional<Estudiante> findByDni(String dni);
    Optional<Estudiante> findByCodigo(String codigo);
    List<Estudiante> findByApellidosContainingIgnoreCase(String apellidos);
    List<Estudiante> findByEstado(Boolean estado);

    @Query("SELECT e FROM Estudiante e WHERE e.apellidos LIKE %:apellido% OR e.nombres LIKE %:nombre%")
    List<Estudiante> buscarPorNombreOApellido(@Param("nombre") String nombre, @Param("apellido") String apellido);

    @Query("""
            SELECT e FROM Estudiante e
            WHERE (:estado IS NULL OR e.estado = :estado)
              AND (:termino IS NULL OR :termino = ''
                   OR LOWER(e.nombres) LIKE LOWER(CONCAT('%', :termino, '%'))
                   OR LOWER(e.apellidos) LIKE LOWER(CONCAT('%', :termino, '%'))
                   OR LOWER(e.dni) LIKE LOWER(CONCAT('%', :termino, '%'))
                   OR LOWER(e.codigo) LIKE LOWER(CONCAT('%', :termino, '%')))
            """)
    Page<Estudiante> buscarPaginado(@Param("termino") String termino,
                                    @Param("estado") Boolean estado,
                                    Pageable pageable);
}
