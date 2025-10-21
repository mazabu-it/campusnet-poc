import { type NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest) {
	try {
		const response = NextResponse.json({
			message: "Logged out successfully",
		});

		// Clear the JWT token cookie
		response.cookies.set("payload-token", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 0, // Expire immediately
		});

		return response;
	} catch (error) {
		console.error("Logout error:", error);
		return NextResponse.json({ message: "Logout failed" }, { status: 500 });
	}
}
