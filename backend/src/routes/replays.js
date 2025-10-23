import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.REPLAYS_DIR || path.join(__dirname, '../../replays');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `replay-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept replay files (you can customize extensions)
    const allowedExtensions = ['.replay', '.rec', '.dem', '.rpl'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only replay files are allowed.'));
    }
  }
});

// Middleware to check authentication
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
}

// Get replay service from app locals
function getReplayService(req) {
  return req.app.locals.replayService;
}

// Upload replay
router.post('/upload', isAuthenticated, upload.single('replay'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const replayService = getReplayService(req);
    const user = req.user;

    const replayData = {
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      userId: user.id,
      username: user.username,
      userAvatar: user.avatar,
      description: req.body.description || '',
      gameMode: req.body.gameMode || 'Unknown',
      map: req.body.map || 'Unknown',
      duration: req.body.duration || 0,
      uploadedBy: {
        id: user.id,
        username: user.username,
        avatar: user.avatar
      }
    };

    const savedReplay = await replayService.saveReplayMetadata(replayData);

    res.status(201).json({
      success: true,
      replay: savedReplay
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload replay' });
  }
});

// Get all replays
router.get('/', async (req, res) => {
  try {
    const replayService = getReplayService(req);
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const result = await replayService.getAllReplays(limit, offset);

    res.json(result);
  } catch (error) {
    console.error('Get replays error:', error);
    res.status(500).json({ error: 'Failed to fetch replays' });
  }
});

// Get replay by ID
router.get('/:id', async (req, res) => {
  try {
    const replayService = getReplayService(req);
    const replay = await replayService.getReplayById(req.params.id);

    if (!replay) {
      return res.status(404).json({ error: 'Replay not found' });
    }

    res.json(replay);
  } catch (error) {
    console.error('Get replay error:', error);
    res.status(500).json({ error: 'Failed to fetch replay' });
  }
});

// Download replay
router.get('/:id/download', async (req, res) => {
  try {
    const replayService = getReplayService(req);
    const replay = await replayService.getReplayById(req.params.id);

    if (!replay) {
      return res.status(404).json({ error: 'Replay not found' });
    }

    if (!replay.filePath) {
      return res.status(404).json({ error: 'Replay file not found' });
    }

    res.download(replay.filePath, replay.fileName);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download replay' });
  }
});

// Delete replay
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const replayService = getReplayService(req);
    const replay = await replayService.getReplayById(req.params.id);

    if (!replay) {
      return res.status(404).json({ error: 'Replay not found' });
    }

    // Check if user owns the replay or is admin
    if (replay.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    await replayService.deleteReplay(req.params.id);

    res.json({ success: true, message: 'Replay deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete replay' });
  }
});

// Get stats
router.get('/stats/overview', async (req, res) => {
  try {
    const replayService = getReplayService(req);
    const stats = await replayService.getStats();

    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;

