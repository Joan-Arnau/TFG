#!/bin/sh
set -eu

UPLOAD_DIR="/app/uploads"

mkdir -p "$UPLOAD_DIR"
chown -R spring:spring "$UPLOAD_DIR"

exec su-exec spring:spring java \
  -XX:+UseContainerSupport \
  -XX:MaxRAMPercentage=75.0 \
  -XX:+ExitOnOutOfMemoryError \
  -jar /app/app.jar
