import express from 'express';
import os from 'os';

const router = express.Router();

// Get replay service from app locals
function getReplayService(req) {
  return req.app.locals.replayService;
}

// Get server health
router.get('/', async (req, res) => {
  try {
    const replayService = getReplayService(req);

    // System metrics
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memUsagePercent = (usedMem / totalMem) * 100;

    const cpus = os.cpus();
    const loadAvg = os.loadavg();

    // Uptime
    const uptime = process.uptime();

    // Database status
    let dbStatus = 'disconnected';
    try {
      if (replayService.db) {
        // Try a simple read operation to check connection
        await replayService.db.collection('replays').limit(1).get();
        dbStatus = 'connected';
      }
    } catch (error) {
      dbStatus = 'error';
    }

    const health = {
      status: 'online',
      timestamp: new Date().toISOString(),
      uptime: uptime,
      system: {
        platform: os.platform(),
        arch: os.arch(),
        hostname: os.hostname(),
        nodeVersion: process.version
      },
      memory: {
        total: totalMem,
        free: freeMem,
        used: usedMem,
        usagePercent: memUsagePercent.toFixed(2)
      },
      cpu: {
        count: cpus.length,
        model: cpus[0]?.model || 'Unknown',
        loadAvg: loadAvg.map(l => l.toFixed(2))
      },
      database: {
        status: dbStatus
      }
    };

    res.json(health);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

export default router;

