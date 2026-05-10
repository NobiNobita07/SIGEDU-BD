package com.sigedu.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.sigedu.backend.audit.AuditEntityListener;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@EntityListeners(AuditEntityListener.class)
@Table(name = "MATRICULA")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Matricula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_matricula")
    private Integer idMatricula;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_estudiante", nullable = false)
    @JsonIgnoreProperties({"matriculas", "hibernateLazyInitializer", "handler"})
    private Estudiante estudiante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_grado_seccion", nullable = false)
    @JsonIgnoreProperties({"matriculas", "docenteCursos", "hibernateLazyInitializer", "handler"})
    private GradoSeccion gradoSeccion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_periodo_academico", nullable = false)
    @JsonIgnoreProperties({"matriculas", "notas", "docenteCursos", "hibernateLazyInitializer", "handler"})
    private PeriodoAcademico periodoAcademico;

    @Column(name = "fecha_matricula", nullable = false)
    private LocalDate fechaMatricula = LocalDate.now();

    @Column(name = "estado", length = 20)
    private String estado = "Activa";

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
    @OneToMany(mappedBy = "matricula")
    private List<Nota> notas;

    @JsonIgnore
    @OneToMany(mappedBy = "matricula")
    private List<Asistencia> asistencias;

    @JsonIgnore
    @OneToMany(mappedBy = "matricula")
    private List<Pago> pagos;
}