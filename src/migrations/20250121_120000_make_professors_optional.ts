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
	// Make professors column nullable in course_instances table
	await db.execute(sql`
		ALTER TABLE "course_instances" ALTER COLUMN "professors" DROP NOT NULL;
	`);
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
