import { type NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const revalidate = 0;
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

// Optimized API route for enrollments using Local API
export async function GET(request: NextRequest) {
	try {
		const payloadInstance = await getPayloadInstance();
		const { searchParams } = new URL(request.url);
		const courseInstanceId = searchParams.get(
			"where[courseInstance][equals]",
		);

		const query: any = {
			collection: "enrollments",
			limit: 1000,
			depth: 2, // Include related data
		};

		if (courseInstanceId) {
			query.where = {
				courseInstance: {
					equals: courseInstanceId,
				},
			};
		}

		const enrollments = await payloadInstance.find(query);

		return NextResponse.json({
			docs: enrollments.docs,
			totalDocs: enrollments.totalDocs,
		});
	} catch (error) {
		console.error("Error fetching enrollments:", error);
		return NextResponse.json(
			{ error: "Failed to fetch enrollments" },
			{ status: 500 },
		);
	}
}
