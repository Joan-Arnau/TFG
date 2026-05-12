package com.promorural.api.infrastructure.config;

import java.util.Locale;
import java.util.Objects;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;


@Configuration
public class LocaleConfig implements WebMvcConfigurer {

    private final AppProperties appProperties;

    public LocaleConfig(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    @Bean
    @NonNull
    public LocaleResolver localeResolver() {
        AcceptHeaderLocaleResolver resolver = new AcceptHeaderLocaleResolver();
        resolver.setDefaultLocale(Locale.of(appProperties.defaultLanguage()));
        resolver.setSupportedLocales(Objects.requireNonNull(appProperties.supportedLanguages().stream()
            .map(Locale::of)
            .toList()
        ));
        return resolver;
    }

    @Bean
    @NonNull
    public LocaleChangeInterceptor localeChangeInterceptor() {
        LocaleChangeInterceptor interceptor = new LocaleChangeInterceptor();
        interceptor.setParamName("lang");
        return interceptor;
    }

    @Override
    public void addInterceptors(@NonNull InterceptorRegistry registry) {
        registry.addInterceptor(localeChangeInterceptor());
    }
}