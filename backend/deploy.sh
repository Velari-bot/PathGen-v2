#!/bin/bash

# PathGen Backend Deployment Script
# Run this on your Vultr VPS

echo "╔════════════════════════════════════════════════════════╗"
echo "║       PathGen Backend Deployment Script              ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
  echo "❌ Please run as root (use sudo)"
  exit 1
fi

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install Node.js 18+ if not installed
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
else
    echo "✓ Node.js already installed"
fi

# Install npm if not installed
if ! command -v npm &> /dev/null; then
    echo "📦 Installing npm..."
    apt install -y npm
else
    echo "✓ npm already installed"
fi

# Create directories
echo "📁 Creating directories..."
mkdir -p /var/pathgen/replays
mkdir -p /root/pathgen-backend

# Navigate to backend directory
cd /root/pathgen-backend || exit

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file if doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << 'EOF'
# Discord OAuth Configuration
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_CALLBACK_URL=http://155.138.163.88:8080/auth/discord/callback

# Session Configuration
SESSION_SECRET=

# Server Configuration
PORT=8080
NODE_ENV=production

# Firebase Configuration
FIREBASE_PROJECT_ID=pathgen-v2
FIREBASE_STORAGE_BUCKET=pathgen-v2.firebasestorage.app
FIREBASE_SERVICE_ACCOUNT_KEY=

# Replays Storage
REPLAYS_DIR=/var/pathgen/replays
EOF
    echo "⚠️  Please edit .env file with your credentials"
fi

# Create systemd service
echo "🔧 Creating systemd service..."
cat > /etc/systemd/system/pathgen-backend.service << 'EOF'
[Unit]
Description=PathGen Backend API
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/pathgen-backend
Environment=NODE_ENV=production
ExecStart=/usr/bin/node src/index.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=pathgen-backend

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd
echo "🔄 Reloading systemd..."
systemctl daemon-reload

# Enable service
echo "✓ Enabling service..."
systemctl enable pathgen-backend

# Configure firewall
echo "🔥 Configuring firewall..."
if command -v ufw &> /dev/null; then
    ufw allow 8080/tcp
    echo "✓ Firewall configured (port 8080 opened)"
else
    echo "⚠️  UFW not installed, please manually open port 8080"
fi

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║       Deployment Complete!                            ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo "1. Edit /root/pathgen-backend/.env with your credentials"
echo "2. Start the service: systemctl start pathgen-backend"
echo "3. Check status: systemctl status pathgen-backend"
echo "4. View logs: journalctl -u pathgen-backend -f"
echo ""
echo "API will be available at: http://155.138.163.88:8080"
echo ""

