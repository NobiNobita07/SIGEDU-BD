package com.sigedu.backend.controller;

import com.sigedu.backend.dto.response.ApiResponse;
import com.sigedu.backend.entity.TipoPago;
import com.sigedu.backend.service.TipoPagoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/tipos-pago")
public class TipoPagoController {

    @Autowired
    private TipoPagoService tipoPagoService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TipoPago>>> findAll() {
        List<TipoPago> tipos = tipoPagoService.findAll();
        return ResponseEntity.ok(ApiResponse.success(tipos));
    }

    @GetMapping("/activos")
    public ResponseEntity<ApiResponse<List<TipoPago>>> findActivos() {
        List<TipoPago> tiposActivos = tipoPagoService.findAllActivos();
        return ResponseEntity.ok(ApiResponse.success(tiposActivos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TipoPago>> findById(@PathVariable Integer id) {
        return tipoPagoService.findById(id)
                .map(tipo -> ResponseEntity.ok(ApiResponse.success(tipo)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Tipo de pago no encontrado con id: " + id)));
    }

    @GetMapping("/concepto/{concepto}")
    public ResponseEntity<ApiResponse<TipoPago>> findByConcepto(@PathVariable String concepto) {
        return tipoPagoService.findByConcepto(concepto)
                .map(tipo -> ResponseEntity.ok(ApiResponse.success(tipo)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Tipo de pago no encontrado con concepto: " + concepto)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TipoPago>> create(@Valid @RequestBody TipoPago tipoPago) {
        try {
            TipoPago nuevoTipo = tipoPagoService.save(tipoPago);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Tipo de pago creado exitosamente", nuevoTipo));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TipoPago>> update(@PathVariable Integer id, @Valid @RequestBody TipoPago tipoPago) {
        try {
            TipoPago tipoActualizado = tipoPagoService.update(id, tipoPago);
            return ResponseEntity.ok(ApiResponse.success("Tipo de pago actualizado exitosamente", tipoActualizado));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/{id}/monto")
    public ResponseEntity<ApiResponse<Void>> actualizarMonto(
            @PathVariable Integer id,
            @RequestParam BigDecimal monto) {
        try {
            tipoPagoService.actualizarMontoBase(id, monto);
            return ResponseEntity.ok(ApiResponse.success("Monto base actualizado exitosamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/{id}/reactivar")
    public ResponseEntity<ApiResponse<Void>> reactivar(@PathVariable Integer id) {
        try {
            tipoPagoService.reactivar(id);
            return ResponseEntity.ok(ApiResponse.success("Tipo de pago reactivado exitosamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        try {
            tipoPagoService.delete(id);
            return ResponseEntity.ok(ApiResponse.success("Tipo de pago eliminado exitosamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}