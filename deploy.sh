#!/usr/bin/env bash
set -euo pipefail
cmd=${1:-help}
case "$cmd" in
  up)      docker compose up -d --build ;;
  update)  git pull && docker compose up -d --build ;;
  logs)    docker compose logs -f --tail 100 ;;
  status)  docker compose ps && echo && docker stats --no-stream ;;
  down)    docker compose down ;;
  *)
    echo "Usage: $0 {up|update|logs|status|down}"
    exit 1 ;;
esac
