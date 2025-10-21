import { type NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@/payload.config";

export async function POST(_req: NextRequest) {
	try {
		// Get Payload instance
		const payload = await getPayload({ config });

		// Call the reset and seed endpoint handler directly
		const resetAndSeedEndpoint = await import(
			"@/endpoints/seed/reset-and-seed"
		);

		// Create a mock request object for the endpoint
		const mockReq = {
			payload,
			user: null,
			headers: new Headers(),
			url: new URL("http://localhost:3002/reset-and-seed"),
		};

		const result = await resetAndSeedEndpoint.resetAndSeedEndpoint.handler(
			mockReq as any,
		);

		// Parse the response
		const responseData = await result.json();

		if (!result.ok) {
			return NextResponse.json(
				{
					success: false,
					error:
						responseData.error ||
						"Failed to reset and seed database",
					details: responseData.details,
				},
				{ status: result.status },
			);
		}

		return NextResponse.json({
			success: true,
			message: "Database reset and demo data seeded successfully!",
			data: responseData.data,
		});
	} catch (error) {
		console.error("Reset and seed error:", error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
