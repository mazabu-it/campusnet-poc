import { type NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { z } from "zod";
import { emailService } from "@/services/emailService";

const contactFormSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	subject: z.string().min(5, "Subject must be at least 5 characters"),
	message: z.string().min(10, "Message must be at least 10 characters"),
	phone: z.string().optional(),
	program: z.string().optional(),
	academicYear: z.string().optional(),
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate the form data
		const validatedData = contactFormSchema.parse(body);

		// Send the email
		const result = await emailService.sendContactFormEmail(validatedData);

		if (result.success) {
			return NextResponse.json(
				{
					success: true,
					message:
						"Thank you for your message! We will get back to you soon.",
				},
				{ status: 200 },
			);
		} else {
			return NextResponse.json(
				{
					success: false,
					message:
						"Sorry, there was an error sending your message. Please try again.",
				},
				{ status: 500 },
			);
		}
	} catch (error) {
		console.error("Contact form error:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					success: false,
					message: "Please check your form data and try again.",
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
