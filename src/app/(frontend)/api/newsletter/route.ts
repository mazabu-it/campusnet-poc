import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { emailService } from "@/services/emailService";

const newsletterSchema = z.object({
	email: z.string().email("Invalid email address"),
	name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate the form data
		const validatedData = newsletterSchema.parse(body);

		// Send the welcome newsletter email
		const result = await emailService.sendNewsletterEmail(
			validatedData.email,
			validatedData.name || "Subscriber",
		);

		if (result.success) {
			return NextResponse.json(
				{
					success: true,
					message: "Thank you for subscribing to our newsletter!",
				},
				{ status: 200 },
			);
		} else {
			return NextResponse.json(
				{
					success: false,
					message:
						"Sorry, there was an error subscribing you to our newsletter. Please try again.",
				},
				{ status: 500 },
			);
		}
	} catch (error) {
		console.error("Newsletter subscription error:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					success: false,
					message: "Please check your email address and try again.",
					errors: error.issues,
				},
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{
				success: false,
				message: "An unexpected error occurred. Please try again.",
			},
			{ status: 500 },
		);
	}
}
