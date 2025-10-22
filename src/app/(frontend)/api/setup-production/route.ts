import configPromise from "@payload-config";
import { type NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";

export async function POST(_request: NextRequest) {
	try {
		const payload = await getPayload({ config: configPromise });

		console.log("🚀 Starting production setup (migration + seed)...");

		// Step 1: Run migrations
		console.log("📦 Running migrations...");
		await payload.db.migrate({
			migrations: [],
		});
		console.log("✅ Migrations completed!");

		// Step 2: Seed data
		console.log("🌱 Seeding demo data...");
		const seedResponse = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"}/api/seed`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		if (!seedResponse.ok) {
			throw new Error(`Seeding failed: ${seedResponse.statusText}`);
		}

		const seedResult = await seedResponse.json();
		console.log("✅ Seeding completed!");

		return NextResponse.json({
			success: true,
			message: "Production setup completed successfully!",
			migration: "completed",
			seed: seedResult,
		});
	} catch (error) {
		console.error("❌ Production setup failed:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Production setup failed",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}

export async function GET() {
	return NextResponse.json({
		message: "Production setup endpoint. Use POST to run migration + seed.",
		method: "POST",
		description:
			"This endpoint will run migrations and seed demo data for production.",
	});
}
