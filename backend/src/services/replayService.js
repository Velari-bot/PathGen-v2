import { getFirestore } from '../config/firestore.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage directory for replays
const REPLAYS_DIR = process.env.REPLAYS_DIR || path.join(__dirname, '../../replays');

// Ensure replays directory exists
await fs.mkdir(REPLAYS_DIR, { recursive: true });

export class ReplayService {
  constructor(io) {
    this.io = io;
    this.db = getFirestore();
  }

  // Save replay metadata to Firestore
  async saveReplayMetadata(replayData) {
    if (!this.db) {
      console.warn('Firestore not available, skipping metadata save');
      return null;
    }

    try {
      const docRef = await this.db.collection('replays').add({
        ...replayData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      const savedReplay = { id: docRef.id, ...replayData };

      // Emit real-time event
      this.io.emit('replay:uploaded', savedReplay);

      return savedReplay;
    } catch (error) {
      console.error('Error saving replay metadata:', error);
      throw error;
    }
  }

  // Get all replays
  async getAllReplays(limit = 100, offset = 0) {
    if (!this.db) {
      return { replays: [], total: 0 };
    }

    try {
      const snapshot = await this.db.collection('replays')
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .offset(offset)
        .get();

      const replays = [];
      snapshot.forEach(doc => {
        replays.push({ id: doc.id, ...doc.data() });
      });

      // Get total count
      const countSnapshot = await this.db.collection('replays').count().get();
      const total = countSnapshot.data().count;

      return { replays, total };
    } catch (error) {
      console.error('Error fetching replays:', error);
      throw error;
    }
  }

  // Get replay by ID
  async getReplayById(replayId) {
    if (!this.db) {
      throw new Error('Firestore not available');
    }

    try {
      const doc = await this.db.collection('replays').doc(replayId).get();
      
      if (!doc.exists) {
        return null;
      }

      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Error fetching replay:', error);
      throw error;
    }
  }

  // Delete replay
  async deleteReplay(replayId) {
    if (!this.db) {
      throw new Error('Firestore not available');
    }

    try {
      const replay = await this.getReplayById(replayId);
      
      if (!replay) {
        throw new Error('Replay not found');
      }

      // Delete file if it exists
      if (replay.filePath) {
        try {
          await fs.unlink(replay.filePath);
        } catch (err) {
          console.warn('File not found or already deleted:', replay.filePath);
        }
      }

      // Delete from Firestore
      await this.db.collection('replays').doc(replayId).delete();

      // Emit real-time event
      this.io.emit('replay:deleted', { id: replayId });

      return true;
    } catch (error) {
      console.error('Error deleting replay:', error);
      throw error;
    }
  }

  // Get stats
  async getStats() {
    if (!this.db) {
      return {
        totalReplays: 0,
        todayUploads: 0,
        storageUsed: 0,
        activeUsers: 0
      };
    }

    try {
      // Total replays
      const totalSnapshot = await this.db.collection('replays').count().get();
      const totalReplays = totalSnapshot.data().count;

      // Today's uploads
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todaySnapshot = await this.db.collection('replays')
        .where('createdAt', '>=', today.toISOString())
        .count()
        .get();
      const todayUploads = todaySnapshot.data().count;

      // Calculate storage used
      const replaysSnapshot = await this.db.collection('replays').get();
      let storageUsed = 0;
      replaysSnapshot.forEach(doc => {
        const data = doc.data();
        storageUsed += data.fileSize || 0;
      });

      // Active users (users who uploaded in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const activeUsersSnapshot = await this.db.collection('replays')
        .where('createdAt', '>=', thirtyDaysAgo.toISOString())
        .get();
      
      const uniqueUsers = new Set();
      activeUsersSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.userId) {
          uniqueUsers.add(data.userId);
        }
      });

      return {
        totalReplays,
        todayUploads,
        storageUsed,
        activeUsers: uniqueUsers.size
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }

  // Get users
  async getUsers(limit = 50, offset = 0) {
    if (!this.db) {
      return { users: [], total: 0 };
    }

    try {
      const snapshot = await this.db.collection('users')
        .limit(limit)
        .offset(offset)
        .get();

      const users = [];
      snapshot.forEach(doc => {
        users.push({ id: doc.id, ...doc.data() });
      });

      // Get total count
      const countSnapshot = await this.db.collection('users').count().get();
      const total = countSnapshot.data().count;

      return { users, total };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Save or update user
  async saveUser(userData) {
    if (!this.db) {
      return null;
    }

    try {
      const userRef = this.db.collection('users').doc(userData.id);
      await userRef.set({
        ...userData,
        lastLogin: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });

      return { id: userData.id, ...userData };
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }
}

export default ReplayService;

