import express from 'express';
import passport from '../auth/discord.js';

const router = express.Router();

// Redirect to Discord OAuth login
router.get('/discord', passport.authenticate('discord'));

// Discord OAuth callback
router.get('/discord/callback', 
  passport.authenticate('discord', { 
    failureRedirect: '/auth/discord'
  }),
  async (req, res) => {
    try {
      // Get replay service
      const replayService = req.app.locals.replayService;
      
      // Store user data in Firestore
      const userData = {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        avatar: req.user.avatar,
        banner: req.user.banner,
        discriminator: req.user.discriminator,
        createdAt: new Date().toISOString()
      };

      // Save to Firestore
      await replayService.saveUser(userData);

      console.log(`✓ User authenticated: ${req.user.username} (${req.user.id})`);
      
      // Redirect to dashboard
      const redirectUrl = process.env.FRONTEND_URL || 'http://localhost:3000/dashboard';
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Error during authentication callback:', error);
      // Still redirect even if saving fails
      const redirectUrl = process.env.FRONTEND_URL || 'http://localhost:3000/dashboard';
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

