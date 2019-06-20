#!/bin/sh

set -euo pipefail

chown -R nginx:nginx /var/cache/nginx /var/tmp/nginx /run/nginx/

MISSING=no
for TLS_FILE in /etc/ssl/dhparams.pem /etc/ssl/backend.azurefire.net/fullchain.pem /etc/ssl/backend.azurefire.net/privkey.pem; do
  if [ ! -f "${TLS_FILE}" ]; then
    printf "Missing required TLS credential: %s\n" "${TLS_FILE}" >&2
    MISSING=yes
  fi
done
if [ "${MISSING}" = "yes" ]; then
  exit 1
fi

exec /usr/sbin/nginx
