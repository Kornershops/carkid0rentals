# 🚀 Production Deployment Guide

## Prerequisites

- Docker & Docker Compose installed
- Domain name configured
- SSL certificates (Let's Encrypt recommended)
- Paystack account (for payments)
- PostgreSQL database (or use Docker)

---

## Option 1: Docker Deployment (Recommended)

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/carkid0rentals.git
cd carkid0rentals
```

### 2. Configure Environment
```bash
cp .env.production.example .env.production
nano .env.production
```

Update all `CHANGE_ME` values with secure credentials.

### 3. Start Services
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 4. Check Status
```bash
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f api
```

### 5. Run Migrations
```bash
docker-compose -f docker-compose.prod.yml exec api ./main migrate
```

---

## Option 2: Railway Deployment (Backend)

### 1. Install Railway CLI
```bash
npm install -g @railway/cli
railway login
```

### 2. Create New Project
```bash
cd apps/api
railway init
```

### 3. Add PostgreSQL
```bash
railway add postgresql
```

### 4. Set Environment Variables
```bash
railway variables set JWT_SECRET="your-secret-key"
railway variables set PAYSTACK_SECRET_KEY="sk_live_xxx"
railway variables set FRONTEND_URL="https://your-domain.netlify.app"
```

### 5. Deploy
```bash
railway up
```

### 6. Get API URL
```bash
railway domain
```

---

## Option 3: Netlify Deployment (Frontend)

### 1. Build Frontend
```bash
cd apps/web
npm install
npm run build
```

### 2. Deploy to Netlify
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=out
```

### 3. Configure Environment
In Netlify dashboard:
- Go to Site Settings → Environment Variables
- Add: `NEXT_PUBLIC_API_URL=https://your-api-url.railway.app/api/v1`

---

## Option 4: Manual VPS Deployment

### 1. Server Setup (Ubuntu 22.04)
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Install Nginx
sudo apt install nginx -y

# Install Certbot (SSL)
sudo apt install certbot python3-certbot-nginx -y
```

### 2. Clone & Configure
```bash
cd /opt
sudo git clone https://github.com/yourusername/carkid0rentals.git
cd carkid0rentals
sudo cp .env.production.example .env.production
sudo nano .env.production
```

### 3. Start Services
```bash
sudo docker-compose -f docker-compose.prod.yml up -d
```

### 4. Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/carkid0
```

Add:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:9090;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/carkid0 /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. Setup SSL
```bash
sudo certbot --nginx -d api.yourdomain.com
```

---

## Database Migrations

### Run Migrations
```bash
# Docker
docker-compose exec api ./main migrate

# Railway
railway run ./main migrate

# Manual
cd apps/api
go run main.go migrate
```

### Seed Data
```bash
# Docker
docker-compose exec api go run seed.go

# Manual
cd apps/api
go run seed.go
```

---

## Monitoring & Logs

### Docker Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f api
docker-compose -f docker-compose.prod.yml logs -f postgres
```

### Railway Logs
```bash
railway logs
```

### Health Checks
```bash
# API Health
curl https://api.yourdomain.com/health

# Database Connection
docker-compose exec postgres psql -U admin -d carkid0_rentals -c "SELECT 1;"
```

---

## Backup & Restore

### Backup Database
```bash
# Docker
docker-compose exec postgres pg_dump -U admin carkid0_rentals > backup_$(date +%Y%m%d).sql

# Manual
pg_dump -U admin -h localhost carkid0_rentals > backup.sql
```

### Restore Database
```bash
# Docker
docker-compose exec -T postgres psql -U admin carkid0_rentals < backup.sql

# Manual
psql -U admin -h localhost carkid0_rentals < backup.sql
```

---

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secret (min 32 characters)
- [ ] Enable SSL/TLS certificates
- [ ] Configure firewall (UFW)
- [ ] Set up fail2ban
- [ ] Enable database backups
- [ ] Configure CORS properly
- [ ] Use environment variables (never commit secrets)
- [ ] Enable rate limiting
- [ ] Set up monitoring (Sentry, DataDog)

---

## Performance Optimization

### 1. Enable Redis Caching
```bash
docker-compose exec api redis-cli
```

### 2. Database Indexing
```sql
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_listing_id ON bookings(listing_id);
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_availability ON listings(availability);
```

### 3. Nginx Caching
Add to Nginx config:
```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g;
proxy_cache api_cache;
proxy_cache_valid 200 10m;
```

---

## Troubleshooting

### API Not Starting
```bash
# Check logs
docker-compose logs api

# Check database connection
docker-compose exec postgres psql -U admin -d carkid0_rentals

# Restart service
docker-compose restart api
```

### Database Connection Failed
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check connection string
docker-compose exec api env | grep DATABASE_URL
```

### Port Already in Use
```bash
# Find process using port
sudo lsof -i :9090

# Kill process
sudo kill -9 <PID>
```

---

## Scaling

### Horizontal Scaling (Multiple API Instances)
```yaml
# docker-compose.prod.yml
api:
  deploy:
    replicas: 3
```

### Load Balancer (Nginx)
```nginx
upstream api_backend {
    server api1:9090;
    server api2:9090;
    server api3:9090;
}

server {
    location / {
        proxy_pass http://api_backend;
    }
}
```

---

## Maintenance

### Update Application
```bash
git pull origin main
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

### Database Maintenance
```bash
# Vacuum database
docker-compose exec postgres psql -U admin -d carkid0_rentals -c "VACUUM ANALYZE;"

# Check database size
docker-compose exec postgres psql -U admin -d carkid0_rentals -c "SELECT pg_size_pretty(pg_database_size('carkid0_rentals'));"
```

---

## Support

- Documentation: `/docs`
- Issues: GitHub Issues
- Email: support@carkid0.com

---

**Deployment Status**: Ready for Production 🚀
