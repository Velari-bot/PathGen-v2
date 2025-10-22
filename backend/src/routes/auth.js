import express from 'express';
import passport from '../auth/discord.js';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

// Redirect to Discord OAuth login
router.get('/discord', passport.authenticate('discord'));

// Discord OAuth callback
router.get('/discord/callback', 
  passport.authenticate('discord', { 
    failureRedirect: '/auth/discord',
    successRedirect: process.env.NODE_ENV === 'production' 
      ? 'https://v2.pathgen.online' 
      : 'http://localhost:5173'
  }),
  async (req, res) => {
    try {
      // Store user data on VPS
      const userData = {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        avatar: req.user.avatar,
        banner: req.user.banner,
        joinedAt: new Date().toISOString(),
        pricing: 'standard',
        amount: 49.99
      };

      // Create users directory if it doesn't exist
      const usersDir = path.join(process.cwd(), 'data', 'users');
      await fs.mkdir(usersDir, { recursive: true });

      // Save user data to file
      const userFile = path.join(usersDir, `${req.user.id}.json`);
      await fs.writeFile(userFile, JSON.stringify(userData, null, 2));

      console.log(`✓ User data saved: ${req.user.username} (${req.user.id})`);
      
      // Redirect to frontend
      const redirectUrl = process.env.NODE_ENV === 'production' 
        ? 'https://v2.pathgen.online' 
        : 'http://localhost:5173';
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Error saving user data:', error);
      // Still redirect even if saving fails
      const redirectUrl = process.env.NODE_ENV === 'production' 
        ? 'https://v2.pathgen.online' 
        : 'http://localhost:5173';
      res.redirect(redirectUrl);
    }
  }
);

// Logout route
router.get('/logout', (req, res) => {
  const username = req.user?.username || 'Unknown user';
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Failed to logout' });
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).json({ error: 'Failed to destroy session' });
      }
      console.log(`✓ User logged out: ${username}`);
      res.json({ message: 'Logged out successfully' });
    });
  });
});

export default router;

