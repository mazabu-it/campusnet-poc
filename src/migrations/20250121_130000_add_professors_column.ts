import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-vercel-postgres";

export async function up({
	db,
	payload: _payload,
	req: _req,
}: MigrateUpArgs): Promise<void> {
	// Add professors column to course_instances table if it exists
	await db.execute(sql`
		DO $$ BEGIN
			ALTER TABLE "course_instances" ADD COLUMN "professors" integer[];
		EXCEPTION
			WHEN undefined_table THEN
				-- Table doesn't exist yet, will be created by schema sync
				NULL;
			WHEN duplicate_column THEN
				-- Column already exists, skip
				NULL;
		END $$;
	`);
}

export async function down({
	db,
	payload: _payload,
	req: _req,
}: MigrateDownArgs): Promise<void> {
	// Remove professors column from course_instances table
	await db.execute(sql`
		ALTER TABLE "course_instances" DROP COLUMN IF EXISTS "professors";
	`);
}
