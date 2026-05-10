package com.sigedu.backend.dto.request;

import com.sigedu.backend.entity.Apoderado;
import com.sigedu.backend.entity.Estudiante;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApoderadoConEstudianteRequest {

    @Valid
    @NotNull(message = "Los datos del apoderado son obligatorios")
    private Apoderado apoderado;

    @Valid
    @NotNull(message = "Los datos del estudiante son obligatorios")
    private Estudiante estudiante;
}