package com.sigedu.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DniResponse {

    private String dni;
    private String nombres;
    private String apellidos;
    private String nombreCompleto;
}