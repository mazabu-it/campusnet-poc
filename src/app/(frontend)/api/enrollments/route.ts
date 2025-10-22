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
		const courseInstanceId = searchParams.get(
			"where[courseInstance][equals]",
		);

		let whereClause = {};
		if (courseInstanceId) {
			whereClause = {
				courseInstance: {
					equals: courseInstanceId,
				},
			};
		}

		const result = await payload.find({
			collection: "enrollments",
			where: whereClause,
			depth: 2, // Include student and course instance details
		});

		return NextResponse.json(result);
	} catch (error) {
		console.error("Get enrollments error:", error);
		return NextResponse.json(
			{ message: "Failed to fetch enrollments" },
			{ status: 500 },
		);
	}
}
