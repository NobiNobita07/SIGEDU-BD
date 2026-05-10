# Paso 10 - Pruebas básicas del backend

En este paso se agregaron pruebas automatizadas iniciales para mejorar la calidad del backend SIGEDU.

## Cambios realizados

1. Se agregó dependencia de H2 en alcance `test` para ejecutar pruebas sin depender de SQL Server.
2. Se creó el perfil `test` en `src/test/resources/application-test.properties`.
3. Se actualizó `BackendApplicationTests` para usar `@ActiveProfiles("test")`.
4. Se agregó `JwtServiceTest` para comprobar generación y validación de token JWT.
5. Se agregó `AuthControllerTest` para probar:
   - creación automática del usuario `admin`;
   - login correcto con token;
   - login incorrecto con respuesta `401 Unauthorized`.
6. Se corrigieron anotaciones de auditoría `@Column` en entidades.
7. Se completó `AuditEntityListener` para llenar automáticamente `createdBy` y `updatedBy`.
8. Se conservaron los perfiles `dev` y `prod` para configuración profesional.

## Cómo ejecutar las pruebas

Desde la carpeta del backend:

```bash
mvn test
```

Si usas el wrapper:

```bash
./mvnw test
```

En Windows:

```bash
mvnw.cmd test
```

## Prueba de login cubierta

Credenciales usadas en la prueba:

```json
{
  "username": "admin",
  "password": "123456"
}
```

## Importante

Estas pruebas usan H2 en memoria, no afectan tu base real `SIGEDU_BD` de SQL Server.
