package com.sigedu.backend.service;

import com.sigedu.backend.entity.TipoPago;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface TipoPagoService {
    List<TipoPago> findAll();
    List<TipoPago> findAllActivos();  // NUEVO
    Optional<TipoPago> findById(Integer id);
    Optional<TipoPago> findByConcepto(String concepto);
    TipoPago save(TipoPago tipoPago);
    TipoPago update(Integer id, TipoPago tipoPago);
    void delete(Integer id);
    void reactivar(Integer id);  // NUEVO
    void actualizarMontoBase(Integer id, BigDecimal nuevoMonto);
}