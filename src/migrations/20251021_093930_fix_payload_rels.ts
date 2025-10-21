import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-vercel-postgres";

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
	// Add missing columns to payload_locked_documents_rels table
	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "universities_id" integer;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "faculties_id" integer;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "departments_id" integer;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "diploma_levels_id" integer;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "programs_id" integer;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "academic_years_id" integer;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "program_years_id" integer;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "courses_id" integer;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "course_variations_id" integer;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "course_instances_id" integer;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "grading_scales_id" integer;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "academic_calendars_id" integer;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "assessment_templates_id" integer;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "assessments_id" integer;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "enrollments_id" integer;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "scores_id" integer;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "grade_aggregates_id" integer;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

	// Add foreign key constraints for the new columns
	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_universities_id_fk" FOREIGN KEY ("universities_id") REFERENCES "public"."universities"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faculties_id_fk" FOREIGN KEY ("faculties_id") REFERENCES "public"."faculties"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_departments_id_fk" FOREIGN KEY ("departments_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_diploma_levels_id_fk" FOREIGN KEY ("diploma_levels_id") REFERENCES "public"."diploma_levels"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_programs_id_fk" FOREIGN KEY ("programs_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_academic_years_id_fk" FOREIGN KEY ("academic_years_id") REFERENCES "public"."academic_years"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_program_years_id_fk" FOREIGN KEY ("program_years_id") REFERENCES "public"."program_years"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_courses_id_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_course_variations_id_fk" FOREIGN KEY ("course_variations_id") REFERENCES "public"."course_variations"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_course_instances_id_fk" FOREIGN KEY ("course_instances_id") REFERENCES "public"."course_instances"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_grading_scales_id_fk" FOREIGN KEY ("grading_scales_id") REFERENCES "public"."grading_scales"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_academic_calendars_id_fk" FOREIGN KEY ("academic_calendars_id") REFERENCES "public"."academic_calendars"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_assessment_templates_id_fk" FOREIGN KEY ("assessment_templates_id") REFERENCES "public"."assessment_templates"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_assessments_id_fk" FOREIGN KEY ("assessments_id") REFERENCES "public"."assessments"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enrollments_id_fk" FOREIGN KEY ("enrollments_id") REFERENCES "public"."enrollments"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_scores_id_fk" FOREIGN KEY ("scores_id") REFERENCES "public"."scores"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_grade_aggregates_id_fk" FOREIGN KEY ("grade_aggregates_id") REFERENCES "public"."grade_aggregates"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);
}

export async function down({
	db,
	payload: _payload,
	req: _req,
}: MigrateDownArgs): Promise<void> {
	// Remove foreign key constraints
	await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_grade_aggregates_id_fk";
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_scores_id_fk";
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_enrollments_id_fk";
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_assessments_id_fk";
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_assessment_templates_id_fk";
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_academic_calendars_id_fk";
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_grading_scales_id_fk";
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_course_instances_id_fk";
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_course_variations_id_fk";
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_courses_id_fk";
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_program_years_id_fk";
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_academic_years_id_fk";
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_programs_id_fk";
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_diploma_levels_id_fk";
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_departments_id_fk";
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_faculties_id_fk";
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_universities_id_fk";
  `);

	// Remove columns
	await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "grade_aggregates_id";
   ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "scores_id";
   ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "enrollments_id";
   ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "assessments_id";
   ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "assessment_templates_id";
   ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "academic_calendars_id";
   ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "grading_scales_id";
   ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "course_instances_id";
   ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "course_variations_id";
   ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "courses_id";
   ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "program_years_id";
   ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "academic_years_id";
   ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "programs_id";
   ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "diploma_levels_id";
   ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "departments_id";
   ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "faculties_id";
   ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "universities_id";
  `);
}
