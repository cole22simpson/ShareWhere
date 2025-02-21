package com.ShareWhere.ShareWhere.security;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class EnvVariables {

    @Value("${DB_URL}")
    private String databaseUrl;

    @Value("${DB_USERNAME}")
    private String databaseUsername;

    @Value("${DB_PASSWORD}")
    private String databasePassword;

    @Value("${AZURE_ACCOUNT_NAME}")
    private String storageAccountName;

    @Value("${AZURE_ACCOUNT_KEY}")
    private String storageAccountKey;

    @Value("${JWT_SECRET_KEY}")
    private String jwtSecretKey;
}
