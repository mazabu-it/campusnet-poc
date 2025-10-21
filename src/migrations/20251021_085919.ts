import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('super-admin', 'admin', 'rector-dean', 'faculty-staff', 'department-staff', 'professor', 'assistant', 'student');
  CREATE TYPE "public"."enum_users_academic_info_status" AS ENUM('active', 'inactive', 'graduated', 'withdrawn', 'suspended');
  CREATE TYPE "public"."enum_users_permissions_scope" AS ENUM('university', 'faculty', 'department', 'program', 'course', 'self');
  CREATE TYPE "public"."enum_universities_locale" AS ENUM('en', 'nl', 'fr', 'de');
  CREATE TYPE "public"."enum_universities_configuration_rounding_rule" AS ENUM('bankers', 'round-half-up', 'round-half-down');
  CREATE TYPE "public"."enum_universities_configuration_retake_policy_weight_repl" AS ENUM('replace', 'average', 'best');
  CREATE TYPE "public"."enum_universities_configuration_retake_policy_cap_rule" AS ENUM('none', 'pass-cap', 'max-cap');
  CREATE TYPE "public"."enum_universities_configuration_assess_windows_late_policy" AS ENUM('allow', 'penalty', 'deny');
  CREATE TYPE "public"."enum_universities_configuration_report_config_export_format" AS ENUM('pdf', 'pdf-excel');
  CREATE TYPE "public"."enum_diploma_levels_level" AS ENUM('bachelor', 'master', 'phd', 'certificate', 'diploma', 'other');
  CREATE TYPE "public"."enum_courses_course_type" AS ENUM('required', 'elective', 'optional');
  CREATE TYPE "public"."enum_course_variations_locale" AS ENUM('en', 'nl', 'fr', 'de');
  CREATE TYPE "public"."enum_course_instances_schedule_days" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  CREATE TYPE "public"."enum_course_instances_status" AS ENUM('planning', 'open', 'closed', 'in-progress', 'completed', 'cancelled');
  CREATE TYPE "public"."enum_grading_scales_scale_type" AS ENUM('numeric-100', 'numeric-20', 'letter', 'pass-fail', 'custom');
  CREATE TYPE "public"."enum_academic_calendars_important_dates_type" AS ENUM('enrollment-start', 'enrollment-end', 'classes-start', 'classes-end', 'exam-start', 'exam-end', 'grade-deadline', 'holiday', 'other');
  CREATE TYPE "public"."enum_assessment_templates_assessment_type" AS ENUM('exam', 'quiz', 'assignment', 'project', 'presentation', 'lab', 'participation', 'other');
  CREATE TYPE "public"."enum_assessments_status" AS ENUM('draft', 'open', 'locked', 'published');
  CREATE TYPE "public"."enum_enrollments_status" AS ENUM('pending', 'active', 'dropped', 'completed', 'failed', 'withdrawn');
  CREATE TYPE "public"."enum_enrollments_enrollment_type" AS ENUM('required', 'elective', 'optional');
  CREATE TYPE "public"."enum_grade_aggregates_pass_fail" AS ENUM('pass', 'fail', 'incomplete');
  CREATE TYPE "public"."enum_grade_aggregates_calculation_method" AS ENUM('weighted-average', 'simple-average', 'best-score', 'manual-override');
  CREATE TABLE "universities" (
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
  
  CREATE TABLE "faculties" (
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
  
  CREATE TABLE "departments" (
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
  
  CREATE TABLE "diploma_levels" (
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
  
  CREATE TABLE "programs" (
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
  
  CREATE TABLE "academic_years_semesters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"end_date" timestamp(3) with time zone NOT NULL,
  	"is_active" boolean DEFAULT true
  );
  
  CREATE TABLE "academic_years" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"year_label" varchar NOT NULL,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"end_date" timestamp(3) with time zone NOT NULL,
  	"is_active" boolean DEFAULT true,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "program_years" (
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
  
  CREATE TABLE "courses_learning_outcomes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"outcome" varchar NOT NULL
  );
  
  CREATE TABLE "courses" (
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
  
  CREATE TABLE "courses_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"courses_id" integer
  );
  
  CREATE TABLE "course_variations" (
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
  
  CREATE TABLE "course_instances_schedule_days" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_course_instances_schedule_days",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "course_instances" (
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
  
  CREATE TABLE "course_instances_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "grading_scales_grade_mappings" (
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
  
  CREATE TABLE "grading_scales" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"scale_type" "enum_grading_scales_scale_type" NOT NULL,
  	"pass_threshold" numeric NOT NULL,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "academic_calendars_important_dates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"type" "enum_academic_calendars_important_dates_type" NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "academic_calendars" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"academic_year_id" integer NOT NULL,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "assessment_templates_rubric" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"criteria" varchar NOT NULL,
  	"description" varchar,
  	"max_points" numeric NOT NULL
  );
  
  CREATE TABLE "assessment_templates" (
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
  
  CREATE TABLE "assessments" (
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
  
  CREATE TABLE "enrollments" (
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
  
  CREATE TABLE "scores" (
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
  
  CREATE TABLE "grade_aggregates_assessment_breakdown" (
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
  
  CREATE TABLE "grade_aggregates" (
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
  
  ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "users" ADD COLUMN "first_name" varchar;
  ALTER TABLE "users" ADD COLUMN "last_name" varchar;
  ALTER TABLE "users" ADD COLUMN "student_id" varchar;
  ALTER TABLE "users" ADD COLUMN "employee_id" varchar;
  ALTER TABLE "users" ADD COLUMN "role" "enum_users_role" NOT NULL;
  ALTER TABLE "users" ADD COLUMN "university_id" integer;
  ALTER TABLE "users" ADD COLUMN "faculty_id" integer;
  ALTER TABLE "users" ADD COLUMN "department_id" integer;
  ALTER TABLE "users" ADD COLUMN "program_id" integer;
  ALTER TABLE "users" ADD COLUMN "program_year_id" integer;
  ALTER TABLE "users" ADD COLUMN "profile_date_of_birth" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "profile_phone" varchar;
  ALTER TABLE "users" ADD COLUMN "profile_address" varchar;
  ALTER TABLE "users" ADD COLUMN "profile_emergency_contact_name" varchar;
  ALTER TABLE "users" ADD COLUMN "profile_emergency_contact_relationship" varchar;
  ALTER TABLE "users" ADD COLUMN "profile_emergency_contact_phone" varchar;
  ALTER TABLE "users" ADD COLUMN "profile_emergency_contact_email" varchar;
  ALTER TABLE "users" ADD COLUMN "academic_info_enrollment_date" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "academic_info_expected_graduation" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "academic_info_status" "enum_users_academic_info_status" DEFAULT 'active';
  ALTER TABLE "users" ADD COLUMN "academic_info_gpa" numeric;
  ALTER TABLE "users" ADD COLUMN "academic_info_total_credits_earned" numeric;
  ALTER TABLE "users" ADD COLUMN "permissions_can_impersonate" boolean DEFAULT false;
  ALTER TABLE "users" ADD COLUMN "permissions_can_manage_users" boolean DEFAULT false;
  ALTER TABLE "users" ADD COLUMN "permissions_can_manage_courses" boolean DEFAULT false;
  ALTER TABLE "users" ADD COLUMN "permissions_can_grade" boolean DEFAULT false;
  ALTER TABLE "users" ADD COLUMN "permissions_can_view_reports" boolean DEFAULT false;
  ALTER TABLE "users" ADD COLUMN "permissions_scope" "enum_users_permissions_scope" DEFAULT 'self';
  ALTER TABLE "users" ADD COLUMN "is_active" boolean DEFAULT true;
  ALTER TABLE "users" ADD COLUMN "last_login_at" timestamp(3) with time zone;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "universities_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "faculties_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "departments_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "diploma_levels_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "programs_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "academic_years_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "program_years_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "courses_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "course_variations_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "course_instances_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "grading_scales_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "academic_calendars_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "assessment_templates_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "assessments_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "enrollments_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "scores_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "grade_aggregates_id" integer;
  ALTER TABLE "universities" ADD CONSTRAINT "universities_grading_scale_id_grading_scales_id_fk" FOREIGN KEY ("grading_scale_id") REFERENCES "public"."grading_scales"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "universities" ADD CONSTRAINT "universities_academic_calendar_id_academic_calendars_id_fk" FOREIGN KEY ("academic_calendar_id") REFERENCES "public"."academic_calendars"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "universities" ADD CONSTRAINT "universities_configuration_report_config_header_branding_id_media_id_fk" FOREIGN KEY ("configuration_report_config_header_branding_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faculties" ADD CONSTRAINT "faculties_university_id_universities_id_fk" FOREIGN KEY ("university_id") REFERENCES "public"."universities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faculties" ADD CONSTRAINT "faculties_dean_id_users_id_fk" FOREIGN KEY ("dean_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "departments" ADD CONSTRAINT "departments_faculty_id_faculties_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculties"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "departments" ADD CONSTRAINT "departments_head_id_users_id_fk" FOREIGN KEY ("head_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs" ADD CONSTRAINT "programs_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs" ADD CONSTRAINT "programs_diploma_level_id_diploma_levels_id_fk" FOREIGN KEY ("diploma_level_id") REFERENCES "public"."diploma_levels"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs" ADD CONSTRAINT "programs_program_director_id_users_id_fk" FOREIGN KEY ("program_director_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "academic_years_semesters" ADD CONSTRAINT "academic_years_semesters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."academic_years"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "program_years" ADD CONSTRAINT "program_years_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses_learning_outcomes" ADD CONSTRAINT "courses_learning_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses" ADD CONSTRAINT "courses_owning_department_id_departments_id_fk" FOREIGN KEY ("owning_department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses_rels" ADD CONSTRAINT "courses_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_rels" ADD CONSTRAINT "courses_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "course_variations" ADD CONSTRAINT "course_variations_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "course_variations" ADD CONSTRAINT "course_variations_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "course_variations" ADD CONSTRAINT "course_variations_program_year_id_program_years_id_fk" FOREIGN KEY ("program_year_id") REFERENCES "public"."program_years"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "course_instances_schedule_days" ADD CONSTRAINT "course_instances_schedule_days_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."course_instances"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "course_instances" ADD CONSTRAINT "course_instances_course_variation_id_course_variations_id_fk" FOREIGN KEY ("course_variation_id") REFERENCES "public"."course_variations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "course_instances" ADD CONSTRAINT "course_instances_academic_year_id_academic_years_id_fk" FOREIGN KEY ("academic_year_id") REFERENCES "public"."academic_years"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "course_instances_rels" ADD CONSTRAINT "course_instances_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."course_instances"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "course_instances_rels" ADD CONSTRAINT "course_instances_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "grading_scales_grade_mappings" ADD CONSTRAINT "grading_scales_grade_mappings_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."grading_scales"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "academic_calendars_important_dates" ADD CONSTRAINT "academic_calendars_important_dates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."academic_calendars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "academic_calendars" ADD CONSTRAINT "academic_calendars_academic_year_id_academic_years_id_fk" FOREIGN KEY ("academic_year_id") REFERENCES "public"."academic_years"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "assessment_templates_rubric" ADD CONSTRAINT "assessment_templates_rubric_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."assessment_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "assessment_templates" ADD CONSTRAINT "assessment_templates_course_instance_id_course_instances_id_fk" FOREIGN KEY ("course_instance_id") REFERENCES "public"."course_instances"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "assessments" ADD CONSTRAINT "assessments_assessment_template_id_assessment_templates_id_fk" FOREIGN KEY ("assessment_template_id") REFERENCES "public"."assessment_templates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_instance_id_course_instances_id_fk" FOREIGN KEY ("course_instance_id") REFERENCES "public"."course_instances"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "scores" ADD CONSTRAINT "scores_assessment_id_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "scores" ADD CONSTRAINT "scores_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "scores" ADD CONSTRAINT "scores_graded_by_id_users_id_fk" FOREIGN KEY ("graded_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "grade_aggregates_assessment_breakdown" ADD CONSTRAINT "grade_aggregates_assessment_breakdown_assessment_template_id_assessment_templates_id_fk" FOREIGN KEY ("assessment_template_id") REFERENCES "public"."assessment_templates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "grade_aggregates_assessment_breakdown" ADD CONSTRAINT "grade_aggregates_assessment_breakdown_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."grade_aggregates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "grade_aggregates" ADD CONSTRAINT "grade_aggregates_enrollment_id_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "grade_aggregates" ADD CONSTRAINT "grade_aggregates_calculated_by_id_users_id_fk" FOREIGN KEY ("calculated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "universities_code_idx" ON "universities" USING btree ("code");
  CREATE INDEX "universities_grading_scale_idx" ON "universities" USING btree ("grading_scale_id");
  CREATE INDEX "universities_academic_calendar_idx" ON "universities" USING btree ("academic_calendar_id");
  CREATE INDEX "universities_configuration_report_config_configuration_r_idx" ON "universities" USING btree ("configuration_report_config_header_branding_id");
  CREATE INDEX "universities_updated_at_idx" ON "universities" USING btree ("updated_at");
  CREATE INDEX "universities_created_at_idx" ON "universities" USING btree ("created_at");
  CREATE INDEX "faculties_university_idx" ON "faculties" USING btree ("university_id");
  CREATE INDEX "faculties_dean_idx" ON "faculties" USING btree ("dean_id");
  CREATE INDEX "faculties_updated_at_idx" ON "faculties" USING btree ("updated_at");
  CREATE INDEX "faculties_created_at_idx" ON "faculties" USING btree ("created_at");
  CREATE INDEX "departments_faculty_idx" ON "departments" USING btree ("faculty_id");
  CREATE INDEX "departments_head_idx" ON "departments" USING btree ("head_id");
  CREATE INDEX "departments_updated_at_idx" ON "departments" USING btree ("updated_at");
  CREATE INDEX "departments_created_at_idx" ON "departments" USING btree ("created_at");
  CREATE UNIQUE INDEX "diploma_levels_code_idx" ON "diploma_levels" USING btree ("code");
  CREATE INDEX "diploma_levels_updated_at_idx" ON "diploma_levels" USING btree ("updated_at");
  CREATE INDEX "diploma_levels_created_at_idx" ON "diploma_levels" USING btree ("created_at");
  CREATE INDEX "programs_department_idx" ON "programs" USING btree ("department_id");
  CREATE INDEX "programs_diploma_level_idx" ON "programs" USING btree ("diploma_level_id");
  CREATE INDEX "programs_program_director_idx" ON "programs" USING btree ("program_director_id");
  CREATE INDEX "programs_updated_at_idx" ON "programs" USING btree ("updated_at");
  CREATE INDEX "programs_created_at_idx" ON "programs" USING btree ("created_at");
  CREATE INDEX "academic_years_semesters_order_idx" ON "academic_years_semesters" USING btree ("_order");
  CREATE INDEX "academic_years_semesters_parent_id_idx" ON "academic_years_semesters" USING btree ("_parent_id");
  CREATE INDEX "academic_years_updated_at_idx" ON "academic_years" USING btree ("updated_at");
  CREATE INDEX "academic_years_created_at_idx" ON "academic_years" USING btree ("created_at");
  CREATE INDEX "program_years_program_idx" ON "program_years" USING btree ("program_id");
  CREATE INDEX "program_years_updated_at_idx" ON "program_years" USING btree ("updated_at");
  CREATE INDEX "program_years_created_at_idx" ON "program_years" USING btree ("created_at");
  CREATE INDEX "courses_learning_outcomes_order_idx" ON "courses_learning_outcomes" USING btree ("_order");
  CREATE INDEX "courses_learning_outcomes_parent_id_idx" ON "courses_learning_outcomes" USING btree ("_parent_id");
  CREATE INDEX "courses_owning_department_idx" ON "courses" USING btree ("owning_department_id");
  CREATE INDEX "courses_updated_at_idx" ON "courses" USING btree ("updated_at");
  CREATE INDEX "courses_created_at_idx" ON "courses" USING btree ("created_at");
  CREATE INDEX "courses_rels_order_idx" ON "courses_rels" USING btree ("order");
  CREATE INDEX "courses_rels_parent_idx" ON "courses_rels" USING btree ("parent_id");
  CREATE INDEX "courses_rels_path_idx" ON "courses_rels" USING btree ("path");
  CREATE INDEX "courses_rels_courses_id_idx" ON "courses_rels" USING btree ("courses_id");
  CREATE INDEX "course_variations_course_idx" ON "course_variations" USING btree ("course_id");
  CREATE INDEX "course_variations_department_idx" ON "course_variations" USING btree ("department_id");
  CREATE INDEX "course_variations_program_year_idx" ON "course_variations" USING btree ("program_year_id");
  CREATE INDEX "course_variations_updated_at_idx" ON "course_variations" USING btree ("updated_at");
  CREATE INDEX "course_variations_created_at_idx" ON "course_variations" USING btree ("created_at");
  CREATE INDEX "course_instances_schedule_days_order_idx" ON "course_instances_schedule_days" USING btree ("order");
  CREATE INDEX "course_instances_schedule_days_parent_idx" ON "course_instances_schedule_days" USING btree ("parent_id");
  CREATE INDEX "course_instances_course_variation_idx" ON "course_instances" USING btree ("course_variation_id");
  CREATE INDEX "course_instances_academic_year_idx" ON "course_instances" USING btree ("academic_year_id");
  CREATE INDEX "course_instances_updated_at_idx" ON "course_instances" USING btree ("updated_at");
  CREATE INDEX "course_instances_created_at_idx" ON "course_instances" USING btree ("created_at");
  CREATE INDEX "course_instances_rels_order_idx" ON "course_instances_rels" USING btree ("order");
  CREATE INDEX "course_instances_rels_parent_idx" ON "course_instances_rels" USING btree ("parent_id");
  CREATE INDEX "course_instances_rels_path_idx" ON "course_instances_rels" USING btree ("path");
  CREATE INDEX "course_instances_rels_users_id_idx" ON "course_instances_rels" USING btree ("users_id");
  CREATE INDEX "grading_scales_grade_mappings_order_idx" ON "grading_scales_grade_mappings" USING btree ("_order");
  CREATE INDEX "grading_scales_grade_mappings_parent_id_idx" ON "grading_scales_grade_mappings" USING btree ("_parent_id");
  CREATE INDEX "grading_scales_updated_at_idx" ON "grading_scales" USING btree ("updated_at");
  CREATE INDEX "grading_scales_created_at_idx" ON "grading_scales" USING btree ("created_at");
  CREATE INDEX "academic_calendars_important_dates_order_idx" ON "academic_calendars_important_dates" USING btree ("_order");
  CREATE INDEX "academic_calendars_important_dates_parent_id_idx" ON "academic_calendars_important_dates" USING btree ("_parent_id");
  CREATE INDEX "academic_calendars_academic_year_idx" ON "academic_calendars" USING btree ("academic_year_id");
  CREATE INDEX "academic_calendars_updated_at_idx" ON "academic_calendars" USING btree ("updated_at");
  CREATE INDEX "academic_calendars_created_at_idx" ON "academic_calendars" USING btree ("created_at");
  CREATE INDEX "assessment_templates_rubric_order_idx" ON "assessment_templates_rubric" USING btree ("_order");
  CREATE INDEX "assessment_templates_rubric_parent_id_idx" ON "assessment_templates_rubric" USING btree ("_parent_id");
  CREATE INDEX "assessment_templates_course_instance_idx" ON "assessment_templates" USING btree ("course_instance_id");
  CREATE INDEX "assessment_templates_updated_at_idx" ON "assessment_templates" USING btree ("updated_at");
  CREATE INDEX "assessment_templates_created_at_idx" ON "assessment_templates" USING btree ("created_at");
  CREATE INDEX "assessments_assessment_template_idx" ON "assessments" USING btree ("assessment_template_id");
  CREATE INDEX "assessments_updated_at_idx" ON "assessments" USING btree ("updated_at");
  CREATE INDEX "assessments_created_at_idx" ON "assessments" USING btree ("created_at");
  CREATE INDEX "enrollments_student_idx" ON "enrollments" USING btree ("student_id");
  CREATE INDEX "enrollments_course_instance_idx" ON "enrollments" USING btree ("course_instance_id");
  CREATE INDEX "enrollments_updated_at_idx" ON "enrollments" USING btree ("updated_at");
  CREATE INDEX "enrollments_created_at_idx" ON "enrollments" USING btree ("created_at");
  CREATE INDEX "scores_assessment_idx" ON "scores" USING btree ("assessment_id");
  CREATE INDEX "scores_student_idx" ON "scores" USING btree ("student_id");
  CREATE INDEX "scores_graded_by_idx" ON "scores" USING btree ("graded_by_id");
  CREATE INDEX "scores_updated_at_idx" ON "scores" USING btree ("updated_at");
  CREATE INDEX "scores_created_at_idx" ON "scores" USING btree ("created_at");
  CREATE INDEX "grade_aggregates_assessment_breakdown_order_idx" ON "grade_aggregates_assessment_breakdown" USING btree ("_order");
  CREATE INDEX "grade_aggregates_assessment_breakdown_parent_id_idx" ON "grade_aggregates_assessment_breakdown" USING btree ("_parent_id");
  CREATE INDEX "grade_aggregates_assessment_breakdown_assessment_templat_idx" ON "grade_aggregates_assessment_breakdown" USING btree ("assessment_template_id");
  CREATE INDEX "grade_aggregates_enrollment_idx" ON "grade_aggregates" USING btree ("enrollment_id");
  CREATE INDEX "grade_aggregates_calculated_by_idx" ON "grade_aggregates" USING btree ("calculated_by_id");
  CREATE INDEX "grade_aggregates_updated_at_idx" ON "grade_aggregates" USING btree ("updated_at");
  CREATE INDEX "grade_aggregates_created_at_idx" ON "grade_aggregates" USING btree ("created_at");
  ALTER TABLE "users" ADD CONSTRAINT "users_university_id_universities_id_fk" FOREIGN KEY ("university_id") REFERENCES "public"."universities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_faculty_id_faculties_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculties"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_program_year_id_program_years_id_fk" FOREIGN KEY ("program_year_id") REFERENCES "public"."program_years"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_universities_fk" FOREIGN KEY ("universities_id") REFERENCES "public"."universities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faculties_fk" FOREIGN KEY ("faculties_id") REFERENCES "public"."faculties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_departments_fk" FOREIGN KEY ("departments_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_diploma_levels_fk" FOREIGN KEY ("diploma_levels_id") REFERENCES "public"."diploma_levels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_programs_fk" FOREIGN KEY ("programs_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_academic_years_fk" FOREIGN KEY ("academic_years_id") REFERENCES "public"."academic_years"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_program_years_fk" FOREIGN KEY ("program_years_id") REFERENCES "public"."program_years"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_course_variations_fk" FOREIGN KEY ("course_variations_id") REFERENCES "public"."course_variations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_course_instances_fk" FOREIGN KEY ("course_instances_id") REFERENCES "public"."course_instances"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_grading_scales_fk" FOREIGN KEY ("grading_scales_id") REFERENCES "public"."grading_scales"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_academic_calendars_fk" FOREIGN KEY ("academic_calendars_id") REFERENCES "public"."academic_calendars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_assessment_templates_fk" FOREIGN KEY ("assessment_templates_id") REFERENCES "public"."assessment_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_assessments_fk" FOREIGN KEY ("assessments_id") REFERENCES "public"."assessments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enrollments_fk" FOREIGN KEY ("enrollments_id") REFERENCES "public"."enrollments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_scores_fk" FOREIGN KEY ("scores_id") REFERENCES "public"."scores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_grade_aggregates_fk" FOREIGN KEY ("grade_aggregates_id") REFERENCES "public"."grade_aggregates"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_university_idx" ON "users" USING btree ("university_id");
  CREATE INDEX "users_faculty_idx" ON "users" USING btree ("faculty_id");
  CREATE INDEX "users_department_idx" ON "users" USING btree ("department_id");
  CREATE INDEX "users_program_idx" ON "users" USING btree ("program_id");
  CREATE INDEX "users_program_year_idx" ON "users" USING btree ("program_year_id");
  CREATE INDEX "payload_locked_documents_rels_universities_id_idx" ON "payload_locked_documents_rels" USING btree ("universities_id");
  CREATE INDEX "payload_locked_documents_rels_faculties_id_idx" ON "payload_locked_documents_rels" USING btree ("faculties_id");
  CREATE INDEX "payload_locked_documents_rels_departments_id_idx" ON "payload_locked_documents_rels" USING btree ("departments_id");
  CREATE INDEX "payload_locked_documents_rels_diploma_levels_id_idx" ON "payload_locked_documents_rels" USING btree ("diploma_levels_id");
  CREATE INDEX "payload_locked_documents_rels_programs_id_idx" ON "payload_locked_documents_rels" USING btree ("programs_id");
  CREATE INDEX "payload_locked_documents_rels_academic_years_id_idx" ON "payload_locked_documents_rels" USING btree ("academic_years_id");
  CREATE INDEX "payload_locked_documents_rels_program_years_id_idx" ON "payload_locked_documents_rels" USING btree ("program_years_id");
  CREATE INDEX "payload_locked_documents_rels_courses_id_idx" ON "payload_locked_documents_rels" USING btree ("courses_id");
  CREATE INDEX "payload_locked_documents_rels_course_variations_id_idx" ON "payload_locked_documents_rels" USING btree ("course_variations_id");
  CREATE INDEX "payload_locked_documents_rels_course_instances_id_idx" ON "payload_locked_documents_rels" USING btree ("course_instances_id");
  CREATE INDEX "payload_locked_documents_rels_grading_scales_id_idx" ON "payload_locked_documents_rels" USING btree ("grading_scales_id");
  CREATE INDEX "payload_locked_documents_rels_academic_calendars_id_idx" ON "payload_locked_documents_rels" USING btree ("academic_calendars_id");
  CREATE INDEX "payload_locked_documents_rels_assessment_templates_id_idx" ON "payload_locked_documents_rels" USING btree ("assessment_templates_id");
  CREATE INDEX "payload_locked_documents_rels_assessments_id_idx" ON "payload_locked_documents_rels" USING btree ("assessments_id");
  CREATE INDEX "payload_locked_documents_rels_enrollments_id_idx" ON "payload_locked_documents_rels" USING btree ("enrollments_id");
  CREATE INDEX "payload_locked_documents_rels_scores_id_idx" ON "payload_locked_documents_rels" USING btree ("scores_id");
  CREATE INDEX "payload_locked_documents_rels_grade_aggregates_id_idx" ON "payload_locked_documents_rels" USING btree ("grade_aggregates_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "universities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "faculties" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "departments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "diploma_levels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "programs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "academic_years_semesters" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "academic_years" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "program_years" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "courses_learning_outcomes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "courses" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "courses_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "course_variations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "course_instances_schedule_days" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "course_instances" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "course_instances_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "grading_scales_grade_mappings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "grading_scales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "academic_calendars_important_dates" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "academic_calendars" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "assessment_templates_rubric" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "assessment_templates" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "assessments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "enrollments" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "scores" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "grade_aggregates_assessment_breakdown" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "grade_aggregates" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "universities" CASCADE;
  DROP TABLE "faculties" CASCADE;
  DROP TABLE "departments" CASCADE;
  DROP TABLE "diploma_levels" CASCADE;
  DROP TABLE "programs" CASCADE;
  DROP TABLE "academic_years_semesters" CASCADE;
  DROP TABLE "academic_years" CASCADE;
  DROP TABLE "program_years" CASCADE;
  DROP TABLE "courses_learning_outcomes" CASCADE;
  DROP TABLE "courses" CASCADE;
  DROP TABLE "courses_rels" CASCADE;
  DROP TABLE "course_variations" CASCADE;
  DROP TABLE "course_instances_schedule_days" CASCADE;
  DROP TABLE "course_instances" CASCADE;
  DROP TABLE "course_instances_rels" CASCADE;
  DROP TABLE "grading_scales_grade_mappings" CASCADE;
  DROP TABLE "grading_scales" CASCADE;
  DROP TABLE "academic_calendars_important_dates" CASCADE;
  DROP TABLE "academic_calendars" CASCADE;
  DROP TABLE "assessment_templates_rubric" CASCADE;
  DROP TABLE "assessment_templates" CASCADE;
  DROP TABLE "assessments" CASCADE;
  DROP TABLE "enrollments" CASCADE;
  DROP TABLE "scores" CASCADE;
  DROP TABLE "grade_aggregates_assessment_breakdown" CASCADE;
  DROP TABLE "grade_aggregates" CASCADE;
  ALTER TABLE "users" DROP CONSTRAINT "users_university_id_universities_id_fk";
  
  ALTER TABLE "users" DROP CONSTRAINT "users_faculty_id_faculties_id_fk";
  
  ALTER TABLE "users" DROP CONSTRAINT "users_department_id_departments_id_fk";
  
  ALTER TABLE "users" DROP CONSTRAINT "users_program_id_programs_id_fk";
  
  ALTER TABLE "users" DROP CONSTRAINT "users_program_year_id_program_years_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_universities_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_faculties_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_departments_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_diploma_levels_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_programs_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_academic_years_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_program_years_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_courses_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_course_variations_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_course_instances_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_grading_scales_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_academic_calendars_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_assessment_templates_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_assessments_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_enrollments_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_scores_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_grade_aggregates_fk";
  
  DROP INDEX "users_university_idx";
  DROP INDEX "users_faculty_idx";
  DROP INDEX "users_department_idx";
  DROP INDEX "users_program_idx";
  DROP INDEX "users_program_year_idx";
  DROP INDEX "payload_locked_documents_rels_universities_id_idx";
  DROP INDEX "payload_locked_documents_rels_faculties_id_idx";
  DROP INDEX "payload_locked_documents_rels_departments_id_idx";
  DROP INDEX "payload_locked_documents_rels_diploma_levels_id_idx";
  DROP INDEX "payload_locked_documents_rels_programs_id_idx";
  DROP INDEX "payload_locked_documents_rels_academic_years_id_idx";
  DROP INDEX "payload_locked_documents_rels_program_years_id_idx";
  DROP INDEX "payload_locked_documents_rels_courses_id_idx";
  DROP INDEX "payload_locked_documents_rels_course_variations_id_idx";
  DROP INDEX "payload_locked_documents_rels_course_instances_id_idx";
  DROP INDEX "payload_locked_documents_rels_grading_scales_id_idx";
  DROP INDEX "payload_locked_documents_rels_academic_calendars_id_idx";
  DROP INDEX "payload_locked_documents_rels_assessment_templates_id_idx";
  DROP INDEX "payload_locked_documents_rels_assessments_id_idx";
  DROP INDEX "payload_locked_documents_rels_enrollments_id_idx";
  DROP INDEX "payload_locked_documents_rels_scores_id_idx";
  DROP INDEX "payload_locked_documents_rels_grade_aggregates_id_idx";
  ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "users" DROP COLUMN "first_name";
  ALTER TABLE "users" DROP COLUMN "last_name";
  ALTER TABLE "users" DROP COLUMN "student_id";
  ALTER TABLE "users" DROP COLUMN "employee_id";
  ALTER TABLE "users" DROP COLUMN "role";
  ALTER TABLE "users" DROP COLUMN "university_id";
  ALTER TABLE "users" DROP COLUMN "faculty_id";
  ALTER TABLE "users" DROP COLUMN "department_id";
  ALTER TABLE "users" DROP COLUMN "program_id";
  ALTER TABLE "users" DROP COLUMN "program_year_id";
  ALTER TABLE "users" DROP COLUMN "profile_date_of_birth";
  ALTER TABLE "users" DROP COLUMN "profile_phone";
  ALTER TABLE "users" DROP COLUMN "profile_address";
  ALTER TABLE "users" DROP COLUMN "profile_emergency_contact_name";
  ALTER TABLE "users" DROP COLUMN "profile_emergency_contact_relationship";
  ALTER TABLE "users" DROP COLUMN "profile_emergency_contact_phone";
  ALTER TABLE "users" DROP COLUMN "profile_emergency_contact_email";
  ALTER TABLE "users" DROP COLUMN "academic_info_enrollment_date";
  ALTER TABLE "users" DROP COLUMN "academic_info_expected_graduation";
  ALTER TABLE "users" DROP COLUMN "academic_info_status";
  ALTER TABLE "users" DROP COLUMN "academic_info_gpa";
  ALTER TABLE "users" DROP COLUMN "academic_info_total_credits_earned";
  ALTER TABLE "users" DROP COLUMN "permissions_can_impersonate";
  ALTER TABLE "users" DROP COLUMN "permissions_can_manage_users";
  ALTER TABLE "users" DROP COLUMN "permissions_can_manage_courses";
  ALTER TABLE "users" DROP COLUMN "permissions_can_grade";
  ALTER TABLE "users" DROP COLUMN "permissions_can_view_reports";
  ALTER TABLE "users" DROP COLUMN "permissions_scope";
  ALTER TABLE "users" DROP COLUMN "is_active";
  ALTER TABLE "users" DROP COLUMN "last_login_at";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "universities_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "faculties_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "departments_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "diploma_levels_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "programs_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "academic_years_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "program_years_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "courses_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "course_variations_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "course_instances_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "grading_scales_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "academic_calendars_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "assessment_templates_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "assessments_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "enrollments_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "scores_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "grade_aggregates_id";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_users_academic_info_status";
  DROP TYPE "public"."enum_users_permissions_scope";
  DROP TYPE "public"."enum_universities_locale";
  DROP TYPE "public"."enum_universities_configuration_rounding_rule";
  DROP TYPE "public"."enum_universities_configuration_retake_policy_weight_repl";
  DROP TYPE "public"."enum_universities_configuration_retake_policy_cap_rule";
  DROP TYPE "public"."enum_universities_configuration_assess_windows_late_policy";
  DROP TYPE "public"."enum_universities_configuration_report_config_export_format";
  DROP TYPE "public"."enum_diploma_levels_level";
  DROP TYPE "public"."enum_courses_course_type";
  DROP TYPE "public"."enum_course_variations_locale";
  DROP TYPE "public"."enum_course_instances_schedule_days";
  DROP TYPE "public"."enum_course_instances_status";
  DROP TYPE "public"."enum_grading_scales_scale_type";
  DROP TYPE "public"."enum_academic_calendars_important_dates_type";
  DROP TYPE "public"."enum_assessment_templates_assessment_type";
  DROP TYPE "public"."enum_assessments_status";
  DROP TYPE "public"."enum_enrollments_status";
  DROP TYPE "public"."enum_enrollments_enrollment_type";
  DROP TYPE "public"."enum_grade_aggregates_pass_fail";
  DROP TYPE "public"."enum_grade_aggregates_calculation_method";`)
}
