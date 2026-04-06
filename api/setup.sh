#!/usr/bin/env bash

set -e

CHAPTER=$1

if [[ -z "$CHAPTER" ]]; then
  echo "Usage: $0 <chapter-number> (05-12)"
  exit 1
fi

if [[ ! "$CHAPTER" =~ ^(0[5-9]|1[0-2])$ ]]; then
  echo "Error: chapter must be 05 through 12"
  exit 1
fi

echo "Setting up API for chapter $CHAPTER..."

npm install

cat > .env <<EOF
NODE_ENV=development
PORT=9999
LOG_LEVEL=debug
DATABASE_URL=file:dev.db
CLIENT_URL=http://localhost:5173
JWT_SECRET=019aa5cd
EOF

if [[ "$CHAPTER" == "05" || "$CHAPTER" == "06" ]]; then
  echo "BYPASS_AUTH=true" >> .env
fi

echo ".env written."
echo "Done."
