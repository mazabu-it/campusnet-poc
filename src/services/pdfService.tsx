import {
	Document,
	Page,
	pdf,
	StyleSheet,
	Text,
	View,
} from "@react-pdf/renderer";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

// React PDF Components for generating PDFs
export const StudentReportPDF = ({
	student,
	grades,
	_courses,
}: {
	student: unknown;
	grades: unknown;
	_courses: unknown;
}) => (
	<Document>
		<Page size="A4" style={styles.page}>
			<View style={styles.header}>
				<Text style={styles.title}>Demo University</Text>
				<Text style={styles.subtitle}>Student Academic Report</Text>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Student Information</Text>
				<Text style={styles.text}>Name: {student?.name}</Text>
				<Text style={styles.text}>
					Student ID: {student?.studentId}
				</Text>
				<Text style={styles.text}>
					Program: {student?.program?.name}
				</Text>
				<Text style={styles.text}>
					Academic Year: {student?.academicYear?.name}
				</Text>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Academic Performance</Text>
				{grades?.map((grade: unknown, index: number) => (
					<View
						key={(grade as { id?: string }).id || index}
						style={styles.gradeItem}
					>
						<Text style={styles.text}>
							Course: {grade.courseInstance?.course?.name}
						</Text>
						<Text style={styles.text}>
							Grade: {grade.finalGrade}
						</Text>
						<Text style={styles.text}>
							GPA Points: {grade.gpaPoints}
						</Text>
					</View>
				))}
			</View>

			<View style={styles.footer}>
				<Text style={styles.footerText}>
					Generated on {new Date().toLocaleDateString()}
				</Text>
			</View>
		</Page>
	</Document>
);

const styles = StyleSheet.create({
	page: {
		flexDirection: "column",
		backgroundColor: "#ffffff",
		padding: 30,
	},
	header: {
		marginBottom: 20,
		textAlign: "center",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 10,
	},
	subtitle: {
		fontSize: 16,
		color: "#666666",
	},
	section: {
		marginBottom: 20,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
		color: "#333333",
	},
	text: {
		fontSize: 12,
		marginBottom: 5,
	},
	gradeItem: {
		marginBottom: 10,
		padding: 10,
		backgroundColor: "#f5f5f5",
	},
	footer: {
		marginTop: 30,
		textAlign: "center",
	},
	footerText: {
		fontSize: 10,
		color: "#999999",
	},
});

// PDF Service class for advanced PDF operations
export class PDFService {
	async generateStudentReport(
		student: unknown,
		grades: unknown[],
		courses: unknown[],
	) {
		try {
			const pdfDoc = await pdf(
				StudentReportPDF({ student, grades, courses }),
			).toBlob();
			return pdfDoc;
		} catch (error) {
			console.error("Error generating student report:", error);
			throw error;
		}
	}

	async generateTranscript(student: unknown, academicHistory: unknown[]) {
		try {
			const pdfDoc = await PDFDocument.create();
			const page = pdfDoc.addPage([600, 800]);

			const { width: _width, height } = page.getSize();
			const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

			// Header
			page.drawText("Demo University", {
				x: 50,
				y: height - 50,
				size: 24,
				font,
				color: rgb(0, 0, 0),
			});

			page.drawText("Official Transcript", {
				x: 50,
				y: height - 80,
				size: 18,
				font,
				color: rgb(0, 0, 0),
			});

			// Student info
			page.drawText(`Student: ${student?.name}`, {
				x: 50,
				y: height - 120,
				size: 12,
				font,
				color: rgb(0, 0, 0),
			});

			page.drawText(`ID: ${student?.studentId}`, {
				x: 50,
				y: height - 140,
				size: 12,
				font,
				color: rgb(0, 0, 0),
			});

			// Academic history
			let yPosition = height - 180;
			academicHistory.forEach((record: unknown) => {
				page.drawText(`${record.course} - ${record.grade}`, {
					x: 50,
					y: yPosition,
					size: 10,
					font,
					color: rgb(0, 0, 0),
				});
				yPosition -= 20;
			});

			const pdfBytes = await pdfDoc.save();
			return new Blob([pdfBytes], { type: "application/pdf" });
		} catch (error) {
			console.error("Error generating transcript:", error);
			throw error;
		}
	}

	async signDocument(pdfBlob: Blob, _signatureData: string) {
		try {
			const pdfDoc = await PDFDocument.load(await pdfBlob.arrayBuffer());
			const page = pdfDoc.getPages()[0];
			const { width, height: _height } = page.getSize();

			// Add signature placeholder
			page.drawRectangle({
				x: width - 200,
				y: 50,
				width: 150,
				height: 50,
				borderColor: rgb(0, 0, 0),
				borderWidth: 1,
			});

			page.drawText("Digital Signature", {
				x: width - 190,
				y: 70,
				size: 10,
				font: await pdfDoc.embedFont(StandardFonts.Helvetica),
				color: rgb(0, 0, 0),
			});

			const signedPdfBytes = await pdfDoc.save();
			return new Blob([signedPdfBytes], { type: "application/pdf" });
		} catch (error) {
			console.error("Error signing document:", error);
			throw error;
		}
	}
}

export const pdfService = new PDFService();
