import type { Endpoint } from "payload";
import { GradeCalculationEngine } from "../utilities/gradeCalculation";

export const calculateGradeEndpoint: Endpoint = {
	path: "/calculate-grade/:enrollmentId",
	method: "post",
	handler: async (req) => {
		try {
			const enrollmentId = req.url?.split("/").pop();

			if (!enrollmentId) {
				return Response.json(
					{ error: "Enrollment ID is required" },
					{ status: 400 },
				);
			}

			const engine = new GradeCalculationEngine(req);
			const result = await engine.calculateGrade(enrollmentId);

			return Response.json(result);
		} catch (error) {
			console.error("Error calculating grade:", error);
			return Response.json(
				{ error: "Failed to calculate grade" },
				{ status: 500 },
			);
		}
	},
};

export const updateGradeAggregateEndpoint: Endpoint = {
	path: "/update-grade-aggregate/:enrollmentId",
	method: "post",
	handler: async (req) => {
		try {
			const enrollmentId = req.url?.split("/").pop();

			if (!enrollmentId) {
				return Response.json(
					{ error: "Enrollment ID is required" },
					{ status: 400 },
				);
			}

			const engine = new GradeCalculationEngine(req);
			await engine.updateGradeAggregate(enrollmentId);

			return Response.json({ success: true });
		} catch (error) {
			console.error("Error updating grade aggregate:", error);
			return Response.json(
				{ error: "Failed to update grade aggregate" },
				{ status: 500 },
			);
		}
	},
};

export const calculateStudentGPAEndpoint: Endpoint = {
	path: "/calculate-gpa/:studentId",
	method: "get",
	handler: async (req) => {
		try {
			const studentId = req.url?.split("/").pop();

			if (!studentId) {
				return Response.json(
					{ error: "Student ID is required" },
					{ status: 400 },
				);
			}

			const engine = new GradeCalculationEngine(req);
			const gpa = await engine.calculateStudentGPA(studentId);

			return Response.json({ gpa });
		} catch (error) {
			console.error("Error calculating GPA:", error);
			return Response.json(
				{ error: "Failed to calculate GPA" },
				{ status: 500 },
			);
		}
	},
};

export const enrollStudentEndpoint: Endpoint = {
	path: "/enroll-student",
	method: "post",
	handler: async (req) => {
		try {
			const {
				studentId,
				courseInstanceId,
				enrollmentType = "required",
			} = (await req.json?.()) || {};

			if (!studentId || !courseInstanceId) {
				return Response.json(
					{ error: "Student ID and Course Instance ID are required" },
					{ status: 400 },
				);
			}

			// Check if student is already enrolled
			const existingEnrollment = await req.payload.find({
				collection: "enrollments",
				where: {
					student: {
						equals: studentId,
					},
					courseInstance: {
						equals: courseInstanceId,
					},
					status: {
						in: ["pending", "active"],
					},
				},
			});

			if (existingEnrollment.docs.length > 0) {
				return Response.json(
					{ error: "Student is already enrolled in this course" },
					{ status: 400 },
				);
			}

			// Create enrollment
			const enrollment = await req.payload.create({
				collection: "enrollments",
				data: {
					student: studentId,
					courseInstance: courseInstanceId,
					enrollmentType,
					status: "pending",
					enrolledAt: new Date().toISOString(),
				},
			});

			// Update course instance enrollment count
			const courseInstance = await req.payload.findByID({
				collection: "course-instances",
				id: courseInstanceId,
			});

			await req.payload.update({
				collection: "course-instances",
				id: courseInstanceId,
				data: {
					currentEnrollment:
						(courseInstance.currentEnrollment || 0) + 1,
				},
			});

			return Response.json({ enrollment });
		} catch (error) {
			console.error("Error enrolling student:", error);
			return Response.json(
				{ error: "Failed to enroll student" },
				{ status: 500 },
			);
		}
	},
};

export const submitScoreEndpoint: Endpoint = {
	path: "/submit-score",
	method: "post",
	handler: async (req) => {
		try {
			const { assessmentId, studentId, value, feedback, notes } =
				(await req.json?.()) || {};

			if (!assessmentId || !studentId || value === undefined) {
				return Response.json(
					{
						error: "Assessment ID, Student ID, and value are required",
					},
					{ status: 400 },
				);
			}

			// Check if assessment is in open state
			const assessment = await req.payload.findByID({
				collection: "assessments",
				id: assessmentId,
				depth: 2,
			});

			if (assessment.status !== "open") {
				return Response.json(
					{ error: "Assessment is not open for scoring" },
					{ status: 400 },
				);
			}

			// Check if score already exists
			const existingScore = await req.payload.find({
				collection: "scores",
				where: {
					assessment: {
						equals: assessmentId,
					},
					student: {
						equals: studentId,
					},
				},
			});

			const scoreData = {
				assessment: assessmentId,
				student: studentId,
				value,
				maxValue:
					typeof assessment.assessmentTemplate === "object"
						? assessment.assessmentTemplate.maxScore
						: 100, // fallback value
				gradedBy: req.user?.id || 0,
				gradedAt: new Date().toISOString(),
				feedback,
				notes,
			};

			let score: unknown;
			if (existingScore.docs.length > 0) {
				// Update existing score
				score = await req.payload.update({
					collection: "scores",
					id: existingScore.docs[0].id,
					data: scoreData,
				});
			} else {
				// Create new score
				score = await req.payload.create({
					collection: "scores",
					data: scoreData,
				});
			}

			return Response.json({ score });
		} catch (error) {
			console.error("Error submitting score:", error);
			return Response.json(
				{ error: "Failed to submit score" },
				{ status: 500 },
			);
		}
	},
};
