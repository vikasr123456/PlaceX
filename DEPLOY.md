# Deploying PlaceX to AWS Free Tier (EC2 + Docker Compose)

PlaceX is hosted on a single **AWS EC2 `t3.micro`** instance (free tier) running the
whole stack in Docker Compose. A **GitHub Actions workflow** redeploys automatically
every time code is pushed to the **`Shivu`** branch.

```
GitHub (Shivu branch)
   │  push
   ▼
GitHub Actions (deploy.yml)
   │  SSH
   ▼
EC2 t3.micro (Ubuntu 22.04, 1 vCPU / 1 GB RAM + 2 GB swap)
   └─► nginx :80  – serves React build + proxies /api, /admin
         └─► Gunicorn :8000 (Django, 1 worker / 4 threads)
               └─► PostgreSQL 15, MongoDB 6, Redis 7 (internal only)
```

---

## 1. AWS Account Preparation

1. Sign in to your AWS account and pick a region (e.g. `us-east-1`). Use it everywhere.
2. **IAM → Users → Create user** `placex-deploy` (no console access).
3. Attach the managed policy **`AmazonEC2FullAccess`**.
4. Open the user → **Security credentials → Create access key** (CLI use).
   Save `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` somewhere safe.

These keys are only needed if you use the AWS CLI from your PC. The automated
deployment itself uses an **SSH key**, not IAM.

## 2. Launch the EC2 Instance (Free Tier)

AWS Console → **EC2 → Instances → Launch instance**:

- **Name**: `placex-prod`
- **AMI**: Ubuntu Server 22.04 LTS (HVM, 64-bit, free tier eligible)
- **Instance type**: `t3.micro` (free tier, 1 vCPU / 1 GB RAM)
- **Key pair**: Create new → `placex-key` → download the **`.pem`** file.
  This is the SSH key deployed to the server. Keep it private; GitHub Actions needs it.
- **Network settings** → new security group `placex-sg`:
  - `SSH` — `22` / TCP — `0.0.0.0/0` (or your public IP only)
  - `HTTP` — `80` / TCP — `0.0.0.0/0`
- **Configure storage**: 30 GB gp3 (Docker images + database data + media)

Launch. Then go to **Elastic IPs → Allocate → Associate** it with the instance.
**Record the public IP**, e.g. `54.123.45.67`. While the Elastic IP is attached it is free.

## 3. Provision the Server (run once)

From your PC:

```bash
ssh -i placex-key.pem ubuntu@54.123.45.67
```

Run:

```bash
# Base packages
sudo apt-get update
sudo apt-get install -y git

# Docker Engine + Docker Compose plugin
curl -fsSL https://get.docker.com | sudo sh
sudo apt-get install -y docker-compose-plugin
sudo usermod -aG docker "$USER"

# Membership refreshes after a re-login
exit
```

Reconnect:

```bash
ssh -i placex-key.pem ubuntu@54.123.45.67
```

### Enable 2 GB swap (keeps 1 GB RAM instance from OOMing)

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab   # persists across reboot
sudo sysctl vm.swappiness=10
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
free -h   # confirm "Swap: 2.0Gi"
```

### Clone the repo

```bash
sudo mkdir -p /opt/placex
sudo chown -R "$USER":"$USER" /opt/placex
git clone -b Shivu https://github.com/<YOUR_USER>/PlaceX.git /opt/placex
cd /opt/placex
```

### Create the environment file

```bash
cp .env.prod.example .env
nano .env
```

Edit at minimum these lines:

| Variable | Value to set |
|---|---|
| `SECRET_KEY` | A long random string: `python3 -c "import secrets; print(secrets.token_urlsafe(50))"` |
| `DEBUG` | `0` (keep) |
| `ALLOWED_HOSTS` | Your EC2 public IP, e.g. `54.123.45.67` |
| `CORS_ALLOWED_ORIGINS` | `http://54.123.45.67` |
| `CSRF_TRUSTED_ORIGINS` | `http://54.123.45.67` |
| `DB_PASSWORD` / `POSTGRES_PASSWORD` | A strong password (must match each other) |

