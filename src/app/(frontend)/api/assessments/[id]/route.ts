import config from "@payload-config";
import { type NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
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
		const { id: assessmentId } = await params;

		const result = await payload.update({
			collection: "assessments",
			id: Number(assessmentId),
			data: body,
		});

		return NextResponse.json(result);
	} catch (error) {
		console.error("Update assessment error:", error);
		return NextResponse.json(
			{ message: "Failed to update assessment" },
			{ status: 500 },
		);
	}
}
