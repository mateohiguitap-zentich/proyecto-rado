package com.zentich.proyecto_rado_backendAPI.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Permite todas las rutas de tu API
                .allowedOrigins("*") // Permite peticiones desde cualquier Frontend (Live Server, etc)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Permite todos los métodos HTTP
                .allowedHeaders("*"); // Permite cualquier cabecera
    }
}
