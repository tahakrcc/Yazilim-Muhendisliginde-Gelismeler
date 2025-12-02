package com.pazar.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Pazar Yönetim Sistemi API")
                        .version("1.0.0")
                        .description("Yapay Zeka Destekli Ürün Arama ve 3D Konum Yönlendirme Sistemi API Dokümantasyonu")
                        .contact(new Contact()
                                .name("Pazar Yönetim Sistemi")
                                .email("info@pazar.com")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Development Server"),
                        new Server().url("http://pazar-backend:8080").description("Docker Server")
                ));
    }
}

