package com.sigedu.backend.repository;

import com.sigedu.backend.entity.HorarioDocente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalTime;
import java.util.List;

public interface HorarioDocenteRepository extends JpaRepository<HorarioDocente, Integer> {

    List<HorarioDocente> findByEstadoTrue();

    List<HorarioDocente> findByDocente_IdDocente(Integer idDocente);

    List<HorarioDocente> findByDiaSemanaIgnoreCase(String diaSemana);

    @Query(value = """
        SELECT COUNT(*)
        FROM HORARIO_DOCENTE h
        WHERE h.estado = 1
        AND h.id_docente = :idDocente
        AND UPPER(h.dia_semana) = UPPER(:diaSemana)
        AND (:idHorario IS NULL OR h.id_horario_docente <> :idHorario)
        AND h.hora_inicio < CAST(:horaFin AS time)
        AND h.hora_fin > CAST(:horaInicio AS time)
    """, nativeQuery = true)
    int contarCrucesDocente(
            @Param("idDocente") Integer idDocente,
            @Param("diaSemana") String diaSemana,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFin") LocalTime horaFin,
            @Param("idHorario") Integer idHorario
    );

    @Query(value = """
        SELECT COUNT(*)
        FROM HORARIO_DOCENTE h
        WHERE h.estado = 1
        AND h.id_grado_seccion = :idGradoSeccion
        AND UPPER(h.dia_semana) = UPPER(:diaSemana)
        AND (:idHorario IS NULL OR h.id_horario_docente <> :idHorario)
        AND h.hora_inicio < CAST(:horaFin AS time)
        AND h.hora_fin > CAST(:horaInicio AS time)
    """, nativeQuery = true)
    int contarCrucesGradoSeccion(
            @Param("idGradoSeccion") Integer idGradoSeccion,
            @Param("diaSemana") String diaSemana,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFin") LocalTime horaFin,
            @Param("idHorario") Integer idHorario
    );

    @Query(value = """
        SELECT COUNT(*)
        FROM HORARIO_DOCENTE h
        WHERE h.estado = 1
        AND UPPER(h.aula) = UPPER(:aula)
        AND UPPER(h.dia_semana) = UPPER(:diaSemana)
        AND (:idHorario IS NULL OR h.id_horario_docente <> :idHorario)
        AND h.hora_inicio < CAST(:horaFin AS time)
        AND h.hora_fin > CAST(:horaInicio AS time)
    """, nativeQuery = true)
    int contarCrucesAula(
            @Param("aula") String aula,
            @Param("diaSemana") String diaSemana,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFin") LocalTime horaFin,
            @Param("idHorario") Integer idHorario
    );
}