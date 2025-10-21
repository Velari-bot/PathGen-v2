#!/bin/bash

################################################################################
# PathGen API - Vultr Startup Script
# 
# This script runs automatically when your Vultr VPS is first created.
# It installs and configures everything needed for the PathGen Discord Auth API.
#
# INSTRUCTIONS:
# 1. Copy this entire script
# 2. Paste it into Vultr's "Startup Script" field when creating your server
# 3. Deploy Ubuntu 22.04 LTS
# 4. After deployment, SSH in and upload your backend files
################################################################################

set -e

# Log everything to a file
exec > >(tee -a /var/log/pathgen-startup.log)
exec 2>&1

echo "╔════════════════════════════════════════════════════════╗"
echo "║     PathGen API - Vultr Startup Script                ║"
echo "║     Starting system setup...                           ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "Started at: $(date)"
echo ""

# Update system packages
echo "→ Updating system packages..."
apt-get update
DEBIAN_FRONTEND=noninteractive apt-get upgrade -y

# Install essential packages
echo "→ Installing essential packages..."
apt-get install -y \
    curl \
    wget \
    git \
    build-essential \
    software-properties-common \
    ufw \
    nginx \
    certbot \
    python3-certbot-nginx \
    unzip \
    htop \
    fail2ban

# Install Node.js v22
echo "→ Installing Node.js v22..."
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs

# Verify Node.js installation
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
echo "✓ Node.js installed: $NODE_VERSION"
echo "✓ npm installed: $NPM_VERSION"

# Configure firewall (UFW)
echo "→ Configuring firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw limit 22/tcp comment 'SSH rate limit'
ufw --force enable
echo "✓ Firewall configured"

# Configure fail2ban for additional SSH protection
echo "→ Configuring fail2ban..."
systemctl enable fail2ban
systemctl start fail2ban

# Create application directory
echo "→ Creating application directory..."
mkdir -p /var/www/backend
chown -R www-data:www-data /var/www
chmod -R 755 /var/www

# Create systemd service file
echo "→ Creating systemd service..."
cat > /etc/systemd/system/pathgen-auth.service << 'EOF'
[Unit]
Description=PathGen Discord Auth API
Documentation=https://github.com/yourusername/pathgen
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/backend
Environment=NODE_ENV=production
ExecStart=/usr/bin/node src/index.js
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=pathgen-auth

# Security hardening
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/www/backend

[Install]
WantedBy=multi-user.target
EOF

chmod 644 /etc/systemd/system/pathgen-auth.service
systemctl daemon-reload
echo "✓ Systemd service created"

# Remove default Nginx site
echo "→ Configuring Nginx..."
rm -f /etc/nginx/sites-enabled/default

# Create a placeholder Nginx config (to be updated later with your domain)
cat > /etc/nginx/sites-available/pathgen-api << 'EOF'
# PathGen API - Nginx Configuration
# 
# IMPORTANT: Update 'server_name' with your actual domain before enabling SSL
# Replace 'api.pathgen.online' with your domain

