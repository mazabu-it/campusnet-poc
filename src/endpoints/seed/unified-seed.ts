import { faker } from "@faker-js/faker";

// Use French locale for faker-generated content
try {
	// Prefer modern API; if unavailable, ignore silently
	(
		faker as unknown as { setDefaultLocale?: (locale: string) => void }
	).setDefaultLocale?.("fr");
} catch {}

// Congolese (DRC) names to improve realism of seeded users
const congoleseFirstNames = [
	"Jean-Claude",
	"Jean-Pierre",
	"Aimé",
	"Junior",
	"Dieudonné",
	"Moïse",
	"Alain",
	"Blaise",
	"Patrick",
	"Célestin",
	"Christian",
	"François",
	"Gédéon",
	"Hervé",
	"Jules",
	"Kevin",
	"Michel",
	"Nicolas",
	"Samuel",
	"Trésor",
	"Christelle",
	"Nadine",
	"Grace",
	"Prisca",
	"Amina",
	"Chantal",
	"Mado",
	"Merveille",
	"Divine",
	"Clarisse",
	"Deborah",
	"Esther",
	"Florence",
	"Patricia",
	"Naomi",
];

const congoleseLastNames = [
	"Kabongo",
	"Mbuyi",
	"Mwamba",
	"Kasongo",
	"Kalala",
	"Mutombo",
	"Mbala",
	"Manga",
	"Kanku",
	"Nsenga",
	"Nkulu",
	"Ilunga",
	"Tshibangu",
	"Tshisekedi",
	"Lukusa",
	"Kitenge",
	"Kabila",
	"Nzinga",
	"Mukendi",
	"Mbemba",
];

function pickCongoleseName() {
	const firstName = faker.helpers.arrayElement(congoleseFirstNames);
	const lastName = faker.helpers.arrayElement(congoleseLastNames);
	return { firstName, lastName, fullName: `${firstName} ${lastName}` };
}

function slugifyName(input: string) {
	const slugged = input
		.toLowerCase()
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
	// Ensure we always return a valid slug (at least 1 character)
	return slugged || "user";
}

