import { exec } from "node:child_process";
import { promisify } from "node:util";
import { type NextRequest, NextResponse } from "next/server";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
	try {
		// Run migrations via CLI
		await execAsync("npx payload migrate");

		return NextResponse.json({
			success: true,
			message: "Migrations completed successfully",
		});
	} catch (error) {
		console.error("Migration error:", error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
