import path from "node:path";
import { fileURLToPath } from "node:url";
import { vercelPostgresAdapter } from "@payloadcms/db-vercel-postgres";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { buildConfig, type PayloadRequest } from "payload";
import sharp from "sharp"; // sharp-import
import { defaultLexical } from "@/fields/defaultLexical";
import { AcademicCalendar } from "./collections/AcademicCalendar";
import { AcademicYear } from "./collections/AcademicYear";
import { Assessment } from "./collections/Assessment";
import { AssessmentTemplate } from "./collections/AssessmentTemplate";
import { Categories } from "./collections/Categories";
import { Course } from "./collections/Course";
import { CourseInstance } from "./collections/CourseInstance";
import { CourseVariation } from "./collections/CourseVariation";
import { Department } from "./collections/Department";
import { DiplomaLevel } from "./collections/DiplomaLevel";
import { Enrollment } from "./collections/Enrollment";
import { Faculty } from "./collections/Faculty";
import { GradeAggregate } from "./collections/GradeAggregate";
import { GradingScale } from "./collections/GradingScale";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";
import { Posts } from "./collections/Posts";
import { Program } from "./collections/Program";
import { ProgramYear } from "./collections/ProgramYear";
import { Score } from "./collections/Score";
import { University } from "./collections/University";
import { Users } from "./collections/Users";
import {
	calculateGradeEndpoint,
	calculateStudentGPAEndpoint,
	enrollStudentEndpoint,
	submitScoreEndpoint,
	updateGradeAggregateEndpoint,
} from "./endpoints/campusnet";
import {
	generateFacultySummaryEndpoint,
	generateStudentReportEndpoint,
} from "./endpoints/reports";
import { seedCampusnetEndpoint } from "./endpoints/seed";
import { resetAndSeedEndpoint } from "./endpoints/seed/reset-and-seed";
import { Footer } from "./Footer/config";
import { Header } from "./Header/config";
import { plugins } from "./plugins";
import { getServerSideURL } from "./utilities/getURL";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
	admin: {
		components: {
			// The `BeforeLogin` component renders a message that you see while logging into your admin panel.
			// Feel free to delete this at any time. Simply remove the line below.
			beforeLogin: ["@/components/BeforeLogin"],
			// The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
			// Feel free to delete this at any time. Simply remove the line below.
			beforeDashboard: ["@/components/BeforeDashboard"],
		},
		importMap: {
			baseDir: path.resolve(dirname),
		},
		user: Users.slug,
		livePreview: {
			breakpoints: [
				{
					label: "Mobile",
					name: "mobile",
					width: 375,
					height: 667,
				},
				{
					label: "Tablet",
					name: "tablet",
					width: 768,
					height: 1024,
				},
				{
					label: "Desktop",
					name: "desktop",
					width: 1440,
					height: 900,
				},
			],
		},
	},
	// This config helps us configure global or default features that the other editors can inherit
	editor: defaultLexical,
	db: vercelPostgresAdapter({
		pool: {
			connectionString: process.env.POSTGRES_URL || "",
		},
	}),
	collections: [
		Pages,
		Posts,
		Media,
		Categories,
		Users,
		University,
		Faculty,
		Department,
		DiplomaLevel,
		Program,
		AcademicYear,
		ProgramYear,
		Course,
		CourseVariation,
		CourseInstance,
		GradingScale,
		AcademicCalendar,
		AssessmentTemplate,
		Assessment,
		Enrollment,
		Score,
		GradeAggregate,
	],
	cors: [getServerSideURL()].filter(Boolean),
	globals: [Header, Footer],
	plugins: [
		...plugins,
		vercelBlobStorage({
			collections: {
				media: true,
			},
			token: process.env.BLOB_READ_WRITE_TOKEN || "",
		}),
	],
	secret: process.env.PAYLOAD_SECRET,
	sharp,
	typescript: {
		outputFile: path.resolve(dirname, "payload-types.ts"),
	},
	endpoints: [
		calculateGradeEndpoint,
		updateGradeAggregateEndpoint,
		calculateStudentGPAEndpoint,
		enrollStudentEndpoint,
		submitScoreEndpoint,
		seedCampusnetEndpoint,
		resetAndSeedEndpoint,
		generateStudentReportEndpoint,
		generateFacultySummaryEndpoint,
	],
	jobs: {
		access: {
			run: ({ req }: { req: PayloadRequest }): boolean => {
				// Allow logged in users to execute this endpoint (default)
				if (req.user) return true;

				// If there is no logged in user, then check
				// for the Vercel Cron secret to be present as an
				// Authorization header:
				const authHeader = req.headers.get("authorization");
				return authHeader === `Bearer ${process.env.CRON_SECRET}`;
			},
		},
		tasks: [],
	},
});
