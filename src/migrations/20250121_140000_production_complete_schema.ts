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
	// Ensure migrations tracking table exists for Payload Drizzle
	await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "payload_migrations" (
     "id" serial PRIMARY KEY NOT NULL,
     "name" varchar NOT NULL,
     "batch" integer NOT NULL,
     "created_at" timestamp(3) DEFAULT now() NOT NULL,
     "updated_at" timestamp(3) DEFAULT now() NOT NULL
   );
  `);

	// Create all enum types
	await db.execute(sql`
   DO $$ BEGIN
     CREATE TYPE "public"."enum_users_role" AS ENUM('super-admin', 'admin', 'rector-dean', 'faculty-staff', 'department-staff', 'professor', 'assistant', 'student');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     CREATE TYPE "public"."enum_users_academic_info_status" AS ENUM('active', 'inactive', 'graduated', 'withdrawn', 'suspended');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     CREATE TYPE "public"."enum_users_permissions_scope" AS ENUM('university', 'faculty', 'department', 'program', 'course', 'self');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     CREATE TYPE "public"."enum_universities_locale" AS ENUM('en', 'nl', 'fr', 'de');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     CREATE TYPE "public"."enum_universities_configuration_rounding_rule" AS ENUM('bankers', 'round-half-up', 'round-half-down');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     CREATE TYPE "public"."enum_assessment_templates_assessment_type" AS ENUM('exam', 'quiz', 'assignment', 'project', 'presentation', 'participation', 'homework', 'lab', 'midterm', 'final');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     CREATE TYPE "public"."enum_assessments_status" AS ENUM('scheduled', 'in-progress', 'completed', 'cancelled', 'postponed');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     CREATE TYPE "public"."enum_enrollments_status" AS ENUM('enrolled', 'dropped', 'completed', 'failed', 'incomplete', 'withdrawn');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     CREATE TYPE "public"."enum_grade_aggregates_pass_fail" AS ENUM('pass', 'fail', 'incomplete');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     CREATE TYPE "public"."enum_grade_aggregates_calculation_method" AS ENUM('weighted-average', 'simple-average', 'points-based', 'percentage-based');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	// Create universities table
	await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "universities" (
     "id" serial PRIMARY KEY NOT NULL,
     "name" varchar NOT NULL,
     "code" varchar NOT NULL,
     "description" text,
     "website" varchar,
     "email" varchar,
     "phone" varchar,
     "address" jsonb,
     "logo" varchar,
     "locale" "enum_universities_locale" DEFAULT 'en',
     "configuration" jsonb,
     "created_at" timestamp(3) DEFAULT now() NOT NULL,
     "updated_at" timestamp(3) DEFAULT now() NOT NULL
   );
  `);

	// Create faculties table
	await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "faculties" (
     "id" serial PRIMARY KEY NOT NULL,
     "name" varchar NOT NULL,
     "code" varchar NOT NULL,
     "description" text,
     "dean" varchar,
     "university_id" integer NOT NULL,
     "created_at" timestamp(3) DEFAULT now() NOT NULL,
     "updated_at" timestamp(3) DEFAULT now() NOT NULL
   );
  `);

	// Create departments table
	await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "departments" (
     "id" serial PRIMARY KEY NOT NULL,
     "name" varchar NOT NULL,
     "code" varchar NOT NULL,
     "description" text,
     "head" varchar,
     "faculty_id" integer NOT NULL,
     "created_at" timestamp(3) DEFAULT now() NOT NULL,
     "updated_at" timestamp(3) DEFAULT now() NOT NULL
   );
  `);

	// Create programs table
	await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "programs" (
     "id" serial PRIMARY KEY NOT NULL,
     "name" varchar NOT NULL,
     "code" varchar NOT NULL,
     "description" text,
     "degree_type" varchar,
     "duration_years" integer,
     "credits_required" integer,
     "department_id" integer NOT NULL,
     "created_at" timestamp(3) DEFAULT now() NOT NULL,
     "updated_at" timestamp(3) DEFAULT now() NOT NULL
   );
  `);

	// Create courses table
	await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "courses" (
     "id" serial PRIMARY KEY NOT NULL,
     "name" varchar NOT NULL,
     "code" varchar NOT NULL,
     "description" text,
     "credits" integer NOT NULL,
     "department_id" integer NOT NULL,
     "created_at" timestamp(3) DEFAULT now() NOT NULL,
     "updated_at" timestamp(3) DEFAULT now() NOT NULL
   );
  `);

	// Create course_variations table
	await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "course_variations" (
     "id" serial PRIMARY KEY NOT NULL,
     "code_variant" varchar NOT NULL,
     "title_variant" varchar NOT NULL,
     "description" text,
     "course_id" integer NOT NULL,
     "created_at" timestamp(3) DEFAULT now() NOT NULL,
     "updated_at" timestamp(3) DEFAULT now() NOT NULL
   );
  `);

	// Create course_instances table
	await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "course_instances" (
     "id" serial PRIMARY KEY NOT NULL,
     "instance_title" varchar NOT NULL,
     "semester" varchar,
     "academic_year_id" integer,
     "course_variation_id" integer NOT NULL,
     "created_at" timestamp(3) DEFAULT now() NOT NULL,
     "updated_at" timestamp(3) DEFAULT now() NOT NULL
   );
  `);

	// Create academic_years table
	await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "academic_years" (
     "id" serial PRIMARY KEY NOT NULL,
     "name" varchar NOT NULL,
     "start_date" timestamp(3) NOT NULL,
     "end_date" timestamp(3) NOT NULL,
     "is_current" boolean DEFAULT false,
     "university_id" integer NOT NULL,
     "created_at" timestamp(3) DEFAULT now() NOT NULL,
     "updated_at" timestamp(3) DEFAULT now() NOT NULL
   );
  `);

	// Create academic_calendars table
	await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "academic_calendars" (
     "id" serial PRIMARY KEY NOT NULL,
     "name" varchar NOT NULL,
     "academic_year_id" integer NOT NULL,
     "created_at" timestamp(3) DEFAULT now() NOT NULL,
     "updated_at" timestamp(3) DEFAULT now() NOT NULL
   );
  `);

	// Create assessment_templates table
	await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "assessment_templates" (
     "id" serial PRIMARY KEY NOT NULL,
     "name" varchar NOT NULL,
     "description" text,
     "weight_percent" numeric NOT NULL,
     "min_score" numeric NOT NULL,
     "max_score" numeric NOT NULL,
     "assessment_type" "enum_assessment_templates_assessment_type" NOT NULL,
     "course_instance_id" integer NOT NULL,
     "created_at" timestamp(3) DEFAULT now() NOT NULL,
     "updated_at" timestamp(3) DEFAULT now() NOT NULL
   );
  `);

	// Create assessments table
	await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "assessments" (
     "id" serial PRIMARY KEY NOT NULL,
     "title" varchar NOT NULL,
     "description" text,
     "date" timestamp(3),
     "start_time" timestamp(3),
     "end_time" timestamp(3),
     "location" varchar,
     "status" "enum_assessments_status" DEFAULT 'scheduled',
     "assessment_template_id" integer NOT NULL,
     "created_at" timestamp(3) DEFAULT now() NOT NULL,
     "updated_at" timestamp(3) DEFAULT now() NOT NULL
   );
  `);

	// Create enrollments table
	await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "enrollments" (
     "id" serial PRIMARY KEY NOT NULL,
     "enrollment_date" timestamp(3) DEFAULT now() NOT NULL,
     "status" "enum_enrollments_status" DEFAULT 'enrolled',
     "student_id" integer NOT NULL,
     "course_instance_id" integer NOT NULL,
     "created_at" timestamp(3) DEFAULT now() NOT NULL,
     "updated_at" timestamp(3) DEFAULT now() NOT NULL
   );
  `);

	// Create scores table
	await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "scores" (
     "id" serial PRIMARY KEY NOT NULL,
     "value" numeric NOT NULL,
     "max_value" numeric NOT NULL,
     "percentage" numeric NOT NULL,
     "feedback" text,
     "notes" text,
     "is_late" boolean DEFAULT false,
     "graded_at" timestamp(3) DEFAULT now() NOT NULL,
     "student_id" integer NOT NULL,
     "assessment_id" integer NOT NULL,
     "graded_by_id" integer NOT NULL,
     "created_at" timestamp(3) DEFAULT now() NOT NULL,
     "updated_at" timestamp(3) DEFAULT now() NOT NULL
   );
  `);

	// Create grade_aggregates table
	await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "grade_aggregates" (
     "id" serial PRIMARY KEY NOT NULL,
     "final_numeric" numeric NOT NULL,
     "final_letter" varchar,
     "pass_fail" "enum_grade_aggregates_pass_fail" NOT NULL,
     "gpa_points" numeric,
     "calculation_method" "enum_grade_aggregates_calculation_method" DEFAULT 'weighted-average',
     "decision_notes" text,
     "calculated_at" timestamp(3) DEFAULT now() NOT NULL,
     "enrollment_id" integer NOT NULL,
     "calculated_by_id" integer NOT NULL,
     "created_at" timestamp(3) DEFAULT now() NOT NULL,
     "updated_at" timestamp(3) DEFAULT now() NOT NULL
   );
  `);

	// Create grading_scales table
	await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "grading_scales" (
     "id" serial PRIMARY KEY NOT NULL,
     "name" varchar NOT NULL,
     "description" text,
     "university_id" integer NOT NULL,
     "created_at" timestamp(3) DEFAULT now() NOT NULL,
     "updated_at" timestamp(3) DEFAULT now() NOT NULL
   );
  `);

	// Create grading_scales_grade_mappings table
	await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "grading_scales_grade_mappings" (
     "id" serial PRIMARY KEY NOT NULL,
     "letter_grade" varchar NOT NULL,
     "min_percentage" numeric NOT NULL,
     "max_percentage" numeric NOT NULL,
     "gpa_points" numeric NOT NULL,
     "description" text,
     "_parent_id" integer NOT NULL,
     "created_at" timestamp(3) DEFAULT now() NOT NULL,
     "updated_at" timestamp(3) DEFAULT now() NOT NULL
   );
  `);

	// Users table is managed by Payload CMS automatically

	// Add foreign key constraints
	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "grading_scales_grade_mappings" ADD CONSTRAINT "grading_scales_grade_mappings_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."grading_scales"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "faculties" ADD CONSTRAINT "faculties_university_id_fk" FOREIGN KEY ("university_id") REFERENCES "public"."universities"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "departments" ADD CONSTRAINT "departments_faculty_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculties"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "programs" ADD CONSTRAINT "programs_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "courses" ADD CONSTRAINT "courses_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "course_variations" ADD CONSTRAINT "course_variations_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "course_instances" ADD CONSTRAINT "course_instances_course_variation_id_fk" FOREIGN KEY ("course_variation_id") REFERENCES "public"."course_variations"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "course_instances" ADD CONSTRAINT "course_instances_academic_year_id_fk" FOREIGN KEY ("academic_year_id") REFERENCES "public"."academic_years"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "academic_years" ADD CONSTRAINT "academic_years_university_id_fk" FOREIGN KEY ("university_id") REFERENCES "public"."universities"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "academic_calendars" ADD CONSTRAINT "academic_calendars_academic_year_id_fk" FOREIGN KEY ("academic_year_id") REFERENCES "public"."academic_years"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "assessment_templates" ADD CONSTRAINT "assessment_templates_course_instance_id_fk" FOREIGN KEY ("course_instance_id") REFERENCES "public"."course_instances"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "assessments" ADD CONSTRAINT "assessments_assessment_template_id_fk" FOREIGN KEY ("assessment_template_id") REFERENCES "public"."assessment_templates"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	// Skipping FK to users: created later by Payload's users collection

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_instance_id_fk" FOREIGN KEY ("course_instance_id") REFERENCES "public"."course_instances"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	// Skipping FK to users: created later by Payload's users collection

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "scores" ADD CONSTRAINT "scores_assessment_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	// Skipping FK to users: created later by Payload's users collection

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "grade_aggregates" ADD CONSTRAINT "grade_aggregates_enrollment_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

	// Skipping FK to users: created later by Payload's users collection

	await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "grading_scales" ADD CONSTRAINT "grading_scales_university_id_fk" FOREIGN KEY ("university_id") REFERENCES "public"."universities"("id") ON DELETE cascade ON UPDATE no action;
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
	// Drop tables in reverse order
	await db.execute(sql`DROP TABLE IF EXISTS "grading_scales_grade_mappings"`);
	await db.execute(sql`DROP TABLE IF EXISTS "grading_scales"`);
	await db.execute(sql`DROP TABLE IF EXISTS "grade_aggregates"`);
	await db.execute(sql`DROP TABLE IF EXISTS "scores"`);
	await db.execute(sql`DROP TABLE IF EXISTS "enrollments"`);
	await db.execute(sql`DROP TABLE IF EXISTS "assessments"`);
	await db.execute(sql`DROP TABLE IF EXISTS "assessment_templates"`);
	await db.execute(sql`DROP TABLE IF EXISTS "academic_calendars"`);
	await db.execute(sql`DROP TABLE IF EXISTS "academic_years"`);
	await db.execute(sql`DROP TABLE IF EXISTS "course_instances"`);
	await db.execute(sql`DROP TABLE IF EXISTS "course_variations"`);
	await db.execute(sql`DROP TABLE IF EXISTS "courses"`);
	await db.execute(sql`DROP TABLE IF EXISTS "programs"`);
	await db.execute(sql`DROP TABLE IF EXISTS "departments"`);
	await db.execute(sql`DROP TABLE IF EXISTS "faculties"`);
	await db.execute(sql`DROP TABLE IF EXISTS "universities"`);

	// Drop enum types
	await db.execute(
		sql`DROP TYPE IF EXISTS "enum_grading_scales_calculation_method"`,
	);
	await db.execute(
		sql`DROP TYPE IF EXISTS "enum_grade_aggregates_pass_fail"`,
	);
	await db.execute(sql`DROP TYPE IF EXISTS "enum_enrollments_status"`);
	await db.execute(sql`DROP TYPE IF EXISTS "enum_assessments_status"`);
	await db.execute(
		sql`DROP TYPE IF EXISTS "enum_assessment_templates_assessment_type"`,
	);
	await db.execute(
		sql`DROP TYPE IF EXISTS "enum_universities_configuration_rounding_rule"`,
	);
	await db.execute(sql`DROP TYPE IF EXISTS "enum_universities_locale"`);
	await db.execute(sql`DROP TYPE IF EXISTS "enum_users_permissions_scope"`);
	await db.execute(
		sql`DROP TYPE IF EXISTS "enum_users_academic_info_status"`,
	);
	await db.execute(sql`DROP TYPE IF EXISTS "enum_users_role"`);
}
