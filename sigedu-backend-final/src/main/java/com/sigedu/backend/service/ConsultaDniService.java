package com.sigedu.backend.service;

import com.sigedu.backend.dto.response.DniResponse;

public interface ConsultaDniService {

    DniResponse consultarDni(String dni);
}