#!/usr/bin/env node

import { getPayload } from "payload";
import configPromise from "../src/payload.config.ts";

async function runMigrations() {
	try {
		console.log("🚀 Starting migrations...");
		const payload = await getPayload({ config: configPromise });

		// Run migrations programmatically (non-interactive)
		await payload.db.migrate({
			migrations: [], // Payload will automatically find migrations in the configured directory
		});

		console.log("✅ Migrations completed successfully!");
		process.exit(0);
	} catch (error) {
		console.error("❌ Migration failed:", error);
		process.exit(1);
	}
}

runMigrations();

