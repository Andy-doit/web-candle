#!/bin/sh

while true; do
  HTML_BASE_PATH=/usr/share/nginx/html node /app/scripts/generateRoutes.cjs
  sleep 300
done &

nginx -g "daemon off;"