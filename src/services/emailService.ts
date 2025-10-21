import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import { ContactFormEmail } from "@/components/email/ContactFormEmail";
import { NewsletterEmail } from "@/components/email/NewsletterEmail";
import { WelcomeEmail } from "@/components/email/WelcomeEmail";

interface ContactFormData {
	name: string;
	email: string;
	subject: string;
	message: string;
	phone?: string;
	program?: string;
	academicYear?: string;
}

export class EmailService {
	private transporter: nodemailer.Transporter;

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST || "smtp.gmail.com",
			port: parseInt(process.env.SMTP_PORT || "587"),
			secure: false,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
		});
	}

	async sendContactFormEmail(data: ContactFormData) {
		try {
			const emailHtml = await render(ContactFormEmail(data));

			const mailOptions = {
				from: `"Demo University" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
				to: process.env.CONTACT_EMAIL || "contact@demouniversity.edu",
				subject: `New Contact Form Submission: ${data.subject}`,
				html: emailHtml,
				replyTo: data.email,
			};

			const result = await this.transporter.sendMail(mailOptions);
			console.log("Contact form email sent:", result.messageId);
			return { success: true, messageId: result.messageId };
		} catch (error) {
			console.error("Error sending contact form email:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	async sendWelcomeEmail(email: string, name: string) {
		try {
			const emailHtml = await render(
				WelcomeEmail({ name, _email: email }),
			);

			const mailOptions = {
				from: `"Demo University" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
				to: email,
				subject: "Welcome to Demo University!",
				html: emailHtml,
			};

			const result = await this.transporter.sendMail(mailOptions);
			console.log("Welcome email sent:", result.messageId);
			return { success: true, messageId: result.messageId };
		} catch (error) {
			console.error("Error sending welcome email:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	async sendNewsletterEmail(email: string, name: string) {
		try {
			const emailHtml = await render(
				NewsletterEmail({ name, _email: email }),
			);

			const mailOptions = {
				from: `"Demo University Newsletter" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
				to: email,
				subject: "Welcome to Demo University Newsletter!",
				html: emailHtml,
			};

			const result = await this.transporter.sendMail(mailOptions);
			console.log("Newsletter email sent:", result.messageId);
			return { success: true, messageId: result.messageId };
		} catch (error) {
			console.error("Error sending newsletter email:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}
}

export const emailService = new EmailService();
