import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-vercel-postgres";

export async function up({
	db: _db,
	payload: _payload,
	req: _req,
}: MigrateUpArgs): Promise<void> {
	// Skip this migration if the column doesn't exist
	// The column will be created as nullable by Payload's schema sync
	console.log(
		"Skipping professors column alteration - will be handled by schema sync",
	);
}

export async function down({
	db,
	payload: _payload,
	req: _req,
}: MigrateDownArgs): Promise<void> {
	// Make professors column NOT NULL again
	await db.execute(sql`
		ALTER TABLE "course_instances" ALTER COLUMN "professors" SET NOT NULL;
	`);
}
