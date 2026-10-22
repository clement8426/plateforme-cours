#!/usr/bin/env bash
set -e
cd -- "$(dirname -- "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js manque. Installez Node.js 22 ou plus récent : https://nodejs.org/"
  exit 1
fi
exec node scripts/lancer.mjs "$@"
