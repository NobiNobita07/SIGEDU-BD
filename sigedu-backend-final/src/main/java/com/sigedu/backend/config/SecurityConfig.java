package com.sigedu.backend.config;

import com.sigedu.backend.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private UserDetailsService userDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers("/auth/**").permitAll();
                    auth.requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**").permitAll();

                    // Solo ADMIN
                    auth.requestMatchers("/usuarios/**", "/roles/**").hasRole("ADMIN");

                    // Dashboard y reportes
                    auth.requestMatchers(HttpMethod.GET, "/dashboard/**", "/reportes/**")
                            .hasAnyRole("ADMIN", "SECRETARIA", "DOCENTE");

                    // Apoderados
                    auth.requestMatchers(HttpMethod.GET, "/apoderados/**")
                            .hasAnyRole("ADMIN", "SECRETARIA");
                    auth.requestMatchers(HttpMethod.POST, "/apoderados/**")
                            .hasAnyRole("ADMIN", "SECRETARIA");
                    auth.requestMatchers(HttpMethod.PUT, "/apoderados/**")
                            .hasAnyRole("ADMIN", "SECRETARIA");
                    auth.requestMatchers(HttpMethod.PATCH, "/apoderados/**")
                            .hasAnyRole("ADMIN", "SECRETARIA");
                    auth.requestMatchers(HttpMethod.DELETE, "/apoderados/**")
                            .hasRole("ADMIN");

                    // Estudiantes
                    auth.requestMatchers(HttpMethod.GET, "/estudiantes/**")
                            .hasAnyRole("ADMIN", "SECRETARIA", "DOCENTE");
                    auth.requestMatchers(HttpMethod.POST, "/estudiantes/**")
                            .hasAnyRole("ADMIN", "SECRETARIA");
                    auth.requestMatchers(HttpMethod.PUT, "/estudiantes/**")
                            .hasAnyRole("ADMIN", "SECRETARIA");
                    auth.requestMatchers(HttpMethod.PATCH, "/estudiantes/**")
                            .hasAnyRole("ADMIN", "SECRETARIA");
                    auth.requestMatchers(HttpMethod.DELETE, "/estudiantes/**")
                            .hasRole("ADMIN");

                    // Docentes
                    auth.requestMatchers(HttpMethod.GET, "/docentes/**")
                            .hasAnyRole("ADMIN", "SECRETARIA", "DOCENTE");
                    auth.requestMatchers(HttpMethod.POST, "/docentes/**")
                            .hasAnyRole("ADMIN", "SECRETARIA");
                    auth.requestMatchers(HttpMethod.PUT, "/docentes/**")
                            .hasAnyRole("ADMIN", "SECRETARIA");
                    auth.requestMatchers(HttpMethod.PATCH, "/docentes/**")
                            .hasAnyRole("ADMIN", "SECRETARIA");
                    auth.requestMatchers(HttpMethod.DELETE, "/docentes/**")
                            .hasRole("ADMIN");

                    // Cursos
                    auth.requestMatchers(HttpMethod.GET, "/cursos/**")
                            .hasAnyRole("ADMIN", "SECRETARIA", "DOCENTE");
                    auth.requestMatchers(HttpMethod.POST, "/cursos/**")
                            .hasAnyRole("ADMIN", "SECRETARIA");
                    auth.requestMatchers(HttpMethod.PUT, "/cursos/**")
                            .hasAnyRole("ADMIN", "SECRETARIA");
                    auth.requestMatchers(HttpMethod.PATCH, "/cursos/**")
                            .hasAnyRole("ADMIN", "SECRETARIA");
                    auth.requestMatchers(HttpMethod.DELETE, "/cursos/**")
                            .hasRole("ADMIN");

                    // Grados / Secciones
                    auth.requestMatchers(HttpMethod.GET, "/grados-secciones/**")
                            .hasAnyRole("ADMIN", "SECRETARIA", "DOCENTE");
                    auth.requestMatchers(HttpMethod.POST, "/grados-secciones/**")
                            .hasAnyRole("ADMIN", "SECRETARIA");
                    auth.requestMatchers(HttpMethod.PUT, "/grados-secciones/**")
                            .hasAnyRole("ADMIN", "SECRETARIA");
                    auth.requestMatchers(HttpMethod.PATCH, "/grados-secciones/**")
                            .hasAnyRole("ADMIN", "SECRETARIA");
                    auth.requestMatchers(HttpMethod.DELETE, "/grados-secciones/**")
                            .hasRole("ADMIN");

                    // Matrículas
                    auth.requestMatchers(HttpMethod.GET, "/matriculas/**")
                            .hasAnyRole("ADMIN", "SECRETARIA", "DOCENTE");
                    auth.requestMatchers(HttpMethod.POST, "/matriculas/**")
                            .hasAnyRole("ADMIN", "SECRETARIA");
                    auth.requestMatchers(HttpMethod.PUT, "/matriculas/**")
                            .hasAnyRole("ADMIN", "SECRETARIA");
                    auth.requestMatchers(HttpMethod.DELETE, "/matriculas/**")
                            .hasRole("ADMIN");

                    // Periodos académicos
                    auth.requestMatchers(HttpMethod.GET, "/periodos-academicos/**")
                            .hasAnyRole("ADMIN", "SECRETARIA", "DOCENTE");
                    auth.requestMatchers("/periodos-academicos/**")
                            .hasRole("ADMIN");

                    // Tipos de pago y pagos
                    auth.requestMatchers(HttpMethod.GET, "/tipos-pago/**", "/pagos/**")
                            .hasAnyRole("ADMIN", "SECRETARIA", "DOCENTE");
                    auth.requestMatchers(HttpMethod.POST, "/tipos-pago/**", "/pagos/**")
                            .hasAnyRole("ADMIN", "SECRETARIA");
                    auth.requestMatchers(HttpMethod.PUT, "/tipos-pago/**", "/pagos/**")
                            .hasAnyRole("ADMIN", "SECRETARIA");
                    auth.requestMatchers(HttpMethod.PATCH, "/tipos-pago/**", "/pagos/**")
                            .hasAnyRole("ADMIN", "SECRETARIA");
                    auth.requestMatchers(HttpMethod.DELETE, "/tipos-pago/**", "/pagos/**")
                            .hasRole("ADMIN");

                    // Notas y asistencias
                    auth.requestMatchers(HttpMethod.GET, "/notas/**", "/asistencias/**")
                            .hasAnyRole("ADMIN", "DOCENTE");
                    auth.requestMatchers(HttpMethod.POST, "/notas/**", "/asistencias/**")
                            .hasAnyRole("ADMIN", "DOCENTE");
                    auth.requestMatchers(HttpMethod.PUT, "/notas/**", "/asistencias/**")
                            .hasAnyRole("ADMIN", "DOCENTE");
                    auth.requestMatchers(HttpMethod.DELETE, "/notas/**", "/asistencias/**")
                            .hasRole("ADMIN");

                    // Asignación docente-curso
                    auth.requestMatchers(HttpMethod.GET, "/docente-cursos/**")
                            .hasAnyRole("ADMIN", "SECRETARIA", "DOCENTE");
                    auth.requestMatchers("/docente-cursos/**")
                            .hasAnyRole("ADMIN", "SECRETARIA");

                    // Consulta DNI tipo RENIEC / ApiPeruDev
                    auth.requestMatchers("/consultas/**")
                            .hasAnyRole("ADMIN", "SECRETARIA", "DOCENTE");

                    // Horarios de docentes
                    auth.requestMatchers(HttpMethod.GET, "/horarios-docentes/**")
                            .hasAnyRole("ADMIN", "SECRETARIA", "DOCENTE");

                    auth.requestMatchers(HttpMethod.POST, "/horarios-docentes/**")
                            .hasAnyRole("ADMIN", "SECRETARIA");

                    auth.requestMatchers(HttpMethod.PUT, "/horarios-docentes/**")
                            .hasAnyRole("ADMIN", "SECRETARIA");

                    auth.requestMatchers(HttpMethod.PATCH, "/horarios-docentes/**")
                            .hasAnyRole("ADMIN", "SECRETARIA");

                    auth.requestMatchers(HttpMethod.DELETE, "/horarios-docentes/**")
                            .hasRole("ADMIN");

                    auth.anyRequest().authenticated();
                })
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .httpBasic(httpBasic -> httpBasic.disable())
                .formLogin(formLogin -> formLogin.disable());

        return http.build();
    }
}