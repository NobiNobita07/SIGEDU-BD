package com.sigedu.backend.audit;

import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

import java.lang.reflect.Field;

public class AuditEntityListener {

    @PrePersist
    public void prePersist(Object entity) {
        setFieldIfPresent(entity, "createdBy", AuditUtil.obtenerUsuarioActual(), false);
        setFieldIfPresent(entity, "updatedBy", AuditUtil.obtenerUsuarioActual(), true);
    }

    @PreUpdate
    public void preUpdate(Object entity) {
        setFieldIfPresent(entity, "updatedBy", AuditUtil.obtenerUsuarioActual(), true);
    }

    private void setFieldIfPresent(Object entity, String fieldName, String value, boolean overwrite) {
        try {
            Field field = entity.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            Object currentValue = field.get(entity);
            if (overwrite || currentValue == null) {
                field.set(entity, value);
            }
        } catch (NoSuchFieldException ignored) {
            // La entidad no tiene el campo auditado.
        } catch (IllegalAccessException ex) {
            throw new IllegalStateException("No se pudo asignar el campo de auditoría: " + fieldName, ex);
        }
    }
}
