# Paso 7 - Paginación y búsqueda

Se agregaron endpoints profesionales de paginación y búsqueda para los módulos principales del backend.

## Estudiantes

### Listar con paginación
```http
GET /api/estudiantes/paginado?page=0&size=10&sortBy=idEstudiante&direction=asc
```

### Buscar con paginación
```http
GET /api/estudiantes/buscar-paginado?termino=juan&estado=true&page=0&size=10&sortBy=apellidos&direction=asc
```

Busca por nombres, apellidos, DNI o código.

## Docentes

### Listar con paginación
```http
GET /api/docentes/paginado?page=0&size=10&sortBy=idDocente&direction=asc
```

### Buscar con paginación
```http
GET /api/docentes/buscar-paginado?termino=matematica&estado=true&page=0&size=10&sortBy=apellidos&direction=asc
```

Busca por nombres, apellidos, DNI, código o especialidad.

## Apoderados

### Listar con paginación
```http
GET /api/apoderados/paginado?page=0&size=10&sortBy=idApoderado&direction=asc
```

### Buscar con paginación
```http
GET /api/apoderados/buscar-paginado?termino=perez&estado=true&page=0&size=10&sortBy=apellidos&direction=asc
```

Busca por nombres, apellidos, DNI, email o teléfono.

## Parámetros usados

- `page`: número de página. Empieza desde 0.
- `size`: cantidad de registros por página.
- `sortBy`: campo por el cual se ordena.
- `direction`: `asc` o `desc`.
- `termino`: texto de búsqueda.
- `estado`: `true`, `false` o vacío para traer ambos.

## Beneficio

Antes el backend devolvía listas completas. Ahora puede devolver información por páginas, lo cual mejora el rendimiento y facilita trabajar con tablas en React.
