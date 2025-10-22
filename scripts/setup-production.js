#!/usr/bin/env bun

/**
 * Production Setup Script
 * 
 * This script sets up the production database with all necessary migrations and demo data.
 * Run this script after deploying to production to initialize the database.
 * 
 * Usage:
 *   bun run scripts/setup-production.js
 *   bun run setup-production
 */

const PRODUCTION_URL = process.env.PRODUCTION_URL || 'https://your-app.vercel.app';
const LOCAL_URL = 'http://localhost:3000';

async function makeRequest(url, path, method = 'POST') {
	try {
		const response = await fetch(`${url}${path}`, {
			method,
			headers: {
				'Content-Type': 'application/json',
			},
		});

		const data = await response.json();
		return { status: response.status, data };
	} catch (error) {
		throw new Error(`Request failed: ${error.message}`);
	}
}

async function setupProduction() {
	console.log('🚀 Starting production setup...');
	console.log(`📍 Target URL: ${PRODUCTION_URL}`);
	
	try {
		// Try production setup endpoint first
		console.log('📦 Running production setup (migration + seed)...');
		const setupResult = await makeRequest(PRODUCTION_URL, '/api/setup-production');
		
		if (setupResult.status === 200) {
			console.log('✅ Production setup completed successfully!');
			console.log('📊 Setup result:', JSON.stringify(setupResult.data, null, 2));
			return;
		}
		
		// Fallback: run migration and seed separately
		console.log('⚠️  Production setup endpoint failed, trying individual steps...');
		
		console.log('📦 Running migrations...');
		const migrationResult = await makeRequest(PRODUCTION_URL, '/api/migrate-production');
		
		if (migrationResult.status !== 200) {
			throw new Error(`Migration failed: ${migrationResult.data.message || 'Unknown error'}`);
		}
		
		console.log('✅ Migrations completed!');
		
		console.log('🌱 Seeding demo data...');
		const seedResult = await makeRequest(PRODUCTION_URL, '/api/seed');
		
		if (seedResult.status !== 200) {
			throw new Error(`Seeding failed: ${seedResult.data.message || 'Unknown error'}`);
		}
		
		console.log('✅ Seeding completed!');
		console.log('🎉 Production setup completed successfully!');
		
	} catch (error) {
		console.error('❌ Production setup failed:', error.message);
		console.log('\n🔧 Manual setup instructions:');
		console.log('1. Visit your production URL');
		console.log('2. Go to /api/migrate-production (POST) to run migrations');
		console.log('3. Go to /api/seed (POST) to seed demo data');
		console.log('4. Or use the admin panel to run migrations and seed data');
		console.log('5. Or run: bun run setup-production');
		process.exit(1);
	}
}

// Check if running locally
if (process.argv.includes('--local')) {
	console.log('🏠 Running local setup...');
	setupProduction().catch(console.error);
} else {
	setupProduction().catch(console.error);
}
