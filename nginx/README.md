# Public access via nginx

Two pieces are needed to put Blue Volt on the public internet:

1. **A hostname that resolves to your public IP** (DNS).
2. **A reverse proxy** that terminates the public connection and forwards to the local containers.

This folder holds the nginx config. The hostname part you handle outside nginx.

---

## Step 1 - get a public hostname

You have two practical options. Pick one.

### Option A - Cloudflare Tunnel (recommended, zero router config)

You already run `cloudflared` on this machine for grantsetu.in. Add a Blue Volt entry to the same tunnel - no port forward, no static IP, no certbot.

Edit `/etc/cloudflared/config.yml` and add two ingress rules **above** the existing catch-all:

```yaml
ingress:
  # ... existing grantsetu rules above ...
  - hostname: bluevolt.your-domain.com
    service: http://localhost:3001
  - hostname: api.bluevolt.your-domain.com
    service: http://localhost:8000
  # ... existing 404 catch-all stays last ...
  - service: http_status:404
```

Then in the Cloudflare dashboard → DNS, add two CNAME records:
- `bluevolt` → `<tunnel-id>.cfargotunnel.com` (Proxied)
- `api.bluevolt` → `<tunnel-id>.cfargotunnel.com` (Proxied)

Restart cloudflared:
```bash
sudo systemctl restart cloudflared
```

Done. HTTPS is automatic. **You can skip nginx entirely if you go this route.** The Cloudflare edge does the TLS termination.

### Option B - port forward on your home router + DDNS + nginx + Let's Encrypt

Use this if you don't want Cloudflare in the path.

1. **Static / DDNS hostname** - sign up for a free DDNS service (DuckDNS, No-IP) and install the updater on the HP, or point an A record at your home's public IP.
2. **Router port forward** - on your home router, forward TCP 80 + 443 → `192.168.1.50` (the HP).
3. **Install nginx + certbot** on the HP:
   ```bash
   sudo apt install -y nginx certbot python3-certbot-nginx
   ```
4. Drop the config in place:
   ```bash
   sudo cp nginx/bluevolt.conf /etc/nginx/sites-available/bluevolt
   sudo sed -i 's|bluevolt.example.com|bluevolt.your-ddns.duckdns.org|g' /etc/nginx/sites-available/bluevolt
   sudo sed -i 's|api.bluevolt.example.com|api.bluevolt.your-ddns.duckdns.org|g' /etc/nginx/sites-available/bluevolt
   sudo ln -s /etc/nginx/sites-available/bluevolt /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   ```
5. Get TLS certs:
   ```bash
   sudo certbot --nginx -d bluevolt.your-ddns.duckdns.org -d api.bluevolt.your-ddns.duckdns.org
   ```
   Certbot will modify the nginx config to listen on 443 + auto-redirect 80 → 443.

---

## Step 2 - tell the app its public URLs

Once a public hostname works, update `bluevolt-frontend/.env.local` on the HP:

```env
NEXT_PUBLIC_API_URL=https://api.bluevolt.your-domain.com
NEXTAUTH_URL=https://bluevolt.your-domain.com
BACKEND_INTERNAL_URL=http://api:8000   # leave as-is, this is for inside-Docker calls
AUTH_TRUST_HOST=true
```

And in `bluevolt-backend/.env`:

```env
CORS_ORIGINS=https://bluevolt.your-domain.com,http://localhost:3001
FRONTEND_URL=https://bluevolt.your-domain.com
```

Then:
```bash
bash deploy.sh update
```

---

## Step 3 - test

- `https://bluevolt.your-domain.com` - home page should load.
- `https://api.bluevolt.your-domain.com/api/v1/health` - should return `{"status":"ok"}`.
- `/auth/signup` - create an account, verify the session works end-to-end.

If login fails after going public, the usual suspect is `NEXTAUTH_URL` - it MUST exactly match the public origin you're using in the browser (https, including the subdomain).
