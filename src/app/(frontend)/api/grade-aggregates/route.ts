import config from "@payload-config";
import { type NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
		const courseInstanceId = searchParams.get("courseInstanceId");

		let whereClause = {};
		if (courseInstanceId) {
			// Get enrollments for this course instance first
			const enrollmentsResponse = await payload.find({
				collection: "enrollments",
				where: {
					courseInstance: {
						equals: courseInstanceId,
					},
				},
				limit: 1000,
			});

			const enrollmentIds = enrollmentsResponse.docs.map(
				(enrollment: any) => enrollment.id,
			);

			if (enrollmentIds.length > 0) {
				whereClause = {
					enrollment: {
						in: enrollmentIds,
					},
				};
			}
		}

		const result = await payload.find({
			collection: "grade-aggregates",
			where: whereClause,
			depth: 2, // Include enrollment and student details
		});

		return NextResponse.json(result);
	} catch (error) {
		console.error("Get grade aggregates error:", error);
		return NextResponse.json(
			{ message: "Failed to fetch grade aggregates" },
			{ status: 500 },
		);
	}
}
