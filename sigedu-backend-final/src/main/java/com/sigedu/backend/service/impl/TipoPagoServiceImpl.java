package com.sigedu.backend.service.impl;

import com.sigedu.backend.entity.TipoPago;
import com.sigedu.backend.repository.TipoPagoRepository;
import com.sigedu.backend.service.TipoPagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class TipoPagoServiceImpl implements TipoPagoService {

    @Autowired
    private TipoPagoRepository tipoPagoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TipoPago> findAll() {
        return tipoPagoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TipoPago> findAllActivos() {
        return tipoPagoRepository.findAll().stream()
                .filter(TipoPago::getEstado)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<TipoPago> findById(Integer id) {
        return tipoPagoRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<TipoPago> findByConcepto(String concepto) {
        return tipoPagoRepository.findByConcepto(concepto);
    }

    @Override
    public TipoPago save(TipoPago tipoPago) {
        if (tipoPagoRepository.findByConcepto(tipoPago.getConcepto()).isPresent()) {
            throw new RuntimeException("Ya existe un tipo de pago con concepto: " + tipoPago.getConcepto());
        }
        return tipoPagoRepository.save(tipoPago);
    }

    @Override
    public TipoPago update(Integer id, TipoPago tipoPago) {
        TipoPago existing = tipoPagoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo de pago no encontrado con id: " + id));

        existing.setConcepto(tipoPago.getConcepto());
        existing.setMontoBase(tipoPago.getMontoBase());
        existing.setDescripcion(tipoPago.getDescripcion());
        existing.setEstado(tipoPago.getEstado());

        return tipoPagoRepository.save(existing);
    }

    @Override
    public void delete(Integer id) {
        TipoPago tipoPago = tipoPagoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo de pago no encontrado con id: " + id));
        tipoPago.setEstado(false);
        tipoPagoRepository.save(tipoPago);
    }

    @Override
    public void reactivar(Integer id) {
        TipoPago tipoPago = tipoPagoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo de pago no encontrado con id: " + id));

        if (tipoPago.getEstado()) {
            throw new RuntimeException("El tipo de pago ya está activo");
        }

        tipoPago.setEstado(true);
        tipoPagoRepository.save(tipoPago);
    }

    @Override
    public void actualizarMontoBase(Integer id, BigDecimal nuevoMonto) {
        TipoPago tipoPago = tipoPagoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo de pago no encontrado con id: " + id));
        tipoPago.setMontoBase(nuevoMonto);
        tipoPagoRepository.save(tipoPago);
    }
}