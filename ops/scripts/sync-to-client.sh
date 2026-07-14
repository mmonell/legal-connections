#!/usr/bin/env bash
# Promote the dev working copy (/test) to the production folder (/client)
# that Cloudflare Pages builds and deploys from.
#
# When to use this: after verifying a change locally with `npm run dev`
# inside /test, run this script to update /client, then commit and push
# /client to deploy.
#
# Usage: ops/scripts/sync-to-client.sh [--dry-run]

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TEST_DIR="$ROOT_DIR/test"
CLIENT_DIR="$ROOT_DIR/client"
DRY_RUN=false

if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=true
fi

if [[ ! -d "$TEST_DIR" ]]; then
  echo "error: $TEST_DIR does not exist" >&2
  exit 1
fi

RSYNC_ARGS=(
  -a --delete
  --exclude node_modules/
  --exclude .wrangler/
  --exclude .env
  --exclude ".env.*"
  --exclude "*.test.js"
)

if [[ "$DRY_RUN" == true ]]; then
  RSYNC_ARGS+=(--dry-run -v)
  echo "Dry run: showing what would change in $CLIENT_DIR"
fi

mkdir -p "$CLIENT_DIR"
rsync "${RSYNC_ARGS[@]}" "$TEST_DIR"/ "$CLIENT_DIR"/

if [[ "$DRY_RUN" == true ]]; then
  exit 0
fi

echo "Synced $TEST_DIR -> $CLIENT_DIR"
echo "Next: review 'git status' in $CLIENT_DIR, commit, and push to deploy."
