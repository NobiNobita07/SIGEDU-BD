package com.sigedu.backend.audit;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class AuditUtil {

    private AuditUtil() {
    }

    public static String obtenerUsuarioActual() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return "SYSTEM";
        }

        String username = authentication.getName();

        if (username == null || username.isBlank() || "anonymousUser".equalsIgnoreCase(username)) {
            return "SYSTEM";
        }

        return username;
    }
}
