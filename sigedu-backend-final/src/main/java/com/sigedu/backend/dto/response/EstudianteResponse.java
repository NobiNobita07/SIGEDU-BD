package com.sigedu.backend.dto.response;

import com.sigedu.backend.entity.Estudiante;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EstudianteResponse {

    private Integer idEstudiante;
    private String codigo;
    private String nombres;
    private String apellidos;
    private String dni;
    private LocalDate fechaNacimiento;
    private String direccion;
    private String telefono;
    private String email;
    private Boolean estado;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;

    private Integer idApoderado;
    private String apoderadoNombres;
    private String apoderadoApellidos;
    private String apoderadoDni;

    public static EstudianteResponse fromEntity(Estudiante e) {
        return new EstudianteResponse(
                e.getIdEstudiante(),
                e.getCodigo(),
                e.getNombres(),
                e.getApellidos(),
                e.getDni(),
                e.getFechaNacimiento(),
                e.getDireccion(),
                e.getTelefono(),
                e.getEmail(),
                e.getEstado(),
                e.getCreatedAt(),
                e.getUpdatedAt(),
                e.getCreatedBy(),
                e.getUpdatedBy(),
                e.getApoderado() != null ? e.getApoderado().getIdApoderado() : null,
                e.getApoderado() != null ? e.getApoderado().getNombres() : null,
                e.getApoderado() != null ? e.getApoderado().getApellidos() : null,
                e.getApoderado() != null ? e.getApoderado().getDni() : null
        );
    }
}