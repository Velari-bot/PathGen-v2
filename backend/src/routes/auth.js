import express from 'express';
import passport from '../auth/discord.js';

const router = express.Router();

// Redirect to Discord OAuth login
router.get('/discord', passport.authenticate('discord'));

// Discord OAuth callback
router.get('/discord/callback', 
  passport.authenticate('discord', { 
    failureRedirect: '/auth/discord',
    successRedirect: process.env.NODE_ENV === 'production' 
      ? 'https://pathgen.gg' 
      : 'http://localhost:5173'
  })
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

