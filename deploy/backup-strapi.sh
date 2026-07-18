#!/bin/sh

set -eu

repository_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$repository_root"

env_file=${1:-.env.production}
backup_root=${BACKUP_ROOT:-./backups}
timestamp=$(date -u +%Y%m%d-%H%M%S)
backup_dir="$backup_root/$timestamp"
strapi_stopped=false

if [ ! -f "$env_file" ]; then
  echo "Environment file not found: $env_file" >&2
  exit 1
fi

compose() {
  docker compose \
    -f compose.yaml \
    -f compose.server.yaml \
    --env-file "$env_file" \
    "$@"
}

restart_strapi() {
  if [ "$strapi_stopped" = true ]; then
    compose start strapi >/dev/null
  fi
}

trap restart_strapi EXIT HUP INT TERM

mkdir -p "$backup_dir/uploads"
compose stop strapi >/dev/null
strapi_stopped=true

compose cp strapi:/app/.tmp/data.db "$backup_dir/data.db"
compose cp strapi:/app/public/uploads/. "$backup_dir/uploads"

compose start strapi >/dev/null
strapi_stopped=false
trap - EXIT HUP INT TERM

echo "Strapi backup created: $backup_dir"
