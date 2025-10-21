# PathGen Discord Auth Backend

A Node.js + Express backend service that handles Discord OAuth2 authentication for PathGen.

## Features

- 🔐 Discord OAuth2 authentication
- 👤 User session management
- 🌐 CORS support for pathgen.gg and localhost
- 📝 Request logging
- 🚀 Production-ready

## Tech Stack

- **Express** - Web framework
- **Passport.js** - Authentication middleware
- **passport-discord** - Discord OAuth2 strategy
- **express-session** - Session management
- **morgan** - HTTP request logger
- **dotenv** - Environment variable management

## Prerequisites

- Node.js v22 or higher
- Discord Application (for OAuth2 credentials)

## Getting Discord OAuth2 Credentials

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application or select an existing one
3. Go to the "OAuth2" section
4. Copy your Client ID and Client Secret
5. Add redirect URLs:
   - For development: `http://localhost:3000/auth/discord/callback`
   - For production: `https://api.pathgen.gg/auth/discord/callback`

## Installation

```bash
cd backend
npm install
```

## Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and fill in your values:
```env
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_CALLBACK_URL=https://api.pathgen.gg/auth/discord/callback
SESSION_SECRET=generate_a_random_secret_here
```

**Important:** Use a strong random string for `SESSION_SECRET`. Generate one with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Running Locally

Development mode (with auto-reload on Node.js v22):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### `GET /`
Health check endpoint
```json
{
  "status": "online",
  "message": "PathGen Discord Auth API"
}
```

### `GET /auth/discord`
Initiates Discord OAuth2 flow. Redirects user to Discord login page.

### `GET /auth/discord/callback`
Discord OAuth2 callback endpoint. Handles the callback from Discord and creates a user session.

### `GET /me`
Returns the logged-in user's Discord information.

**Response (authenticated):**
```json
{
  "authenticated": true,
  "user": {
    "id": "123456789",
    "username": "username",
    "discriminator": "0",
    "avatar": "abc123",
    "banner": "def456",
    "email": "user@example.com",
    "avatarURL": "https://cdn.discordapp.com/avatars/123456789/abc123.png?size=256",
    "bannerURL": "https://cdn.discordapp.com/banners/123456789/def456.png?size=600"
  }
}
```

**Response (not authenticated):**
```json
{
  "error": "Not authenticated",
  "authenticated": false
}
```

### `GET /auth/logout`
Logs out the user and destroys their session.

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

## Deployment on Ubuntu 22.04 VPS

### Step 1: Install Node.js v22 (if not already installed)

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version  # Should show v22.x.x
```

### Step 2: Clone and Setup

```bash
# Navigate to your project directory
cd /var/www  # or wherever you want to deploy

# Clone your repository (or upload files)
git clone <your-repo-url>
cd PathGen\ v2/backend

# Install dependencies
npm install --production
```

### Step 3: Configure Environment

```bash
# Create and edit .env file
nano .env
```

Add your production values:
```env
DISCORD_CLIENT_ID=your_production_client_id
DISCORD_CLIENT_SECRET=your_production_client_secret
DISCORD_CALLBACK_URL=https://api.pathgen.gg/auth/discord/callback
SESSION_SECRET=your_strong_random_secret
NODE_ENV=production
PORT=3000
```

### Step 4: Setup PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the application
pm2 start src/index.js --name pathgen-auth

# Setup PM2 to start on boot
pm2 startup
pm2 save
```

### Step 5: Setup Nginx Reverse Proxy

```bash
# Install Nginx (if not already installed)
sudo apt update
sudo apt install nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/api.pathgen.gg
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name api.pathgen.gg;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/api.pathgen.gg /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d api.pathgen.gg
```

### Step 7: Configure Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Step 8: Verify Deployment

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs pathgen-auth

# Test the API
curl https://api.pathgen.gg
```

## Useful PM2 Commands

```bash
# View logs
pm2 logs pathgen-auth

# Restart application
pm2 restart pathgen-auth

# Stop application
pm2 stop pathgen-auth

# View application info
pm2 info pathgen-auth

# Monitor
pm2 monit
```

## Security Notes

- Always use HTTPS in production
- Keep your `SESSION_SECRET` secure and random
- Never commit `.env` files to version control
- Regularly update dependencies: `npm update`
- Consider using Redis for session storage in production instead of MemoryStore

## Troubleshooting

### "Missing required environment variables"
Make sure your `.env` file exists and contains all required variables.

### CORS errors
Verify that your frontend domain is listed in the CORS configuration in `src/index.js`.

### Session not persisting
Ensure cookies are enabled and your frontend is sending credentials with requests:
```javascript
fetch('https://api.pathgen.gg/me', {
  credentials: 'include'
})
```

### Discord OAuth not working
1. Verify your Discord application's redirect URLs match your callback URL
2. Check that your Client ID and Secret are correct
3. Ensure the callback URL in Discord Dev Portal matches your `.env`

## Support

For issues or questions, please contact the development team.

