# SIGEDU Backend - Versión Final Integrada

Esta versión integra las mejoras realizadas desde el paso 1 hasta el paso 13 sobre el backend principal.

## Mejoras integradas

1. CORS configurado para React/Vite en `http://localhost:5173`.
2. Spring Security agregado.
3. Login con JWT.
4. Contraseñas encriptadas con BCrypt.
5. Usuario administrador inicial.
6. Manejo global de errores.
7. Swagger/OpenAPI para probar endpoints.
8. Validaciones y DTOs principales.
9. Paginación y búsqueda en módulos principales.
10. Auditoría básica con usuario creador/actualizador.
11. Perfiles de configuración `dev`, `prod` y `test`.
12. Pruebas básicas.
13. Roles y permisos por tipo de usuario.
14. Reportes y dashboard mejorado.
15. Exportación de reportes en CSV.

## Cómo ejecutar

### 1. Crear base de datos en SQL Server

```sql
CREATE DATABASE SIGEDU_BD;
```

### 2. Revisar configuración local

Archivo principal para desarrollo:

```text
src/main/resources/application-dev.properties
```

Verifica tus datos de SQL Server:

```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=SIGEDU_BD;encrypt=false;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=TuPassword123
```

### 3. Ejecutar backend

En la carpeta del backend:

```bash
./mvnw spring-boot:run
```

En Windows también puedes usar:

```bash
mvnw.cmd spring-boot:run
```

Si tienes Maven instalado:

```bash
mvn spring-boot:run
```

## URL principal

```text
http://localhost:8080/api
```

## Swagger

```text
http://localhost:8080/api/swagger-ui.html
```

## Usuarios de prueba

| Usuario | Contraseña | Rol |
|---|---|---|
| admin | 123456 | ADMIN |
| secretaria | 123456 | SECRETARIA |
| docente | 123456 | DOCENTE |
| apoderado | 123456 | APODERADO |
| estudiante | 123456 | ESTUDIANTE |

## Login

Endpoint:

```text
POST http://localhost:8080/api/auth/login
```

Body:

```json
{
  "username": "admin",
  "password": "123456"
}
```

Luego usa el token en Swagger/Postman como:

```text
Authorization: Bearer TU_TOKEN
```

## Nota importante

No se incluyó Docker todavía, porque se decidió dejarlo para el siguiente paso.
