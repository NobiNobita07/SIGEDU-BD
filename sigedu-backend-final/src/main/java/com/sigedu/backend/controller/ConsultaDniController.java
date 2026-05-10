package com.sigedu.backend.controller;

import com.sigedu.backend.dto.response.ApiResponse;
import com.sigedu.backend.dto.response.DniResponse;
import com.sigedu.backend.service.ConsultaDniService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/consultas")
public class ConsultaDniController {

    @Autowired
    private ConsultaDniService consultaDniService;

    @GetMapping("/dni/{dni}")
    public ResponseEntity<ApiResponse<DniResponse>> consultarDni(@PathVariable String dni) {
        try {
            DniResponse response = consultaDniService.consultarDni(dni);
            return ResponseEntity.ok(
                    ApiResponse.success("Datos encontrados correctamente", response)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}