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
	// Create enum if it doesn't exist
	await db.execute(sql`
   DO $$ BEGIN
     CREATE TYPE "public"."enum_users_role" AS ENUM('super-admin', 'admin', 'rector-dean', 'faculty-staff', 'department-staff', 'professor', 'assistant', 'student');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	// Add role column if it doesn't exist
	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD COLUMN "role" "enum_users_role";
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

	// Update existing users with NULL role to 'student'
	await db.execute(sql`
   UPDATE "users" SET "role" = 'student' WHERE "role" IS NULL;
  `);

	// Make role NOT NULL
	await db.execute(sql`
   ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL;
  `);
}

export async function down({
	db,
	payload: _payload,
	req: _req,
}: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "users" DROP COLUMN IF EXISTS "role";
   DROP TYPE IF EXISTS "enum_users_role";
  `);
}
