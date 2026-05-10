# Paso 12 - Reportes profesionales y dashboard mejorado

En este paso se fortaleció el módulo de reportes del backend SIGEDU para que el sistema tenga consultas más útiles para administración, docentes, secretaría, apoderados y estudiantes.

## Archivos modificados

- `DashboardController.java`
- `DashboardService.java`
- `DashboardServiceImpl.java`
- `AsistenciaRepository.java`
- `NotaRepository.java`
- `PagoRepository.java`

## Nuevos endpoints agregados

### 1. Resumen ejecutivo del periodo académico

```http
GET /api/dashboard/reportes/resumen-ejecutivo/{idPeriodoAcademico}
```

Devuelve un resumen general con estudiantes, docentes, cursos, ingresos, deudas, pagos por estado y promedio general por curso.

### 2. Resumen académico por estudiante

```http
GET /api/dashboard/reportes/notas/estudiante/{idEstudiante}/resumen?idPeriodoAcademico=1
```

Devuelve el promedio general del estudiante, situación académica y detalle por curso.

### 3. Resumen de asistencia por estudiante

```http
GET /api/dashboard/reportes/asistencia/estudiante/{idEstudiante}/resumen?fechaInicio=2026-03-01&fechaFin=2026-03-31
```

Devuelve conteo de asistencias por estado, porcentaje de asistencia y situación del estudiante.

### 4. Resumen general de asistencia

```http
GET /api/dashboard/reportes/asistencia/resumen-general?fechaInicio=2026-03-01&fechaFin=2026-03-31
```

Devuelve el conteo global de presentes, tardanzas, faltas y justificaciones.

### 5. Pagos pendientes

```http
GET /api/dashboard/reportes/pagos/pendientes
```

También puede filtrarse por periodo:

```http
GET /api/dashboard/reportes/pagos/pendientes?idPeriodoAcademico=1
```

Devuelve los pagos pendientes o en deuda, ordenados por fecha de vencimiento.

### 6. Resumen de pagos por estado

```http
GET /api/dashboard/reportes/pagos/resumen-estado/{idPeriodoAcademico}
```

Devuelve el saldo pendiente agrupado por estado de pago.

## Beneficio del paso

Con esta mejora, el backend ya no solo registra datos, sino que también genera información resumida para la toma de decisiones. Esto mejora el valor del sistema porque permite consultar indicadores académicos, financieros y de asistencia desde el dashboard o desde Swagger.
