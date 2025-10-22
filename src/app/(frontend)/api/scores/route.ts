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
		const assessmentId = searchParams.get("where[assessment][equals]");

		let whereClause = {};
		if (assessmentId) {
			whereClause = {
				assessment: {
					equals: assessmentId,
				},
			};
		}

		const result = await payload.find({
			collection: "scores",
			where: whereClause,
			depth: 2, // Include student and assessment details
		});

		return NextResponse.json(result);
	} catch (error) {
		console.error("Get scores error:", error);
		return NextResponse.json(
			{ message: "Failed to fetch scores" },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
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
		const scoreData = {
			...body,
			gradedBy: user.user.id,
			gradedAt: new Date().toISOString(),
		};

		const result = await payload.create({
			collection: "scores",
			data: scoreData,
		});

		return NextResponse.json(result);
	} catch (error) {
		console.error("Create score error:", error);
		return NextResponse.json(
			{ message: "Failed to create score" },
			{ status: 500 },
		);
	}
}

export async function PATCH(request: NextRequest) {
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

		const { searchParams } = new URL(request.url);
		const scoreId = searchParams.get("id");

		if (!scoreId) {
			return NextResponse.json(
				{ message: "Score ID is required" },
				{ status: 400 },
			);
		}

		const body = await request.json();
		const scoreData = {
			...body,
			gradedBy: user.user.id,
			gradedAt: new Date().toISOString(),
		};

		const result = await payload.update({
			collection: "scores",
			id: scoreId,
			data: scoreData,
		});

		return NextResponse.json(result);
	} catch (error) {
		console.error("Update score error:", error);
		return NextResponse.json(
			{ message: "Failed to update score" },
			{ status: 500 },
		);
	}
}
