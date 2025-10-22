import config from "@payload-config";
import { type NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";

export async function GET(request: NextRequest) {
	try {
		const payload = await getPayload({ config });

		// Get the current user from the token
		const user = await payload.auth({ headers: request.headers });

		if (!user.user) {
			return NextResponse.json(
				{ message: "Not authenticated" },
				{ status: 401 },
			);
		}

		// Get query parameters
		const { searchParams } = new URL(request.url);
		const assessmentId = searchParams.get("where[assessment][equals]");
		const courseInstanceId = searchParams.get("courseInstanceId");

		let whereClause = {};
		if (assessmentId) {
			whereClause = {
				assessment: {
					equals: assessmentId,
				},
			};
		} else if (courseInstanceId) {
			// Get assessments for this course instance first
			const assessmentsResponse = await payload.find({
				collection: "assessments",
				where: {
					"assessmentTemplate.courseInstance": {
						equals: courseInstanceId,
					},
				},
				limit: 1000,
			});

			const assessmentIds = assessmentsResponse.docs.map(
				(assessment: any) => assessment.id,
			);

			if (assessmentIds.length > 0) {
				whereClause = {
					assessment: {
						in: assessmentIds,
					},
				};
			}
		}

		const result = await payload.find({
			collection: "scores",
			where: whereClause,
			depth: 2, // Include student and assessment details
		});

		return NextResponse.json(result);
	} catch (error) {
		console.error("Get scores error:", error);
		return NextResponse.json(
			{ message: "Failed to fetch scores" },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const payload = await getPayload({ config });

		// Get the current user from the token
		const user = await payload.auth({ headers: request.headers });

		if (!user.user) {
			return NextResponse.json(
				{ message: "Not authenticated" },
				{ status: 401 },
			);
		}

		const body = await request.json();

		// Log the incoming data for debugging
		console.log("POST /api/scores - Incoming data:", {
			assessment: body.assessment,
			student: body.student,
			gradedBy: user.user.id,
			assessmentType: typeof body.assessment,
			studentType: typeof body.student,
			gradedByType: typeof user.user.id,
		});

		// Verify the assessment exists
		const assessmentCheck = await payload.findByID({
			collection: "assessments",
			id: body.assessment,
		});
		console.log(
			"Assessment exists:",
			!!assessmentCheck,
			"ID:",
			body.assessment,
		);

		// Verify the student exists
		const studentCheck = await payload.findByID({
			collection: "users",
			id: body.student,
		});
		console.log("Student exists:", !!studentCheck, "ID:", body.student);

		// Convert string IDs to numbers for Payload relationships
		// Payload expects numeric IDs when the database ID field is numeric
		const scoreData = {
			...body,
			assessment: Number(body.assessment),
			student: Number(body.student),
			gradedBy: Number(user.user.id),
			gradedAt: new Date().toISOString(),
		};

		const result = await payload.create({
			collection: "scores",
			data: scoreData,
		});

		return NextResponse.json(result);
	} catch (error) {
		console.error("Create score error:", error);
		return NextResponse.json(
			{ message: "Failed to create score", error: String(error) },
			{ status: 500 },
		);
	}
}

export async function PATCH(request: NextRequest) {
	try {
		const payload = await getPayload({ config });

		// Get the current user from the token
		const user = await payload.auth({ headers: request.headers });

		if (!user.user) {
			return NextResponse.json(
				{ message: "Not authenticated" },
				{ status: 401 },
			);
		}

		const { searchParams } = new URL(request.url);
		const scoreId = searchParams.get("id");

		if (!scoreId) {
			return NextResponse.json(
				{ message: "Score ID is required" },
				{ status: 400 },
			);
		}

		const body = await request.json();

		// Convert gradedBy to number for Payload relationships
		const scoreData = {
			...body,
			gradedBy: Number(user.user.id),
			gradedAt: new Date().toISOString(),
		};

		const result = await payload.update({
			collection: "scores",
			id: Number(scoreId),
			data: scoreData,
		});

		return NextResponse.json(result);
	} catch (error) {
		console.error("Update score error:", error);
		return NextResponse.json(
			{ message: "Failed to update score" },
			{ status: 500 },
		);
	}
}
