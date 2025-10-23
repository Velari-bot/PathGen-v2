# PathGen Backend API

Backend server for PathGen Replay Dashboard with Discord OAuth, Firestore, and WebSocket support.

## Features

- Discord OAuth 2.0 authentication
- RESTful API for replay management
- Real-time updates via Socket.io
- Firebase Firestore for metadata storage
- File upload handling with Multer
- Server health monitoring
- User management

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file:

```env
# Discord OAuth
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
DISCORD_CALLBACK_URL=http://155.138.163.88:8080/auth/discord/callback

# Session
SESSION_SECRET=your_random_secret

# Server
PORT=8080
NODE_ENV=production

# Firebase
FIREBASE_PROJECT_ID=pathgen-v2
FIREBASE_STORAGE_BUCKET=pathgen-v2.firebasestorage.app
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# Storage
REPLAYS_DIR=/var/pathgen/replays
```

## Running

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Endpoints

### Authentication
- `GET /auth/discord` - Start Discord OAuth flow
- `GET /auth/discord/callback` - OAuth callback
- `GET /auth/logout` - Logout user
- `GET /me` - Get current user

### Replays
- `GET /api/replays` - List all replays
- `GET /api/replays/:id` - Get replay details
- `POST /api/replays/upload` - Upload replay (auth required)
- `GET /api/replays/:id/download` - Download replay
- `DELETE /api/replays/:id` - Delete replay (auth required)
- `GET /api/replays/stats/overview` - Get statistics

### Users
- `GET /api/users` - List users (admin only)
- `GET /api/users/:id` - Get user details (admin only)
- `GET /api/users/:id/replays` - Get user's replays

### Health
- `GET /api/health` - Server health status

## WebSocket Events

### Emitted by Server
- `stats:update` - Stats updated (every 30s)
- `replay:uploaded` - New replay uploaded
- `replay:deleted` - Replay deleted

## File Structure

```
src/
├── auth/
│   └── discord.js          # Passport Discord strategy
├── config/
│   └── firestore.js        # Firestore initialization
├── routes/
│   ├── auth.js             # Auth routes
│   ├── replays.js          # Replay routes
│   ├── users.js            # User routes
│   ├── health.js           # Health routes
│   └── me.js               # Current user route
├── services/
│   └── replayService.js    # Replay business logic
└── index.js                # Main server file
```

## Deployment

### Using systemd (Recommended)

1. Run deployment script:
```bash
sudo ./deploy.sh
```

2. Manage service:
```bash
# Start
sudo systemctl start pathgen-backend

# Stop
sudo systemctl stop pathgen-backend

# Restart
sudo systemctl restart pathgen-backend

# Status
sudo systemctl status pathgen-backend

# Logs
sudo journalctl -u pathgen-backend -f
```

### Manual Deployment

1. Install dependencies:
```bash
npm install --production
```

2. Set environment variables

3. Run with PM2:
```bash
npm install -g pm2
pm2 start src/index.js --name pathgen-backend
pm2 save
pm2 startup
```

## Security

- Session-based authentication
- CORS configured for specific origins
- File upload validation
- Admin-only routes protected
- Environment variables for secrets

## Troubleshooting

### Port already in use
```bash
lsof -i :8080
kill -9 <PID>
```

### Firestore connection fails
- Verify service account key
- Check Firebase project ID
- Ensure Firestore is enabled

### Discord OAuth fails
- Verify client ID and secret
- Check callback URL matches Discord app
- Ensure correct scopes (identify, email)

## Development

### Watch mode
```bash
npm run dev
```

### Testing endpoints
```bash
# Health check
curl http://localhost:8080/api/health

# Get stats
curl http://localhost:8080/api/replays/stats/overview
```

## License

MIT
