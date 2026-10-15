#!/usr/bin/env sh
set -eu

# Alternativa manual para diagnóstico. El despliegue normal lo realiza GitHub Actions.
# Uso: sudo sh scripts/deploy-manual.sh USUARIO_DOCKERHUB/docker-automatizacion-oci:latest
IMAGE="${1:-USUARIO_DOCKERHUB/docker-automatizacion-oci:latest}"
CONTAINER_NAME="deployflow"

docker pull "$IMAGE"
docker rm -f "$CONTAINER_NAME" 2>/dev/null || true
docker rm -f cloudlab 2>/dev/null || true
docker run -d \
  --name "$CONTAINER_NAME" \
  --restart unless-stopped \
  -p 80:80 \
  "$IMAGE"

sleep 5
curl --fail http://127.0.0.1/health
docker ps --filter "name=$CONTAINER_NAME"
