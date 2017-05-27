#!/bin/sh

set -euo pipefail

chown -R nginx:nginx /var/cache/nginx /var/tmp/nginx /run/nginx/
chmod -R g+r /var/www/pushbot.party/ /var/www/azurefire.net/

python /python/tls-up.py

exec /usr/sbin/nginx
