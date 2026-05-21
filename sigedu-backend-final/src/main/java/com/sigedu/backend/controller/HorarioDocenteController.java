package com.sigedu.backend.controller;

import com.sigedu.backend.dto.response.ApiResponse;
import com.sigedu.backend.entity.HorarioDocente;
import com.sigedu.backend.service.HorarioDocenteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/horarios-docentes")
public class HorarioDocenteController {

    @Autowired
    private HorarioDocenteService horarioDocenteService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<HorarioDocente>>> findAll() {
        return ResponseEntity.ok(
                ApiResponse.success(horarioDocenteService.findAll())
        );
    }

    @GetMapping("/activos")
    public ResponseEntity<ApiResponse<List<HorarioDocente>>> findActivos() {
        return ResponseEntity.ok(
                ApiResponse.success(horarioDocenteService.findActivos())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HorarioDocente>> findById(@PathVariable Integer id) {
        return horarioDocenteService.findById(id)
                .map(horario -> ResponseEntity.ok(ApiResponse.success(horario)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Horario no encontrado con id: " + id)));
    }

    @GetMapping("/docente/{idDocente}")
    public ResponseEntity<ApiResponse<List<HorarioDocente>>> findByDocente(@PathVariable Integer idDocente) {
        return ResponseEntity.ok(
                ApiResponse.success(horarioDocenteService.findByDocente(idDocente))
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<HorarioDocente>> create(@Valid @RequestBody HorarioDocente horarioDocente) {
        try {
            HorarioDocente nuevoHorario = horarioDocenteService.save(horarioDocente);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Horario creado exitosamente", nuevoHorario));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<HorarioDocente>> update(
            @PathVariable Integer id,
            @Valid @RequestBody HorarioDocente horarioDocente) {
        try {
            HorarioDocente horarioActualizado = horarioDocenteService.update(id, horarioDocente);

            return ResponseEntity.ok(
                    ApiResponse.success("Horario actualizado exitosamente", horarioActualizado)
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/{id}/reactivar")
    public ResponseEntity<ApiResponse<Void>> reactivar(@PathVariable Integer id) {
        try {
            horarioDocenteService.reactivar(id);

            return ResponseEntity.ok(
                    ApiResponse.success("Horario reactivado exitosamente", null)
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        try {
            horarioDocenteService.delete(id);

            return ResponseEntity.ok(
                    ApiResponse.success("Horario eliminado exitosamente", null)
            );

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}