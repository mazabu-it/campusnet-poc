import config from "@payload-config";
import { type NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";

export async function POST(request: NextRequest) {
	try {
		// Parse request body with error handling
		let email: string;
		let password: string;

		try {
			const body = await request.json();
			console.log(
				"Received login request body:",
				JSON.stringify(body, null, 2),
			);
			email = body.email;
			password = body.password;
		} catch (parseError) {
			console.error("JSON parse error:", parseError);
			// Don't try to read the body again as it's already been consumed
			return NextResponse.json(
				{ message: "Invalid JSON in request body" },
				{ status: 400 },
			);
		}

		if (!email || !password) {
			return NextResponse.json(
				{ message: "Email and password are required" },
				{ status: 400 },
			);
		}

		const payload = await getPayload({ config });

		// Authenticate user with Payload
		const result = await payload.login({
			collection: "users",
			data: {
				email,
				password,
			},
		});

		if (result.user && result.token) {
			// Set HTTP-only cookie for session
			const response = NextResponse.json({
				user: {
					id: result.user.id,
					email: result.user.email,
					role: result.user.role,
					name: result.user.name,
				},
				token: result.token,
			});

			// Set the JWT token as an HTTP-only cookie
			response.cookies.set("payload-token", result.token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				maxAge: 60 * 60 * 24 * 7, // 7 days
			});

			return response;
		}

		return NextResponse.json(
			{ message: "Invalid credentials" },
			{ status: 401 },
		);
	} catch (error) {
		console.error("Login error:", error);

		// Handle authentication errors specifically
		if (
			error instanceof Error &&
			error.message.includes("email or password")
		) {
			return NextResponse.json(
				{ message: "Invalid credentials" },
				{ status: 401 },
			);
		}

		return NextResponse.json(
			{
				message: "Login failed",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
