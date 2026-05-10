package com.sigedu.backend.service.impl;

import com.sigedu.backend.entity.DetallePago;
import com.sigedu.backend.entity.Pago;
import com.sigedu.backend.repository.DetallePagoRepository;
import com.sigedu.backend.repository.PagoRepository;
import com.sigedu.backend.service.PagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PagoServiceImpl implements PagoService {

    @Autowired
    private PagoRepository pagoRepository;

    @Autowired
    private DetallePagoRepository detallePagoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Pago> findAll() {
        return pagoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Pago> findById(Integer id) {
        return pagoRepository.findById(id);
    }

    @Override
    public Pago save(Pago pago) {
        pago.setSaldoPendiente(pago.getMontoTotal());
        pago.setMontoPagado(BigDecimal.ZERO);
        return pagoRepository.save(pago);
    }

    @Override
    public Pago update(Integer id, Pago pago) {
        Pago existing = pagoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado con id: " + id));

        existing.setMontoTotal(pago.getMontoTotal());
        existing.setFechaVencimiento(pago.getFechaVencimiento());

        return pagoRepository.save(existing);
    }

    @Override
    public void delete(Integer id) {
        Pago pago = pagoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado con id: " + id));
        pago.setEstado("Anulado");
        pagoRepository.save(pago);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Pago> findByMatricula(Integer idMatricula) {
        return pagoRepository.findByMatriculaIdMatricula(idMatricula);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Pago> findByEstado(String estado) {
        return pagoRepository.findByEstado(estado);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Pago> findDeudasByEstudiante(Integer idEstudiante) {
        return pagoRepository.findDeudasByEstudiante(idEstudiante);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Pago> findByMatriculaAndMes(Integer idMatricula, Integer mes) {
        return pagoRepository.findByMatriculaAndMes(idMatricula, mes);
    }

    @Override
    public void registrarPago(Integer idPago, BigDecimal montoPagado, String medioPago, String numeroOperacion) {
        Pago pago = pagoRepository.findById(idPago)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado con id: " + idPago));

        if (montoPagado.compareTo(pago.getSaldoPendiente()) > 0) {
            throw new RuntimeException("El monto pagado no puede ser mayor al saldo pendiente");
        }

        // Crear detalle de pago
        DetallePago detalle = new DetallePago();
        detalle.setPago(pago);
        detalle.setMontoPagado(montoPagado);
        detalle.setFechaPago(LocalDate.now());
        detalle.setMedioPago(medioPago);
        detalle.setNumeroOperacion(numeroOperacion);
        detallePagoRepository.save(detalle);

        // Actualizar pago
        BigDecimal nuevoMontoPagado = pago.getMontoPagado().add(montoPagado);
        BigDecimal nuevoSaldo = pago.getSaldoPendiente().subtract(montoPagado);

        pago.setMontoPagado(nuevoMontoPagado);
        pago.setSaldoPendiente(nuevoSaldo);

        if (nuevoSaldo.compareTo(BigDecimal.ZERO) == 0) {
            pago.setEstado("Pagado");
        } else {
            pago.setEstado("Deuda");
        }

        pagoRepository.save(pago);
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal calcularTotalDeudasByEstudiante(Integer idEstudiante) {
        List<Pago> deudas = pagoRepository.findDeudasByEstudiante(idEstudiante);
        return deudas.stream()
                .map(Pago::getSaldoPendiente)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}