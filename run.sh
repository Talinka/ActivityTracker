#!/bin/sh

set -eux
test -f /data/activities.json || (
    mkdir /data
    cat > /data/activities.json << _EOF_
[
    {
        "type": "stretching",
        "ids": [12, 14, 16, 18]
    },
    {
        "type": "fitness",
        "ids": [1, 3, 5, 7]
    }
]
_EOF_
)
exec node backend/dist/server.js
