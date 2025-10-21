import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Preview,
	Section,
	Text,
} from "@react-email/components";

interface WelcomeEmailProps {
	name: string;
	_email: string;
}

export const WelcomeEmail = ({ name, _email }: WelcomeEmailProps) => (
	<Html>
		<Head />
		<Preview>Welcome to Demo University, {name}!</Preview>
		<Body style={main}>
			<Container style={container}>
				<Section style={header}>
					<Heading style={h1}>Welcome to Demo University!</Heading>
				</Section>
				<Section style={content}>
					<Text style={paragraph}>Dear {name},</Text>

					<Text style={paragraph}>
						Thank you for your interest in Demo University!
						We&apos;re excited to have you as part of our community.
					</Text>

					<Text style={paragraph}>
						Our admissions team will review your application and get
						back to you within 5-7 business days. In the meantime,
						feel free to explore our website to learn more about our
						programs, faculty, and campus life.
					</Text>

					<Section style={buttonContainer}>
						<Button
							style={button}
							href="https://demouniversity.edu"
						>
							Explore Our Programs
						</Button>
					</Section>
					<Hr style={hr} />

					<Text style={footerText}>
						If you have any questions, please don&apos;t hesitate to
						contact us at admissions@demouniversity.edu or call
						(555) 123-4567.
					</Text>
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

const content = {
	padding: "0 24px",
};

const paragraph = {
	color: "#374151",
	fontSize: "16px",
	lineHeight: "24px",
	margin: "0 0 24px",
};

const buttonContainer = {
	textAlign: "center" as const,
	margin: "32px 0",
};

const button = {
	backgroundColor: "#3b82f6",
	borderRadius: "8px",
	color: "#ffffff",
	fontSize: "16px",
	fontWeight: "bold",
	textDecoration: "none",
	textAlign: "center" as const,
	display: "inline-block",
	padding: "12px 24px",
};

const hr = {
	borderColor: "#e5e7eb",
	margin: "32px 0",
};

const footerText = {
	color: "#6b7280",
	fontSize: "14px",
	margin: "0",
};
