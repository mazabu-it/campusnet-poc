import type { Endpoint } from "payload";
import { getPayload } from "payload";
import config from "../../payload.config";
import { seedCampusnetUnifiedData } from "./unified-seed";

export const resetAndSeedEndpoint: Endpoint = {
	path: "/reset-and-seed",
	method: "post",
	handler: async (_req) => {
		try {
			console.log(
				"🔄 Starting complete database reset and demo seeding...",
			);
			console.log(
				"📊 This will create comprehensive demo data with realistic scores on 20-point scale",
			);

			// Initialize Payload with Local API for better performance
			const payload = await getPayload({ config });

			// Clear all Campusnet data (in correct dependency order)
			console.log("🗑️ Clearing existing data...");

			// Delete in proper order to respect foreign key constraints
			// 1. Delete scores first (no dependencies)
			console.log("Deleting scores...");
			const scores = await payload.find({
				collection: "scores",
				limit: 1000,
			});
			for (const score of scores.docs) {
				try {
					await payload.delete({
						collection: "scores",
						id: score.id,
					});
				} catch (error) {
					console.log(`Failed to delete score ${score.id}:`, error);
				}
			}

			// 2. Delete grade aggregates
			console.log("Deleting grade aggregates...");
			const gradeAggregates = await payload.find({
				collection: "grade-aggregates",
				limit: 1000,
			});
			for (const aggregate of gradeAggregates.docs) {
				try {
					await payload.delete({
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

			// 3. Delete enrollments
			console.log("Deleting enrollments...");
			const enrollments = await payload.find({
				collection: "enrollments",
				limit: 1000,
			});
			for (const enrollment of enrollments.docs) {
				try {
					await payload.delete({
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
			console.log("Deleting assessments...");
			const assessments = await payload.find({
				collection: "assessments",
				limit: 1000,
			});
			for (const assessment of assessments.docs) {
				try {
					await payload.delete({
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
			console.log("Deleting assessment templates...");
			const assessmentTemplates = await payload.find({
				collection: "assessment-templates",
				limit: 1000,
			});
			for (const template of assessmentTemplates.docs) {
				try {
					await payload.delete({
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
			console.log("Deleting course instances...");
			const courseInstances = await payload.find({
				collection: "course-instances",
				limit: 1000,
			});
			for (const instance of courseInstances.docs) {
				try {
					await payload.delete({
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
			console.log("Deleting course variations...");
			const courseVariations = await payload.find({
				collection: "course-variations",
				limit: 1000,
			});
			for (const variation of courseVariations.docs) {
				try {
					await payload.delete({
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
			console.log("Deleting courses...");
			const courses = await payload.find({
				collection: "courses",
				limit: 1000,
			});
			for (const course of courses.docs) {
				try {
					await payload.delete({
						collection: "courses",
						id: course.id,
					});
				} catch (error) {
					console.log(`Failed to delete course ${course.id}:`, error);
				}
			}

			// 9. Delete departments
			console.log("Deleting departments...");
			const departments = await payload.find({
				collection: "departments",
				limit: 1000,
			});
			for (const department of departments.docs) {
				try {
					await payload.delete({
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

			// 10. Delete faculties
			console.log("Deleting faculties...");
			const faculties = await payload.find({
				collection: "faculties",
				limit: 1000,
			});
			for (const faculty of faculties.docs) {
				try {
					await payload.delete({
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

			// 11. Delete universities
			console.log("Deleting universities...");
			const universities = await payload.find({
				collection: "universities",
				limit: 1000,
			});
			for (const university of universities.docs) {
				try {
					await payload.delete({
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

			// 12. Delete academic calendars
			console.log("Deleting academic calendars...");
			const academicCalendars = await payload.find({
				collection: "academic-calendars",
				limit: 1000,
			});
			for (const calendar of academicCalendars.docs) {
				try {
					await payload.delete({
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

			// 13. Delete academic years
			console.log("Deleting academic years...");
			const academicYears = await payload.find({
				collection: "academic-years",
				limit: 1000,
			});
			for (const year of academicYears.docs) {
				try {
					await payload.delete({
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

			// 14. Delete grading scales
			console.log("Deleting grading scales...");
			const gradingScales = await payload.find({
				collection: "grading-scales",
				limit: 1000,
			});
			for (const scale of gradingScales.docs) {
				try {
					await payload.delete({
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

			// 15. Delete users (professors and students)
			console.log("Deleting users...");
			const users = await payload.find({
				collection: "users",
				limit: 1000,
			});
			for (const user of users.docs) {
				try {
					await payload.delete({
						collection: "users",
						id: user.id,
					});
				} catch (error) {
					console.log(`Failed to delete user ${user.id}:`, error);
				}
			}

			console.log("✅ Database cleared successfully!");

			// Now seed the data using Local API
			console.log("🌱 Seeding new data...");
			await seedCampusnetUnifiedData(payload);

			console.log("🎉 Database reset and seed completed successfully!");

			return new Response(
				JSON.stringify({
					message: "Database reset and seed completed successfully!",
				}),
				{
					status: 200,
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
		} catch (error) {
			console.error("❌ Error during reset and seed:", error);
			throw new Error(
				`Error during reset and seed: ${
					error instanceof Error ? error.message : "Unknown error"
				}`,
			);
		}
	},
};
