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
@Table(name = "GRADO_SECCION")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GradoSeccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_grado_seccion")
    private Integer idGradoSeccion;

    @Column(name = "grado", nullable = false, length = 20)
    private String grado;

    @Column(name = "seccion", nullable = false, length = 10)
    private String seccion;

    @Column(name = "nivel", nullable = false, length = 20)
    private String nivel;

    @Column(name = "turno", nullable = false, length = 20)
    private String turno;

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
    @ManyToOne
    @JoinColumn(name = "id_docente_tutor")
    private Docente docenteTutor;

    @JsonIgnore
    @OneToMany(mappedBy = "gradoSeccion")
    private List<Matricula> matriculas;

    @JsonIgnore
    @OneToMany(mappedBy = "gradoSeccion")
    private List<DocenteCurso> docenteCursos;
}