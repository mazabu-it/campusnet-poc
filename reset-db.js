// reset-db.js
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

async function resetDatabase() {
	try {
		console.log("🗑️ Resetting database...");

		// Drop all Campusnet tables
		await sql`DROP TABLE IF EXISTS "grade_aggregates" CASCADE`;
		await sql`DROP TABLE IF EXISTS "scores" CASCADE`;
		await sql`DROP TABLE IF EXISTS "enrollments" CASCADE`;
		await sql`DROP TABLE IF EXISTS "assessments" CASCADE`;
		await sql`DROP TABLE IF EXISTS "assessment_templates" CASCADE`;
		await sql`DROP TABLE IF EXISTS "course_instances" CASCADE`;
		await sql`DROP TABLE IF EXISTS "course_variations" CASCADE`;
		await sql`DROP TABLE IF EXISTS "courses" CASCADE`;
		await sql`DROP TABLE IF EXISTS "program_years" CASCADE`;
		await sql`DROP TABLE IF EXISTS "programs" CASCADE`;
		await sql`DROP TABLE IF EXISTS "departments" CASCADE`;
		await sql`DROP TABLE IF EXISTS "faculties" CASCADE`;
		await sql`DROP TABLE IF EXISTS "universities" CASCADE`;
		await sql`DROP TABLE IF EXISTS "grading_scales" CASCADE`;
		await sql`DROP TABLE IF EXISTS "academic_calendars" CASCADE`;
		await sql`DROP TABLE IF EXISTS "academic_years" CASCADE`;
		await sql`DROP TABLE IF EXISTS "diploma_levels" CASCADE`;

		// Reset migrations table
		await sql`DROP TABLE IF EXISTS "payload_migrations" CASCADE`;

		console.log("✅ Database reset complete!");
	} catch (error) {
		console.error("❌ Error resetting database:", error);
	}
}

resetDatabase();
