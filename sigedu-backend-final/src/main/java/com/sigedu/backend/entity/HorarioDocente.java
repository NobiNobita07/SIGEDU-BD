package com.sigedu.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.sigedu.backend.audit.AuditEntityListener;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@EntityListeners(AuditEntityListener.class)
@Table(name = "HORARIO_DOCENTE")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class HorarioDocente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_horario_docente")
    private Integer idHorarioDocente;

    @NotNull(message = "El docente es obligatorio")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_docente", nullable = false)
    @JsonIgnoreProperties({
            "gradosSecciones",
            "docenteCursos",
            "usuario",
            "hibernateLazyInitializer",
            "handler"
    })
    private Docente docente;

    @NotNull(message = "El curso es obligatorio")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_curso", nullable = false)
    @JsonIgnoreProperties({
            "docenteCursos",
            "notas",
            "asistencias",
            "hibernateLazyInitializer",
            "handler"
    })
    private Curso curso;

    @NotNull(message = "El grado/sección es obligatorio")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_grado_seccion", nullable = false)
    @JsonIgnoreProperties({
            "matriculas",
            "docenteCursos",
            "docenteTutor",
            "hibernateLazyInitializer",
            "handler"
    })
    private GradoSeccion gradoSeccion;

    @NotNull(message = "El periodo académico es obligatorio")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_periodo_academico", nullable = false)
    @JsonIgnoreProperties({
            "matriculas",
            "notas",
            "docenteCursos",
            "hibernateLazyInitializer",
            "handler"
    })
    private PeriodoAcademico periodoAcademico;

    @NotBlank(message = "El día de la semana es obligatorio")
    @Column(name = "dia_semana", nullable = false, length = 20)
    private String diaSemana;

    @NotNull(message = "La hora de inicio es obligatoria")
    @Column(name = "hora_inicio", nullable = false)
    private LocalTime horaInicio;

    @NotNull(message = "La hora de fin es obligatoria")
    @Column(name = "hora_fin", nullable = false)
    private LocalTime horaFin;

    @Column(name = "aula", length = 50)
    private String aula;

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
}