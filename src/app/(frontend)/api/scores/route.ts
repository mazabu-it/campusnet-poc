import { type NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "../../../../payload.config";

// Initialize Payload with Local API
let payload: any = null;
const getPayloadInstance = async () => {
	if (!payload) {
		payload = await getPayload({ config });
	}
	return payload;
};

// Optimized API route for scores using Local API
export async function GET(request: NextRequest) {
	try {
		const payloadInstance = await getPayloadInstance();
		const { searchParams } = new URL(request.url);
		const courseInstanceId = searchParams.get(
			"where[assessment.assessmentTemplate.courseInstance][equals]",
		);
		const assessmentId = searchParams.get("where[assessment][equals]");

		const query: any = {
			collection: "scores",
			limit: 1000,
			depth: 2, // Include related data
		};

		// Build where clause based on provided filters
		const where: any = {};
		if (courseInstanceId) {
			where["assessment.assessmentTemplate.courseInstance"] = {
				equals: courseInstanceId,
			};
		}
		if (assessmentId) {
			where.assessment = { equals: assessmentId };
		}
		if (Object.keys(where).length > 0) {
			query.where = where;
		}

		const scores = await payloadInstance.find(query);

		return NextResponse.json({
			docs: scores.docs,
			totalDocs: scores.totalDocs,
		});
	} catch (error) {
		console.error("Error fetching scores:", error);
		return NextResponse.json(
			{ error: "Failed to fetch scores" },
			{ status: 500 },
		);
	}
}

// Update score using Local API
export async function PATCH(request: NextRequest) {
	try {
		const payloadInstance = await getPayloadInstance();
		const { searchParams } = new URL(request.url);
		const scoreId = searchParams.get("id");
		const body = await request.json();

		if (!scoreId) {
			return NextResponse.json(
				{ error: "Score ID is required" },
				{ status: 400 },
			);
		}

		const updatedScore = await payloadInstance.update({
			collection: "scores",
			id: scoreId,
			data: body,
		});

		return NextResponse.json(updatedScore);
	} catch (error) {
		console.error("Error updating score:", error);
		return NextResponse.json(
			{ error: "Failed to update score" },
			{ status: 500 },
		);
	}
}

// Create score using Local API
export async function POST(request: NextRequest) {
	try {
		const payloadInstance = await getPayloadInstance();
		const body = await request.json();

		// Minimal validation
		if (!body || body.assessment == null || body.student == null) {
			return NextResponse.json(
				{ error: "assessment and student are required" },
				{ status: 400 },
			);
		}

		const created = await payloadInstance.create({
			collection: "scores",
			data: body,
		});

		return NextResponse.json(created, { status: 201 });
	} catch (error) {
		console.error("Error creating score:", error);
		return NextResponse.json(
			{ error: "Failed to create score" },
			{ status: 500 },
		);
	}
}
