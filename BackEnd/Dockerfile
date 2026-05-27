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
    apk add --no-cache libcrypto3 libssl3 su-exec && \
    addgroup -S spring && \
    adduser -S -s /sbin/nologin -G spring spring

RUN mkdir -p /app/uploads

COPY --from=build --chown=spring:spring /app/target/api-server-0.0.1-SNAPSHOT.jar app.jar
COPY docker-entrypoint.sh /app/docker-entrypoint.sh

RUN chmod 500 app.jar
RUN chmod 500 /app/docker-entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/app/docker-entrypoint.sh"]