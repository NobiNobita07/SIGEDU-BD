# Paso 11 - Roles completos y protección de rutas

Se agregó una configuración más profesional de autorización por roles para el backend SIGEDU.

## Roles iniciales creados automáticamente

Al iniciar el backend, si no existen, se crean los siguientes roles:

- ADMIN
- SECRETARIA
- DOCENTE
- APODERADO
- ESTUDIANTE

También se crean usuarios de prueba con contraseña `123456`:

| Usuario | Rol |
|---|---|
| admin | ADMIN |
| secretaria | SECRETARIA |
| docente | DOCENTE |
| apoderado | APODERADO |
| estudiante | ESTUDIANTE |

## Permisos configurados

### ADMIN
Tiene acceso completo al sistema.

### SECRETARIA
Puede gestionar estudiantes, docentes, apoderados, matrículas, pagos y catálogos académicos. No puede eliminar registros críticos ni administrar roles/usuarios.

### DOCENTE
Puede consultar estudiantes, cursos, grados, matrículas y gestionar notas y asistencias.

### APODERADO
Puede consultar información relacionada con estudiantes, notas, asistencias, pagos y reportes.

### ESTUDIANTE
Puede consultar información académica básica, notas, asistencias, pagos y reportes.

## Rutas públicas

- `/auth/**`
- `/swagger-ui/**`
- `/swagger-ui.html`
- `/v3/api-docs/**`

## Nota para el frontend

Después del login se debe enviar el token JWT en cada petición protegida:

```http
Authorization: Bearer TOKEN_AQUI
```
