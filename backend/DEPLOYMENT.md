# PathGen API - Deployment Guide

This guide covers deploying the PathGen Discord Auth API to an Ubuntu 22.04 VPS.

## 📋 Prerequisites

- Ubuntu 22.04 VPS with root/sudo access
- Node.js v22 installed
- Domain name configured (e.g., api.pathgen.online)
- Discord OAuth2 credentials

## 🚀 Quick Deployment

### Step 1: Upload Files to VPS

```bash
# On your local machine, compress the backend folder
tar -czf backend.tar.gz backend/

# Upload to VPS (replace with your VPS IP)
scp backend.tar.gz user@YOUR_VPS_IP:/tmp/

# SSH into VPS
ssh user@YOUR_VPS_IP

# Extract files
sudo mkdir -p /var/www
sudo tar -xzf /tmp/backend.tar.gz -C /var/www/
cd /var/www/backend
```

### Step 2: Install Dependencies

```bash
# Install Node.js v22 (if not installed)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v22.x.x

# Install project dependencies
npm install --production
```

### Step 3: Configure Environment

```bash
# Copy example .env
cp .env.example .env

# Edit .env with your values
nano .env
```

Add your production values:
```env
DISCORD_CLIENT_ID=your_production_client_id
DISCORD_CLIENT_SECRET=your_production_client_secret
DISCORD_CALLBACK_URL=https://api.pathgen.online/auth/discord/callback
SESSION_SECRET=your_strong_random_secret_here
NODE_ENV=production
PORT=3000
```

Generate a secure session secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Setup Firewall

```bash
# Make the script executable
chmod +x setup-firewall.sh

# Run the firewall setup script
sudo ./setup-firewall.sh
```

This will:
- Install UFW (if not already installed)
- Configure firewall rules for SSH, HTTP, and HTTPS
- Enable rate limiting for SSH
- Enable the firewall

**Important:** The script will prompt you before enabling the firewall to prevent lockout.

### Step 5: Install as System Service

```bash
# Make the installation script executable
chmod +x install-service.sh

# Run the service installation script
sudo ./install-service.sh
```

This will:
- Install the systemd service
- Enable auto-start on boot
- Start the service immediately (if you choose)

### Step 6: Setup Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt update
sudo apt install nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/api.pathgen.online
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name api.pathgen.online;

    # Increase client body size if needed for file uploads
    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        
        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        
        # Pass headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Cache
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/api.pathgen.online /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Step 7: Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d api.pathgen.online

# Follow the prompts to:
# 1. Enter your email
# 2. Agree to terms
# 3. Choose whether to redirect HTTP to HTTPS (recommended: yes)
```

Certbot will automatically:
- Obtain an SSL certificate
- Configure Nginx for HTTPS
- Setup auto-renewal

### Step 8: Verify Installation

```bash
# Check service status
sudo systemctl status pathgen-auth

# Check logs
sudo journalctl -u pathgen-auth -n 50

# Test API endpoint
curl https://api.pathgen.online
```

Expected response:
```json
{
  "status": "online",
  "message": "PathGen Discord Auth API",
  "endpoints": {...}
}
```

## 🔧 Service Management

### Systemd Commands

```bash
# Start service
sudo systemctl start pathgen-auth

# Stop service
sudo systemctl stop pathgen-auth

# Restart service
sudo systemctl restart pathgen-auth

# Check status
sudo systemctl status pathgen-auth

# Enable auto-start on boot
sudo systemctl enable pathgen-auth

# Disable auto-start
sudo systemctl disable pathgen-auth

# View logs (live)
sudo journalctl -u pathgen-auth -f

# View last 100 lines
sudo journalctl -u pathgen-auth -n 100

# View logs from today
sudo journalctl -u pathgen-auth --since today

# View logs with error priority
sudo journalctl -u pathgen-auth -p err
```

## 🔥 Firewall Management

### UFW Commands

```bash
# Check status
sudo ufw status verbose

# Enable firewall
sudo ufw enable

# Disable firewall
sudo ufw disable

# Reload rules
sudo ufw reload

# List rules with numbers
sudo ufw status numbered

# Delete a rule
sudo ufw delete [number]

# Allow a port
sudo ufw allow 8080/tcp

# Deny a port
sudo ufw deny 8080/tcp

# View application profiles
sudo ufw app list
```

## 🔄 Updating the Application

```bash
# Navigate to backend directory
cd /var/www/backend

# Pull latest changes (if using git)
git pull

# Or upload new files via SCP
# scp -r backend/* user@VPS_IP:/var/www/backend/

# Install new dependencies
npm install --production

# Restart service
sudo systemctl restart pathgen-auth

# Check status
sudo systemctl status pathgen-auth
```

## 🐛 Troubleshooting

### Service won't start

```bash
# Check logs for errors
sudo journalctl -u pathgen-auth -n 50

# Common issues:
# 1. Missing .env file
# 2. Wrong file permissions
# 3. Node.js not found
# 4. Port 3000 already in use
```

### Check if port 3000 is in use:
```bash
sudo lsof -i :3000
```

### Fix file permissions:
```bash
sudo chown -R www-data:www-data /var/www/backend
sudo chmod -R 755 /var/www/backend
```

### Nginx errors

```bash
# Check Nginx status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# View error logs
sudo tail -f /var/log/nginx/error.log

# View access logs
sudo tail -f /var/log/nginx/access.log
```

### SSL certificate issues

```bash
# Test certificate renewal
sudo certbot renew --dry-run

# Manually renew
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

### Can't connect to API

1. Check if service is running:
   ```bash
   sudo systemctl status pathgen-auth
   ```

2. Check if Nginx is running:
   ```bash
   sudo systemctl status nginx
   ```

3. Check firewall:
   ```bash
   sudo ufw status
   ```

4. Test local connection:
   ```bash
   curl http://localhost:3000
   ```

5. Check DNS:
   ```bash
   nslookup api.pathgen.online
   ```

## 📊 Monitoring

### View real-time logs:
```bash
# API logs
sudo journalctl -u pathgen-auth -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
```

### Check system resources:
```bash
# CPU and memory usage
htop

# Disk usage
df -h

# Network connections
sudo netstat -tulpn | grep :3000
```

## 🔐 Security Checklist

- [ ] Firewall enabled (UFW)
- [ ] SSH key authentication enabled
- [ ] Root login disabled
- [ ] Strong session secret in .env
- [ ] SSL certificate installed
- [ ] Regular security updates enabled
- [ ] Non-root user for service (www-data)
- [ ] .env file not publicly accessible
- [ ] Rate limiting configured
- [ ] Regular backups configured

## 📦 Backup

### Backup .env and data:
```bash
# Create backup
sudo tar -czf pathgen-backup-$(date +%Y%m%d).tar.gz \
  /var/www/backend/.env \
  /etc/nginx/sites-available/api.pathgen.online

# Download backup
scp user@VPS_IP:/home/user/pathgen-backup-*.tar.gz ./
```

## 🆘 Support

If you encounter issues:

1. Check logs: `sudo journalctl -u pathgen-auth -n 100`
2. Verify .env configuration
3. Check Discord OAuth settings
4. Ensure DNS is properly configured
5. Verify firewall rules allow HTTP/HTTPS

## 📝 Notes

- The service runs as `www-data` user for security
- Logs are stored in systemd journal
- Auto-restart on failure is configured
- SSL certificates auto-renew via certbot
- Session data is stored in memory (will be lost on restart)
  - Consider using Redis for production session storage

