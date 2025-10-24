import type {
	MigrateDownArgs,
	MigrateUpArgs,
} from "@payloadcms/db-vercel-postgres";

export async function up({
	db: _db,
	payload: _payload,
	req: _req,
}: MigrateUpArgs): Promise<void> {
	return;
}

export async function down({
	db: _db,
	payload: _payload,
	req: _req,
}: MigrateDownArgs): Promise<void> {
	return;
}
