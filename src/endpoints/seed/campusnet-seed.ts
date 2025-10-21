import type { PayloadRequest } from "payload";

export async function seedCampusnetData(req: PayloadRequest) {
	try {
		console.log("Starting Campusnet data seeding...");

		// Create grading scales
		const gradingScale = await req.payload.create({
			collection: "grading-scales",
			data: {
				name: "Standard 0-100 Scale",
				description: "Standard numeric grading scale from 0 to 100",
				scaleType: "numeric-100",
				gradeMappings: [
					{
						minScore: 90,
						maxScore: 100,
						letterGrade: "A+",
						numericGrade: 4.0,
						isPassing: true,
						description: "Excellent",
					},
					{
						minScore: 85,
						maxScore: 89,
						letterGrade: "A",
						numericGrade: 3.7,
						isPassing: true,
						description: "Very Good",
					},
					{
						minScore: 80,
						maxScore: 84,
						letterGrade: "A-",
						numericGrade: 3.3,
						isPassing: true,
						description: "Good",
					},
					{
						minScore: 75,
						maxScore: 79,
						letterGrade: "B+",
						numericGrade: 3.0,
						isPassing: true,
						description: "Above Average",
					},
					{
						minScore: 70,
						maxScore: 74,
						letterGrade: "B",
						numericGrade: 2.7,
						isPassing: true,
						description: "Average",
					},
					{
						minScore: 65,
						maxScore: 69,
						letterGrade: "B-",
						numericGrade: 2.3,
						isPassing: true,
						description: "Below Average",
					},
					{
						minScore: 60,
						maxScore: 64,
						letterGrade: "C+",
						numericGrade: 2.0,
						isPassing: true,
						description: "Satisfactory",
					},
					{
						minScore: 55,
						maxScore: 59,
						letterGrade: "C",
						numericGrade: 1.7,
						isPassing: true,
						description: "Passing",
					},
					{
						minScore: 50,
						maxScore: 54,
						letterGrade: "C-",
						numericGrade: 1.3,
						isPassing: true,
						description: "Minimum Pass",
					},
					{
						minScore: 0,
						maxScore: 49,
						letterGrade: "F",
						numericGrade: 0.0,
						isPassing: false,
						description: "Fail",
					},
				],
				passThreshold: 50,
				isActive: true,
			},
		});

		// Create diploma levels
		const bachelorLevel = await req.payload.create({
			collection: "diploma-levels",
			data: {
				name: "Bachelor",
				code: "BACHELOR-" + Date.now(), // Make it unique
				level: "bachelor",
				description: "Bachelor degree level",
				typicalDuration: 3,
				isActive: true,
			},
		});

		const masterLevel = await req.payload.create({
			collection: "diploma-levels",
			data: {
				name: "Master",
				code: "MASTER-" + Date.now(), // Make it unique
				level: "master",
				description: "Master degree level",
				typicalDuration: 2,
				isActive: true,
			},
		});

		// Create academic year
		const academicYear = await req.payload.create({
			collection: "academic-years",
			data: {
				yearLabel: "2025-2026",
				startDate: "2025-09-01",
				endDate: "2026-08-31",
				semesters: [
					{
						name: "Fall Semester 2025",
						startDate: "2025-09-01",
						endDate: "2025-12-20",
						isActive: true,
					},
					{
						name: "Spring Semester 2026",
						startDate: "2026-01-15",
						endDate: "2026-05-15",
						isActive: true,
					},
				],
				isActive: true,
				description: "Academic year 2025-2026",
			},
		});

		// Create academic calendar
		const academicCalendar = await req.payload.create({
			collection: "academic-calendars",
			data: {
				name: "Academic Calendar 2025-2026",
				academicYear: academicYear.id,
				importantDates: [
					{
						name: "Enrollment Opens",
						date: "2025-08-01",
						type: "enrollment-start",
						description: "Student enrollment begins",
					},
					{
						name: "Enrollment Closes",
						date: "2025-09-15",
						type: "enrollment-end",
						description: "Student enrollment ends",
					},
					{
						name: "Classes Start",
						date: "2025-09-01",
						type: "classes-start",
						description: "First day of classes",
					},
					{
						name: "Classes End",
						date: "2026-05-15",
						type: "classes-end",
						description: "Last day of classes",
					},
					{
						name: "Exam Period Start",
						date: "2026-05-20",
						type: "exam-start",
						description: "Final exams begin",
					},
					{
						name: "Exam Period End",
						date: "2026-06-10",
						type: "exam-end",
						description: "Final exams end",
					},
					{
						name: "Grade Submission Deadline",
						date: "2026-06-15",
						type: "grade-deadline",
						description: "All grades must be submitted",
					},
				],
				isActive: true,
			},
		});

		// Create university
		const university = await req.payload.create({
			collection: "universities",
			data: {
				name: "Campusnet University",
				code: "CNU-" + Date.now(), // Make it unique
				description:
					"A modern university using Campusnet for academic management",
				locale: "en",
				timezone: "Europe/Brussels",
				gradingScale: gradingScale.id,
				academicCalendar: academicCalendar.id,
				configuration: {
					roundingRule: "bankers",
					decimalPrecision: 2,
					retakePolicy: {
						maxRetakes: 2,
						weightRepl: "replace",
						capRule: "pass-cap",
					},
					assessWindows: {
						defaultOpenDays: 7,
						defaultCloseDays: 14,
						latePolicy: "allow",
					},
					reportConfig: {
						signatureRequired: true,
						watermarking: false,
						exportFormat: "pdf",
					},
				},
				isActive: true,
				contactInfo: {
					address: "123 University Street, Brussels, Belgium",
					phone: "+32 2 123 4567",
					email: "info@campusnet-university.edu",
					website: "https://campusnet-university.edu",
				},
			},
		});

		// Create faculty
		const faculty = await req.payload.create({
			collection: "faculties",
			data: {
				university: university.id,
				name: "Faculty of Computer Science",
				code: "FCS",
				description: "Faculty specializing in computer science and technology",
				contactInfo: {
					address: "456 Tech Avenue, Brussels, Belgium",
					phone: "+32 2 234 5678",
					email: "fcs@campusnet-university.edu",
				},
				isActive: true,
			},
		});

		// Create department
		const department = await req.payload.create({
			collection: "departments",
			data: {
				faculty: faculty.id,
				name: "Department of Software Engineering",
				code: "DSE",
				description:
					"Department focused on software engineering and development",
				contactInfo: {
					address: "789 Code Street, Brussels, Belgium",
					phone: "+32 2 345 6789",
					email: "dse@campusnet-university.edu",
				},
				isActive: true,
			},
		});

		// Create programs
		const bachelorProgram = await req.payload.create({
			collection: "programs",
			data: {
				department: department.id,
				name: "Bachelor in Software Engineering",
				code: "BSE",
				description: "Comprehensive bachelor program in software engineering",
				diplomaLevel: bachelorLevel.id,
				duration: 3,
				curriculumRules: {
					totalCreditsRequired: 180,
					electiveCreditsAllowed: 30,
					maxCreditsPerSemester: 30,
					minCreditsPerSemester: 12,
					prerequisiteRules:
						"Students must complete prerequisite courses before enrolling in advanced courses.",
				},
				isActive: true,
			},
		});

		const masterProgram = await req.payload.create({
			collection: "programs",
			data: {
				department: department.id,
				name: "Master in Software Engineering",
				code: "MSE",
				description: "Advanced master program in software engineering",
				diplomaLevel: masterLevel.id,
				duration: 2,
				curriculumRules: {
					totalCreditsRequired: 120,
					electiveCreditsAllowed: 20,
					maxCreditsPerSemester: 30,
					minCreditsPerSemester: 12,
					prerequisiteRules:
						"Students must hold a bachelor degree in computer science or related field.",
				},
				isActive: true,
			},
		});

		// Create program years
		await req.payload.create({
			collection: "program-years",
			data: {
				program: bachelorProgram.id,
				yearNumber: 1,
				requiredCredits: 60,
				electiveCreditsAllowed: 10,
				description: "First year of Bachelor in Software Engineering",
				isActive: true,
			},
		});

		await req.payload.create({
			collection: "program-years",
			data: {
				program: bachelorProgram.id,
				yearNumber: 2,
				requiredCredits: 60,
				electiveCreditsAllowed: 10,
				description: "Second year of Bachelor in Software Engineering",
				isActive: true,
			},
		});

		await req.payload.create({
			collection: "program-years",
			data: {
				program: bachelorProgram.id,
				yearNumber: 3,
				requiredCredits: 60,
				electiveCreditsAllowed: 10,
				description: "Third year of Bachelor in Software Engineering",
				isActive: true,
			},
		});

		// Create courses
		const courses = [
			{
				code: "CS101",
				title: "Introduction to Programming",
				description: "Fundamental concepts of programming and problem solving",
				credits: 6,
				courseType: "required" as const,
				learningOutcomes: [
					{ outcome: "Understand basic programming concepts" },
					{ outcome: "Write simple programs in a high-level language" },
					{ outcome: "Debug and test programs effectively" },
				],
			},
			{
				code: "CS102",
				title: "Data Structures and Algorithms",
				description: "Fundamental data structures and algorithm design",
				credits: 6,
				courseType: "required" as const,
				learningOutcomes: [
					{ outcome: "Implement common data structures" },
					{ outcome: "Analyze algorithm complexity" },
					{ outcome: "Design efficient algorithms" },
				],
			},
			{
				code: "CS201",
				title: "Software Engineering Principles",
				description: "Introduction to software engineering methodologies",
				credits: 6,
				courseType: "required" as const,
				learningOutcomes: [
					{ outcome: "Apply software engineering principles" },
					{ outcome: "Work effectively in development teams" },
					{ outcome: "Use version control systems" },
				],
			},
			{
				code: "CS301",
				title: "Advanced Software Design",
				description:
					"Advanced topics in software architecture and design patterns",
				credits: 6,
				courseType: "required" as const,
				learningOutcomes: [
					{ outcome: "Design scalable software architectures" },
					{ outcome: "Apply design patterns effectively" },
					{ outcome: "Evaluate software quality metrics" },
				],
			},
		];

		const createdCourses = [];
		for (const courseData of courses) {
			const course = await req.payload.create({
				collection: "courses",
				data: {
					...courseData,
					owningDepartment: department.id,
					isActive: true,
				},
			});
			createdCourses.push(course);
		}

		// Create course variations
		const courseVariations = [];
		for (const course of createdCourses) {
			const variation = await req.payload.create({
				collection: "course-variations",
				data: {
					course: course.id,
					department: department.id,
					codeVariant: course.code,
					titleVariant: course.title,
					descriptionVariant: course.description,
					locale: "en",
					credits: course.credits,
					isActive: true,
				},
			});
			courseVariations.push(variation);
		}

		console.log("Campusnet data seeding completed successfully!");
		return {
			university,
			faculty,
			department,
			bachelorProgram,
			masterProgram,
			academicYear,
			gradingScale,
			courses: createdCourses,
			courseVariations,
		};
	} catch (error) {
		console.error("Error seeding Campusnet data:", error);
		throw error;
	}
}
