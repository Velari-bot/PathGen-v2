import express from 'express';
import session from 'express-session';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import passport from './auth/discord.js';
import authRoutes from './routes/auth.js';
import meRoute from './routes/me.js';
import replaysRoutes from './routes/replays.js';
import usersRoutes from './routes/users.js';
import healthRoutes from './routes/health.js';
import { initializeFirestore } from './config/firestore.js';
import ReplayService from './services/replayService.js';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'DISCORD_CLIENT_ID',
  'DISCORD_CLIENT_SECRET',
  'DISCORD_CALLBACK_URL',
  'SESSION_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPlease create a .env file based on .env.example');
  process.exit(1);
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Create HTTP server and Socket.io
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['https://pathgen.gg', 'https://v2.pathgen.online', 'http://localhost:3000', 'http://localhost:5173'],
    credentials: true
  }
});

// Initialize Firestore
const db = initializeFirestore();

// Initialize ReplayService
const replayService = new ReplayService(io);
app.locals.replayService = replayService;

// Middleware
app.use(morgan('dev')); // Log all requests

// CORS configuration
app.use(cors({
  origin: ['https://pathgen.gg', 'https://v2.pathgen.online', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true // Allow cookies to be sent
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true in production (HTTPS)
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/me', meRoute);
app.use('/api/replays', replaysRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/health', healthRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    status: 'online',
    message: 'PathGen Replay Dashboard API',
    version: '2.0.0',
    endpoints: {
      auth: '/auth/discord',
      callback: '/auth/discord/callback',
      profile: '/me',
      logout: '/auth/logout',
      replays: '/api/replays',
      users: '/api/users',
      health: '/api/health',
      stats: '/api/replays/stats/overview'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('✓ Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('✗ Client disconnected:', socket.id);
  });

  // Send initial stats when client connects
  replayService.getStats().then(stats => {
    socket.emit('stats:update', stats);
  }).catch(err => {
    console.error('Error sending initial stats:', err);
  });
});

// Periodic stats update (every 30 seconds)
setInterval(async () => {
  try {
    const stats = await replayService.getStats();
    io.emit('stats:update', stats);
  } catch (error) {
    console.error('Error broadcasting stats:', error);
  }
}, 30000);

// Start server
httpServer.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║       PathGen Replay Dashboard API                    ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ CORS enabled for: pathgen.gg, v2.pathgen.online, localhost`);
  console.log(`✓ WebSocket enabled on port ${PORT}`);
  console.log('\nAvailable endpoints:');
  console.log(`  → GET    http://localhost:${PORT}/auth/discord`);
  console.log(`  → GET    http://localhost:${PORT}/me`);
  console.log(`  → GET    http://localhost:${PORT}/api/replays`);
  console.log(`  → POST   http://localhost:${PORT}/api/replays/upload`);
  console.log(`  → GET    http://localhost:${PORT}/api/replays/stats/overview`);
  console.log(`  → GET    http://localhost:${PORT}/api/users`);
  console.log(`  → GET    http://localhost:${PORT}/api/health`);
  console.log('════════════════════════════════════════════════════════');
});

