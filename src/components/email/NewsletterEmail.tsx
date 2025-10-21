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

interface NewsletterEmailProps {
	name: string;
	_email: string;
}

export const NewsletterEmail = ({ name, _email }: NewsletterEmailProps) => (
	<Html>
		<Head />
		<Preview>Welcome to Demo University Newsletter!</Preview>
		<Body style={main}>
			<Container style={container}>
				<Section style={header}>
					<Heading style={h1}>Welcome to Our Newsletter!</Heading>
				</Section>
				<Section style={content}>
					<Text style={paragraph}>Dear {name},</Text>

					<Text style={paragraph}>
						Thank you for subscribing to the Demo University
						newsletter! You&apos;ll now receive regular updates
						about:
					</Text>

					<ul style={list}>
						<li>Latest news and announcements</li>
						<li>Upcoming events and activities</li>
						<li>Faculty achievements and research</li>
						<li>Student success stories</li>
						<li>Important dates and deadlines</li>
					</ul>

					<Text style={paragraph}>
						We&apos;re committed to keeping you informed about
						everything happening at Demo University.
					</Text>

					<Hr style={hr} />
					<Text style={footerText}>
						You can unsubscribe at any time by clicking the link at
						the bottom of our emails.
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

const list = {
	color: "#374151",
	fontSize: "16px",
	lineHeight: "24px",
	margin: "0 0 24px",
	paddingLeft: "20px",
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
