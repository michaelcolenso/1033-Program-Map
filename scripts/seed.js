#!/usr/bin/env node

/**
 * Database Seed Script
 *
 * Seeds the MongoDB database with 1033 Program equipment data.
 *
 * Usage:
 *   npm run seed              # Interactive mode
 *   npm run seed -- --force   # Force reseed (non-interactive)
 *   node scripts/seed.js --force
 *
 * Options:
 *   --force           Skip confirmation and reseed if data exists
 *   --skip-existing   Exit silently if data already exists (for Docker auto-seed)
 */

'use strict';

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGOLAB_URI || 'mongodb://localhost:27017/1033-program-map';
const DATA_FILE = path.join(__dirname, '../controllers/id_county_item.json');
const COLLECTION_NAME = 'id_county_item';
const FORCE_MODE = process.argv.includes('--force');
const SKIP_EXISTING = process.argv.includes('--skip-existing');

async function seed() {
  console.log('🌱 Starting database seed...');
  console.log(`📦 Database: ${MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
  if (FORCE_MODE) {
    console.log('⚡ Running in force mode (non-interactive)');
  }

  let client;

  try {
    // Check if data file exists
    if (!fs.existsSync(DATA_FILE)) {
      console.error(`❌ Data file not found: ${DATA_FILE}`);
      process.exit(1);
    }

    // Connect to MongoDB with retry logic for Docker
    let retries = 5;
    while (retries > 0) {
      try {
        client = new MongoClient(MONGODB_URI);
        await client.connect();
        break;
      } catch (err) {
        retries--;
        if (retries === 0) throw err;
        console.log(`⏳ Waiting for MongoDB... (${retries} retries left)`);
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    console.log('✓ Connected to MongoDB');

    const db = client.db();
    const collection = db.collection(COLLECTION_NAME);

    // Check if collection already has data
    const count = await collection.countDocuments();
    if (count > 0) {
      console.log(`⚠️  Collection "${COLLECTION_NAME}" already has ${count} documents.`);

      if (SKIP_EXISTING) {
        console.log('✓ Data already exists, skipping seed.');
        return;
      } else if (FORCE_MODE) {
        console.log('🔄 Force mode: dropping existing collection...');
        await collection.drop();
        console.log('✓ Dropped existing collection');
      } else {
        // Interactive mode
        const readline = require('readline');
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        const answer = await new Promise((resolve) => {
          rl.question('Do you want to drop and reseed? (y/N): ', resolve);
        });
        rl.close();

        if (answer.toLowerCase() !== 'y') {
          console.log('Seed cancelled.');
          return;
        }

        await collection.drop();
        console.log('✓ Dropped existing collection');
      }
    }

    // Read and parse JSON data
    console.log('📖 Reading data file...');
    const rawData = fs.readFileSync(DATA_FILE, 'utf8');
    const data = JSON.parse(rawData);

    // Convert object to array of documents
    const documents = [];
    for (const [areaName, items] of Object.entries(data)) {
      if (Array.isArray(items)) {
        for (const item of items) {
          documents.push({
            Areaname: areaName,
            ...item
          });
        }
      }
    }

    if (documents.length === 0) {
      console.error('❌ No documents found in data file');
      process.exit(1);
    }

    // Insert documents in batches
    console.log(`📝 Inserting ${documents.length} documents...`);
    const BATCH_SIZE = 1000;
    let inserted = 0;

    for (let i = 0; i < documents.length; i += BATCH_SIZE) {
      const batch = documents.slice(i, i + BATCH_SIZE);
      await collection.insertMany(batch);
      inserted += batch.length;
      process.stdout.write(`\r   Progress: ${inserted}/${documents.length} (${Math.round(inserted / documents.length * 100)}%)`);
    }

    console.log('\n✓ Data inserted successfully');

    // Create index on Areaname for faster queries
    await collection.createIndex({ Areaname: 1 });
    console.log('✓ Created index on Areaname');

    console.log('\n🎉 Seed completed successfully!');

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Run if called directly
if (require.main === module) {
  seed();
}

module.exports = seed;
