# SIGEDU-BD

Sistema web de gestión educativa desarrollado con Spring Boot, React, TailwindCSS y SQL Server.

## Tecnologías utilizadas

### Backend
- Java 17
- Spring Boot
- Spring Security
- JWT
- SQL Server
- Maven

### Frontend
- React
- Vite
- TailwindCSS
- Axios

## Funcionalidades

- Login con roles
- Dashboard institucional
- Gestión de estudiantes
- Gestión de docentes
- Gestión de apoderados
- Gestión de matrículas
- Gestión de notas
- Gestión de asistencias
- Gestión de pagos
- Consulta DNI con ApiPeruDev
- Reportes PDF

## Roles

- Administrador
- Docente
- Secretaría

## Backend

```bash
cd sigedu-backend-final
mvn spring-boot:run "-Dspring-boot.run.profiles=dev"
```

## Frontend

```bash
cd sigedu-frontend
npm install
npm run dev
```

## Usuarios de prueba

```text
admin / 123456
docente / 123456
secretaria / 123456
```