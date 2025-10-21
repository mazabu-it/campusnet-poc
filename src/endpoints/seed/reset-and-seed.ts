import type { Endpoint } from "payload";
import { seedCampusnetDemoData } from "./campusnet-demo-seed";

export const resetAndSeedEndpoint: Endpoint = {
	path: "/reset-and-seed",
	method: "post",
	handler: async (req) => {
		try {
			console.log("🔄 Starting database reset and demo seeding...");

			// Clear all Campusnet data (in reverse dependency order)
			console.log("🗑️ Clearing existing data...");

			// Clear grade aggregates
			const gradeAggregates = await req.payload.find({
				collection: "grade-aggregates",
				limit: 1000,
			});
			for (const aggregate of gradeAggregates.docs) {
				await req.payload.delete({
					collection: "grade-aggregates",
					id: aggregate.id,
				});
			}

			// Clear scores
			const scores = await req.payload.find({
				collection: "scores",
				limit: 1000,
			});
			for (const score of scores.docs) {
				await req.payload.delete({
					collection: "scores",
					id: score.id,
				});
			}

			// Clear enrollments
			const enrollments = await req.payload.find({
				collection: "enrollments",
				limit: 1000,
			});
			for (const enrollment of enrollments.docs) {
				await req.payload.delete({
					collection: "enrollments",
					id: enrollment.id,
				});
			}

			// Clear assessments
			const assessments = await req.payload.find({
				collection: "assessments",
				limit: 1000,
			});
			for (const assessment of assessments.docs) {
				await req.payload.delete({
					collection: "assessments",
					id: assessment.id,
				});
			}

			// Clear assessment templates
			const assessmentTemplates = await req.payload.find({
				collection: "assessment-templates",
				limit: 1000,
			});
			for (const template of assessmentTemplates.docs) {
				await req.payload.delete({
					collection: "assessment-templates",
					id: template.id,
				});
			}

			// Clear course instances
			const courseInstances = await req.payload.find({
				collection: "course-instances",
				limit: 1000,
			});
			for (const instance of courseInstances.docs) {
				await req.payload.delete({
					collection: "course-instances",
					id: instance.id,
				});
			}

			// Clear course variations
			const courseVariations = await req.payload.find({
				collection: "course-variations",
				limit: 1000,
			});
			for (const variation of courseVariations.docs) {
				await req.payload.delete({
					collection: "course-variations",
					id: variation.id,
				});
			}

			// Clear courses
			const courses = await req.payload.find({
				collection: "courses",
				limit: 1000,
			});
			for (const course of courses.docs) {
				await req.payload.delete({
					collection: "courses",
					id: course.id,
				});
			}

			// Clear program years
			const programYears = await req.payload.find({
				collection: "program-years",
				limit: 1000,
			});
			for (const year of programYears.docs) {
				await req.payload.delete({
					collection: "program-years",
					id: year.id,
				});
			}

			// Clear programs
			const programs = await req.payload.find({
				collection: "programs",
				limit: 1000,
			});
			for (const program of programs.docs) {
				await req.payload.delete({
					collection: "programs",
					id: program.id,
				});
			}

			// Clear departments
			const departments = await req.payload.find({
				collection: "departments",
				limit: 1000,
			});
			for (const department of departments.docs) {
				await req.payload.delete({
					collection: "departments",
					id: department.id,
				});
			}

			// Clear faculties
			const faculties = await req.payload.find({
				collection: "faculties",
				limit: 1000,
			});
			for (const faculty of faculties.docs) {
				await req.payload.delete({
					collection: "faculties",
					id: faculty.id,
				});
			}

			// Clear academic calendars
			const academicCalendars = await req.payload.find({
				collection: "academic-calendars",
				limit: 1000,
			});
			for (const calendar of academicCalendars.docs) {
				await req.payload.delete({
					collection: "academic-calendars",
					id: calendar.id,
				});
			}

			// Clear academic years
			const academicYears = await req.payload.find({
				collection: "academic-years",
				limit: 1000,
			});
			for (const year of academicYears.docs) {
				await req.payload.delete({
					collection: "academic-years",
					id: year.id,
				});
			}

			// Clear universities
			const universities = await req.payload.find({
				collection: "universities",
				limit: 1000,
			});
			for (const university of universities.docs) {
				await req.payload.delete({
					collection: "universities",
					id: university.id,
				});
			}

			// Clear grading scales
			const gradingScales = await req.payload.find({
				collection: "grading-scales",
				limit: 1000,
			});
			for (const scale of gradingScales.docs) {
				await req.payload.delete({
					collection: "grading-scales",
					id: scale.id,
				});
			}

			// Clear diploma levels
			const diplomaLevels = await req.payload.find({
				collection: "diploma-levels",
				limit: 1000,
			});
			for (const level of diplomaLevels.docs) {
				await req.payload.delete({
					collection: "diploma-levels",
					id: level.id,
				});
			}

			// Clear Campusnet users (keep admin users)
			const campusnetUsers = await req.payload.find({
				collection: "users",
				where: {
					role: {
						in: [
							"professor",
							"assistant",
							"student",
							"faculty-staff",
							"department-staff",
							"rector-dean",
						],
					},
				},
				limit: 1000,
			});
			for (const user of campusnetUsers.docs) {
				await req.payload.delete({
					collection: "users",
					id: user.id,
				});
			}

			console.log("✅ Database cleared successfully!");

			// Now seed with demo data
			console.log("🌱 Seeding demo data...");
			await seedCampusnetDemoData(req.payload);

			return Response.json({
				success: true,
				message: "Database reset and demo data seeded successfully!",
				data: {
					cleared: {
						gradeAggregates: gradeAggregates.docs.length,
						scores: scores.docs.length,
						enrollments: enrollments.docs.length,
						assessments: assessments.docs.length,
						assessmentTemplates: assessmentTemplates.docs.length,
						courseInstances: courseInstances.docs.length,
						courseVariations: courseVariations.docs.length,
						courses: courses.docs.length,
						programYears: programYears.docs.length,
						programs: programs.docs.length,
						departments: departments.docs.length,
						faculties: faculties.docs.length,
						academicCalendars: academicCalendars.docs.length,
						academicYears: academicYears.docs.length,
						universities: universities.docs.length,
						gradingScales: gradingScales.docs.length,
						diplomaLevels: diplomaLevels.docs.length,
						campusnetUsers: campusnetUsers.docs.length,
					},
				},
			});
		} catch (error) {
			console.error("Error resetting and seeding database:", error);
			return Response.json(
				{
					success: false,
					error: "Failed to reset and seed database",
					details: error instanceof Error ? error.message : "Unknown error",
				},
				{ status: 500 },
			);
		}
	},
};
