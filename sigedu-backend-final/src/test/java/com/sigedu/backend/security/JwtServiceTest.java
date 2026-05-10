package com.sigedu.backend.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.ActiveProfiles;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class JwtServiceTest {

    @Autowired
    private JwtService jwtService;

    @Test
    void debeGenerarTokenValidoConUsername() {
        UserDetails userDetails = User.withUsername("admin")
                .password("123456")
                .authorities("ROLE_ADMIN")
                .build();

        Map<String, Object> claims = new HashMap<>();
        claims.put("rol", "ADMIN");

        String token = jwtService.generateToken(userDetails, claims);

        assertThat(token).isNotBlank();
        assertThat(jwtService.extractUsername(token)).isEqualTo("admin");
        assertThat(jwtService.isTokenValid(token, userDetails)).isTrue();
    }
}
