#!/bin/sh

set -eux
test -f /data/activities.json || cp /default_data/activities.json /data/
exec node backend/dist/server.js