server {
    listen 80;
    server_name api.pathgen.online _;  # Update this!

    # Increase client body size if needed
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
EOF

ln -s /etc/nginx/sites-available/pathgen-api /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
echo "✓ Nginx configured"

# Configure automatic security updates
echo "→ Enabling automatic security updates..."
apt-get install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades

# Create deployment instructions file
cat > /root/DEPLOY_INSTRUCTIONS.txt << 'EOF'
╔════════════════════════════════════════════════════════════════════╗
║              PathGen API - Deployment Instructions                 ║
╚════════════════════════════════════════════════════════════════════╝

Your VPS is now ready! Follow these steps to deploy your backend:

STEP 1: Upload Your Backend Code
─────────────────────────────────
On your local machine, compress the backend folder:
  
  cd "C:\Users\bende\OneDrive\Desktop\PathGen v2"
  tar -czf backend.tar.gz backend/
  
Then upload to VPS:
  
  scp backend.tar.gz root@YOUR_VPS_IP:/tmp/

STEP 2: Extract and Setup on VPS
─────────────────────────────────
SSH into your VPS and run:

  cd /tmp
  tar -xzf backend.tar.gz
  cp -r backend/* /var/www/backend/
  cd /var/www/backend
  npm install --production

STEP 3: Configure Environment
──────────────────────────────
Create your .env file:

  nano /var/www/backend/.env

Add your configuration:

  DISCORD_CLIENT_ID=your_client_id_here
  DISCORD_CLIENT_SECRET=your_client_secret_here
  DISCORD_CALLBACK_URL=https://api.pathgen.online/auth/discord/callback
  SESSION_SECRET=generate_random_secret_here
  NODE_ENV=production
  PORT=3000

Generate a secure SESSION_SECRET:

  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

STEP 4: Update Nginx with Your Domain
──────────────────────────────────────
Edit the Nginx config:

  nano /etc/nginx/sites-available/pathgen-api

Replace 'api.pathgen.online' with your actual domain, then:

  nginx -t
  systemctl reload nginx

STEP 5: Setup SSL Certificate
──────────────────────────────
Run Certbot (make sure your domain DNS is pointing to this server first):

  certbot --nginx -d api.pathgen.online

STEP 6: Start the Service
──────────────────────────
Enable and start your API:

  systemctl enable pathgen-auth
  systemctl start pathgen-auth
  systemctl status pathgen-auth

STEP 7: Verify Everything Works
────────────────────────────────
Check service status:
  systemctl status pathgen-auth

View logs:
  journalctl -u pathgen-auth -f

Test API:
  curl https://api.pathgen.online

═══════════════════════════════════════════════════════════════════════

USEFUL COMMANDS:
  
  systemctl status pathgen-auth       # Check status
  systemctl restart pathgen-auth      # Restart service
  journalctl -u pathgen-auth -f       # View logs
  ufw status                          # Check firewall
  nginx -t                            # Test Nginx config
  certbot renew --dry-run             # Test SSL renewal

═══════════════════════════════════════════════════════════════════════

INSTALLED PACKAGES:
  ✓ Node.js v22.x
  ✓ npm
  ✓ Nginx
  ✓ Certbot (Let's Encrypt)
  ✓ UFW Firewall (configured)
  ✓ fail2ban (SSH protection)
  ✓ Git, curl, wget
  ✓ Automatic security updates

SECURITY:
  ✓ Firewall enabled (ports 22, 80, 443)
  ✓ SSH rate limiting enabled
  ✓ fail2ban protecting SSH
  ✓ Automatic security updates enabled

═══════════════════════════════════════════════════════════════════════
Setup log available at: /var/log/pathgen-startup.log
═══════════════════════════════════════════════════════════════════════
EOF

# Set proper permissions
chown -R www-data:www-data /var/www/backend
chmod -R 755 /var/www/backend

# Create a helper script for quick status check
cat > /usr/local/bin/pathgen-status << 'EOF'
#!/bin/bash
echo "╔════════════════════════════════════════╗"
echo "║     PathGen API - Status Check         ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "Service Status:"
systemctl status pathgen-auth --no-pager | head -5
echo ""
echo "Firewall Status:"
ufw status | head -10
echo ""
echo "Nginx Status:"
systemctl status nginx --no-pager | head -3
echo ""
echo "Last 10 API logs:"
journalctl -u pathgen-auth -n 10 --no-pager
echo ""
echo "Run 'journalctl -u pathgen-auth -f' to follow logs"
EOF

chmod +x /usr/local/bin/pathgen-status

# Final setup
echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║     PathGen API - Setup Complete!                      ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "✓ Node.js v22 installed"
echo "✓ Nginx installed and configured"
echo "✓ Certbot (Let's Encrypt) ready"
echo "✓ Firewall configured (ports 22, 80, 443)"
echo "✓ fail2ban enabled for SSH protection"
echo "✓ Systemd service created"
echo "✓ Automatic security updates enabled"
echo ""
echo "Next Steps:"
echo "1. Read deployment instructions: cat /root/DEPLOY_INSTRUCTIONS.txt"
echo "2. Upload your backend code to /var/www/backend/"
echo "3. Configure .env file"
echo "4. Update Nginx with your domain"
echo "5. Get SSL certificate with Certbot"
echo "6. Start the service"
echo ""
echo "Quick status check: pathgen-status"
echo ""
echo "Completed at: $(date)"
echo ""

# Reboot notification
echo "════════════════════════════════════════════════════════"
echo "Server setup complete. Rebooting in 10 seconds..."
echo "════════════════════════════════════════════════════════"
sleep 10
reboot

