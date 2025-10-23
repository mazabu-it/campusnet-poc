import type { Endpoint } from "payload";
import { seedCampusnetUnifiedData } from "./unified-seed";

export const resetAndSeedEndpoint: Endpoint = {
	path: "/reset-and-seed",
	method: "post",
	handler: async (req) => {
		try {
			console.log(
				"🔄 Starting complete database reset and demo seeding...",
			);
			console.log(
				"📊 This will create comprehensive demo data with realistic scores on 20-point scale",
			);

			// Clear all Campusnet data (in correct dependency order)
			console.log("🗑️ Clearing existing data...");

			// First, clear all dependent data in correct order
			// 1. Delete grade aggregates first (they reference enrollments)
			const gradeAggregates = await req.payload.find({
				collection: "grade-aggregates",
				limit: 1000,
			});
			for (const aggregate of gradeAggregates.docs) {
				try {
					await req.payload.delete({
						collection: "grade-aggregates",
						id: aggregate.id,
					});
				} catch (error) {
					console.log(
						`Failed to delete grade aggregate ${aggregate.id}:`,
						error,
					);
				}
			}

			// 2. Delete scores (they reference assessments and students)
			const scores = await req.payload.find({
				collection: "scores",
				limit: 1000,
			});
			for (const score of scores.docs) {
				try {
					await req.payload.delete({
						collection: "scores",
						id: score.id,
					});
				} catch (error) {
					console.log(`Failed to delete score ${score.id}:`, error);
				}
			}

			// 3. Delete enrollments (they reference students and course instances)
			const enrollments = await req.payload.find({
				collection: "enrollments",
				limit: 1000,
			});
			for (const enrollment of enrollments.docs) {
				try {
					await req.payload.delete({
						collection: "enrollments",
						id: enrollment.id,
					});
				} catch (error) {
					console.log(
						`Failed to delete enrollment ${enrollment.id}:`,
						error,
					);
				}
			}

			// 4. Delete assessments
			const assessments = await req.payload.find({
				collection: "assessments",
				limit: 1000,
			});
			for (const assessment of assessments.docs) {
				try {
					await req.payload.delete({
						collection: "assessments",
						id: assessment.id,
					});
				} catch (error) {
					console.log(
						`Failed to delete assessment ${assessment.id}:`,
						error,
					);
				}
			}

			// 5. Delete assessment templates
			const assessmentTemplates = await req.payload.find({
				collection: "assessment-templates",
				limit: 1000,
			});
			for (const template of assessmentTemplates.docs) {
				try {
					await req.payload.delete({
						collection: "assessment-templates",
						id: template.id,
					});
				} catch (error) {
					console.log(
						`Failed to delete assessment template ${template.id}:`,
						error,
					);
				}
			}

			// 6. Delete course instances
			const courseInstances = await req.payload.find({
				collection: "course-instances",
				limit: 1000,
			});
			for (const instance of courseInstances.docs) {
				try {
					await req.payload.delete({
						collection: "course-instances",
						id: instance.id,
					});
				} catch (error) {
					console.log(
						`Failed to delete course instance ${instance.id}:`,
						error,
					);
				}
			}

			// 7. Delete course variations
			const courseVariations = await req.payload.find({
				collection: "course-variations",
				limit: 1000,
			});
			for (const variation of courseVariations.docs) {
				try {
					await req.payload.delete({
						collection: "course-variations",
						id: variation.id,
					});
				} catch (error) {
					console.log(
						`Failed to delete course variation ${variation.id}:`,
						error,
					);
				}
			}

			// 8. Delete courses
			const courses = await req.payload.find({
				collection: "courses",
				limit: 1000,
			});
			for (const course of courses.docs) {
				try {
					await req.payload.delete({
						collection: "courses",
						id: course.id,
					});
				} catch (error) {
					console.log(`Failed to delete course ${course.id}:`, error);
				}
			}

			// 9. Delete program years
			const programYears = await req.payload.find({
				collection: "program-years",
				limit: 1000,
			});
			for (const programYear of programYears.docs) {
				try {
					await req.payload.delete({
						collection: "program-years",
						id: programYear.id,
					});
				} catch (error) {
					console.log(
						`Failed to delete program year ${programYear.id}:`,
						error,
					);
				}
			}

			// 10. Delete programs
			const programs = await req.payload.find({
				collection: "programs",
				limit: 1000,
			});
			for (const program of programs.docs) {
				try {
					await req.payload.delete({
						collection: "programs",
						id: program.id,
					});
				} catch (error) {
					console.log(
						`Failed to delete program ${program.id}:`,
						error,
					);
				}
			}

			// 11. Delete departments
			const departments = await req.payload.find({
				collection: "departments",
				limit: 1000,
			});
			for (const department of departments.docs) {
				try {
					await req.payload.delete({
						collection: "departments",
						id: department.id,
					});
				} catch (error) {
					console.log(
						`Failed to delete department ${department.id}:`,
						error,
					);
				}
			}

			// 12. Delete faculties
			const faculties = await req.payload.find({
				collection: "faculties",
				limit: 1000,
			});
			for (const faculty of faculties.docs) {
				try {
					await req.payload.delete({
						collection: "faculties",
						id: faculty.id,
					});
				} catch (error) {
					console.log(
						`Failed to delete faculty ${faculty.id}:`,
						error,
					);
				}
			}

			// 13. Delete universities
			const universities = await req.payload.find({
				collection: "universities",
				limit: 1000,
			});
			for (const university of universities.docs) {
				try {
					await req.payload.delete({
						collection: "universities",
						id: university.id,
					});
				} catch (error) {
					console.log(
						`Failed to delete university ${university.id}:`,
						error,
					);
				}
			}

			// 14. Delete academic calendars
			const academicCalendars = await req.payload.find({
				collection: "academic-calendars",
				limit: 1000,
			});
			for (const calendar of academicCalendars.docs) {
				try {
					await req.payload.delete({
						collection: "academic-calendars",
						id: calendar.id,
					});
				} catch (error) {
					console.log(
						`Failed to delete academic calendar ${calendar.id}:`,
						error,
					);
				}
			}

			// 15. Delete academic years
			const academicYears = await req.payload.find({
				collection: "academic-years",
				limit: 1000,
			});
			for (const year of academicYears.docs) {
				try {
					await req.payload.delete({
						collection: "academic-years",
						id: year.id,
					});
				} catch (error) {
					console.log(
						`Failed to delete academic year ${year.id}:`,
						error,
					);
				}
			}

			// 16. Delete grading scales
			const gradingScales = await req.payload.find({
				collection: "grading-scales",
				limit: 1000,
			});
			for (const scale of gradingScales.docs) {
				try {
					await req.payload.delete({
						collection: "grading-scales",
						id: scale.id,
					});
				} catch (error) {
					console.log(
						`Failed to delete grading scale ${scale.id}:`,
						error,
					);
				}
			}

			// 17. Delete diploma levels
			const diplomaLevels = await req.payload.find({
				collection: "diploma-levels",
				limit: 1000,
			});
			for (const level of diplomaLevels.docs) {
				try {
					await req.payload.delete({
						collection: "diploma-levels",
						id: level.id,
					});
				} catch (error) {
					console.log(
						`Failed to delete diploma level ${level.id}:`,
						error,
					);
				}
			}

			// 18. Delete campusnet users
			const campusnetUsers = await req.payload.find({
				collection: "users",
				where: {
					role: {
						in: ["student", "professor"],
					},
				},
				limit: 1000,
			});
			for (const user of campusnetUsers.docs) {
				try {
					await req.payload.delete({
						collection: "users",
						id: user.id,
					});
				} catch (error) {
					console.log(`Failed to delete user ${user.id}:`, error);
				}
			}

			// 19. Delete pages
			const pages = await req.payload.find({
				collection: "pages",
				limit: 1000,
			});
			for (const page of pages.docs) {
				try {
					await req.payload.delete({
						collection: "pages",
						id: page.id,
					});
				} catch (error) {
					console.log(`Failed to delete page ${page.id}:`, error);
				}
			}

			console.log("✅ Database cleared successfully!");

			// Now seed with unified data
			console.log("🌱 Seeding unified data...");
			const seedResult = await seedCampusnetUnifiedData(req.payload);

			return Response.json({
				success: true,
				message:
					"Complete database reset and comprehensive demo data seeded successfully!",
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
						universities: universities.docs.length,
						academicCalendars: academicCalendars.docs.length,
						academicYears: academicYears.docs.length,
						gradingScales: gradingScales.docs.length,
						diplomaLevels: diplomaLevels.docs.length,
						campusnetUsers: campusnetUsers.docs.length,
						pages: pages.docs.length,
					},
					seeded: seedResult,
				},
			});
		} catch (error) {
			console.error("Error resetting and seeding database:", error);
			return Response.json(
				{
					success: false,
					error: "Failed to reset and seed database",
					details:
						error instanceof Error
							? error.message
							: "Unknown error",
				},
				{ status: 500 },
			);
		}
	},
};
