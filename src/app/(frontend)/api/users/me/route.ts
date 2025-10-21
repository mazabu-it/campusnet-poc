import config from "@payload-config";
import { type NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";

export async function GET(request: NextRequest) {
	try {
		const payload = await getPayload({ config });

		// Get the current user from the token
		const user = await payload.auth({ headers: request.headers });

		if (user.user) {
			return NextResponse.json({
				user: {
					id: user.user.id,
					email: user.user.email,
					role: user.user.role,
					name: user.user.name,
				},
			});
		}

		return NextResponse.json(
			{ message: "Not authenticated" },
			{ status: 401 },
		);
	} catch (error) {
		console.error("Get user error:", error);
		return NextResponse.json(
			{ message: "Authentication failed" },
			{ status: 401 },
		);
	}
}
