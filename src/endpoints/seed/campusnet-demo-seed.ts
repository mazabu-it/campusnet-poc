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

		// 4. Create University (University of Kinshasa)
		console.log("Creating University of Kinshasa...");
		const university = await payload.create({
			collection: "universities",
			data: {
				name: "University of Kinshasa",
				code: `UNIKIN-${Date.now()}`,
				description:
					"L'Université de Kinshasa (UNIKIN) est la plus ancienne université de la République démocratique du Congo, fondée en 1954. Elle forme des professionnels dans divers domaines académiques.",
				locale: "fr",
				timezone: "Africa/Kinshasa",
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
						footerText: "Université de Kinshasa - Relevé de Notes",
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
				name: "Faculté des Sciences et Technologies",
				code: "FST",
				description:
					"Faculté des Sciences et Technologies de l'Université de Kinshasa - Formation en informatique et technologies",
				contactInfo: {
					address:
						"Campus de l'Université de Kinshasa, Avenue de l'Université",
					phone: "+243-81-700-0001",
					email: "fst@unikin.ac.cd",
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
				name: "Département d'Informatique",
				code: "INFO",
				description:
					"Département d'Informatique de la Faculté des Sciences et Technologies - Formation en génie logiciel et développement",
				contactInfo: {
					address: "Bureau 201, Faculté des Sciences et Technologies",
					phone: "+243-81-700-0002",
					email: "info@unikin.ac.cd",
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
				name: "Licence en Informatique",
				code: "LIC-INFO",
				description:
					"Programme de licence en informatique avec spécialisation en génie logiciel",
				diplomaLevel: diplomaLevel.id,
				duration: 3,
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
				code: "INFO101",
				title: "Introduction à la Programmation",
				description:
					"Fondamentaux de la programmation et concepts de base",
				credits: 3,
				owningDepartment: department.id,
				courseType: "required",
				isActive: true,
				learningOutcomes: [
					{
						outcome:
							"Comprendre les concepts de base de la programmation",
					},
					{ outcome: "Écrire des programmes simples en Python" },
					{ outcome: "Déboguer et tester le code efficacement" },
				],
			},
		});

		const dataStructures = await payload.create({
			collection: "courses",
			data: {
				code: "INFO201",
				title: "Structures de Données et Algorithmes",
				description:
					"Structures de données avancées et pensée algorithmique",
				credits: 4,
				owningDepartment: department.id,
				courseType: "required",
				isActive: true,
				learningOutcomes: [
					{
						outcome:
							"Implémenter des structures de données communes",
					},
					{ outcome: "Analyser la complexité des algorithmes" },
					{
						outcome:
							"Résoudre des problèmes en utilisant des algorithmes appropriés",
					},
				],
			},
		});

		const softwareEngineering = await payload.create({
			collection: "courses",
			data: {
				code: "INFO301",
				title: "Principes du Génie Logiciel",
				description:
					"Cycle de vie du développement logiciel et méthodologies",
				credits: 3,
				owningDepartment: department.id,
				courseType: "required",
				isActive: true,
				learningOutcomes: [
					{
						outcome:
							"Comprendre le cycle de vie du développement logiciel",
					},
					{
						outcome:
							"Appliquer les méthodologies du génie logiciel",
					},
					{
						outcome:
							"Travailler efficacement en équipe de développement",
					},
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

		// Skip test user creation - user already exists from previous seeding
		console.log(
			"Skipping test user creation - using existing test@test.com user",
		);

		// Create a test student for debugging
		try {
			const testStudent = await payload.create({
				collection: "users",
				data: {
					name: "Test Student",
					email: "student@test.com",
					password: "test123",
					role: "student",
					university: university.id,
					faculty: faculty.id,
					department: department.id,
					program: program.id,
					programYear: programYear1.id,
					studentId: "TEST001",
					profile: {
						phone: "+32 2 123 4567",
						address: "123 Test Street, Brussels, Belgium",
					},
					academicInfo: {
						enrollmentDate: new Date().toISOString(),
						expectedGraduation: new Date(
							Date.now() + 2 * 365 * 24 * 60 * 60 * 1000,
						).toISOString(),
						status: "active",
					},
				},
			});
			console.log("✅ Test student created:", testStudent.email);
		} catch (error) {
			console.log("❌ Test student creation failed:", error);
			console.log("University ID:", university?.id);
			console.log("Faculty ID:", faculty?.id);
			console.log("Department ID:", department?.id);
			console.log("Program ID:", program?.id);
			console.log("ProgramYear1 ID:", programYear1?.id);
		}

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
		const _introMidtermAssessment = await payload.create({
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

		const _introProjectAssessment = await payload.create({
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

		// 17. Create Comprehensive Scores for All Students
		console.log("Creating comprehensive scores for all students...");

		let scoreCount = 0;

		// Get all assessment templates for each course instance
		const introProgrammingTemplates = await payload.find({
			collection: "assessment-templates",
			where: { courseInstance: { equals: introProgrammingInstance.id } },
		});

		const dataStructuresTemplates = await payload.find({
			collection: "assessment-templates",
			where: { courseInstance: { equals: dataStructuresInstance.id } },
		});

		const softwareEngineeringTemplates = await payload.find({
			collection: "assessment-templates",
			where: {
				courseInstance: { equals: softwareEngineeringInstance.id },
			},
		});

		// Create assessments for each template
		const allAssessments = [];

		// Introduction to Programming Assessments
		for (const template of introProgrammingTemplates.docs) {
			const assessment = await payload.create({
				collection: "assessments",
				data: {
					assessmentTemplate: template.id,
					title: `Fall 2024 ${template.name} - INFO101`,
					description: `${template.description} for Introduction à la Programmation`,
					date: faker.date
						.future({ years: 1 })
						.toISOString()
						.split("T")[0],
					startTime: "09:00",
					endTime: "12:00",
					location: "Salle de cours INFO101",
					status: "published",
					submissionWindow: {
						opensAt: faker.date
							.past({ years: 1 })
							.toISOString()
							.split("T")[0],
						closesAt: faker.date
							.future({ years: 1 })
							.toISOString()
							.split("T")[0],
						lateSubmissionAllowed: true,
						latePenaltyPercent: 10,
					},
					gradingWindow: {
						opensAt: faker.date
							.past({ years: 1 })
							.toISOString()
							.split("T")[0],
						closesAt: faker.date
							.future({ years: 1 })
							.toISOString()
							.split("T")[0],
						allowLateGrading: true,
					},
					instructions: template.instructions,
					notes: "Évaluation automatisée pour la démonstration",
				},
			});
			allAssessments.push({ ...assessment, template });
		}

		// Data Structures Assessments
		for (const template of dataStructuresTemplates.docs) {
			const assessment = await payload.create({
				collection: "assessments",
				data: {
					assessmentTemplate: template.id,
					title: `Fall 2024 ${template.name} - INFO201`,
					description: `${template.description} for Structures de Données et Algorithmes`,
					date: faker.date
						.future({ years: 1 })
						.toISOString()
						.split("T")[0],
					startTime: "14:00",
					endTime: "17:00",
					location: "Salle de cours INFO201",
					status: "published",
					submissionWindow: {
						opensAt: faker.date
							.past({ years: 1 })
							.toISOString()
							.split("T")[0],
						closesAt: faker.date
							.future({ years: 1 })
							.toISOString()
							.split("T")[0],
						lateSubmissionAllowed: true,
						latePenaltyPercent: 10,
					},
					gradingWindow: {
						opensAt: faker.date
							.past({ years: 1 })
							.toISOString()
							.split("T")[0],
						closesAt: faker.date
							.future({ years: 1 })
							.toISOString()
							.split("T")[0],
						allowLateGrading: true,
					},
					instructions: template.instructions,
					notes: "Évaluation automatisée pour la démonstration",
				},
			});
			allAssessments.push({ ...assessment, template });
		}

		// Software Engineering Assessments
		for (const template of softwareEngineeringTemplates.docs) {
			const assessment = await payload.create({
				collection: "assessments",
				data: {
					assessmentTemplate: template.id,
					title: `Fall 2024 ${template.name} - INFO301`,
					description: `${template.description} for Principes du Génie Logiciel`,
					date: faker.date
						.future({ years: 1 })
						.toISOString()
						.split("T")[0],
					startTime: "10:00",
					endTime: "13:00",
					location: "Salle de cours INFO301",
					status: "published",
					submissionWindow: {
						opensAt: faker.date
							.past({ years: 1 })
							.toISOString()
							.split("T")[0],
						closesAt: faker.date
							.future({ years: 1 })
							.toISOString()
							.split("T")[0],
						lateSubmissionAllowed: true,
						latePenaltyPercent: 10,
					},
					gradingWindow: {
						opensAt: faker.date
							.past({ years: 1 })
							.toISOString()
							.split("T")[0],
						closesAt: faker.date
							.future({ years: 1 })
							.toISOString()
							.split("T")[0],
						allowLateGrading: true,
					},
					instructions: template.instructions,
					notes: "Évaluation automatisée pour la démonstration",
				},
			});
			allAssessments.push({ ...assessment, template });
		}

		console.log(`Created ${allAssessments.length} assessments`);

		// Create scores for all students in all assessments
		for (const student of students) {
			// Get student's enrollments
			const studentEnrollments = enrollments.filter(
				(enrollment) => enrollment.student === student.id,
			);

			for (const enrollment of studentEnrollments) {
				// Find assessments for this course instance
				const courseAssessments = allAssessments.filter(
					(assessment) =>
						assessment.template.courseInstance ===
						enrollment.courseInstance,
				);

				for (const assessment of courseAssessments) {
					// Generate realistic scores based on assessment type
					let scoreValue: number;
					let feedback: string;

					switch (assessment.template.assessmentType) {
						case "exam":
							// Exams tend to have more varied scores
							scoreValue = faker.number.int({
								min: 45,
								max: 100,
							});
							feedback = faker.helpers.arrayElement([
								"Good understanding of concepts",
								"Shows improvement in problem-solving",
								"Excellent work, keep it up",
								"Needs more practice with algorithms",
								"Strong analytical skills demonstrated",
								"Good effort, review key concepts",
							]);
							break;
						case "project":
							// Projects tend to have higher scores
							scoreValue = faker.number.int({
								min: 70,
								max: 100,
							});
							feedback = faker.helpers.arrayElement([
								"Excellent implementation and documentation",
								"Good project structure and code quality",
								"Creative solution to the problem",
								"Good work, minor improvements needed",
								"Outstanding project presentation",
								"Solid implementation with room for enhancement",
							]);
							break;
						case "assignment":
							// Assignments have moderate scores
							scoreValue = faker.number.int({
								min: 60,
								max: 100,
							});
							feedback = faker.helpers.arrayElement([
								"Good understanding of the material",
								"Correct approach, minor errors",
								"Excellent work, well done",
								"Good effort, check calculations",
								"Clear explanations provided",
								"Good progress, continue practicing",
							]);
							break;
						default:
							scoreValue = faker.number.int({
								min: 50,
								max: 100,
							});
							feedback = "Good work overall";
					}

					// Add some variation based on student performance
					const studentPerformance = faker.helpers.arrayElement([
						"excellent",
						"good",
						"average",
						"below-average",
					]);

					switch (studentPerformance) {
						case "excellent":
							scoreValue = Math.min(
								100,
								scoreValue +
									faker.number.int({ min: 5, max: 15 }),
							);
							break;
						case "good":
							scoreValue = Math.min(
								100,
								scoreValue +
									faker.number.int({ min: 0, max: 10 }),
							);
							break;
						case "average":
							scoreValue = Math.max(
								0,
								scoreValue -
									faker.number.int({ min: 0, max: 5 }),
							);
							break;
						case "below-average":
							scoreValue = Math.max(
								0,
								scoreValue -
									faker.number.int({ min: 5, max: 15 }),
							);
							break;
					}

					await payload.create({
						collection: "scores",
						data: {
							assessment: assessment.id,
							student: student.id,
							scoreTitle: `${student.name} - ${assessment.title}`,
							value: scoreValue,
							maxValue: assessment.template.maxScore,
							percentage: Math.round(
								(scoreValue / assessment.template.maxScore) *
									100,
							),
							isLate: faker.datatype.boolean({
								probability: 0.1,
							}),
							latePenaltyApplied: 0,
							finalValue: scoreValue,
							gradedBy: professors[0].id,
							gradedAt: faker.date
								.past({ years: 1 })
								.toISOString(),
							feedback,
							notes: faker.lorem.sentence(),
							isExcused: faker.datatype.boolean({
								probability: 0.02,
							}),
						},
					});
					scoreCount++;
				}
			}
		}

		console.log(
			`Created ${scoreCount} comprehensive scores for all students`,
		);

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

		// 19. Create Client-Facing Site Pages with Blocks
		console.log("Creating client-facing site pages...");

		// Create Home Page with University Hero and Programs Showcase
		await payload.create({
			collection: "pages",
			data: {
				title: "Welcome to Demo University",
				slug: "home",
				_status: "published",
				hero: {
					type: "none",
				},
				meta: {
					title: "Demo University - Excellence in Education",
					description:
						"Join Demo University for world-class education and innovative programs",
				},
				layout: [
					{
						blockType: "university-hero",
						title: "Welcome to Demo University",
						subtitle:
							"Empowering Tomorrow's Leaders Through Excellence in Education",
						primaryButtonText: "Apply Now",
						secondaryButtonText: "Learn More",
						stats: [
							{
								icon: "lucide:graduation-cap",
								value: "2,500+",
								label: "Students",
							},
							{
								icon: "lucide:users",
								value: "150+",
								label: "Faculty",
							},
							{
								icon: "lucide:book-open",
								value: "25+",
								label: "Programs",
							},
							{
								icon: "lucide:award",
								value: "95%",
								label: "Success Rate",
							},
						],
					},
					{
						blockType: "programs-showcase",
						title: "Our Academic Programs",
						subtitle:
							"Discover world-class programs designed to prepare you for success",
						programs: [
							{
								name: "Bachelor of Software Engineering",
								description:
									"Comprehensive program covering software development, system design, and project management.",
								icon: "lucide:code",
								level: "Bachelor's",
								duration: "4 Years",
								credits: 120,
								studentCount: "150+",
							},
							{
								name: "Master of Computer Science",
								description:
									"Advanced studies in algorithms, machine learning, and distributed systems.",
								icon: "lucide:cpu",
								level: "Master's",
								duration: "2 Years",
								credits: 60,
								studentCount: "75+",
							},
							{
								name: "PhD in Information Technology",
								description:
									"Research-focused program for future technology leaders and innovators.",
								icon: "lucide:microscope",
								level: "Doctorate",
								duration: "4-6 Years",
								credits: 90,
								studentCount: "25+",
							},
						],
					},
					{
						blockType: "registration-form",
						title: "Start Your Journey",
						subtitle:
							"Apply to Demo University and begin your path to success",
						programs: [
							{
								label: "Bachelor of Software Engineering",
								value: "bse",
							},
							{
								label: "Master of Computer Science",
								value: "mcs",
							},
							{
								label: "PhD in Information Technology",
								value: "phd-it",
							},
						],
						academicYears: [
							{ label: "Fall 2025", value: "fall-2025" },
							{ label: "Spring 2026", value: "spring-2026" },
							{ label: "Fall 2026", value: "fall-2026" },
						],
					},
					{
						blockType: "news-events",
						title: "Latest News & Events",
						subtitle:
							"Stay updated with university news and upcoming events",
						items: [
							{
								type: "news",
								title: "New AI Research Center Opens",
								excerpt:
									"Demo University launches state-of-the-art AI research facility with $5M investment.",
								date: faker.date
									.recent({ days: 7 })
									.toISOString(),
								location: "Main Campus",
							},
							{
								type: "event",
								title: "Tech Innovation Summit 2025",
								excerpt:
									"Join industry leaders and students for a day of innovation and networking.",
								date: faker.date
									.future({ years: 1 })
									.toISOString(),
								location: "Conference Center",
							},
							{
								type: "news",
								title: "Student Wins National Coding Competition",
								excerpt:
									"Our student team secures first place in the prestigious National Coding Championship.",
								date: faker.date
									.recent({ days: 14 })
									.toISOString(),
								location: "Online",
							},
						],
					},
				],
			},
		});

		// Create University Info Page
		await payload.create({
			collection: "pages",
			data: {
				title: "About Demo University",
				slug: "university",
				_status: "published",
				hero: {
					type: "none",
				},
				meta: {
					title: "About Demo University - Our Mission & Vision",
					description:
						"Learn about Demo University's mission, vision, and commitment to excellence",
				},
				layout: [
					{
						blockType: "university-hero",
						title: "About Demo University",
						subtitle: "Excellence in Education Since 1995",
						primaryButtonText: "Visit Campus",
						secondaryButtonText: "Contact Us",
						stats: [
							{
								icon: "lucide:calendar",
								value: "30+",
								label: "Years of Excellence",
							},
							{
								icon: "lucide:building",
								value: "5",
								label: "Campuses",
							},
							{
								icon: "lucide:globe",
								value: "50+",
								label: "Countries",
							},
							{
								icon: "lucide:trophy",
								value: "100+",
								label: "Awards",
							},
						],
					},
					{
						blockType: "faculty-showcase",
						title: "Meet Our Faculty",
						subtitle: "World-class educators and researchers",
						faculty: professors.slice(0, 6).map((professor) => ({
							name: professor.name,
							title: "Professor",
							department: "Computer Science",
							avatar: faker.image.avatar(),
							bio: faker.lorem.paragraph(),
							education: "PhD in Computer Science",
							email: professor.email,
							experience: faker.number.int({ min: 5, max: 20 }),
							specializations: [
								{ specialization: "Software Engineering" },
								{ specialization: "Machine Learning" },
								{ specialization: "Data Science" },
							],
						})),
					},
				],
			},
		});

		// Create Dashboard Page
		await payload.create({
			collection: "pages",
			data: {
				title: "University Dashboard",
				slug: "dashboard",
				_status: "published",
				hero: {
					type: "none",
				},
				meta: {
					title: "University Dashboard - Analytics & Insights",
					description:
						"View university statistics and performance metrics",
				},
				layout: [
					{
						blockType: "dashboard-stats",
						title: "University Analytics",
						subtitle: "Key performance indicators and trends",
						metrics: [
							{
								label: "Total Enrollments",
								value: "2,547",
								icon: "lucide:users",
								trend: "up",
								change: "+12%",
							},
							{
								label: "Graduation Rate",
								value: "94.2%",
								icon: "lucide:graduation-cap",
								trend: "up",
								change: "+2.1%",
							},
							{
								label: "Student Satisfaction",
								value: "4.8/5",
								icon: "lucide:star",
								trend: "up",
								change: "+0.3",
							},
							{
								label: "Research Funding",
								value: "$12.5M",
								icon: "lucide:dollar-sign",
								trend: "up",
								change: "+18%",
							},
						],
						enrollmentData: [
							{ month: "Jan", enrollments: 45 },
							{ month: "Feb", enrollments: 52 },
							{ month: "Mar", enrollments: 48 },
							{ month: "Apr", enrollments: 61 },
							{ month: "May", enrollments: 55 },
							{ month: "Jun", enrollments: 67 },
						],
						programData: [
							{ name: "Software Engineering", value: 35 },
							{ name: "Computer Science", value: 28 },
							{ name: "Information Technology", value: 22 },
							{ name: "Data Science", value: 15 },
						],
						goals: [
							{
								name: "Increase Enrollment",
								description: "Target 3,000 students by 2026",
								progress: 85,
							},
							{
								name: "Research Excellence",
								description: "Achieve top 10 research ranking",
								progress: 72,
							},
							{
								name: "Student Success",
								description: "Maintain 95%+ graduation rate",
								progress: 94,
							},
						],
					},
				],
			},
		});

		// Create Registration Page
		await payload.create({
			collection: "pages",
			data: {
				title: "Student Registration",
				slug: "registration",
				_status: "published",
				hero: {
					type: "none",
				},
				meta: {
					title: "Student Registration - Apply to Demo University",
					description:
						"Complete your application to join Demo University",
				},
				layout: [
					{
						blockType: "registration-form",
						title: "Apply to Demo University",
						subtitle:
							"Take the first step towards your future success",
						programs: [
							{
								label: "Bachelor of Software Engineering",
								value: "bse",
							},
							{
								label: "Master of Computer Science",
								value: "mcs",
							},
							{
								label: "PhD in Information Technology",
								value: "phd-it",
							},
							{ label: "Bachelor of Data Science", value: "bds" },
							{
								label: "Master of AI Engineering",
								value: "maie",
							},
						],
						academicYears: [
							{ label: "Fall 2025", value: "fall-2025" },
							{ label: "Spring 2026", value: "spring-2026" },
							{ label: "Fall 2026", value: "fall-2026" },
							{ label: "Spring 2027", value: "spring-2027" },
						],
					},
				],
			},
		});

		// Create News Page
		await payload.create({
			collection: "pages",
			data: {
				title: "News & Events",
				slug: "news",
				_status: "published",
				hero: {
					type: "none",
				},
				meta: {
					title: "News & Events - Demo University",
					description:
						"Stay updated with the latest news and events at Demo University",
				},
				layout: [
					{
						blockType: "news-events",
						title: "University News & Events",
						subtitle:
							"Stay connected with campus life and achievements",
						items: [
							{
								type: "news",
								title: "University Receives Accreditation Renewal",
								excerpt:
									"Demo University has successfully renewed its accreditation for another 10 years.",
								date: faker.date
									.recent({ days: 3 })
									.toISOString(),
								location: "Main Campus",
							},
							{
								type: "event",
								title: "Annual Career Fair 2025",
								excerpt:
									"Connect with top employers and explore career opportunities.",
								date: faker.date
									.future({ years: 1 })
									.toISOString(),
								location: "Student Center",
							},
							{
								type: "news",
								title: "Research Grant Awarded",
								excerpt:
									"Faculty receives $2M grant for cybersecurity research project.",
								date: faker.date
									.recent({ days: 10 })
									.toISOString(),
								location: "Research Center",
							},
							{
								type: "event",
								title: "Alumni Reunion Weekend",
								excerpt:
									"Join fellow alumni for a weekend of networking and celebration.",
								date: faker.date
									.future({ years: 1 })
									.toISOString(),
								location: "Alumni Hall",
							},
							{
								type: "news",
								title: "New Student Housing Opens",
								excerpt:
									"Modern residence hall provides housing for 500 additional students.",
								date: faker.date
									.recent({ days: 21 })
									.toISOString(),
								location: "North Campus",
							},
							{
								type: "event",
								title: "Tech Innovation Conference",
								excerpt:
									"Industry leaders discuss the future of technology in education.",
								date: faker.date
									.future({ years: 1 })
									.toISOString(),
								location: "Conference Center",
							},
						],
					},
				],
			},
		});

		// Create Faculty Page
		await payload.create({
			collection: "pages",
			data: {
				title: "Our Faculty",
				slug: "faculty",
				_status: "published",
				hero: {
					type: "none",
				},
				meta: {
					title: "Faculty - Meet Our Professors",
					description:
						"Learn about our distinguished faculty members and their expertise",
				},
				layout: [
					{
						blockType: "faculty-showcase",
						title: "Meet Our Distinguished Faculty",
						subtitle:
							"World-class educators and researchers dedicated to student success",
						faculty: professors.map((professor) => ({
							name: professor.name,
							title: faker.helpers.arrayElement([
								"Professor",
								"Associate Professor",
								"Assistant Professor",
								"Distinguished Professor",
							]),
							department: "Computer Science",
							avatar: faker.image.avatar(),
							bio: faker.lorem.paragraphs(2),
							education: faker.helpers.arrayElement([
								"PhD in Computer Science, MIT",
								"PhD in Software Engineering, Stanford",
								"PhD in Information Technology, Carnegie Mellon",
								"PhD in Data Science, Berkeley",
							]),
							email: professor.email,
							experience: faker.number.int({ min: 5, max: 25 }),
							specializations: faker.helpers
								.arrayElements(
									[
										"Software Engineering",
										"Machine Learning",
										"Data Science",
										"Cybersecurity",
										"Web Development",
										"Mobile Development",
										"Database Systems",
										"Computer Networks",
										"Human-Computer Interaction",
										"Artificial Intelligence",
									],
									{ min: 2, max: 4 },
								)
								.map((spec) => ({ specialization: spec })),
						})),
					},
				],
			},
		});

		console.log("✅ Client-facing site pages created successfully!");

		console.log("✅ Campusnet demo data seeding completed successfully!");
		console.log("📊 Created:");
		console.log("  - 1 University (University of Kinshasa)");
		console.log("  - 1 Faculty (Faculté des Sciences et Technologies)");
		console.log("  - 1 Department (Département d'Informatique)");
		console.log("  - 1 Program (Licence en Informatique)");
		console.log("  - 2 Program Years");
		console.log("  - 3 Courses (INFO101, INFO201, INFO301)");
		console.log("  - 3 Course Instances");
		console.log(`  - ${professors.length} Professors`);
		console.log(`  - ${students.length} Students`);
		console.log(`  - ${facultyStaff.length} Faculty Staff`);
		console.log(`  - ${departmentStaff.length} Department Staff`);
		console.log("  - 9 Assessment Templates");
		console.log(`  - ${allAssessments.length} Assessments`);
		console.log(`  - ${enrollments.length} Enrollments`);
		console.log(`  - ${scoreCount} Comprehensive Scores`);
		console.log("  - Multiple Grade Aggregates");
		console.log(
			"  - 6 Client-Facing Pages (Home, University, Dashboard, Registration, News, Faculty)",
		);
		console.log(
			"  - All Payload Blocks (University Hero, Programs Showcase, Registration Form, Dashboard Stats, News & Events, Faculty Showcase)",
		);
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
