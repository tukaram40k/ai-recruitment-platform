#!/bin/sh
set -e

# Default PORT to 80 if not set (for local development)
export PORT=${PORT:-80}

# Default BACKEND_URL to docker service name (for local) or Railway internal URL
export BACKEND_URL=${BACKEND_URL:-http://backend:8000}

# Substitute environment variables in nginx config
envsubst '${PORT} ${BACKEND_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g 'daemon off;'
