package com.sigedu.backend.entity;

import com.sigedu.backend.audit.AuditEntityListener;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@EntityListeners(AuditEntityListener.class)
@Table(name = "CURSO")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Curso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_curso")
    private Integer idCurso;

    @Column(name = "nombre", nullable = false, unique = true, length = 100)
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "horas_semanales")
    private Integer horasSemanales = 4;

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

    // Relaciones
    @JsonIgnore
    @OneToMany(mappedBy = "curso")
    private List<DocenteCurso> docenteCursos;

    @JsonIgnore
    @OneToMany(mappedBy = "curso")
    private List<Nota> notas;

    @JsonIgnore
    @OneToMany(mappedBy = "curso")
    private List<Asistencia> asistencias;
}