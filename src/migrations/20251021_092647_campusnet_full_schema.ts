import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
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
     CREATE TYPE "public"."enum_universities_configuration_retake_policy_weight_repl" AS ENUM('replace', 'average', 'best');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     CREATE TYPE "public"."enum_universities_configuration_retake_policy_cap_rule" AS ENUM('none', 'pass-cap', 'max-cap');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     CREATE TYPE "public"."enum_universities_configuration_assess_windows_late_policy" AS ENUM('allow', 'penalty', 'deny');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     CREATE TYPE "public"."enum_universities_configuration_report_config_export_format" AS ENUM('pdf', 'pdf-excel');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     CREATE TYPE "public"."enum_diploma_levels_level" AS ENUM('bachelor', 'master', 'phd', 'certificate', 'diploma', 'other');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     CREATE TYPE "public"."enum_courses_course_type" AS ENUM('required', 'elective', 'optional');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     CREATE TYPE "public"."enum_course_variations_locale" AS ENUM('en', 'nl', 'fr', 'de');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     CREATE TYPE "public"."enum_course_instances_schedule_days" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     CREATE TYPE "public"."enum_course_instances_status" AS ENUM('planning', 'open', 'closed', 'in-progress', 'completed', 'cancelled');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     CREATE TYPE "public"."enum_grading_scales_scale_type" AS ENUM('numeric-100', 'numeric-20', 'letter', 'pass-fail', 'custom');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     CREATE TYPE "public"."enum_academic_calendars_important_dates_type" AS ENUM('enrollment-start', 'enrollment-end', 'classes-start', 'classes-end', 'exam-start', 'exam-end', 'grade-deadline', 'holiday', 'other');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     CREATE TYPE "public"."enum_assessment_templates_assessment_type" AS ENUM('exam', 'quiz', 'assignment', 'project', 'presentation', 'lab', 'participation', 'other');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     CREATE TYPE "public"."enum_assessments_status" AS ENUM('draft', 'open', 'locked', 'published');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     CREATE TYPE "public"."enum_enrollments_status" AS ENUM('pending', 'active', 'dropped', 'completed', 'failed', 'withdrawn');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     CREATE TYPE "public"."enum_enrollments_enrollment_type" AS ENUM('required', 'elective', 'optional');
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
     CREATE TYPE "public"."enum_grade_aggregates_calculation_method" AS ENUM('weighted-average', 'simple-average', 'best-score', 'manual-override');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  // Create grading_scales table
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "grading_scales" (
     "id" serial PRIMARY KEY NOT NULL,
     "name" varchar NOT NULL,
     "description" varchar,
     "scale_type" "enum_grading_scales_scale_type" NOT NULL,
     "pass_threshold" numeric NOT NULL,
     "is_active" boolean DEFAULT true,
     "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
     "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
   );
  `);

  // Create grading_scales_grade_mappings table
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "grading_scales_grade_mappings" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL,
     "id" varchar PRIMARY KEY NOT NULL,
     "min_score" numeric NOT NULL,
     "max_score" numeric NOT NULL,
     "letter_grade" varchar,
     "numeric_grade" numeric,
     "is_passing" boolean DEFAULT true,
     "description" varchar
   );
  `);

  // Create academic_years table
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "academic_years" (
     "id" serial PRIMARY KEY NOT NULL,
     "year_label" varchar NOT NULL,
     "start_date" timestamp(3) with time zone NOT NULL,
     "end_date" timestamp(3) with time zone NOT NULL,
     "is_active" boolean DEFAULT true,
     "description" varchar,
     "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
     "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
   );
  `);

  // Create academic_years_semesters table
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "academic_years_semesters" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL,
     "id" varchar PRIMARY KEY NOT NULL,
     "name" varchar NOT NULL,
     "start_date" timestamp(3) with time zone NOT NULL,
     "end_date" timestamp(3) with time zone NOT NULL,
     "is_active" boolean DEFAULT true
   );
  `);

  // Create academic_calendars table
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "academic_calendars" (
     "id" serial PRIMARY KEY NOT NULL,
     "name" varchar NOT NULL,
     "academic_year_id" integer NOT NULL,
     "is_active" boolean DEFAULT true,
     "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
     "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
   );
  `);

  // Create academic_calendars_important_dates table
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "academic_calendars_important_dates" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL,
     "id" varchar PRIMARY KEY NOT NULL,
     "name" varchar NOT NULL,
     "date" timestamp(3) with time zone NOT NULL,
     "type" "enum_academic_calendars_important_dates_type" NOT NULL,
     "description" varchar
   );
  `);

  // Create universities table
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "universities" (
     "id" serial PRIMARY KEY NOT NULL,
     "name" varchar NOT NULL,
     "code" varchar NOT NULL,
     "description" varchar,
     "locale" "enum_universities_locale" DEFAULT 'en' NOT NULL,
     "timezone" varchar DEFAULT 'Europe/Brussels' NOT NULL,
     "grading_scale_id" integer NOT NULL,
     "academic_calendar_id" integer NOT NULL,
     "configuration_rounding_rule" "enum_universities_configuration_rounding_rule" DEFAULT 'bankers',
     "configuration_decimal_precision" numeric DEFAULT 2,
     "configuration_retake_policy_max_retakes" numeric DEFAULT 2,
     "configuration_retake_policy_weight_repl" "enum_universities_configuration_retake_policy_weight_repl" DEFAULT 'replace',
     "configuration_retake_policy_cap_rule" "enum_universities_configuration_retake_policy_cap_rule" DEFAULT 'pass-cap',
     "configuration_assess_windows_default_open_days" numeric DEFAULT 7,
     "configuration_assess_windows_default_close_days" numeric DEFAULT 14,
     "configuration_assess_windows_late_policy" "enum_universities_configuration_assess_windows_late_policy" DEFAULT 'allow',
     "configuration_report_config_header_branding_id" integer,
     "configuration_report_config_footer_text" varchar,
     "configuration_report_config_signature_required" boolean DEFAULT true,
     "configuration_report_config_watermarking" boolean DEFAULT false,
     "configuration_report_config_export_format" "enum_universities_configuration_report_config_export_format" DEFAULT 'pdf',
     "is_active" boolean DEFAULT true,
     "contact_info_address" varchar,
     "contact_info_phone" varchar,
     "contact_info_email" varchar,
     "contact_info_website" varchar,
     "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
     "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
   );
  `);

  // Create faculties table
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "faculties" (
     "id" serial PRIMARY KEY NOT NULL,
     "university_id" integer NOT NULL,
     "name" varchar NOT NULL,
     "code" varchar NOT NULL,
     "description" varchar,
     "dean_id" integer,
     "contact_info_address" varchar,
     "contact_info_phone" varchar,
     "contact_info_email" varchar,
     "is_active" boolean DEFAULT true,
     "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
     "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
   );
  `);

  // Create departments table
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "departments" (
     "id" serial PRIMARY KEY NOT NULL,
     "faculty_id" integer NOT NULL,
     "name" varchar NOT NULL,
     "code" varchar NOT NULL,
     "description" varchar,
     "head_id" integer,
     "contact_info_address" varchar,
     "contact_info_phone" varchar,
     "contact_info_email" varchar,
     "is_active" boolean DEFAULT true,
     "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
     "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
   );
  `);

  // Create diploma_levels table
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "diploma_levels" (
     "id" serial PRIMARY KEY NOT NULL,
     "name" varchar NOT NULL,
     "code" varchar NOT NULL,
     "level" "enum_diploma_levels_level" NOT NULL,
     "description" varchar,
     "typical_duration" numeric,
     "is_active" boolean DEFAULT true,
     "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
     "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
   );
  `);

  // Create programs table
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "programs" (
     "id" serial PRIMARY KEY NOT NULL,
     "department_id" integer NOT NULL,
     "name" varchar NOT NULL,
     "code" varchar NOT NULL,
     "description" varchar,
     "diploma_level_id" integer NOT NULL,
     "duration" numeric NOT NULL,
     "curriculum_rules_total_credits_required" numeric NOT NULL,
     "curriculum_rules_elective_credits_allowed" numeric DEFAULT 0,
     "curriculum_rules_max_credits_per_semester" numeric DEFAULT 30,
     "curriculum_rules_min_credits_per_semester" numeric DEFAULT 12,
     "curriculum_rules_prerequisite_rules" varchar,
     "program_director_id" integer,
     "is_active" boolean DEFAULT true,
     "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
     "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
   );
  `);

  // Create program_years table
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "program_years" (
     "id" serial PRIMARY KEY NOT NULL,
     "program_id" integer NOT NULL,
     "year_number" numeric NOT NULL,
     "title" varchar,
     "required_credits" numeric NOT NULL,
     "elective_credits_allowed" numeric DEFAULT 0,
     "description" varchar,
     "is_active" boolean DEFAULT true,
     "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
     "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
   );
  `);

  // Create courses table
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "courses" (
     "id" serial PRIMARY KEY NOT NULL,
     "code" varchar NOT NULL,
     "title" varchar NOT NULL,
     "description" varchar,
     "credits" numeric NOT NULL,
     "owning_department_id" integer NOT NULL,
     "course_type" "enum_courses_course_type" DEFAULT 'required',
     "is_active" boolean DEFAULT true,
     "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
     "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
   );
  `);

  // Create courses_learning_outcomes table
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "courses_learning_outcomes" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL,
     "id" varchar PRIMARY KEY NOT NULL,
     "outcome" varchar NOT NULL
   );
  `);

  // Create courses_rels table
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "courses_rels" (
     "id" serial PRIMARY KEY NOT NULL,
     "order" integer,
     "parent_id" integer NOT NULL,
     "path" varchar NOT NULL,
     "courses_id" integer
   );
  `);

  // Create course_variations table
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "course_variations" (
     "id" serial PRIMARY KEY NOT NULL,
     "course_id" integer NOT NULL,
     "department_id" integer NOT NULL,
     "program_year_id" integer,
     "code_variant" varchar NOT NULL,
     "title_variant" varchar,
     "description_variant" varchar,
     "locale" "enum_course_variations_locale" DEFAULT 'en',
     "credits" numeric,
     "is_active" boolean DEFAULT true,
     "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
     "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
   );
  `);

  // Create course_instances table
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "course_instances" (
     "id" serial PRIMARY KEY NOT NULL,
     "course_variation_id" integer NOT NULL,
     "academic_year_id" integer NOT NULL,
     "instance_title" varchar,
     "max_enrollment" numeric,
     "current_enrollment" numeric DEFAULT 0,
     "schedule_start_time" varchar,
     "schedule_end_time" varchar,
     "schedule_room" varchar,
     "status" "enum_course_instances_status" DEFAULT 'planning',
     "notes" varchar,
     "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
     "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
   );
  `);

  // Create course_instances_schedule_days table
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "course_instances_schedule_days" (
     "order" integer NOT NULL,
     "parent_id" integer NOT NULL,
     "value" "enum_course_instances_schedule_days",
     "id" serial PRIMARY KEY NOT NULL
   );
  `);

  // Create course_instances_rels table
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "course_instances_rels" (
     "id" serial PRIMARY KEY NOT NULL,
     "order" integer,
     "parent_id" integer NOT NULL,
     "path" varchar NOT NULL,
     "users_id" integer
   );
  `);

  // Create assessment_templates table
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "assessment_templates" (
     "id" serial PRIMARY KEY NOT NULL,
     "course_instance_id" integer NOT NULL,
     "name" varchar NOT NULL,
     "description" varchar,
     "weight_percent" numeric NOT NULL,
     "min_score" numeric DEFAULT 0,
     "max_score" numeric NOT NULL,
     "is_optional" boolean DEFAULT false,
     "assessment_type" "enum_assessment_templates_assessment_type" NOT NULL,
     "instructions" varchar,
     "is_active" boolean DEFAULT true,
     "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
     "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
   );
  `);

  // Create assessment_templates_rubric table
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "assessment_templates_rubric" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL,
     "id" varchar PRIMARY KEY NOT NULL,
     "criteria" varchar NOT NULL,
     "description" varchar,
     "max_points" numeric NOT NULL
   );
  `);

  // Create assessments table
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "assessments" (
     "id" serial PRIMARY KEY NOT NULL,
     "assessment_template_id" integer NOT NULL,
     "title" varchar NOT NULL,
     "description" varchar,
     "date" timestamp(3) with time zone NOT NULL,
     "start_time" varchar,
     "end_time" varchar,
     "location" varchar,
     "status" "enum_assessments_status" DEFAULT 'draft' NOT NULL,
     "submission_window_opens_at" timestamp(3) with time zone,
     "submission_window_closes_at" timestamp(3) with time zone,
     "submission_window_late_submission_allowed" boolean DEFAULT false,
     "submission_window_late_penalty_percent" numeric DEFAULT 0,
     "grading_window_opens_at" timestamp(3) with time zone,
     "grading_window_closes_at" timestamp(3) with time zone,
     "grading_window_allow_late_grading" boolean DEFAULT false,
     "instructions" varchar,
     "notes" varchar,
     "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
     "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
   );
  `);

  // Create enrollments table
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "enrollments" (
     "id" serial PRIMARY KEY NOT NULL,
     "student_id" integer NOT NULL,
     "course_instance_id" integer NOT NULL,
     "enrollment_title" varchar,
     "status" "enum_enrollments_status" DEFAULT 'pending' NOT NULL,
     "enrolled_at" timestamp(3) with time zone,
     "dropped_at" timestamp(3) with time zone,
     "completed_at" timestamp(3) with time zone,
     "enrollment_type" "enum_enrollments_enrollment_type" DEFAULT 'required',
     "credits_earned" numeric,
     "notes" varchar,
     "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
     "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
   );
  `);

  // Create scores table
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "scores" (
     "id" serial PRIMARY KEY NOT NULL,
     "assessment_id" integer NOT NULL,
     "student_id" integer NOT NULL,
     "score_title" varchar,
     "value" numeric NOT NULL,
     "max_value" numeric,
     "percentage" numeric,
     "is_late" boolean DEFAULT false,
     "late_penalty_applied" numeric DEFAULT 0,
     "final_value" numeric,
     "graded_by_id" integer NOT NULL,
     "graded_at" timestamp(3) with time zone,
     "feedback" varchar,
     "notes" varchar,
     "is_excused" boolean DEFAULT false,
     "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
     "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
   );
  `);

  // Create grade_aggregates table
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "grade_aggregates" (
     "id" serial PRIMARY KEY NOT NULL,
     "enrollment_id" integer NOT NULL,
     "grade_title" varchar,
     "final_numeric" numeric,
     "final_letter" varchar,
     "pass_fail" "enum_grade_aggregates_pass_fail" NOT NULL,
     "gpa_points" numeric,
     "calculation_method" "enum_grade_aggregates_calculation_method" DEFAULT 'weighted-average',
     "decision_notes" varchar,
     "calculated_at" timestamp(3) with time zone,
     "calculated_by_id" integer,
     "is_published" boolean DEFAULT false,
     "published_at" timestamp(3) with time zone,
     "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
     "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
   );
  `);

  // Create grade_aggregates_assessment_breakdown table
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "grade_aggregates_assessment_breakdown" (
     "_order" integer NOT NULL,
     "_parent_id" integer NOT NULL,
     "id" varchar PRIMARY KEY NOT NULL,
     "assessment_template_id" integer NOT NULL,
     "score" numeric,
     "max_score" numeric,
     "weight" numeric,
     "contribution" numeric,
     "is_missing" boolean DEFAULT false,
     "is_excused" boolean DEFAULT false
   );
  `);

  // Add missing columns to users table
  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD COLUMN "first_name" varchar;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD COLUMN "last_name" varchar;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD COLUMN "student_id" varchar;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD COLUMN "employee_id" varchar;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD COLUMN "role" "enum_users_role";
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD COLUMN "university_id" integer;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD COLUMN "faculty_id" integer;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD COLUMN "department_id" integer;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD COLUMN "program_id" integer;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD COLUMN "program_year_id" integer;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD COLUMN "profile_date_of_birth" timestamp(3) with time zone;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD COLUMN "profile_phone" varchar;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD COLUMN "profile_address" varchar;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD COLUMN "profile_emergency_contact_name" varchar;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD COLUMN "profile_emergency_contact_relationship" varchar;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD COLUMN "profile_emergency_contact_phone" varchar;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD COLUMN "profile_emergency_contact_email" varchar;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD COLUMN "academic_info_enrollment_date" timestamp(3) with time zone;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD COLUMN "academic_info_expected_graduation" timestamp(3) with time zone;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD COLUMN "academic_info_status" "enum_users_academic_info_status" DEFAULT 'active';
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD COLUMN "academic_info_gpa" numeric;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD COLUMN "academic_info_total_credits_earned" numeric;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD COLUMN "permissions_can_impersonate" boolean DEFAULT false;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD COLUMN "permissions_can_manage_users" boolean DEFAULT false;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD COLUMN "permissions_can_manage_courses" boolean DEFAULT false;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD COLUMN "permissions_can_grade" boolean DEFAULT false;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD COLUMN "permissions_can_view_reports" boolean DEFAULT false;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD COLUMN "permissions_scope" "enum_users_permissions_scope" DEFAULT 'self';
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD COLUMN "is_active" boolean DEFAULT true;
   EXCEPTION
     WHEN duplicate_column THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD COLUMN "last_login_at" timestamp(3) with time zone;
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
     ALTER TABLE "academic_years_semesters" ADD CONSTRAINT "academic_years_semesters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."academic_years"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "academic_calendars" ADD CONSTRAINT "academic_calendars_academic_year_id_academic_years_id_fk" FOREIGN KEY ("academic_year_id") REFERENCES "public"."academic_years"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "academic_calendars_important_dates" ADD CONSTRAINT "academic_calendars_important_dates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."academic_calendars"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "universities" ADD CONSTRAINT "universities_grading_scale_id_grading_scales_id_fk" FOREIGN KEY ("grading_scale_id") REFERENCES "public"."grading_scales"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "universities" ADD CONSTRAINT "universities_academic_calendar_id_academic_calendars_id_fk" FOREIGN KEY ("academic_calendar_id") REFERENCES "public"."academic_calendars"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "faculties" ADD CONSTRAINT "faculties_university_id_universities_id_fk" FOREIGN KEY ("university_id") REFERENCES "public"."universities"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "departments" ADD CONSTRAINT "departments_faculty_id_faculties_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculties"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "programs" ADD CONSTRAINT "programs_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "programs" ADD CONSTRAINT "programs_diploma_level_id_diploma_levels_id_fk" FOREIGN KEY ("diploma_level_id") REFERENCES "public"."diploma_levels"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "program_years" ADD CONSTRAINT "program_years_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "courses" ADD CONSTRAINT "courses_owning_department_id_departments_id_fk" FOREIGN KEY ("owning_department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "courses_learning_outcomes" ADD CONSTRAINT "courses_learning_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "courses_rels" ADD CONSTRAINT "courses_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "courses_rels" ADD CONSTRAINT "courses_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "course_variations" ADD CONSTRAINT "course_variations_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "course_variations" ADD CONSTRAINT "course_variations_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "course_variations" ADD CONSTRAINT "course_variations_program_year_id_program_years_id_fk" FOREIGN KEY ("program_year_id") REFERENCES "public"."program_years"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "course_instances" ADD CONSTRAINT "course_instances_course_variation_id_course_variations_id_fk" FOREIGN KEY ("course_variation_id") REFERENCES "public"."course_variations"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "course_instances" ADD CONSTRAINT "course_instances_academic_year_id_academic_years_id_fk" FOREIGN KEY ("academic_year_id") REFERENCES "public"."academic_years"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "course_instances_schedule_days" ADD CONSTRAINT "course_instances_schedule_days_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."course_instances"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "course_instances_rels" ADD CONSTRAINT "course_instances_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."course_instances"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "course_instances_rels" ADD CONSTRAINT "course_instances_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "assessment_templates" ADD CONSTRAINT "assessment_templates_course_instance_id_course_instances_id_fk" FOREIGN KEY ("course_instance_id") REFERENCES "public"."course_instances"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "assessment_templates_rubric" ADD CONSTRAINT "assessment_templates_rubric_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."assessment_templates"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "assessments" ADD CONSTRAINT "assessments_assessment_template_id_assessment_templates_id_fk" FOREIGN KEY ("assessment_template_id") REFERENCES "public"."assessment_templates"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_instance_id_course_instances_id_fk" FOREIGN KEY ("course_instance_id") REFERENCES "public"."course_instances"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "scores" ADD CONSTRAINT "scores_assessment_id_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "scores" ADD CONSTRAINT "scores_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "scores" ADD CONSTRAINT "scores_graded_by_id_users_id_fk" FOREIGN KEY ("graded_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "grade_aggregates" ADD CONSTRAINT "grade_aggregates_enrollment_id_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "grade_aggregates" ADD CONSTRAINT "grade_aggregates_calculated_by_id_users_id_fk" FOREIGN KEY ("calculated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "grade_aggregates_assessment_breakdown" ADD CONSTRAINT "grade_aggregates_assessment_breakdown_assessment_template_id_assessment_templates_id_fk" FOREIGN KEY ("assessment_template_id") REFERENCES "public"."assessment_templates"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "grade_aggregates_assessment_breakdown" ADD CONSTRAINT "grade_aggregates_assessment_breakdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."grade_aggregates"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD CONSTRAINT "users_university_id_universities_id_fk" FOREIGN KEY ("university_id") REFERENCES "public"."universities"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD CONSTRAINT "users_faculty_id_faculties_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculties"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD CONSTRAINT "users_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD CONSTRAINT "users_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);

  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "users" ADD CONSTRAINT "users_program_year_id_program_years_id_fk" FOREIGN KEY ("program_year_id") REFERENCES "public"."program_years"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
  `);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Drop all Campusnet tables
  await db.execute(sql`
   DROP TABLE IF EXISTS "grade_aggregates_assessment_breakdown";
   DROP TABLE IF EXISTS "grade_aggregates";
   DROP TABLE IF EXISTS "scores";
   DROP TABLE IF EXISTS "enrollments";
   DROP TABLE IF EXISTS "assessments";
   DROP TABLE IF EXISTS "assessment_templates_rubric";
   DROP TABLE IF EXISTS "assessment_templates";
   DROP TABLE IF EXISTS "course_instances_rels";
   DROP TABLE IF EXISTS "course_instances_schedule_days";
   DROP TABLE IF EXISTS "course_instances";
   DROP TABLE IF EXISTS "course_variations";
   DROP TABLE IF EXISTS "courses_rels";
   DROP TABLE IF EXISTS "courses_learning_outcomes";
   DROP TABLE IF EXISTS "courses";
   DROP TABLE IF EXISTS "program_years";
   DROP TABLE IF EXISTS "programs";
   DROP TABLE IF EXISTS "diploma_levels";
   DROP TABLE IF EXISTS "departments";
   DROP TABLE IF EXISTS "faculties";
   DROP TABLE IF EXISTS "universities";
   DROP TABLE IF EXISTS "academic_calendars_important_dates";
   DROP TABLE IF EXISTS "academic_calendars";
   DROP TABLE IF EXISTS "academic_years_semesters";
   DROP TABLE IF EXISTS "academic_years";
   DROP TABLE IF EXISTS "grading_scales_grade_mappings";
   DROP TABLE IF EXISTS "grading_scales";
  `);

  // Drop all enum types
  await db.execute(sql`
   DROP TYPE IF EXISTS "enum_grade_aggregates_calculation_method";
   DROP TYPE IF EXISTS "enum_grade_aggregates_pass_fail";
   DROP TYPE IF EXISTS "enum_enrollments_enrollment_type";
   DROP TYPE IF EXISTS "enum_enrollments_status";
   DROP TYPE IF EXISTS "enum_assessments_status";
   DROP TYPE IF EXISTS "enum_assessment_templates_assessment_type";
   DROP TYPE IF EXISTS "enum_academic_calendars_important_dates_type";
   DROP TYPE IF EXISTS "enum_grading_scales_scale_type";
   DROP TYPE IF EXISTS "enum_course_instances_status";
   DROP TYPE IF EXISTS "enum_course_instances_schedule_days";
   DROP TYPE IF EXISTS "enum_course_variations_locale";
   DROP TYPE IF EXISTS "enum_courses_course_type";
   DROP TYPE IF EXISTS "enum_diploma_levels_level";
   DROP TYPE IF EXISTS "enum_universities_configuration_report_config_export_format";
   DROP TYPE IF EXISTS "enum_universities_configuration_assess_windows_late_policy";
   DROP TYPE IF EXISTS "enum_universities_configuration_retake_policy_cap_rule";
   DROP TYPE IF EXISTS "enum_universities_configuration_retake_policy_weight_repl";
   DROP TYPE IF EXISTS "enum_universities_configuration_rounding_rule";
   DROP TYPE IF EXISTS "enum_universities_locale";
   DROP TYPE IF EXISTS "enum_users_permissions_scope";
   DROP TYPE IF EXISTS "enum_users_academic_info_status";
   DROP TYPE IF EXISTS "enum_users_role";
  `);

  // Remove added user columns
  await db.execute(sql`
   ALTER TABLE "users" DROP COLUMN IF EXISTS "last_login_at";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "is_active";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "permissions_scope";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "permissions_can_view_reports";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "permissions_can_grade";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "permissions_can_manage_courses";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "permissions_can_manage_users";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "permissions_can_impersonate";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "academic_info_total_credits_earned";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "academic_info_gpa";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "academic_info_status";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "academic_info_expected_graduation";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "academic_info_enrollment_date";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "profile_emergency_contact_email";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "profile_emergency_contact_phone";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "profile_emergency_contact_relationship";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "profile_emergency_contact_name";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "profile_address";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "profile_phone";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "profile_date_of_birth";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "program_year_id";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "program_id";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "department_id";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "faculty_id";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "university_id";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "role";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "employee_id";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "student_id";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "last_name";
   ALTER TABLE "users" DROP COLUMN IF EXISTS "first_name";
  `);
}