import fs from 'fs';
import path from 'path';
import prisma from './lib/prisma.js';

async function migrateData() {
  const jsonPath = path.join(process.cwd(), 'lib', 'feedback.json');
  
  if (!fs.existsSync(jsonPath)) {
    console.log('No feedback.json found. Skipping migration.');
    return;
  }

  try {
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const feedbacks = JSON.parse(rawData);
    
    console.log(`Found ${feedbacks.length} feedbacks to migrate.`);

    for (const fb of feedbacks) {
      await prisma.feedback.create({
        data: {
          name: fb.name || 'Anonymous',
          rating: fb.rating || 5,
          comment: fb.comment || '',
          images: Array.isArray(fb.images) ? fb.images : (fb.image ? [fb.image] : []),
          date: fb.date ? new Date(fb.date) : new Date(),
        }
      });
      console.log(`Migrated: ${fb.name}`);
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateData();
