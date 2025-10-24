import config from "@payload-config";
import { type NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";

// Initialize Payload with Local API
let payload: any = null;
const getPayloadInstance = async () => {
	if (!payload) {
		payload = await getPayload({ config });
	}
	return payload;
};

// Optimized API route for professor grading using Local API
export async function GET(request: NextRequest) {
	try {
		const payloadInstance = await getPayloadInstance();
		const { searchParams } = new URL(request.url);
		const courseInstanceId = searchParams.get("courseInstanceId");

		if (!courseInstanceId) {
			return NextResponse.json(
				{ error: "Course instance ID is required" },
				{ status: 400 },
			);
		}

		// Fetch all data in parallel using Local API
		const [enrollments, assessments, scores] = await Promise.all([
			payloadInstance.find({
				collection: "enrollments",
				where: {
					courseInstance: {
						equals: courseInstanceId,
					},
				},
				limit: 1000,
				depth: 2,
			}),
			payloadInstance.find({
				collection: "assessments",
				where: {
					"assessmentTemplate.courseInstance": {
						equals: courseInstanceId,
					},
				},
				limit: 1000,
				depth: 2,
			}),
			payloadInstance.find({
				collection: "scores",
				where: {
					"assessment.assessmentTemplate.courseInstance": {
						equals: courseInstanceId,
					},
				},
				limit: 1000,
				depth: 2,
			}),
		]);

		return NextResponse.json({
			enrollments: enrollments.docs,
			assessments: assessments.docs,
			scores: scores.docs,
		});
	} catch (error) {
		console.error("Error fetching professor grading data:", error);
		return NextResponse.json(
			{ error: "Failed to fetch professor grading data" },
			{ status: 500 },
		);
	}
}
