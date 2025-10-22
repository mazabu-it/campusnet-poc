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
		let whereClause: any = {
			courseVariation: {
				exists: true, // Only include course instances that have a course variation
			},
		};
		if (
			user.user.role === "professor" ||
			user.user.role === "faculty-staff"
		) {
			whereClause = {
				...whereClause,
				professors: {
					contains: user.user.id,
				},
			};
		}

		console.log(
			"Fetching course instances for user:",
			user.user.id,
			"role:",
			user.user.role,
		);
		console.log("Where clause:", JSON.stringify(whereClause, null, 2));

		const result = await payload.find({
			collection: "course-instances",
			where: whereClause,
			depth: 2, // Include course and professor details
		});

		console.log("Found course instances:", result.docs.length);
		console.log(
			"First course instance:",
			result.docs[0] ? JSON.stringify(result.docs[0], null, 2) : "None",
		);

		return NextResponse.json(result);
	} catch (error) {
		console.error("Get course instances error:", error);
		return NextResponse.json(
			{ message: "Failed to fetch course instances" },
			{ status: 500 },
		);
	}
}
