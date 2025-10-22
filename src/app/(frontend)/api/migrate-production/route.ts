import configPromise from "@payload-config";
import { type NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";

export async function POST(request: NextRequest) {
	try {
		const payload = await getPayload({ config: configPromise });

		console.log("🚀 Starting production migration...");

		// Run the production migration
		await payload.db.migrate({
			migrations: [], // Payload will automatically find migrations in the configured directory
		});

		console.log("✅ Production migration completed successfully!");

		return NextResponse.json({
			success: true,
			message: "Production migration completed successfully!",
		});
	} catch (error) {
		console.error("❌ Production migration failed:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Production migration failed",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}

export async function GET() {
	return NextResponse.json({
		message: "Production migration endpoint. Use POST to run migrations.",
		method: "POST",
	});
}
