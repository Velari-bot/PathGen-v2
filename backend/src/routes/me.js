import express from 'express';

const router = express.Router();

// Return logged-in user's Discord info
router.get('/', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ 
      error: 'Not authenticated',
      authenticated: false 
    });
  }

  // Return user data from session
  res.json({
    authenticated: true,
    user: {
      id: req.user.id,
      username: req.user.username,
      discriminator: req.user.discriminator,
      avatar: req.user.avatar,
      banner: req.user.banner,
      email: req.user.email,
      // Construct avatar URL for convenience
      avatarURL: req.user.avatar 
        ? `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png?size=256`
        : null,
      // Construct banner URL for convenience
      bannerURL: req.user.banner
        ? `https://cdn.discordapp.com/banners/${req.user.id}/${req.user.banner}.png?size=600`
        : null
    }
  });
});

export default router;

