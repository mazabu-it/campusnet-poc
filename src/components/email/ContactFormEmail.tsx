import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Preview,
	Section,
	Text,
} from "@react-email/components";

interface ContactFormEmailProps {
	name: string;
	email: string;
	subject: string;
	message: string;
	phone?: string;
	program?: string;
	academicYear?: string;
}

export const ContactFormEmail = ({
	name,
	email,
	subject,
	message,
	phone,
	program,
	academicYear,
}: ContactFormEmailProps) => (
	<Html>
		<Head />
		<Preview>New contact form submission from {name}</Preview>
		<Body style={main}>
			<Container style={container}>
				<Section style={header}>
					<Heading style={h1}>Demo University</Heading>
					<Text style={subtitle}>New Contact Form Submission</Text>
				</Section>

				<Section style={content}>
					<Text style={paragraph}>
						You have received a new contact form submission from the
						Demo University website.
					</Text>

					<Section style={details}>
						<Text style={label}>Name:</Text>
						<Text style={value}>{name}</Text>

						<Text style={label}>Email:</Text>
						<Text style={value}>{email}</Text>

						{phone && (
							<>
								<Text style={label}>Phone:</Text>
								<Text style={value}>{phone}</Text>
							</>
						)}

						<Text style={label}>Subject:</Text>
						<Text style={value}>{subject}</Text>

						{program && (
							<>
								<Text style={label}>Program of Interest:</Text>
								<Text style={value}>{program}</Text>
							</>
						)}

						{academicYear && (
							<>
								<Text style={label}>Academic Year:</Text>
								<Text style={value}>{academicYear}</Text>
							</>
						)}

						<Text style={label}>Message:</Text>
						<Text style={messageText}>{message}</Text>
					</Section>

					<Hr style={hr} />

					<Section style={footer}>
						<Text style={footerText}>
							This email was sent from the Demo University contact
							form.
						</Text>
						<Text style={footerText}>
							Please respond directly to {email} to reply to this
							inquiry.
						</Text>
					</Section>
				</Section>
			</Container>
		</Body>
	</Html>
);

const main = {
	backgroundColor: "#f6f9fc",
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
	backgroundColor: "#ffffff",
	margin: "0 auto",
	padding: "20px 0 48px",
	marginBottom: "64px",
};

const header = {
	padding: "32px 24px 0",
	textAlign: "center" as const,
};

const h1 = {
	color: "#1f2937",
	fontSize: "32px",
	fontWeight: "bold",
	margin: "0 0 8px",
};

const subtitle = {
	color: "#6b7280",
	fontSize: "16px",
	margin: "0 0 32px",
};

const content = {
	padding: "0 24px",
};

const paragraph = {
	color: "#374151",
	fontSize: "16px",
	lineHeight: "24px",
	margin: "0 0 24px",
};

const details = {
	backgroundColor: "#f9fafb",
	borderRadius: "8px",
	padding: "24px",
	margin: "24px 0",
};

const label = {
	color: "#374151",
	fontSize: "14px",
	fontWeight: "bold",
	margin: "0 0 4px",
};

const value = {
	color: "#1f2937",
	fontSize: "16px",
	margin: "0 0 16px",
};

const messageText = {
	color: "#1f2937",
	fontSize: "16px",
	lineHeight: "24px",
	margin: "0",
	whiteSpace: "pre-wrap" as const,
};

const hr = {
	borderColor: "#e5e7eb",
	margin: "32px 0",
};

const footer = {
	textAlign: "center" as const,
};

const footerText = {
	color: "#6b7280",
	fontSize: "14px",
	margin: "0 0 8px",
};

export default ContactFormEmail;
