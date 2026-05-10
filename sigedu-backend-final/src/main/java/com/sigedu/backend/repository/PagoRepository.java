package com.sigedu.backend.repository;

import com.sigedu.backend.entity.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Integer> {
    List<Pago> findByMatriculaIdMatricula(Integer idMatricula);
    List<Pago> findByEstado(String estado);

    @Query("SELECT p FROM Pago p WHERE p.matricula.estudiante.idEstudiante = :idEstudiante AND p.estado IN ('Pendiente', 'Deuda')")
    List<Pago> findDeudasByEstudiante(@Param("idEstudiante") Integer idEstudiante);

    @Query("SELECT p FROM Pago p WHERE p.matricula.idMatricula = :idMatricula AND p.mes = :mes")
    Optional<Pago> findByMatriculaAndMes(@Param("idMatricula") Integer idMatricula, @Param("mes") Integer mes);

    @Query("SELECT p FROM Pago p WHERE p.estado IN ('Pendiente', 'Deuda') ORDER BY p.fechaVencimiento ASC")
    List<Pago> findPagosPendientesOrdenados();

    @Query("SELECT p FROM Pago p WHERE p.matricula.periodoAcademico.idPeriodoAcademico = :idPeriodoAcademico AND p.estado IN ('Pendiente', 'Deuda') ORDER BY p.fechaVencimiento ASC")
    List<Pago> findPagosPendientesByPeriodo(@Param("idPeriodoAcademico") Integer idPeriodoAcademico);

    @Query("SELECT p.estado, COUNT(p), COALESCE(SUM(p.saldoPendiente), 0) FROM Pago p WHERE p.matricula.periodoAcademico.idPeriodoAcademico = :idPeriodoAcademico GROUP BY p.estado")
    List<Object[]> resumenPagosByPeriodo(@Param("idPeriodoAcademico") Integer idPeriodoAcademico);
}
