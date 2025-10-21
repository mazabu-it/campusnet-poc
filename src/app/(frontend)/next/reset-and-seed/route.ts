import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		// Call the Payload endpoint
		const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/reset-and-seed`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		const result = await response.json();

		if (!response.ok) {
			return NextResponse.json(
				{
					success: false,
					error: result.error || 'Failed to reset and seed database',
					details: result.details,
				},
				{ status: response.status },
			);
		}

		return NextResponse.json({
			success: true,
			message: 'Database reset and demo data seeded successfully!',
			data: result.data,
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
