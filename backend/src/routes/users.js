import express from 'express';

const router = express.Router();

// Middleware to check authentication
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
}

// Middleware to check admin
function isAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  res.status(403).json({ error: 'Admin access required' });
}

// Get replay service from app locals
function getReplayService(req) {
  return req.app.locals.replayService;
}

// Get all users (admin only)
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const replayService = getReplayService(req);
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const result = await replayService.getUsers(limit, offset);

    res.json(result);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID (admin only)
router.get('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const replayService = getReplayService(req);
    const db = replayService.db;

    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }

    const doc = await db.collection('users').doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get user's replays
router.get('/:id/replays', async (req, res) => {
  try {
    const replayService = getReplayService(req);
    const db = replayService.db;

    if (!db) {
      return res.status(500).json({ error: 'Database not available' });
    }

    const snapshot = await db.collection('replays')
      .where('userId', '==', req.params.id)
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();

    const replays = [];
    snapshot.forEach(doc => {
      replays.push({ id: doc.id, ...doc.data() });
    });

    res.json({ replays, total: replays.length });
  } catch (error) {
    console.error('Get user replays error:', error);
    res.status(500).json({ error: 'Failed to fetch user replays' });
  }
});

export default router;

