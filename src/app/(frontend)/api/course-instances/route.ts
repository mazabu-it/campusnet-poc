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

// Optimized API route for course instances using Local API
export async function GET(_request: NextRequest) {
	try {
		const payloadInstance = await getPayloadInstance();

		const courseInstances = await payloadInstance.find({
			collection: "course-instances",
			limit: 100,
			depth: 2, // Include related data
		});

		return NextResponse.json({
			docs: courseInstances.docs,
			totalDocs: courseInstances.totalDocs,
		});
	} catch (error) {
		console.error("Error fetching course instances:", error);
		return NextResponse.json(
			{ error: "Failed to fetch course instances" },
			{ status: 500 },
		);
	}
}
