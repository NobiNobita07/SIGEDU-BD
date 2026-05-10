package com.sigedu.backend.controller;

import com.sigedu.backend.dto.request.RegistroPagoRequest;
import com.sigedu.backend.dto.response.ApiResponse;
import com.sigedu.backend.entity.Pago;
import com.sigedu.backend.service.PagoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/pagos")
public class PagoController {

    @Autowired
    private PagoService pagoService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Pago>>> findAll() {
        List<Pago> pagos = pagoService.findAll();
        return ResponseEntity.ok(ApiResponse.success(pagos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Pago>> findById(@PathVariable Integer id) {
        return pagoService.findById(id)
                .map(pago -> ResponseEntity.ok(ApiResponse.success(pago)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Pago no encontrado con id: " + id)));
    }

    @GetMapping("/matricula/{idMatricula}")
    public ResponseEntity<ApiResponse<List<Pago>>> findByMatricula(@PathVariable Integer idMatricula) {
        List<Pago> pagos = pagoService.findByMatricula(idMatricula);
        return ResponseEntity.ok(ApiResponse.success(pagos));
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<ApiResponse<List<Pago>>> findByEstado(@PathVariable String estado) {
        List<Pago> pagos = pagoService.findByEstado(estado);
        return ResponseEntity.ok(ApiResponse.success(pagos));
    }

    @GetMapping("/deudas/estudiante/{idEstudiante}")
    public ResponseEntity<ApiResponse<List<Pago>>> findDeudasByEstudiante(@PathVariable Integer idEstudiante) {
        List<Pago> deudas = pagoService.findDeudasByEstudiante(idEstudiante);
        return ResponseEntity.ok(ApiResponse.success(deudas));
    }

    @GetMapping("/deudas/estudiante/{idEstudiante}/total")
    public ResponseEntity<ApiResponse<BigDecimal>> calcularTotalDeudas(@PathVariable Integer idEstudiante) {
        BigDecimal total = pagoService.calcularTotalDeudasByEstudiante(idEstudiante);
        return ResponseEntity.ok(ApiResponse.success(total));
    }

    @GetMapping("/matricula/{idMatricula}/mes/{mes}")
    public ResponseEntity<ApiResponse<Pago>> findByMatriculaAndMes(
            @PathVariable Integer idMatricula,
            @PathVariable Integer mes) {
        return pagoService.findByMatriculaAndMes(idMatricula, mes)
                .map(pago -> ResponseEntity.ok(ApiResponse.success(pago)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("No se encontró pago para el mes " + mes)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Pago>> create(@Valid @RequestBody Pago pago) {
        try {
            Pago nuevoPago = pagoService.save(pago);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Pago registrado exitosamente", nuevoPago));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{idPago}/registrar-pago")
    public ResponseEntity<ApiResponse<Void>> registrarPago(
            @PathVariable Integer idPago,
            @Valid @RequestBody RegistroPagoRequest request) {
        try {
            pagoService.registrarPago(
                    idPago,
                    request.getMontoPagado(),
                    request.getMedioPago(),
                    request.getNumeroOperacion()
            );
            return ResponseEntity.ok(ApiResponse.success("Pago registrado exitosamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Pago>> update(@PathVariable Integer id, @Valid @RequestBody Pago pago) {
        try {
            Pago pagoActualizado = pagoService.update(id, pago);
            return ResponseEntity.ok(ApiResponse.success("Pago actualizado exitosamente", pagoActualizado));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        try {
            pagoService.delete(id);
            return ResponseEntity.ok(ApiResponse.success("Pago anulado exitosamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}