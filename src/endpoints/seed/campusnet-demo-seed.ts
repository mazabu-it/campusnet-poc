import type { Payload } from "payload";

export async function seedCampusnetDemoData(payload: Payload): Promise<void> {
	console.log("🌱 Starting Campusnet demo data seeding...");

	try {
		// 1. Create Grading Scale
		console.log("Creating grading scale...");
		const gradingScale = await payload.create({
			collection: "grading-scales",
			data: {
				name: "Standard 100-Point Scale",
				description: "Standard grading scale with letter grades",
				scaleType: "numeric-100",
				passThreshold: 60,
				isActive: true,
				gradeMappings: [
					{
						minScore: 97,
						maxScore: 100,
						letterGrade: "A+",
						numericGrade: 4.0,
						isPassing: true,
						description: "Exceptional",
					},
					{
						minScore: 93,
						maxScore: 96,
						letterGrade: "A",
						numericGrade: 4.0,
						isPassing: true,
						description: "Excellent",
					},
					{
						minScore: 90,
						maxScore: 92,
						letterGrade: "A-",
						numericGrade: 3.7,
						isPassing: true,
						description: "Very Good",
					},
					{
						minScore: 87,
						maxScore: 89,
						letterGrade: "B+",
						numericGrade: 3.3,
						isPassing: true,
						description: "Good Plus",
					},
					{
						minScore: 83,
						maxScore: 86,
						letterGrade: "B",
						numericGrade: 3.0,
						isPassing: true,
						description: "Good",
					},
					{
						minScore: 80,
						maxScore: 82,
						letterGrade: "B-",
						numericGrade: 2.7,
						isPassing: true,
						description: "Satisfactory Plus",
					},
					{
						minScore: 77,
						maxScore: 79,
						letterGrade: "C+",
						numericGrade: 2.3,
						isPassing: true,
						description: "Satisfactory",
					},
					{
						minScore: 73,
						maxScore: 76,
						letterGrade: "C",
						numericGrade: 2.0,
						isPassing: true,
						description: "Average",
					},
					{
						minScore: 70,
						maxScore: 72,
						letterGrade: "C-",
						numericGrade: 1.7,
						isPassing: true,
						description: "Below Average",
					},
					{
						minScore: 67,
						maxScore: 69,
						letterGrade: "D+",
						numericGrade: 1.3,
						isPassing: true,
						description: "Poor Plus",
					},
					{
						minScore: 63,
						maxScore: 66,
						letterGrade: "D",
						numericGrade: 1.0,
						isPassing: true,
						description: "Poor",
					},
					{
						minScore: 60,
						maxScore: 62,
						letterGrade: "D-",
						numericGrade: 0.7,
						isPassing: true,
						description: "Minimal Pass",
					},
					{
						minScore: 0,
						maxScore: 59,
						letterGrade: "F",
						numericGrade: 0.0,
						isPassing: false,
						description: "Fail",
					},
				],
			},
		});

		// 2. Create Academic Year
		console.log("Creating academic year...");
		const academicYear = await payload.create({
			collection: "academic-years",
			data: {
				yearLabel: "2024-2025",
				startDate: "2024-09-01T00:00:00.000Z",
				endDate: "2025-08-31T23:59:59.999Z",
				isActive: true,
				description: "Academic Year 2024-2025",
				semesters: [
					{
						name: "Fall 2024",
						startDate: "2024-09-01T00:00:00.000Z",
						endDate: "2024-12-20T23:59:59.999Z",
						isActive: true,
					},
					{
						name: "Spring 2025",
						startDate: "2025-01-15T00:00:00.000Z",
						endDate: "2025-05-15T23:59:59.999Z",
						isActive: true,
					},
				],
			},
		});

		// 3. Create Academic Calendar
		console.log("Creating academic calendar...");
		const academicCalendar = await payload.create({
			collection: "academic-calendars",
			data: {
				name: "Main Academic Calendar 2024-2025",
				academicYear: academicYear.id,
				isActive: true,
				importantDates: [
					{
						name: "Fall Semester Begins",
						date: "2024-09-01T00:00:00.000Z",
						type: "classes-start",
						description: "First day of fall semester classes",
					},
					{
						name: "Midterm Exams",
						date: "2024-10-15T00:00:00.000Z",
						type: "exam-start",
						description: "Midterm examination period begins",
					},
					{
						name: "Fall Break",
						date: "2024-11-25T00:00:00.000Z",
						type: "holiday",
						description: "Thanksgiving break",
					},
					{
						name: "Final Exams",
						date: "2024-12-10T00:00:00.000Z",
						type: "exam-start",
						description: "Final examination period",
					},
					{
						name: "Spring Semester Begins",
						date: "2025-01-15T00:00:00.000Z",
						type: "classes-start",
						description: "First day of spring semester classes",
					},
				],
			},
		});

		// 4. Create University
		console.log("Creating university...");
		const university = await payload.create({
			collection: "universities",
			data: {
				name: "Demo University",
				code: `DEMO-${Date.now()}`,
				description: "A comprehensive demo university for testing Campusnet",
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
						headerBranding: null,
						footerText: "Demo University - Academic Records",
						signatureRequired: true,
						watermarking: false,
						exportFormat: "pdf",
					},
				},
				isActive: true,
				contactInfo: {
					address: "123 University Avenue, Demo City, DC 12345",
					phone: "+1-555-0123",
					email: "info@demouniversity.edu",
					website: "https://demouniversity.edu",
				},
			},
		});

		// 5. Create Faculty
		console.log("Creating faculty...");
		const faculty = await payload.create({
			collection: "faculties",
			data: {
				university: university.id,
				name: "Faculty of Computer Science",
				code: "CS",
				description: "Faculty specializing in computer science and technology",
				contactInfo: {
					address: "Building A, Demo University",
					phone: "+1-555-0124",
					email: "cs@demouniversity.edu",
				},
				isActive: true,
			},
		});

		// 6. Create Department
		console.log("Creating department...");
		const department = await payload.create({
			collection: "departments",
			data: {
				faculty: faculty.id,
				name: "Department of Software Engineering",
				code: "SE",
				description:
					"Department focused on software engineering and development",
				contactInfo: {
					address: "Room 201, Building A",
					phone: "+1-555-0125",
					email: "se@demouniversity.edu",
				},
				isActive: true,
			},
		});

		// 7. Create Diploma Level
		console.log("Creating diploma level...");
		const diplomaLevel = await payload.create({
			collection: "diploma-levels",
			data: {
				name: "Bachelor of Science",
				code: `BSC-${Date.now()}`,
				level: "bachelor",
				description: "Bachelor of Science degree",
				typicalDuration: 4,
				isActive: true,
			},
		});

		// 8. Create Program
		console.log("Creating program...");
		const program = await payload.create({
			collection: "programs",
			data: {
				department: department.id,
				name: "Bachelor of Science in Software Engineering",
				code: "BSE",
				description: "Comprehensive software engineering program",
				diplomaLevel: diplomaLevel.id,
				duration: 4,
				curriculumRules: {
					totalCreditsRequired: 120,
					electiveCreditsAllowed: 30,
					maxCreditsPerSemester: 18,
					minCreditsPerSemester: 12,
					prerequisiteRules:
						"Prerequisites must be completed before advanced courses",
				},
				isActive: true,
			},
		});

		// 9. Create Program Years
		console.log("Creating program years...");
		const programYear1 = await payload.create({
			collection: "program-years",
			data: {
				program: program.id,
				yearNumber: 1,
				title: "First Year",
				requiredCredits: 30,
				electiveCreditsAllowed: 6,
				description: "Foundation year courses",
				isActive: true,
			},
		});

		const programYear2 = await payload.create({
			collection: "program-years",
			data: {
				program: program.id,
				yearNumber: 2,
				title: "Second Year",
				requiredCredits: 30,
				electiveCreditsAllowed: 6,
				description: "Intermediate year courses",
				isActive: true,
			},
		});

		// 10. Create Courses
		console.log("Creating courses...");
		const introProgramming = await payload.create({
			collection: "courses",
			data: {
				code: "CS101",
				title: "Introduction to Programming",
				description: "Fundamentals of programming concepts and practices",
				credits: 3,
				owningDepartment: department.id,
				courseType: "required",
				isActive: true,
				learningOutcomes: [
					{ outcome: "Understand basic programming concepts" },
					{ outcome: "Write simple programs in Python" },
					{ outcome: "Debug and test code effectively" },
				],
			},
		});

		const dataStructures = await payload.create({
			collection: "courses",
			data: {
				code: "CS201",
				title: "Data Structures and Algorithms",
				description: "Advanced data structures and algorithmic thinking",
				credits: 4,
				owningDepartment: department.id,
				courseType: "required",
				isActive: true,
				learningOutcomes: [
					{ outcome: "Implement common data structures" },
					{ outcome: "Analyze algorithm complexity" },
					{ outcome: "Solve problems using appropriate algorithms" },
				],
			},
		});

		const softwareEngineering = await payload.create({
			collection: "courses",
			data: {
				code: "SE301",
				title: "Software Engineering Principles",
				description: "Software development lifecycle and methodologies",
				credits: 3,
				owningDepartment: department.id,
				courseType: "required",
				isActive: true,
				learningOutcomes: [
					{ outcome: "Understand software development lifecycle" },
					{ outcome: "Apply software engineering methodologies" },
					{ outcome: "Work effectively in development teams" },
				],
			},
		});

		// 11. Create Course Variations
		console.log("Creating course variations...");
		const introProgrammingVar = await payload.create({
			collection: "course-variations",
			data: {
				course: introProgramming.id,
				department: department.id,
				programYear: programYear1.id,
				codeVariant: "CS101-A",
				titleVariant: "Introduction to Programming (Section A)",
				descriptionVariant: "Morning section of intro programming",
				locale: "en",
				credits: 3,
				isActive: true,
			},
		});

		const dataStructuresVar = await payload.create({
			collection: "course-variations",
			data: {
				course: dataStructures.id,
				department: department.id,
				programYear: programYear2.id,
				codeVariant: "CS201-A",
				titleVariant: "Data Structures and Algorithms (Section A)",
				descriptionVariant: "Main section of data structures course",
				locale: "en",
				credits: 4,
				isActive: true,
			},
		});

		const softwareEngineeringVar = await payload.create({
			collection: "course-variations",
			data: {
				course: softwareEngineering.id,
				department: department.id,
				programYear: programYear2.id,
				codeVariant: "SE301-A",
				titleVariant: "Software Engineering Principles (Section A)",
				descriptionVariant: "Core software engineering course",
				locale: "en",
				credits: 3,
				isActive: true,
			},
		});

		// 12. Create Users (Professor and Students)
		console.log("Creating users...");
		const professor = await payload.create({
			collection: "users",
			data: {
				name: "Dr. Sarah Johnson",
				email: "sarah.johnson@demouniversity.edu",
				password: "password123",
				role: "professor",
			},
		});

		console.log("Professor created with ID:", professor.id);

		const student1 = await payload.create({
			collection: "users",
			data: {
				name: "Alex Chen",
				email: "alex.chen@demouniversity.edu",
				password: "password123",
				role: "student",
			},
		});

		const student2 = await payload.create({
			collection: "users",
			data: {
				name: "Emma Rodriguez",
				email: "emma.rodriguez@demouniversity.edu",
				password: "password123",
				role: "student",
			},
		});

		// 13. Create Course Instances
		console.log("Creating course instances...");
		const introProgrammingInstance = await payload.create({
			collection: "course-instances",
			data: {
				courseVariation: introProgrammingVar.id,
				academicYear: academicYear.id,
				instanceTitle: "Fall 2024 - Introduction to Programming",
				maxEnrollment: 30,
				currentEnrollment: 0,
				schedule: {
					days: ["monday", "wednesday", "friday"],
					startTime: "09:00",
					endTime: "10:30",
					room: "A101",
				},
				status: "open",
				notes: "Morning section with hands-on programming labs",
				professors: [professor.id],
			},
		});

		const dataStructuresInstance = await payload.create({
			collection: "course-instances",
			data: {
				courseVariation: dataStructuresVar.id,
				academicYear: academicYear.id,
				instanceTitle: "Fall 2024 - Data Structures and Algorithms",
				maxEnrollment: 25,
				currentEnrollment: 0,
				schedule: {
					days: ["tuesday", "thursday"],
					startTime: "14:00",
					endTime: "16:00",
					room: "A205",
				},
				status: "open",
				notes: "Afternoon section with algorithm analysis focus",
				professors: [professor.id],
			},
		});

		const _softwareEngineeringInstance = await payload.create({
			collection: "course-instances",
			data: {
				courseVariation: softwareEngineeringVar.id,
				academicYear: academicYear.id,
				instanceTitle: "Spring 2025 - Software Engineering Principles",
				maxEnrollment: 20,
				currentEnrollment: 0,
				schedule: {
					days: ["monday", "wednesday"],
					startTime: "10:00",
					endTime: "11:30",
					room: "A301",
				},
				status: "planning",
				notes: "Project-based course with team assignments",
				professors: [professor.id],
			},
		});

		// 14. Create Assessment Templates
		console.log("Creating assessment templates...");
		const introProgrammingMidterm = await payload.create({
			collection: "assessment-templates",
			data: {
				courseInstance: introProgrammingInstance.id,
				name: "Midterm Exam",
				description: "Midterm examination covering programming fundamentals",
				weightPercent: 30,
				minScore: 0,
				maxScore: 100,
				isOptional: false,
				assessmentType: "exam",
				instructions: "Complete all programming problems. Show your work.",
				isActive: true,
				rubric: [
					{
						criteria: "Code Correctness",
						description: "Program runs without errors",
						maxPoints: 40,
					},
					{
						criteria: "Code Quality",
						description: "Clean, readable code",
						maxPoints: 30,
					},
					{
						criteria: "Problem Solving",
						description: "Logical approach to problems",
						maxPoints: 30,
					},
				],
			},
		});

		const introProgrammingFinal = await payload.create({
			collection: "assessment-templates",
			data: {
				courseInstance: introProgrammingInstance.id,
				name: "Final Exam",
				description: "Comprehensive final examination",
				weightPercent: 40,
				minScore: 0,
				maxScore: 100,
				isOptional: false,
				assessmentType: "exam",
				instructions: "Complete all sections. Partial credit will be given.",
				isActive: true,
			},
		});

		const introProgrammingProject = await payload.create({
			collection: "assessment-templates",
			data: {
				courseInstance: introProgrammingInstance.id,
				name: "Programming Project",
				description: "Individual programming project",
				weightPercent: 30,
				minScore: 0,
				maxScore: 100,
				isOptional: false,
				assessmentType: "project",
				instructions:
					"Create a complete program demonstrating course concepts.",
				isActive: true,
			},
		});

		const dataStructuresMidterm = await payload.create({
			collection: "assessment-templates",
			data: {
				courseInstance: dataStructuresInstance.id,
				name: "Midterm Exam",
				description: "Data structures and algorithm analysis",
				weightPercent: 35,
				minScore: 0,
				maxScore: 100,
				isOptional: false,
				assessmentType: "exam",
				instructions: "Analyze algorithms and implement data structures.",
				isActive: true,
			},
		});

		const dataStructuresFinal = await payload.create({
			collection: "assessment-templates",
			data: {
				courseInstance: dataStructuresInstance.id,
				name: "Final Exam",
				description: "Comprehensive final examination",
				weightPercent: 45,
				minScore: 0,
				maxScore: 100,
				isOptional: false,
				assessmentType: "exam",
				instructions: "Complete all algorithm and data structure problems.",
				isActive: true,
			},
		});

		const dataStructuresAssignment = await payload.create({
			collection: "assessment-templates",
			data: {
				courseInstance: dataStructuresInstance.id,
				name: "Algorithm Analysis Assignment",
				description: "Written assignment on algorithm complexity",
				weightPercent: 20,
				minScore: 0,
				maxScore: 100,
				isOptional: false,
				assessmentType: "assignment",
				instructions:
					"Analyze the time and space complexity of given algorithms.",
				isActive: true,
			},
		});

		// 15. Create Assessments
		console.log("Creating assessments...");
		const introMidtermAssessment = await payload.create({
			collection: "assessments",
			data: {
				assessmentTemplate: introProgrammingMidterm.id,
				title: "Fall 2024 Midterm Exam - CS101",
				description: "Midterm examination for Introduction to Programming",
				date: "2024-10-15T09:00:00.000Z",
				startTime: "09:00",
				endTime: "11:00",
				location: "A101",
				status: "published",
				submissionWindow: {
					opensAt: "2024-10-15T09:00:00.000Z",
					closesAt: "2024-10-15T11:00:00.000Z",
					lateSubmissionAllowed: false,
					latePenaltyPercent: 0,
				},
				gradingWindow: {
					opensAt: "2024-10-15T11:00:00.000Z",
					closesAt: "2024-10-22T23:59:59.999Z",
					allowLateGrading: false,
				},
				instructions:
					"Complete all programming problems. Show your work clearly.",
				notes: "Closed book exam. No electronic devices allowed.",
			},
		});

		const _introFinalAssessment = await payload.create({
			collection: "assessments",
			data: {
				assessmentTemplate: introProgrammingFinal.id,
				title: "Fall 2024 Final Exam - CS101",
				description: "Final examination for Introduction to Programming",
				date: "2024-12-10T09:00:00.000Z",
				startTime: "09:00",
				endTime: "12:00",
				location: "A101",
				status: "open",
				submissionWindow: {
					opensAt: "2024-12-10T09:00:00.000Z",
					closesAt: "2024-12-10T12:00:00.000Z",
					lateSubmissionAllowed: false,
					latePenaltyPercent: 0,
				},
				gradingWindow: {
					opensAt: "2024-12-10T12:00:00.000Z",
					closesAt: "2024-12-17T23:59:59.999Z",
					allowLateGrading: false,
				},
				instructions:
					"Complete all sections. Partial credit will be given for correct approaches.",
				notes: "Comprehensive exam covering all course material.",
			},
		});

		const introProjectAssessment = await payload.create({
			collection: "assessments",
			data: {
				assessmentTemplate: introProgrammingProject.id,
				title: "Fall 2024 Programming Project - CS101",
				description:
					"Individual programming project demonstrating course concepts",
				date: "2024-11-20T23:59:59.999Z",
				status: "open",
				submissionWindow: {
					opensAt: "2024-10-01T00:00:00.000Z",
					closesAt: "2024-11-20T23:59:59.999Z",
					lateSubmissionAllowed: true,
					latePenaltyPercent: 10,
				},
				gradingWindow: {
					opensAt: "2024-11-21T00:00:00.000Z",
					closesAt: "2024-12-05T23:59:59.999Z",
					allowLateGrading: true,
				},
				instructions:
					"Create a complete program that demonstrates your understanding of programming concepts.",
				notes:
					"Project must be original work. Include documentation and comments.",
			},
		});

		const dataStructuresMidtermAssessment = await payload.create({
			collection: "assessments",
			data: {
				assessmentTemplate: dataStructuresMidterm.id,
				title: "Fall 2024 Midterm Exam - CS201",
				description: "Midterm examination for Data Structures and Algorithms",
				date: "2024-10-20T14:00:00.000Z",
				startTime: "14:00",
				endTime: "16:00",
				location: "A205",
				status: "published",
				submissionWindow: {
					opensAt: "2024-10-20T14:00:00.000Z",
					closesAt: "2024-10-20T16:00:00.000Z",
					lateSubmissionAllowed: false,
					latePenaltyPercent: 0,
				},
				gradingWindow: {
					opensAt: "2024-10-20T16:00:00.000Z",
					closesAt: "2024-10-27T23:59:59.999Z",
					allowLateGrading: false,
				},
				instructions:
					"Analyze algorithms and implement data structures as requested.",
				notes: "Focus on algorithmic thinking and efficiency.",
			},
		});

		// 16. Create Enrollments
		console.log("Creating enrollments...");
		const alexIntroEnrollment = await payload.create({
			collection: "enrollments",
			data: {
				student: student1.id,
				courseInstance: introProgrammingInstance.id,
				enrollmentTitle: "Alex Chen - CS101 Fall 2024",
				status: "active",
				enrolledAt: "2024-09-01T00:00:00.000Z",
				enrollmentType: "required",
				notes: "First-year student enrolled in required course",
			},
		});

		const emmaDataStructuresEnrollment = await payload.create({
			collection: "enrollments",
			data: {
				student: student2.id,
				courseInstance: dataStructuresInstance.id,
				enrollmentTitle: "Emma Rodriguez - CS201 Fall 2024",
				status: "active",
				enrolledAt: "2024-09-01T00:00:00.000Z",
				enrollmentType: "required",
				notes: "Second-year student with strong programming background",
			},
		});

		// 17. Create Scores
		console.log("Creating scores...");
		// Alex's scores for Introduction to Programming
		await payload.create({
			collection: "scores",
			data: {
				assessment: introMidtermAssessment.id,
				student: student1.id,
				scoreTitle: "Alex Chen - CS101 Midterm",
				value: 85,
				maxValue: 100,
				percentage: 85,
				isLate: false,
				latePenaltyApplied: 0,
				finalValue: 85,
				gradedBy: professor.id,
				gradedAt: "2024-10-16T10:00:00.000Z",
				feedback:
					"Good understanding of basic concepts. Work on code organization.",
				notes: "Solid performance with room for improvement in code structure.",
				isExcused: false,
			},
		});

		await payload.create({
			collection: "scores",
			data: {
				assessment: introProjectAssessment.id,
				student: student1.id,
				scoreTitle: "Alex Chen - CS101 Project",
				value: 92,
				maxValue: 100,
				percentage: 92,
				isLate: false,
				latePenaltyApplied: 0,
				finalValue: 92,
				gradedBy: professor.id,
				gradedAt: "2024-11-25T14:00:00.000Z",
				feedback:
					"Excellent project! Well-documented code and creative solution.",
				notes: "Demonstrates strong programming skills and creativity.",
				isExcused: false,
			},
		});

		// Emma's scores for Data Structures
		await payload.create({
			collection: "scores",
			data: {
				assessment: dataStructuresMidtermAssessment.id,
				student: student2.id,
				scoreTitle: "Emma Rodriguez - CS201 Midterm",
				value: 94,
				maxValue: 100,
				percentage: 94,
				isLate: false,
				latePenaltyApplied: 0,
				finalValue: 94,
				gradedBy: professor.id,
				gradedAt: "2024-10-21T16:30:00.000Z",
				feedback:
					"Outstanding work! Excellent algorithmic thinking and implementation.",
				notes: "Top performer in the class. Strong analytical skills.",
				isExcused: false,
			},
		});

		// 18. Create Grade Aggregates
		console.log("Creating grade aggregates...");
		const _alexGradeAggregate = await payload.create({
			collection: "grade-aggregates",
			data: {
				enrollment: alexIntroEnrollment.id,
				gradeTitle: "Alex Chen - CS101 Final Grade",
				finalNumeric: 88.5,
				finalLetter: "B+",
				passFail: "pass",
				gpaPoints: 3.3,
				calculationMethod: "weighted-average",
				decisionNotes:
					"Weighted average of midterm (30%), project (30%), and final (40%)",
				calculatedAt: "2024-12-18T15:00:00.000Z",
				calculatedBy: professor.id,
				isPublished: true,
				publishedAt: "2024-12-18T15:00:00.000Z",
				assessmentBreakdown: [
					{
						assessmentTemplate: introProgrammingMidterm.id,
						score: 85,
						maxScore: 100,
						weight: 30,
						contribution: 25.5,
						isMissing: false,
						isExcused: false,
					},
					{
						assessmentTemplate: introProgrammingProject.id,
						score: 92,
						maxScore: 100,
						weight: 30,
						contribution: 27.6,
						isMissing: false,
						isExcused: false,
					},
					{
						assessmentTemplate: introProgrammingFinal.id,
						score: 88,
						maxScore: 100,
						weight: 40,
						contribution: 35.2,
						isMissing: false,
						isExcused: false,
					},
				],
			},
		});

		const _emmaGradeAggregate = await payload.create({
			collection: "grade-aggregates",
			data: {
				enrollment: emmaDataStructuresEnrollment.id,
				gradeTitle: "Emma Rodriguez - CS201 Final Grade",
				finalNumeric: 94,
				finalLetter: "A",
				passFail: "pass",
				gpaPoints: 4.0,
				calculationMethod: "weighted-average",
				decisionNotes: "Excellent performance across all assessments",
				calculatedAt: "2024-12-18T16:00:00.000Z",
				calculatedBy: professor.id,
				isPublished: true,
				publishedAt: "2024-12-18T16:00:00.000Z",
				assessmentBreakdown: [
					{
						assessmentTemplate: dataStructuresMidterm.id,
						score: 94,
						maxScore: 100,
						weight: 35,
						contribution: 32.9,
						isMissing: false,
						isExcused: false,
					},
					{
						assessmentTemplate: dataStructuresAssignment.id,
						score: 96,
						maxScore: 100,
						weight: 20,
						contribution: 19.2,
						isMissing: false,
						isExcused: false,
					},
					{
						assessmentTemplate: dataStructuresFinal.id,
						score: 92,
						maxScore: 100,
						weight: 45,
						contribution: 41.4,
						isMissing: false,
						isExcused: false,
					},
				],
			},
		});

		console.log("✅ Campusnet demo data seeding completed successfully!");
		console.log("📊 Created:");
		console.log("  - 1 University (Demo University)");
		console.log("  - 1 Faculty (Computer Science)");
		console.log("  - 1 Department (Software Engineering)");
		console.log("  - 1 Program (BSE)");
		console.log("  - 2 Program Years");
		console.log("  - 3 Courses (CS101, CS201, SE301)");
		console.log("  - 3 Course Instances");
		console.log("  - 1 Professor (Dr. Sarah Johnson)");
		console.log("  - 2 Students (Alex Chen, Emma Rodriguez)");
		console.log("  - 6 Assessment Templates");
		console.log("  - 4 Assessments");
		console.log("  - 2 Enrollments");
		console.log("  - 3 Scores");
		console.log("  - 2 Grade Aggregates");
		console.log("");
		console.log("🎓 Demo Credentials:");
		console.log("  Professor: sarah.johnson@demouniversity.edu / password123");
		console.log("  Student 1: alex.chen@demouniversity.edu / password123");
		console.log("  Student 2: emma.rodriguez@demouniversity.edu / password123");
	} catch (error) {
		console.error("❌ Error seeding Campusnet demo data:", error);
		throw error;
	}
}
