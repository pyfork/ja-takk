#!/usr/bin/env bash
# Deploy veridle.com to the SSH host in $VERIDLE_HOST (set it in deploy/.env, git-ignored). Run from the repo root:  deploy/deploy.sh
# Touches only: /sites/veridle.com, the veridle-api unit/user, /etc/nginx/sites-available/veridle.com
# (symlinked from sites-enabled) and /etc/nginx/snippets/veridle-headers.conf. Rolls the nginx file back if `nginx -t` fails.
set -euo pipefail
cd "$(dirname "$0")/.."
[ -f deploy/.env ] && . deploy/.env
H=${VERIDLE_HOST:?set VERIDLE_HOST in deploy/.env (an alias from ~/.ssh/config)}
STAMP=$(date +%Y%m%d-%H%M%S)
T=/tmp/veridle-deploy-$STAMP

echo "→ build site"; (cd site && npm ci --silent && node build.mjs)
BIN=$(mktemp)
echo "→ test + build api"; (cd api && go test -count=1 ./... && GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o "$BIN" .)

echo "→ upload"
ssh $H "mkdir -p $T"
scp -q -r site/dist "$H:$T/www"
scp -q "$BIN" "$H:$T/veridle-api"
scp -q deploy/veridle.com.nginx deploy/veridle-headers.conf deploy/veridle-api.service "$H:$T/"
rm -f "$BIN"

echo "→ install on $H"
ssh $H "sudo bash -s" <<REMOTE
set -euo pipefail
T=$T
id veridle-api >/dev/null 2>&1 || useradd --system --no-create-home --shell /usr/sbin/nologin veridle-api
mkdir -p /sites/veridle.com/app /sites/veridle.com/www
# static: swap in atomically-ish, root-owned, world-readable (nginx runs as www-data)
rsync -a --delete \$T/www/ /sites/veridle.com/www/
chown -R root:root /sites/veridle.com/www
find /sites/veridle.com/www -type d -exec chmod 755 {} +; find /sites/veridle.com/www -type f -exec chmod 644 {} +
chmod 755 /sites/veridle.com /sites/veridle.com/app
install -m 755 -o root -g root \$T/veridle-api /sites/veridle.com/app/veridle-api
install -m 644 \$T/veridle-api.service /etc/systemd/system/veridle-api.service
systemctl daemon-reload && systemctl enable veridle-api >/dev/null 2>&1 && systemctl restart veridle-api
sleep 1
curl -fsS http://127.0.0.1:8793/healthz >/dev/null && echo "api healthy"

install -m 644 \$T/veridle-headers.conf /etc/nginx/snippets/veridle-headers.conf
cp -a /etc/nginx/sites-available/veridle.com /root/veridle.com.nginx.bak-$STAMP
install -m 644 \$T/veridle.com.nginx /etc/nginx/sites-available/veridle.com
if nginx -t; then systemctl reload nginx && echo "nginx reloaded"
else cp -a /root/veridle.com.nginx.bak-$STAMP /etc/nginx/sites-available/veridle.com; nginx -t; echo "nginx test FAILED — rolled back"; exit 1; fi
rm -rf \$T
REMOTE
echo "✓ deployed. Verify: curl -sI https://veridle.com/"
