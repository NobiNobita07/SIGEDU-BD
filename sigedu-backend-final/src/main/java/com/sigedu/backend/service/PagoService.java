package com.sigedu.backend.service;

import com.sigedu.backend.entity.DetallePago;
import com.sigedu.backend.entity.Pago;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface PagoService {
    List<Pago> findAll();
    Optional<Pago> findById(Integer id);
    Pago save(Pago pago);
    Pago update(Integer id, Pago pago);
    void delete(Integer id);
    List<Pago> findByMatricula(Integer idMatricula);
    List<Pago> findByEstado(String estado);
    List<Pago> findDeudasByEstudiante(Integer idEstudiante);
    Optional<Pago> findByMatriculaAndMes(Integer idMatricula, Integer mes);
    void registrarPago(Integer idPago, BigDecimal montoPagado, String medioPago, String numeroOperacion);
    BigDecimal calcularTotalDeudasByEstudiante(Integer idEstudiante);
}