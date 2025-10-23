import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { getFirestore } from './src/config/firestore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPLAYS_DIR = '/srv/pathgen_replays';
const db = getFirestore();

async function syncExistingReplays() {
  try {
    console.log('Starting replay sync...');
    
    // Check if directory exists
    const dirExists = await fs.access(REPLAYS_DIR).then(() => true).catch(() => false);
    
    if (!dirExists) {
      console.log(`Directory ${REPLAYS_DIR} does not exist, skipping sync.`);
      return;
    }

    // Read all subdirectories
    const entries = await fs.readdir(REPLAYS_DIR, { withFileTypes: true });
    
    let totalSynced = 0;
    
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      
      const userDir = path.join(REPLAYS_DIR, entry.name);
      const files = await fs.readdir(userDir);
      
      for (const file of files) {
        if (!file.endsWith('.replay')) continue;
        
        const filePath = path.join(userDir, file);
        const stats = await fs.stat(filePath);
        
        // Check if this file already exists in Firestore
        const existingDocs = await db.collection('replays')
          .where('fileName', '==', file)
          .where('filePath', '==', filePath)
          .get();
        
        if (!existingDocs.empty) {
          console.log(`Skipping ${file} (already in database)`);
          continue;
        }
        
        // Create metadata
        const replayData = {
          fileName: file,
          filePath: filePath,
          fileSize: stats.size,
          userId: entry.name,
          username: entry.name === 'unknown' ? 'Unknown User' : entry.name,
          userAvatar: '',
          description: '',
          gameMode: 'Unknown',
          map: 'Unknown',
          duration: 0,
          uploadedBy: {
            id: entry.name,
            username: entry.name === 'unknown' ? 'Unknown User' : entry.name,
            avatar: ''
          },
          createdAt: stats.birthtime.toISOString(),
          updatedAt: stats.mtime.toISOString()
        };
        
        // Save to Firestore
        await db.collection('replays').add(replayData);
        
        console.log(`✓ Synced: ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
        totalSynced++;
      }
    }
    
    console.log(`\n✓ Sync complete! Synced ${totalSynced} replays.`);
  } catch (error) {
    console.error('Error syncing replays:', error);
    process.exit(1);
  }
}

syncExistingReplays().then(() => {
  process.exit(0);
});

