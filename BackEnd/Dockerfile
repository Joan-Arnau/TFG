# STAGE 1: Build
FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

RUN apk upgrade --no-cache

COPY pom.xml .

RUN mvn dependency:go-offline -B -q

COPY src ./src

RUN mvn -q -DskipTests package && \
    rm -rf ~/.m2/repository


# STAGE 2: Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN apk upgrade --no-cache && \
    apk add --no-cache libcrypto3 libssl3 && \
    addgroup -S spring && \
    adduser -S -s /sbin/nologin -G spring spring

COPY --from=build --chown=spring:spring /app/target/api-server-0.0.1-SNAPSHOT.jar app.jar

RUN chmod 500 app.jar

USER spring:spring

EXPOSE 8080

ENTRYPOINT ["java", \
            "-XX:+UseContainerSupport", \
            "-XX:MaxRAMPercentage=75.0", \
            "-XX:+ExitOnOutOfMemoryError", \
            "-jar", "app.jar"]