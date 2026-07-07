#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
KEY_FILE="${TMPDIR:-/tmp}/hetzner_deploy_key"

if [[ -z "${HETZNER_SSH_KEY:-}" ]]; then
  echo "HETZNER_SSH_KEY is not set" >&2
  exit 1
fi

if [[ -z "${HETZNER_HOST:-}" ]]; then
  echo "HETZNER_HOST is not set" >&2
  exit 1
fi

SSH_USER="${HETZNER_SSH_USER:-deploy}"

python3 - <<'PY' > "$KEY_FILE"
import os, re, sys
key = os.environ["HETZNER_SSH_KEY"].strip()
match = re.match(r"(-----BEGIN [^-]+-----)\s*(.+?)\s*(-----END [^-]+-----)", key)
if not match:
    sys.exit("Could not parse HETZNER_SSH_KEY")
header, body, footer = match.groups()
body = body.replace(" ", "")
wrapped = "\n".join(body[i:i+70] for i in range(0, len(body), 70))
print(f"{header}\n{wrapped}\n{footer}\n", end="")
PY

chmod 600 "$KEY_FILE"

ssh -i "$KEY_FILE" \
  -o StrictHostKeyChecking=accept-new \
  -o ConnectTimeout=20 \
  "${SSH_USER}@${HETZNER_HOST}" \
  'cd /srv/portfolio && git pull && docker compose up -d --build && \
   if docker ps --format "{{.Names}}" | grep -qx "health-bridge-caddy-1"; then \
     docker network connect portfolio_default health-bridge-caddy-1 2>/dev/null || true; \
   fi'

rm -f "$KEY_FILE"
