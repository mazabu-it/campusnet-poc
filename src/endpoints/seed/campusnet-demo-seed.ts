import { faker } from "@faker-js/faker";
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
				description:
					"A comprehensive demo university for testing Campusnet",
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
				description:
					"Faculty specializing in computer science and technology",
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
				description:
					"Fundamentals of programming concepts and practices",
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
				description:
					"Advanced data structures and algorithmic thinking",
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

		// 12. Create Users (Professors, Students, Staff)
		console.log("Creating users...");

		// Create multiple professors
		const professors = [];
		for (let i = 0; i < 5; i++) {
			const professor = await payload.create({
				collection: "users",
				data: {
					name: faker.person.fullName(),
					email: faker.internet.email(),
					password: "password123",
					role: "professor",
					university: university.id,
					faculty: faculty.id,
					department: department.id,
					employeeId: `EMP${faker.number.int({ min: 1000, max: 9999 })}`,
					profile: {
						phone: faker.phone.number(),
						address: faker.location.streetAddress(),
					},
				},
			});
			professors.push(professor);
		}

		// Create multiple students
		const students = [];
		for (let i = 0; i < 20; i++) {
			const student = await payload.create({
				collection: "users",
				data: {
					name: faker.person.fullName(),
					email: faker.internet.email(),
					password: "password123",
					role: "student",
					university: university.id,
					faculty: faculty.id,
					department: department.id,
					program: program.id,
					programYear: i < 10 ? programYear1.id : programYear2.id,
					studentId: `STU${faker.number.int({ min: 10000, max: 99999 })}`,
					profile: {
						dateOfBirth: faker.date
							.birthdate({ min: 18, max: 25, mode: "age" })
							.toISOString(),
						phone: faker.phone.number(),
						address: faker.location.streetAddress(),
						emergencyContact: {
							name: faker.person.fullName(),
							relationship: faker.helpers.arrayElement([
								"Parent",
								"Guardian",
								"Sibling",
							]),
							phone: faker.phone.number(),
							email: faker.internet.email(),
						},
					},
					academicInfo: {
						enrollmentDate: faker.date
							.past({ years: 2 })
							.toISOString(),
						expectedGraduation: faker.date
							.future({ years: 2 })
							.toISOString(),
						status: faker.helpers.arrayElement([
							"active",
							"active",
							"active",
							"inactive",
						]),
					},
				},
			});
			students.push(student);
		}

		// Create faculty staff
		const facultyStaff = [];
		for (let i = 0; i < 3; i++) {
			const staff = await payload.create({
				collection: "users",
				data: {
					name: faker.person.fullName(),
					email: faker.internet.email(),
					password: "password123",
					role: "faculty-staff",
					university: university.id,
					faculty: faculty.id,
					employeeId: `STAFF${faker.number.int({ min: 1000, max: 9999 })}`,
					profile: {
						phone: faker.phone.number(),
						address: faker.location.streetAddress(),
					},
				},
			});
			facultyStaff.push(staff);
		}

		// Create department staff
		const departmentStaff = [];
		for (let i = 0; i < 2; i++) {
			const staff = await payload.create({
				collection: "users",
				data: {
					name: faker.person.fullName(),
					email: faker.internet.email(),
					password: "password123",
					role: "department-staff",
					university: university.id,
					faculty: faculty.id,
					department: department.id,
					employeeId: `DEPT${faker.number.int({ min: 1000, max: 9999 })}`,
					profile: {
						phone: faker.phone.number(),
						address: faker.location.streetAddress(),
					},
				},
			});
			departmentStaff.push(staff);
		}

		console.log(
			`Created ${professors.length} professors, ${students.length} students, ${facultyStaff.length} faculty staff, ${departmentStaff.length} department staff`,
		);

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
			},
		});

		const softwareEngineeringInstance = await payload.create({
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
			},
		});

		// Assign professors to course instances
		console.log("Assigning professors to course instances...");

		// Update course instances with professor assignment
		await payload.update({
			collection: "course-instances",
			id: introProgrammingInstance.id,
			data: {
				professors: [professors[0].id],
			},
		});

		await payload.update({
			collection: "course-instances",
			id: dataStructuresInstance.id,
			data: {
				professors: [professors[1].id],
			},
		});

		await payload.update({
			collection: "course-instances",
			id: softwareEngineeringInstance.id,
			data: {
				professors: [professors[2].id],
			},
		});

		console.log(
			"Course instances created and professors assigned successfully!",
		);

		// 14. Create Assessment Templates
		console.log("Creating assessment templates...");
		const introProgrammingMidterm = await payload.create({
			collection: "assessment-templates",
			data: {
				courseInstance: introProgrammingInstance.id,
				name: "Midterm Exam",
				description:
					"Midterm examination covering programming fundamentals",
				weightPercent: 30,
				minScore: 0,
				maxScore: 100,
				isOptional: false,
				assessmentType: "exam",
				instructions:
					"Complete all programming problems. Show your work.",
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
				instructions:
					"Complete all sections. Partial credit will be given.",
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
				instructions:
					"Analyze algorithms and implement data structures.",
				isActive: true,
			},
		});

		const _dataStructuresFinal = await payload.create({
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
				instructions:
					"Complete all algorithm and data structure problems.",
				isActive: true,
			},
		});

		const _dataStructuresAssignment = await payload.create({
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

		// Software Engineering Assessment Templates
		const _softwareEngineeringMidterm = await payload.create({
			collection: "assessment-templates",
			data: {
				courseInstance: softwareEngineeringInstance.id,
				name: "Midterm Exam",
				description:
					"Software engineering principles and methodologies",
				weightPercent: 30,
				minScore: 0,
				maxScore: 100,
				isOptional: false,
				assessmentType: "exam",
				instructions:
					"Answer questions about software development lifecycle and methodologies.",
				isActive: true,
			},
		});

		const _softwareEngineeringProject = await payload.create({
			collection: "assessment-templates",
			data: {
				courseInstance: softwareEngineeringInstance.id,
				name: "Team Project",
				description: "Group software development project",
				weightPercent: 50,
				minScore: 0,
				maxScore: 100,
				isOptional: false,
				assessmentType: "project",
				instructions:
					"Work in teams to develop a complete software application.",
				isActive: true,
			},
		});

		const _softwareEngineeringFinal = await payload.create({
			collection: "assessment-templates",
			data: {
				courseInstance: softwareEngineeringInstance.id,
				name: "Final Exam",
				description: "Comprehensive final examination",
				weightPercent: 20,
				minScore: 0,
				maxScore: 100,
				isOptional: false,
				assessmentType: "exam",
				instructions:
					"Complete all sections covering software engineering concepts.",
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
				description:
					"Midterm examination for Introduction to Programming",
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
				description:
					"Final examination for Introduction to Programming",
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
				notes: "Project must be original work. Include documentation and comments.",
			},
		});

		const _dataStructuresMidtermAssessment = await payload.create({
			collection: "assessments",
			data: {
				assessmentTemplate: dataStructuresMidterm.id,
				title: "Fall 2024 Midterm Exam - CS201",
				description:
					"Midterm examination for Data Structures and Algorithms",
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

		// Create enrollments for multiple students
		const enrollments = [];

		// Enroll first 10 students in Introduction to Programming
		for (let i = 0; i < 10; i++) {
			const enrollment = await payload.create({
				collection: "enrollments",
				data: {
					student: students[i].id,
					courseInstance: introProgrammingInstance.id,
					enrollmentTitle: `${students[i].name} - CS101 Fall 2024`,
					status: faker.helpers.arrayElement([
						"active",
						"active",
						"active",
						"pending",
					]),
					enrolledAt: faker.date.past({ years: 1 }).toISOString(),
					enrollmentType: faker.helpers.arrayElement([
						"required",
						"elective",
					]),
					notes: faker.lorem.sentence(),
				},
			});
			enrollments.push(enrollment);
		}

		// Enroll next 10 students in Data Structures
		for (let i = 10; i < 20; i++) {
			const enrollment = await payload.create({
				collection: "enrollments",
				data: {
					student: students[i].id,
					courseInstance: dataStructuresInstance.id,
					enrollmentTitle: `${students[i].name} - CS201 Fall 2024`,
					status: faker.helpers.arrayElement([
						"active",
						"active",
						"active",
						"pending",
					]),
					enrolledAt: faker.date.past({ years: 1 }).toISOString(),
					enrollmentType: faker.helpers.arrayElement([
						"required",
						"elective",
					]),
					notes: faker.lorem.sentence(),
				},
			});
			enrollments.push(enrollment);
		}

		// Enroll some students in Software Engineering (mix of first and second year)
		for (let i = 0; i < 8; i++) {
			const studentIndex = faker.number.int({ min: 0, max: 19 });
			const enrollment = await payload.create({
				collection: "enrollments",
				data: {
					student: students[studentIndex].id,
					courseInstance: softwareEngineeringInstance.id,
					enrollmentTitle: `${students[studentIndex].name} - SE301 Spring 2025`,
					status: faker.helpers.arrayElement([
						"active",
						"active",
						"active",
						"pending",
					]),
					enrolledAt: faker.date.future({ years: 1 }).toISOString(),
					enrollmentType: faker.helpers.arrayElement([
						"required",
						"elective",
					]),
					notes: faker.lorem.sentence(),
				},
			});
			enrollments.push(enrollment);
		}

		console.log(`Created ${enrollments.length} enrollments`);

		// 17. Create Scores (Sample)
		console.log("Creating sample scores...");

		// Create a few sample scores for demonstration
		let scoreCount = 0;

		// Create scores for first few students in Introduction to Programming
		for (let i = 0; i < Math.min(3, students.length); i++) {
			const student = students[i];

			// Sample midterm score
			await payload.create({
				collection: "scores",
				data: {
					assessment: introMidtermAssessment.id,
					student: student.id,
					scoreTitle: `${student.name} - CS101 Midterm`,
					value: faker.number.int({ min: 70, max: 100 }),
					maxValue: 100,
					percentage: faker.number.int({ min: 70, max: 100 }),
					isLate: faker.datatype.boolean({ probability: 0.1 }),
					latePenaltyApplied: 0,
					finalValue: faker.number.int({ min: 70, max: 100 }),
					gradedBy: professors[0].id,
					gradedAt: faker.date.past({ years: 1 }).toISOString(),
					feedback: faker.lorem.sentence(),
					notes: faker.lorem.sentence(),
					isExcused: false,
				},
			});
			scoreCount++;

			// Sample project score
			await payload.create({
				collection: "scores",
				data: {
					assessment: introProjectAssessment.id,
					student: student.id,
					scoreTitle: `${student.name} - CS101 Project`,
					value: faker.number.int({ min: 75, max: 100 }),
					maxValue: 100,
					percentage: faker.number.int({ min: 75, max: 100 }),
					isLate: faker.datatype.boolean({ probability: 0.05 }),
					latePenaltyApplied: 0,
					finalValue: faker.number.int({ min: 75, max: 100 }),
					gradedBy: professors[0].id,
					gradedAt: faker.date.past({ years: 1 }).toISOString(),
					feedback: faker.lorem.sentence(),
					notes: faker.lorem.sentence(),
					isExcused: false,
				},
			});
			scoreCount++;
		}

		console.log(`Created ${scoreCount} sample scores`);

		// 18. Create Grade Aggregates (Sample)
		console.log("Creating sample grade aggregates...");

		// Create a few sample grade aggregates for demonstration
		if (enrollments.length > 0) {
			await payload.create({
				collection: "grade-aggregates",
				data: {
					enrollment: enrollments[0].id,
					gradeTitle: `${students[0].name} - Sample Grade`,
					finalNumeric: faker.number.int({ min: 70, max: 100 }),
					finalLetter: faker.helpers.arrayElement([
						"A",
						"B",
						"C",
						"D",
					]),
					passFail: "pass",
					gpaPoints: faker.number.float({
						min: 2.0,
						max: 4.0,
						fractionDigits: 1,
					}),
					calculationMethod: "weighted-average",
					decisionNotes: "Sample grade aggregate for demonstration",
					calculatedAt: new Date().toISOString(),
					calculatedBy: professors[0].id,
					isPublished: true,
					publishedAt: new Date().toISOString(),
					assessmentBreakdown: [],
				},
			});
		}

		console.log("Sample grade aggregate created");

		console.log("✅ Campusnet demo data seeding completed successfully!");
		console.log("📊 Created:");
		console.log("  - 1 University (Demo University)");
		console.log("  - 1 Faculty (Computer Science)");
		console.log("  - 1 Department (Software Engineering)");
		console.log("  - 1 Program (BSE)");
		console.log("  - 2 Program Years");
		console.log("  - 3 Courses (CS101, CS201, SE301)");
		console.log("  - 3 Course Instances");
		console.log(`  - ${professors.length} Professors`);
		console.log(`  - ${students.length} Students`);
		console.log(`  - ${facultyStaff.length} Faculty Staff`);
		console.log(`  - ${departmentStaff.length} Department Staff`);
		console.log("  - 9 Assessment Templates");
		console.log("  - 6 Assessments");
		console.log(`  - ${enrollments.length} Enrollments`);
		console.log(`  - ${scoreCount} Scores`);
		console.log("  - 3 Grade Aggregates");
		console.log("");
		console.log("🎓 Demo Credentials:");
		console.log("  All users have password: password123");
		console.log(
			`  Professors: ${professors.map((p) => p.email).join(", ")}`,
		);
		console.log(
			`  Students: ${students
				.slice(0, 5)
				.map((s) => s.email)
				.join(", ")} (and ${students.length - 5} more)`,
		);
		console.log(
			`  Faculty Staff: ${facultyStaff.map((s) => s.email).join(", ")}`,
		);
		console.log(
			`  Department Staff: ${departmentStaff.map((s) => s.email).join(", ")}`,
		);
	} catch (error) {
		console.error("❌ Error seeding Campusnet demo data:", error);
		throw error;
	}
}
