#!/bin/bash

# 종료할 서비스 목록
SERVICES=("django" "nginx" "postgres" "redis")

VOLUMES=(
  "ft_transcendence_static-files"
  "ft_transcendence_media-files"
  "ft_transcendence_ssl-keys"
  "ft_transcendence_postgres-data"
)

# 1. 지정된 서비스 삭제 및 볼륨 제거
for SERVICE in "${SERVICES[@]}"; do
  echo "Removing services and volumes..."
  docker compose rm -fsv "$SERVICE"
done

# 2. 볼륨 삭제
for VOLUME in "${VOLUMES[@]}"; do
  echo "Removing volume: $VOLUME"
  docker volume rm "$VOLUME" || echo "Failed to remove volume $VOLUME (it may not exist)."
done

# 3. 지정된 서비스 재시작
for SERVICE in "${SERVICES[@]}"; do
  echo "Restarting service: $SERVICE"
  docker compose up -d "$SERVICE" --build
done

echo "All specified services have been restarted."

