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

		// For professors, only show course instances they are assigned to
		let whereClause = {};
		if (
			user.user.role === "professor" ||
			user.user.role === "faculty-staff"
		) {
			whereClause = {
				professors: {
					contains: user.user.id,
				},
			};
		}

		const result = await payload.find({
			collection: "course-instances",
			where: whereClause,
			depth: 2, // Include course and professor details
		});

		return NextResponse.json(result);
	} catch (error) {
		console.error("Get course instances error:", error);
		return NextResponse.json(
			{ message: "Failed to fetch course instances" },
			{ status: 500 },
		);
	}
}