Save and exit. `db.sqlite3` is never used in production (Django switches to
PostgreSQL automatically when `DEBUG=0` + `DB_HOST` is set).

## 4. First Deployment

```bash
cd /opt/placex
docker compose -f docker-compose.prod.yml up -d --build
```

This:
- Builds the Django image and the React static build (via nginx multi-stage image)
- Starts PostgreSQL, Redis, MongoDB, `web` (Gunicorn), and `nginx`
- Runs `migrate` + `collectstatic` automatically when the `web` container first starts

Wait ~1–2 minutes (first build pulls base images), then verify:

```bash
docker ps                       # all 5-6 containers Up
docker compose -f docker-compose.prod.yml logs -f
docker stats --no-stream        # total memory should stay under ~900 MB
```

### Create the admin superuser

```bash
docker compose -f docker-compose.prod.yml exec web python manage.py createsuperuser
```

## 5. Verify

Open `http://54.123.45.67` in a browser:
- The React app loads (SPA served by nginx)
- Register / log in work (same-origin `/api` proxied to Django)
- `http://54.123.45.67/admin` lets you log in with the superuser
- Resume uploads land in the `media` volume (persisted)

## 6. Automatic Deploys (GitHub Actions)

When anything is pushed to `Shivu`, GitHub Actions SSHes into the box, pulls the
latest code, rebuilds images, and recreates the containers.

### One-time GitHub secret setup

Repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Value |
|---|---|
| `AWS_HOST` | EC2 public IP, e.g. `54.123.45.67` |
| `AWS_SSH_KEY` | **Entire contents** of `placex-key.pem` (the multi-line block) |

### Manual redeploy

Go to the **Actions** tab → **Deploy PlaceX to EC2** → **Run workflow**.

### How to run on the EC2 box without GitHub (userdata/scripts)

```bash
cd /opt/placex
git pull --ff-only origin Shivu
docker compose -f docker-compose.prod.yml up -d --build
docker image prune -f
```

## 7. Ongoing Operations

| Task | Command |
|---|---|
| See logs | `docker compose -f docker-compose.prod.yml logs -f web` |
| Restart stack | `docker compose -f docker-compose.prod.yml restart` |
| Stop stack | `docker compose -f docker-compose.prod.yml down` |
| DB back up (Postgres) | `docker compose -f docker-compose.prod.yml exec db pg_dump -U placex_user placex_db > backup.sql` |
| Weekly snapshot | EC2 Console → Volumes → snapshot (guards the whole disk incl. DB volumes) |
| Memory watched? | `watch -n 2 'docker stats --no-stream'` |

- **Reboot note**: swap, Docker service, and all containers auto-start (Docker
  `restart: always` + systemd). Nothing manual after a reboot.
- **Backup**: take a weekly EBS snapshot so data survives an instance failure.
  The API only returns images/logs; database and uploaded resume files live in the
  named Docker volumes on the disk.

## 8. Cost & Limits

- Free tier (12 months, new accounts): `t3.micro` (750 hr/mo), 30 GB EBS, 100 GB/mo
  outbound data, Elastic IP while attached, GitHub Actions free.
- **After free tier**: this setup costs roughly **$10–12/month** (t3.micro + EBS).
- Tuned for **light usage** (demo/college portal). If traffic grows, upgrade to
  `t3.medium`/`t3.small` and raise the memory limits in `docker-compose.prod.yml`,
  or scale to ECS Fargate.

## 9. Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| Site not loading | `sudo ufw status` — ensure firewall isn't blocking 80; check `docker ps` for `placex_nginx` Up |
| 500 on `/admin` or `/api` | `docker compose -f docker-compose.prod.yml logs web` — check DB connection & `SECRET_KEY` |
| OOM / killed containers | `free -h`; confirm swap is on; `docker stats`; raise memory caps in compose |
| API works but blank page | nginx `try_files` should serve `index.html` — force-refresh (`Ctrl+F5`), check `/usr/share/nginx/html` inside `nginx` container |
| New push didn't deploy | Check the Actions run; confirm secrets `AWS_HOST` / `AWS_SSH_KEY` |