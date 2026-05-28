package com.promorural.api.core.application.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Documented
@Constraint(validatedBy = ValidI18nMapValidator.class)
@Target({ElementType.FIELD, ElementType.METHOD, ElementType.PARAMETER, ElementType.RECORD_COMPONENT})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidI18nMap {
    String message() default "{validation.i18n.invalid}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    int max();

    boolean required() default false;
}
