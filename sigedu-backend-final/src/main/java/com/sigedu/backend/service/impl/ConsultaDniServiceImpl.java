package com.sigedu.backend.service.impl;

import com.sigedu.backend.dto.response.DniResponse;
import com.sigedu.backend.service.ConsultaDniService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class ConsultaDniServiceImpl implements ConsultaDniService {

    @Value("${dni.api.url:https://apiperu.dev/api/dni}")
    private String dniApiUrl;

    @Value("${dni.api.token:}")
    private String dniApiToken;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public DniResponse consultarDni(String dni) {
        if (dni == null || !dni.matches("\\d{8}")) {
            throw new RuntimeException("El DNI debe tener exactamente 8 dígitos.");
        }

        if (dniApiToken == null || dniApiToken.isBlank()) {
            return consultarDniSimulado(dni);
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));
            headers.setBearerAuth(dniApiToken);

            Map<String, String> body = Map.of("dni", dni);

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    dniApiUrl,
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            Map responseBody = response.getBody();

            if (responseBody == null) {
                throw new RuntimeException("No se recibió respuesta del servicio de consulta DNI.");
            }

            Boolean success = (Boolean) responseBody.get("success");

            if (success == null || !success) {
                throw new RuntimeException("No se encontraron datos para el DNI ingresado.");
            }

            Map data = (Map) responseBody.get("data");

            if (data == null) {
                throw new RuntimeException("La respuesta del servicio DNI no contiene datos.");
            }

            String nombres = obtenerTexto(data, "nombres");
            String apellidoPaterno = obtenerTexto(data, "apellido_paterno");
            String apellidoMaterno = obtenerTexto(data, "apellido_materno");
            String nombreCompleto = obtenerTexto(data, "nombre_completo");

            String apellidos = (apellidoPaterno + " " + apellidoMaterno).trim();

            if (nombreCompleto == null || nombreCompleto.isBlank()) {
                nombreCompleto = (nombres + " " + apellidos).trim();
            }

            return new DniResponse(
                    dni,
                    nombres,
                    apellidos,
                    nombreCompleto
            );

        } catch (Exception e) {
            throw new RuntimeException("No se pudo consultar el DNI: " + e.getMessage());
        }
    }

    private String obtenerTexto(Map data, String key) {
        Object value = data.get(key);
        return value != null ? value.toString() : "";
    }

    private DniResponse consultarDniSimulado(String dni) {
        return switch (dni) {
            case "70000001" -> new DniResponse("70000001", "Carlos", "Quispe Huamán", "Carlos Quispe Huamán");
            case "70000002" -> new DniResponse("70000002", "María", "García Rojas", "María García Rojas");
            case "70000003" -> new DniResponse("70000003", "José", "Mendoza Díaz", "José Mendoza Díaz");

            case "72000001" -> new DniResponse("72000001", "Mateo", "Quispe García", "Mateo Quispe García");
            case "72000002" -> new DniResponse("72000002", "Valeria", "García Rojas", "Valeria García Rojas");
            case "72000003" -> new DniResponse("72000003", "Sebastián", "Mendoza Díaz", "Sebastián Mendoza Díaz");

            case "71000001" -> new DniResponse("71000001", "Juan", "Salazar Ríos", "Juan Salazar Ríos");
            case "71000002" -> new DniResponse("71000002", "Karla", "Molina Prado", "Karla Molina Prado");
            case "71000003" -> new DniResponse("71000003", "Diego", "Vera Huamán", "Diego Vera Huamán");

            default -> throw new RuntimeException("No se encontraron datos para el DNI ingresado.");
        };
    }
}