export async function seedCampusnetUnifiedData(payload: any) {
	try {
		console.log("🌱 Starting unified Campusnet data seeding...");

		// 1. Create foundational data
		console.log("📚 Creating foundational data...");

		let university: any, faculty: any, department: any, academicYear: any;

		// Use existing grading scale configuration to create grading scale
		let gradingScale: any;
		const existingGradingScales = await payload.find({
			collection: "grading-scales",
			limit: 1,
		});

		if (existingGradingScales.docs.length > 0) {
			gradingScale = existingGradingScales.docs[0];
			console.log("Using existing grading scale:", gradingScale.name);
		} else {
			// Create grading scale using the existing configuration
			gradingScale = await payload.create({
				collection: "grading-scales",
				data: {
					name: "Test Scale",
					scaleType: "numeric-100",
					passThreshold: 50,
				},
			});
			console.log(
				"Created grading scale using existing configuration:",
				gradingScale.name,
			);
		}

		// Create academic year
		academicYear = await payload.create({
			collection: "academic-years",
			data: {
				yearLabel: "2024-2025",
				startDate: "2024-09-01",
				endDate: "2025-08-31",
				isActive: true,
				description: "Academic Year 2024-2025",
			},
		});

		// Create academic calendar
		const academicCalendar = await payload.create({
			collection: "academic-calendars",
			data: {
				name: "Academic Calendar 2024-2025",
				academicYear: academicYear.id,
				isActive: true,
			},
		});

		// Create university
		university = await payload.create({
			collection: "universities",
			data: {
				name: "Université de Kinshasa",
				code: "UNIKIN",
				description: "Université de Kinshasa",
				locale: "fr",
				timezone: "Africa/Kinshasa",
				gradingScale: gradingScale.id,
				academicCalendar: academicCalendar.id,
				isActive: true,
			},
		});

		// Create faculty
		faculty = await payload.create({
			collection: "faculties",
			data: {
				university: university.id,
				name: "Faculté des Sciences et Technologies",
				code: "FST",
				description: "Faculté spécialisée en sciences et technologies",
				isActive: true,
			},
		});

		// Create department
		department = await payload.create({
			collection: "departments",
			data: {
				faculty: faculty.id,
				name: "Département d'Informatique",
				code: "INFO",
				description: "Département d'informatique et génie logiciel",
				isActive: true,
			},
		});

		// 2. Create courses
		console.log("📖 Creating courses...");

		const courses = [
			{
				code: "INFO101",
				title: "Introduction à la Programmation",
				description:
					"Concepts fondamentaux de la programmation et résolution de problèmes",
				credits: 3,
				courseType: "required" as const,
				learningOutcomes: [
					{
						outcome:
							"Comprendre les concepts de base de la programmation",
					},
					{
						outcome:
							"Écrire des programmes simples dans un langage de haut niveau",
					},
					{
						outcome:
							"Déboguer et tester des programmes efficacement",
					},
				],
			},
			{
				code: "INFO201",
				title: "Structures de Données",
				description:
					"Structures de données fondamentales et conception d'algorithmes",
				credits: 4,
				courseType: "required" as const,
				learningOutcomes: [
					{
						outcome:
							"Implémenter des structures de données communes",
					},
					{ outcome: "Analyser la complexité des algorithmes" },
					{ outcome: "Concevoir des algorithmes efficaces" },
				],
			},
			{
				code: "INFO301",
				title: "Principes du Génie Logiciel",
				description: "Introduction aux méthodologies du génie logiciel",
				credits: 3,
				courseType: "required" as const,
				learningOutcomes: [
					{ outcome: "Appliquer les principes du génie logiciel" },
					{
						outcome:
							"Travailler efficacement en équipe de développement",
					},
					{ outcome: "Utiliser les systèmes de contrôle de version" },
				],
			},
		];

		const createdCourses = [];
		for (const courseData of courses) {
			const course = await payload.create({
				collection: "courses",
				data: {
					...courseData,
					owningDepartment: department.id,
					isActive: true,
				},
			});
			createdCourses.push(course);
		}

		// 3. Create course variations
		console.log("🔄 Creating course variations...");

		const courseVariations = [];
		for (const course of createdCourses) {
			console.log(
				`Creating course variation for course: ${course.code} (ID: ${course.id})`,
			);
			const variation = await payload.create({
				collection: "course-variations",
				data: {
					course: course.id,
					department: department.id,
					codeVariant: course.code,
					titleVariant: course.title,
					descriptionVariant: course.description,
					locale: "fr",
					credits: course.credits,
					isActive: true,
				},
			});
			courseVariations.push(variation);
			console.log(
				`  Created course variation: ${variation.codeVariant} (ID: ${variation.id})`,
			);
		}

		// 4. Create course instances
		console.log("🏫 Creating course instances...");

		const courseInstances = [];
		for (let i = 0; i < courseVariations.length; i++) {
			const variation = courseVariations[i];
			const course = createdCourses[i];

			console.log(
				`Creating course instance for variation: ${variation.codeVariant} (ID: ${variation.id})`,
			);

			const instance = await payload.create({
				collection: "course-instances",
				data: {
					courseVariation: variation.id,
					academicYear: academicYear.id,
					instanceTitle: `Instance ${course.code}`,
					professors: [], // Will be populated later
					assistants: [],
					maxEnrollment: 25,
					currentEnrollment: 0,
					schedule: {
						days: ["monday", "wednesday", "friday"],
						startTime: "09:00",
						endTime: "10:30",
						room: `Salle ${course.code}`,
					},
					status: "open",
					notes: `Instance du cours ${course.title}`,
				},
			});
			courseInstances.push(instance);
			console.log(
				`  Created course instance: ${instance.instanceTitle} (ID: ${instance.id}, courseVariation: ${instance.courseVariation})`,
			);
		}

		// 5. Create users
		console.log("👥 Creating users...");

		// Create test professor
		const testProfessor = await payload.create({
			collection: "users",
			data: {
				name: "Jean Professeur",
				email: "professor@test.com",
				password: "test123",
				role: "professor",
				firstName: "Jean",
				lastName: "Professeur",
				isActive: true,
			},
		});

		// Create test student
		const testStudent = await payload.create({
			collection: "users",
			data: {
				name: "Marie Étudiante",
				email: "student@test.com",
				password: "test123",
				role: "student",
				firstName: "Marie",
				lastName: "Étudiante",
				studentId: "STU001",
				isActive: true,
			},
		});

		// Create additional professors (Congolese names)
		const professors = [testProfessor];
		const usedEmails = new Set<string>(["professor@test.com"]);
		for (let i = 0; i < 4; i++) {
			const { firstName, lastName, fullName } = pickCongoleseName();
			let email = `${slugifyName(firstName)}-${slugifyName(lastName)}${i > 0 ? `-${i + 1}` : ""}@example.cd`;
			
			// Ensure uniqueness
			let attempts = 0;
			while (usedEmails.has(email) && attempts < 10) {
				email = `${slugifyName(firstName)}-${slugifyName(lastName)}-${Date.now()}-${i}@example.cd`;
				attempts++;
			}

			if (usedEmails.has(email)) {
				// Final fallback: use timestamp-based email
				email = `prof-${Date.now()}-${i}@example.cd`;
			}

			usedEmails.add(email);
			const professor = await payload.create({
				collection: "users",
				data: {
					name: fullName,
					email,
					password: "password123",
					role: "professor",
					firstName,
					lastName,
					isActive: true,
				},
			});
			professors.push(professor);
		}

		// Create additional students (Congolese names)
		const students = [testStudent];
		usedEmails.add("student@test.com");
		for (let i = 0; i < 19; i++) {
			const { firstName, lastName, fullName } = pickCongoleseName();
			let email = `${slugifyName(firstName)}-${slugifyName(lastName)}-${i + 2}@example.cd`;
			
			// Ensure uniqueness
			let attempts = 0;
			while (usedEmails.has(email) && attempts < 10) {
				email = `${slugifyName(firstName)}-${slugifyName(lastName)}-${Date.now()}-${i}@example.cd`;
				attempts++;
			}

			if (usedEmails.has(email)) {
				// Final fallback: use timestamp-based email
				email = `student-${Date.now()}-${i}@example.cd`;
			}

			usedEmails.add(email);
			const student = await payload.create({
				collection: "users",
				data: {
					name: fullName,
					email,
					password: "password123",
					role: "student",
					firstName,
					lastName,
					studentId: `STU${String(i + 2).padStart(3, "0")}`,
					isActive: true,
				},
			});
			students.push(student);
		}

		// 6. Assign professors to course instances
		console.log("👨‍🏫 Assigning professors to course instances...");

		for (let i = 0; i < courseInstances.length; i++) {
			const instance = courseInstances[i];
			const professor = professors[i % professors.length];

			await payload.update({
				collection: "course-instances",
				id: instance.id,
				data: {
					professors: [professor.id],
				},
			});
		}

		// 7. Create enrollments
		console.log("📝 Creating enrollments...");

		const enrollments = [];
		for (const student of students) {
			for (const instance of courseInstances) {
				const enrollment = await payload.create({
					collection: "enrollments",
					data: {
						student: student.id,
						courseInstance: instance.id,
						enrollmentType: "required",
						grade: null,
					},
				});
				enrollments.push(enrollment);
			}
		}

		// 8. Create assessment templates
		console.log("📋 Creating assessment templates...");

		const assessmentTemplates = [];
		for (const instance of courseInstances) {
			// Fetch the course instance with populated course variation
			const populatedInstance = await payload.findByID({
				collection: "course-instances",
				id: instance.id,
				depth: 2,
			});

			const courseVariation = populatedInstance.courseVariation;

			console.log(
				`Creating templates for course instance ${instance.id}, course variation: ${courseVariation?.codeVariant}`,
			);

			// Create midterm exam
			const midtermTemplate = await payload.create({
				collection: "assessment-templates",
				data: {
					courseInstance: instance.id,
					name: "Examen de Mi-parcours",
					description: `Examen de mi-parcours pour ${courseVariation?.titleVariant || "Unknown Course"}`,
					weightPercent: 30,
					minScore: 0,
					maxScore: 20,
					isOptional: false,
					assessmentType: "exam",
					instructions:
						"Répondez à toutes les questions. Montrez votre travail.",
					rubric: [
						{
							criteria: "Exactitude",
							description: "Réponses correctes",
							maxPoints: 40,
						},
						{
							criteria: "Qualité",
							description: "Présentation claire",
							maxPoints: 30,
						},
						{
							criteria: "Résolution",
							description: "Approche logique",
							maxPoints: 30,
						},
					],
					isActive: true,
				},
			});
			assessmentTemplates.push(midtermTemplate);

			// Create project
			const projectTemplate = await payload.create({
				collection: "assessment-templates",
				data: {
					courseInstance: instance.id,
					name: "Projet",
					description: `Projet individuel pour ${courseVariation?.titleVariant || "Unknown Course"}`,
					weightPercent: 40,
					minScore: 0,
					maxScore: 20,
					isOptional: false,
					assessmentType: "project",
					instructions:
						"Créez un programme complet démontrant les concepts du cours.",
					rubric: [],
					isActive: true,
				},
			});
			assessmentTemplates.push(projectTemplate);

			// Create final exam
			const finalTemplate = await payload.create({
				collection: "assessment-templates",
				data: {
					courseInstance: instance.id,
					name: "Examen Final",
					description: `Examen final pour ${courseVariation?.titleVariant || "Unknown Course"}`,
					weightPercent: 30,
					minScore: 0,
					maxScore: 20,
					isOptional: false,
					assessmentType: "exam",
					instructions:
						"Répondez à toutes les sections. Crédit partiel sera accordé.",
					rubric: [],
					isActive: true,
				},
			});
			assessmentTemplates.push(finalTemplate);
		}

		// 9. Create assessments
		console.log("📝 Creating assessments...");

		const assessments = [];
		for (const template of assessmentTemplates) {
			// Extract the course instance ID (template.courseInstance might be an object or ID)
			const courseInstanceId =
				typeof template.courseInstance === "object"
					? template.courseInstance.id
					: template.courseInstance;

			// Fetch the course instance with populated course variation
			const courseInstance = await payload.findByID({
				collection: "course-instances",
				id: courseInstanceId,
				depth: 2,
			});

			console.log(
				`Processing template: ${template.name} for course instance: ${courseInstanceId}`,
			);

			// Course variation is now populated
			const courseVariation = courseInstance.courseVariation;

			console.log(
				`  Course variation (populated): ${JSON.stringify({
					id: courseVariation?.id,
					codeVariant: courseVariation?.codeVariant,
					titleVariant: courseVariation?.titleVariant,
				})}`,
			);

			const assessment = await payload.create({
				collection: "assessments",
				data: {
					assessmentTemplate: template.id,
					title: `Fall 2024 ${template.name} - ${courseVariation?.codeVariant || "UNKNOWN"}`,
					description: `${template.description} pour ${courseVariation?.titleVariant || "Unknown Course"}`,
					date: "2024-10-15", // Consistent date
					startTime: "09:00",
					endTime: "12:00",
					location: "Salle de cours",
					status: "published",
					isCompleted: !template.name.toLowerCase().includes("final"), // Skip final exams
					submissionWindow: {
						opensAt: "2024-09-01T08:00:00.000Z",
						closesAt: "2024-12-15T18:00:00.000Z",
					},
					instructions:
						template.instructions ||
						"Complétez l'évaluation comme indiqué.",
				},
			});
			assessments.push(assessment);
			console.log(`  Created assessment: ${assessment.title}`);
		}

		// 10. Create scores using the same logic as the professor endpoint
		console.log("🎯 Creating scores...");

		let totalScoresCreated = 0;

		// Group assessments by course instance to avoid creating scores for wrong courses
		const assessmentsByCourseInstance = new Map();

		for (const assessment of assessments) {
			// Skip final exams
			if (assessment.title.toLowerCase().includes("final")) {
				console.log(`Skipping final exam: ${assessment.title}`);
				continue;
			}

			// Only create scores for completed assessments
			if (!assessment.isCompleted) {
				console.log(
					`Skipping incomplete assessment: ${assessment.title}`,
				);
				continue;
			}

			// Find the course instance for this assessment
			const assessmentTemplate = assessmentTemplates.find((at) => {
				const assessmentTemplateId =
					typeof assessment.assessmentTemplate === "object"
						? assessment.assessmentTemplate.id
						: assessment.assessmentTemplate;
				return String(at.id) === String(assessmentTemplateId);
			});

			const courseInstanceId = assessmentTemplate?.courseInstance
				? typeof assessmentTemplate.courseInstance === "object"
					? assessmentTemplate.courseInstance.id
					: assessmentTemplate.courseInstance
				: null;

			if (!courseInstanceId) {
				console.log(
					`  ⚠️ No course instance found for assessment: ${assessment.title}`,
				);
				continue;
			}

			// Group by course instance
			if (!assessmentsByCourseInstance.has(courseInstanceId)) {
				assessmentsByCourseInstance.set(courseInstanceId, []);
			}
			assessmentsByCourseInstance.get(courseInstanceId).push(assessment);
		}

		// Create scores for each course instance separately
		for (const [
			courseInstanceId,
			courseAssessments,
		] of assessmentsByCourseInstance) {
			console.log(
				`Creating scores for course instance ${courseInstanceId} with ${courseAssessments.length} assessments`,
			);

			// Find students enrolled in this specific course instance
			const enrolledStudents = enrollments.filter((enrollment) => {
				const enrollmentCourseInstanceId =
					typeof enrollment.courseInstance === "object"
						? enrollment.courseInstance.id
						: enrollment.courseInstance;

				return (
					String(enrollmentCourseInstanceId) ===
					String(courseInstanceId)
				);
			});

			console.log(
				`  Found ${enrolledStudents.length} enrolled students for course instance ${courseInstanceId}`,
			);

			if (enrolledStudents.length === 0) {
				console.log(
					`  ⚠️ No enrolled students found for course instance ${courseInstanceId}`,
				);
				continue;
			}

			// Create scores for each assessment in this course instance
			for (const assessment of courseAssessments) {
				console.log(`Creating scores for: ${assessment.title}`);

				const assessmentTemplate = assessmentTemplates.find((at) => {
					const assessmentTemplateId =
						typeof assessment.assessmentTemplate === "object"
							? assessment.assessmentTemplate.id
							: assessment.assessmentTemplate;
					return String(at.id) === String(assessmentTemplateId);
				});

				console.log(
					`  Assessment template found: ${!!assessmentTemplate}`,
				);

				// Create scores for each enrolled student using the same structure as professor endpoint
				for (const enrollment of enrolledStudents) {
					// Extract student ID (might be object or ID)
					const enrollmentStudentId =
						typeof enrollment.student === "object"
							? enrollment.student.id
							: enrollment.student;

					const student = students.find(
						(s) => String(s.id) === String(enrollmentStudentId),
					);

					if (!student) {
						console.log(
							`  ⚠️ Student not found for enrollment ${enrollment.id}`,
						);
						continue;
					}

					const maxScore = assessmentTemplate?.maxScore || 20;

					// Generate realistic score
					let scoreValue: number;
					let feedback: string;

					if (student?.email === "student@test.com") {
						// Test student gets excellent scores (85-98% of maxScore)
						const minScore = Math.max(
							1,
							Math.round(maxScore * 0.85),
						);
						const maxScoreLimit = Math.min(
							maxScore,
							Math.round(maxScore * 0.98),
						);
						scoreValue =
							Math.floor(
								Math.random() * (maxScoreLimit - minScore + 1),
							) + minScore;
						feedback = faker.helpers.arrayElement([
							"Excellent travail! Montre une compréhension solide des concepts.",
							"Performance exceptionnelle. Continuez comme ça!",
							"Très bien fait. Démontre une maîtrise du matériel.",
						]);
					} else {
						// Other students get varied scores (45-95% of maxScore)
						const minScore = Math.max(
							1,
							Math.round(maxScore * 0.45),
						);
						const maxScoreLimit = Math.min(
							maxScore,
							Math.round(maxScore * 0.95),
						);
						scoreValue =
							Math.floor(
								Math.random() * (maxScoreLimit - minScore + 1),
							) + minScore;
						feedback = faker.helpers.arrayElement([
							"Bonne compréhension du matériel.",
							"Montre des améliorations dans les domaines clés.",
							"Performance solide avec de la place pour la croissance.",
						]);
					}

					try {
						// Create the score using the same structure as the professor endpoint
						const scoreData = {
							assessment: Number(assessment.id),
							student: Number(student.id),
							scoreTitle: `${student.name} - ${assessment.title}`,
							value: scoreValue,
							maxValue: maxScore,
							percentage: Math.round(
								(scoreValue / maxScore) * 100,
							),
							finalValue: scoreValue,
							gradedBy: Number(professors[0].id),
							gradedAt: "2024-10-20T10:00:00.000Z",
							feedback: feedback,
							notes: "",
							isLate: false,
							latePenaltyApplied: 0,
							isExcused: false,
						};

						console.log(`Creating score with data:`, {
							assessment: scoreData.assessment,
							student: scoreData.student,
							value: scoreData.value,
							maxValue: scoreData.maxValue,
						});

						await payload.create({
							collection: "scores",
							data: scoreData,
						});

						totalScoresCreated++;
						console.log(
							`    ✅ Score: ${scoreValue}/${maxScore} (${Math.round((scoreValue / maxScore) * 100)}%) for ${student.name}`,
						);
					} catch (error) {
						console.error(
							`    ❌ Failed to create score for ${student.name}:`,
							error,
						);
					}
				}
			}
		}

		console.log(
			`🎉 Created ${totalScoresCreated} scores for all students!`,
		);

		// 11. Create grade aggregates
		console.log("📊 Creating grade aggregates...");

		for (const enrollment of enrollments) {
			const student = students.find((s) => s.id === enrollment.student);
			const finalNumeric =
				student?.email === "student@test.com"
					? faker.number.int({ min: 85, max: 95 })
					: faker.number.int({ min: 60, max: 85 });

			let finalLetter: string;
			let gpaPoints: number;

			if (finalNumeric >= 90) {
				finalLetter = "A";
				gpaPoints = 4.0;
			} else if (finalNumeric >= 80) {
				finalLetter = "B";
				gpaPoints = 3.0;
			} else if (finalNumeric >= 70) {
				finalLetter = "C";
				gpaPoints = 2.0;
			} else if (finalNumeric >= 60) {
				finalLetter = "D";
				gpaPoints = 1.0;
			} else {
				finalLetter = "F";
				gpaPoints = 0.0;
			}

			await payload.create({
				collection: "grade-aggregates",
				data: {
					enrollment: enrollment.id,
					finalNumeric,
					finalLetter,
					passFail: finalNumeric >= 50 ? "pass" : "fail",
					gpaPoints,
					calculatedAt: faker.date.past({ years: 1 }).toISOString(),
					notes: "Note finale calculée à partir de toutes les évaluations",
				},
			});
		}

		console.log(
			"✅ Campusnet unified data seeding completed successfully!",
		);

		return {
			university,
			faculty,
			department,
			courses: createdCourses,
			courseInstances,
			professors,
			students,
			enrollments,
			assessments,
			totalScoresCreated,
		};
	} catch (error) {
		console.error("Error seeding Campusnet unified data:", error);
		throw error;
	}
}
