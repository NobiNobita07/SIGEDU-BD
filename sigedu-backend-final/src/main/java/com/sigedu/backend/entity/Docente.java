package com.sigedu.backend.entity;

import com.sigedu.backend.audit.AuditEntityListener;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@EntityListeners(AuditEntityListener.class)
@Table(name = "DOCENTE")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Docente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_docente")
    private Integer idDocente;

    @NotBlank(message = "El código del docente es obligatorio")
    @Size(max = 20, message = "El código no debe superar 20 caracteres")
    @Column(name = "codigo", nullable = false, unique = true, length = 20)
    private String codigo;

    @NotBlank(message = "Los nombres son obligatorios")
    @Size(max = 100, message = "Los nombres no deben superar 100 caracteres")
    @Column(name = "nombres", nullable = false, length = 100)
    private String nombres;

    @NotBlank(message = "Los apellidos son obligatorios")
    @Size(max = 100, message = "Los apellidos no deben superar 100 caracteres")
    @Column(name = "apellidos", nullable = false, length = 100)
    private String apellidos;

    @NotBlank(message = "El DNI es obligatorio")
    @Pattern(regexp = "\\d{8}", message = "El DNI debe tener 8 dígitos")
    @Column(name = "dni", nullable = false, unique = true, length = 8)
    private String dni;

    @Size(max = 100, message = "La especialidad no debe superar 100 caracteres")
    @Column(name = "especialidad", length = 100)
    private String especialidad;

    @Pattern(regexp = "^$|^[0-9+ -]{6,15}$", message = "El teléfono no tiene un formato válido")
    @Column(name = "telefono", length = 15)
    private String telefono;

    @Email(message = "El email no tiene un formato válido")
    @Size(max = 100, message = "El email no debe superar 100 caracteres")
    @Column(name = "email", length = 100)
    private String email;

    @NotNull(message = "La fecha de ingreso es obligatoria")
    @PastOrPresent(message = "La fecha de ingreso no puede ser futura")
    @Column(name = "fecha_ingreso", nullable = false)
    private LocalDate fechaIngreso;

    @Column(name = "estado")
    private Boolean estado = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by", updatable = false, length = 50)
    private String createdBy;

    @Column(name = "updated_by", length = 50)
    private String updatedBy;

    @JsonIgnore
    @OneToMany(mappedBy = "docenteTutor")
    private List<GradoSeccion> gradosSecciones;

    @JsonIgnore
    @OneToMany(mappedBy = "docente")
    private List<DocenteCurso> docenteCursos;

    @JsonIgnore
    @OneToOne(mappedBy = "docente")
    private Usuario usuario;
}
