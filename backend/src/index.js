import express from 'express';
import session from 'express-session';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import passport from './auth/discord.js';
import authRoutes from './routes/auth.js';
import meRoute from './routes/me.js';

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

// Middleware
app.use(morgan('dev')); // Log all requests

// CORS configuration
app.use(cors({
  origin: ['https://pathgen.gg', 'http://localhost:5173'],
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

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    status: 'online',
    message: 'PathGen Discord Auth API',
    endpoints: {
      auth: '/auth/discord',
      callback: '/auth/discord/callback',
      profile: '/me',
      logout: '/auth/logout'
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

// Start server
app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║       PathGen Discord Auth API                        ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ CORS enabled for: https://pathgen.gg, http://localhost:5173`);
  console.log('\nAvailable endpoints:');
  console.log(`  → GET  http://localhost:${PORT}/auth/discord`);
  console.log(`  → GET  http://localhost:${PORT}/auth/discord/callback`);
  console.log(`  → GET  http://localhost:${PORT}/me`);
  console.log(`  → GET  http://localhost:${PORT}/auth/logout`);
  console.log('════════════════════════════════════════════════════════');
});

