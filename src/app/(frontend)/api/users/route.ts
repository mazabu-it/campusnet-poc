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

		// Allow professors and faculty-staff to fetch student data
		if (
			user.user.role !== "professor" &&
			user.user.role !== "faculty-staff" &&
			user.user.role !== "student"
		) {
			return NextResponse.json(
				{ message: "Access denied" },
				{ status: 403 },
			);
		}

		// Get query parameters
		const { searchParams } = new URL(request.url);
		const userIds = searchParams.get("where[id][in]");

		let whereClause = {};
		if (userIds) {
			const ids = userIds.split(",");
			whereClause = {
				id: {
					in: ids,
				},
			};
		}

		const result = await payload.find({
			collection: "users",
			where: whereClause,
			depth: 1,
		});

		return NextResponse.json(result);
	} catch (error) {
		console.error("Get users error:", error);
		return NextResponse.json(
			{ message: "Failed to fetch users" },
			{ status: 500 },
		);
	}
}
