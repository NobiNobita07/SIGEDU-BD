package com.sigedu.backend.entity;

import com.sigedu.backend.audit.AuditEntityListener;

import jakarta.persistence.*;
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
@Table(name = "PERIODO_ACADEMICO")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PeriodoAcademico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_periodo_academico")
    private Integer idPeriodoAcademico;

    @Column(name = "anio", nullable = false)
    private Integer anio;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDate fechaFin;

    @Column(name = "estado", length = 20)
    private String estado = "Activo";

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

    // Relaciones
    @JsonIgnore
    @OneToMany(mappedBy = "periodoAcademico")
    private List<Matricula> matriculas;

    @JsonIgnore
    @OneToMany(mappedBy = "periodoAcademico")
    private List<Nota> notas;

    @JsonIgnore
    @OneToMany(mappedBy = "periodoAcademico")
    private List<DocenteCurso> docenteCursos;
}