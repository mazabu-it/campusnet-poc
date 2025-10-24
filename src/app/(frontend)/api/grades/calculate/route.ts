import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import type { PayloadRequest } from "payload";
import { getPayload } from "payload";
import config from "@/payload.config";
import type { Enrollment } from "@/payload-types";
import { GradeCalculationEngine } from "@/utilities/gradeCalculation";

export async function POST(request: Request) {
	try {
		const payload = await getPayload({ config });
		const body = await request.json();
		const { enrollmentId, courseInstanceId } = body;

		if (!enrollmentId && !courseInstanceId) {
			return NextResponse.json(
				{
					error: "Either enrollmentId or courseInstanceId is required",
				},
				{ status: 400 },
			);
		}

		// Get enrollment(s) to calculate grades for
		let enrollments: Enrollment[] | undefined;
		if (enrollmentId) {
			const enrollment = await payload.findByID({
				collection: "enrollments",
				id: enrollmentId,
			});
			enrollments = [enrollment];
		} else {
			const result = await payload.find({
				collection: "enrollments",
				where: { courseInstance: { equals: courseInstanceId } },
			});
			enrollments = result.docs;
		}

		const gradeCalculationEngine = new GradeCalculationEngine({
			payload,
			req: request,
		} as unknown as PayloadRequest);
		const results = [];

		for (const enrollment of enrollments) {
			try {
				// Get all assessments for this course instance
				const courseInstanceId =
					typeof enrollment.courseInstance === "string"
						? enrollment.courseInstance
						: typeof enrollment.courseInstance === "number"
							? enrollment.courseInstance
							: enrollment.courseInstance?.id;

				// Extract student ID correctly
				const studentId =
					typeof enrollment.student === "string"
						? enrollment.student
						: typeof enrollment.student === "number"
							? enrollment.student
							: enrollment.student?.id;

				const assessmentsResult = await payload.find({
					collection: "assessments",
					where: {
						"assessmentTemplate.courseInstance": {
							equals: courseInstanceId,
						},
					},
					depth: 2,
				});

				// Get all scores for this student in this course
				const _scoresResult = await payload.find({
					collection: "scores",
					where: {
						and: [
							{ student: { equals: studentId } },
							{
								assessment: {
									in: assessmentsResult.docs.map((a) => a.id),
								},
							},
						],
					},
					depth: 1,
				});

				// Calculate grade using the engine
				const calculationResult =
					await gradeCalculationEngine.calculateGrade(
						enrollment.id.toString(),
					);

				// Check if grade aggregate already exists
				const existingGradeResult = await payload.find({
					collection: "grade-aggregates",
					where: { enrollment: { equals: enrollment.id } },
				});

				const gradeData = {
					enrollment: enrollment.id,
					gradeTitle: `${enrollment.student} - ${enrollment.courseInstance} Grade`,
					finalNumeric: calculationResult.finalNumeric,
					finalLetter: calculationResult.finalLetter,
					passFail: calculationResult.passFail,
					gpaPoints: calculationResult.gpaPoints,
					calculationMethod: "weighted-average" as const,
					decisionNotes: `Automatically calculated on ${new Date().toISOString()}`,
					calculatedAt: new Date().toISOString(),
					calculatedBy: enrollment.student, // Student ID as calculated by
					isPublished: true,
					publishedAt: new Date().toISOString(),
					assessmentBreakdown:
						calculationResult.assessmentBreakdown.map(
							(breakdown) => ({
								...breakdown,
								assessmentTemplate:
									typeof breakdown.assessmentTemplate ===
									"string"
										? parseInt(
												breakdown.assessmentTemplate,
												10,
											)
										: breakdown.assessmentTemplate,
							}),
						),
				};

				if (existingGradeResult.docs.length > 0) {
					// Update existing grade aggregate
					const updatedGrade = await payload.update({
						collection: "grade-aggregates",
						id: existingGradeResult.docs[0].id,
						data: gradeData,
					});
					results.push({
						enrollmentId: enrollment.id,
						action: "updated",
						grade: updatedGrade,
					});
				} else {
					// Create new grade aggregate
					const newGrade = await payload.create({
						collection: "grade-aggregates",
						data: gradeData,
					});
					results.push({
						enrollmentId: enrollment.id,
						action: "created",
						grade: newGrade,
					});
				}
			} catch (error) {
				console.error(
					`Error calculating grade for enrollment ${enrollment.id}:`,
					error,
				);
				results.push({
					enrollmentId: enrollment.id,
					action: "error",
					error:
						error instanceof Error
							? error.message
							: "Unknown error",
				});
			}
		}

		return NextResponse.json({
			success: true,
			message: `Calculated grades for ${results.length} enrollment(s)`,
			results,
		});
	} catch (error) {
		console.error("Error in grade calculation endpoint:", error);
		return NextResponse.json(
			{ error: "Failed to calculate grades" },
			{ status: 500 },
		);
	}
}
