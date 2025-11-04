"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useId, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/stores/app-store";

interface CourseInstance {
	id: string;
	instanceTitle: string;
	courseVariation: {
		id: string;
		course: {
			id: string;
			code: string;
			name: string;
		};
		codeVariant: string;
		titleVariant: string;
	};
	professors: Array<{
		id: string;
		name: string;
		email: string;
	}>;
}

interface Assessment {
	id: string;
	title: string;
	description: string;
	maxScore: number;
	dueDate: string;
	isCompleted?: boolean;
	assessmentTemplate: {
		id: string;
		name: string;
		weightPercent: number;
		maxScore: number;
		assessmentType: string;
	};
}

interface Student {
	id: string;
	name: string;
	email: string;
	studentId: string;
}

interface Score {
	id: string;
	student: string;
	value: number;
	maxValue: number;
	percentage: number;
	feedback: string;
	gradedAt: string;
}

export default function ProfessorDashboard() {
	const { user: userStore } = useAppStore();
	const checkboxId = useId();
	const [courseInstances, setCourseInstances] = useState<CourseInstance[]>(
		[],
	);
	const [assessments, setAssessments] = useState<Assessment[]>([]);
	const [students, setStudents] = useState<Student[]>([]);
	const [scores, setScores] = useState<Score[]>([]);
	const [selectedCourse, setSelectedCourse] = useState<string>("");
	const [selectedAssessment, setSelectedAssessment] = useState<string>("");
	const [loading, setLoading] = useState(true);
	const [gradingMode, setGradingMode] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	// Unified view - no tabs
	const [newScores, setNewScores] = useState<
		Record<string, { value: number; feedback: string }>
	>({});

	const fetchCourseInstances = useCallback(async () => {
		try {
			console.log(
				"Fetching course instances for user:",
				userStore.user?.email,
			);
			const response = await fetch("/api/course-instances", {
				credentials: "include",
			});
			console.log(
				"Course instances response:",
				response.status,
				response.statusText,
			);
			if (response.ok) {
				const data = await response.json();
				console.log("Course instances data:", data);
				setCourseInstances(data.docs || []);
			} else {
				console.error(
					"Failed to fetch course instances:",
					response.status,
				);
				const errorText = await response.text();
				console.error("Error details:", errorText);
			}
		} catch (error) {
			console.error("Error fetching course instances:", error);
		} finally {
			setLoading(false);
		}
	}, [userStore.user]);

	const fetchAssessments = useCallback(async () => {
		if (courseInstances.length === 0) {
			setAssessments([]);
			return;
		}

		try {
			// Fetch assessments for ALL course instances, not just the selected one
			const allAssessments: Assessment[] = [];

			for (const courseInstance of courseInstances) {
				const response = await fetch(
					`/api/assessments?where[assessmentTemplate.courseInstance][equals]=${courseInstance.id}`,
					{
						credentials: "include",
					},
				);
				if (response.ok) {
					const data = await response.json();
					allAssessments.push(...(data.docs || []));
				} else {
					console.error(
						`Failed to fetch assessments for course ${courseInstance.id}:`,
						response.status,
					);
				}
			}

			console.log(
				`Fetched ${allAssessments.length} assessments across all courses`,
			);

			// Filter assessments by the currently selected course before setting state
			const filteredAssessments = allAssessments.filter((assessment) => {
				const assessmentCourseInstanceId = (
					assessment.assessmentTemplate as any
				)?.courseInstance
					? typeof (assessment.assessmentTemplate as any)
							.courseInstance === "object"
						? (assessment.assessmentTemplate as any).courseInstance
								.id
						: (assessment.assessmentTemplate as any).courseInstance
					: null;
				return (
					String(assessmentCourseInstanceId) ===
					String(selectedCourse)
				);
			});

			setAssessments(filteredAssessments);
			console.log(
				`Filtered to ${filteredAssessments.length} assessments for selected course ${selectedCourse}`,
			);

			// If no assessment is selected, or the selected assessment is no longer in the filtered list, select the first one
			if (
				!selectedAssessment ||
				!filteredAssessments.some((a) => a.id === selectedAssessment)
			) {
				setSelectedAssessment(
					filteredAssessments.length > 0
						? String(filteredAssessments[0].id)
						: "",
				);
			}
		} catch (error) {
			console.error("Error fetching assessments:", error);
		}
	}, [courseInstances, selectedCourse, selectedAssessment]);

	// Helper function to extract student ID from score (stable for deps)
	const getStudentIdFromScore = useCallback((score: any): string | number => {
		if (
			typeof score.student === "string" ||
			typeof score.student === "number"
		) {
			return score.student;
		}
		return score.student?.id;
	}, []);

	const fetchStudentsAndScores = useCallback(async () => {
		if (!selectedAssessment) return;

		setLoading(true);
		try {
			// First, get the assessment to find its course instance
			const selectedAssessmentData = assessments.find(
				(a) => a.id === selectedAssessment,
			);

			if (!selectedAssessmentData) {
				console.log("Assessment not found:", selectedAssessment);
				setStudents([]);
				setScores([]);
				return;
			}

			// Get the course instance ID from the assessment template
			const assessmentCourseInstanceId = (
				selectedAssessmentData.assessmentTemplate as any
			)?.courseInstance
				? typeof (selectedAssessmentData.assessmentTemplate as any)
						.courseInstance === "object"
					? (selectedAssessmentData.assessmentTemplate as any)
							.courseInstance.id
					: (selectedAssessmentData.assessmentTemplate as any)
							.courseInstance
				: null;

			if (!assessmentCourseInstanceId) {
				console.log(
					"No course instance found for assessment:",
					selectedAssessmentData.title,
				);
				setStudents([]);
				setScores([]);
				return;
			}

			console.log("Assessment data:", selectedAssessmentData);
			console.log(
				"Assessment template:",
				selectedAssessmentData.assessmentTemplate,
			);
			console.log(
				"Fetching students for course instance:",
				assessmentCourseInstanceId,
			);

			// Fetch students enrolled in the assessment's course instance (not the selected course)
			const enrollmentsResponse = await fetch(
				`/api/enrollments?where[courseInstance][equals]=${assessmentCourseInstanceId}`,
				{
					credentials: "include",
				},
			);
			if (enrollmentsResponse.ok) {
				const enrollmentsData = await enrollmentsResponse.json();
				console.log("Raw enrollments data:", enrollmentsData.docs);

				// First, deduplicate enrollments by student ID to avoid duplicate enrollments
				const uniqueEnrollments =
					enrollmentsData.docs?.filter(
						(enrollment: any, index: number, self: any[]) => {
							const studentId =
								typeof enrollment.student === "string"
									? enrollment.student
									: enrollment.student?.id;
							return (
								index ===
								self.findIndex((e) => {
									const otherStudentId =
										typeof e.student === "string"
											? e.student
											: e.student?.id;
									return otherStudentId === studentId;
								})
							);
						},
					) || [];

				console.log(
					"Unique enrollments after deduplication:",
					uniqueEnrollments,
				);

				const studentIds = uniqueEnrollments.map(
					(enrollment: unknown) => {
						const student = (
							enrollment as { student: string | { id: string } }
						).student;
						// Handle both cases: student as ID string or student as object
						return typeof student === "string"
							? student
							: student.id;
					},
				);

				console.log("Student IDs before deduplication:", studentIds);

				// Remove duplicate student IDs and ensure they're strings
				const uniqueStudentIds = Array.from(
					new Set(
						studentIds.map((id: string | number) => String(id)),
					),
				);

				console.log(
					"Unique student IDs after deduplication:",
					uniqueStudentIds,
				);

				if (uniqueStudentIds.length > 0) {
					console.log(
						"Fetching students with IDs:",
						uniqueStudentIds,
					);
					const studentsResponse = await fetch(
						`/api/users?where[id][in]=${uniqueStudentIds.join(",")}`,
						{
							credentials: "include",
						},
					);
					console.log(
						"Students response status:",
						studentsResponse.status,
					);
					if (studentsResponse.ok) {
						const studentsData = await studentsResponse.json();
						console.log("Students data received:", studentsData);

						// Ensure students are unique by ID and sort by name for consistent display
						const uniqueStudents = (studentsData.docs || [])
							.filter(
								(student: any, index: number, self: any[]) =>
									index ===
									self.findIndex(
										(s: any) => s.id === student.id,
									),
							)
							.sort((a: any, b: any) =>
								a.name.localeCompare(b.name),
							);

						console.log("Final unique students:", uniqueStudents);
						setStudents(uniqueStudents);
					} else {
						const errorText = await studentsResponse.text();
						console.error(
							"Failed to fetch students:",
							studentsResponse.status,
							errorText,
						);
					}
				}
			}

			// Fetch existing scores for this assessment
			const scoresResponse = await fetch(
				`/api/scores?where[assessment][equals]=${selectedAssessment}`,
				{
					credentials: "include",
				},
			);
			if (scoresResponse.ok) {
				const scoresData = await scoresResponse.json();
				const rawScores: any[] = scoresData.docs || [];
				console.log("Fetched scores:", rawScores);

				// Helper to extract assessment id from score
				const getScoreAssessmentId = (score: any): string => {
					if (
						typeof score.assessment === "string" ||
						typeof score.assessment === "number"
					) {
						return String(score.assessment);
					}
					return String(score.assessment?.id);
				};

				// Strictly filter by selected assessment (defensive) and deduplicate by student, preferring latest update
				const filteredForAssessment = rawScores.filter(
					(s) =>
						String(getScoreAssessmentId(s)) ===
						String(selectedAssessment),
				);
				const latestByStudent = new Map<string, any>();
				for (const s of filteredForAssessment) {
					const sid = String(getStudentIdFromScore(s));
					const existing = latestByStudent.get(sid);
					if (!existing) {
						latestByStudent.set(sid, s);
						continue;
					}
					const existingUpdated = new Date(
						existing.updatedAt || existing.createdAt || 0,
					).getTime();
					const currentUpdated = new Date(
						s.updatedAt || s.createdAt || 0,
					).getTime();
					if (currentUpdated >= existingUpdated) {
						latestByStudent.set(sid, s);
					}
				}
				const dedupedScores = Array.from(latestByStudent.values());
				console.log(
					"Scores after assessment-filter + dedupe:",
					dedupedScores,
				);
				setScores(dedupedScores);
			}
		} catch (error) {
			console.error("Error fetching students and scores:", error);
		} finally {
			setLoading(false);
		}
	}, [selectedAssessment, assessments, getStudentIdFromScore]);

	useEffect(() => {
		console.log("Professor page mounted, user:", userStore.user);
		if (userStore.user) {
			if (
				userStore.user.role === "professor" ||
				userStore.user.role === "faculty-staff"
			) {
				fetchCourseInstances();
			} else {
				console.log(
					"User does not have professor role:",
					userStore.user.role,
				);
				toast.error("Access denied. Professor role required.");
				// Let the login page handle the redirect
			}
		} else {
			console.log("No user found, redirecting to login");
			// Let the login page handle the redirect
		}
	}, [fetchCourseInstances, userStore.user]);

	// Add a useEffect to verify authentication status
	useEffect(() => {
		const verifyAuth = async () => {
			try {
				const response = await fetch("/api/users/me", {
					credentials: "include",
				});
				console.log("Auth verification response:", response.status);
				if (!response.ok) {
					console.log("Authentication failed, redirecting to login");
					// Redirect to login if authentication fails
					window.location.href = "/login";
				}
			} catch (error) {
				console.error("Auth verification error:", error);
				window.location.href = "/login";
			}
		};

		// Only verify if we have a user in the store
		if (userStore.user) {
			verifyAuth();
		}
	}, [userStore.user]);

	useEffect(() => {
		if (courseInstances.length > 0) {
			fetchAssessments();
		}
	}, [courseInstances, fetchAssessments]);

	useEffect(() => {
		if (selectedAssessment) {
			fetchStudentsAndScores();
			// removed tab switch in unified view
		}
	}, [selectedAssessment, fetchStudentsAndScores]);

	// Check if user is professor or faculty-staff
	if (!userStore.user) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	if (
		userStore.user.role !== "professor" &&
		userStore.user.role !== "faculty-staff"
	) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<Card className="w-full max-w-md bg-card border-border">
					<CardContent className="pt-6">
						<div className="text-center">
							<Icon
								icon="lucide:lock"
								className="w-12 h-12 text-red-500 mx-auto mb-4"
							/>
							<h2 className="text-xl font-semibold text-card-foreground mb-2">
								Access Denied
							</h2>
							<p className="text-muted-foreground">
								You need professor or faculty-staff privileges
								to access this page.
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	const handleScoreChange = (studentId: string, value: number) => {
		// Ensure value is a valid number
		const numericValue = Number.isNaN(value) ? 0 : value;

		setNewScores((prev) => ({
			...prev,
			[studentId]: {
				...prev[studentId],
				value: numericValue,
			},
		}));
	};

	const handleFeedbackChange = (studentId: string, feedback: string) => {
		setNewScores((prev) => ({
			...prev,
			[studentId]: {
				...prev[studentId],
				feedback,
			},
		}));
	};

	const toggleAssessmentCompletion = async (
		assessmentId: string,
		isCompleted: boolean,
	) => {
		try {
			const response = await fetch(`/api/assessments/${assessmentId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ isCompleted }),
			});

			if (!response.ok) {
				throw new Error("Failed to update assessment");
			}

			// Update local state
			setAssessments((prev) =>
				prev.map((a) =>
					a.id === assessmentId ? { ...a, isCompleted } : a,
				),
			);

			toast.success(
				isCompleted
					? "Assessment marked as completed"
					: "Assessment marked as incomplete",
			);
		} catch (error) {
			console.error("Error updating assessment:", error);
			toast.error("Failed to update assessment status");
		}
	};

	const saveScores = async () => {
		if (isSaving) return; // Prevent multiple simultaneous saves

		setIsSaving(true);
		try {
			const selectedAssessmentData = assessments.find(
				(a) => a.id === selectedAssessment,
			);
			if (!selectedAssessmentData) {
				toast.error("Assessment not found");
				return;
			}

			if (Object.keys(newScores).length === 0) {
				toast.error("Aucune note à enregistrer");
				return;
			}

			console.log("Saving scores:", newScores);
			console.log("Selected course:", selectedCourse);
			console.log("Selected assessment:", selectedAssessment);

			// Process all entries in newScores
			const promises = Object.entries(newScores).map(
				async ([studentId, scoreData]) => {
					const existingScore = scores.find(
						(s) =>
							String(getStudentIdFromScore(s)) ===
							String(studentId),
					);

					console.log(`Processing student ${studentId}:`, {
						existingScore,
						scoreData,
					});

					if (existingScore) {
						// Update existing score - allow updating feedback even without changing value
						const updateData: any = {
							feedback: scoreData.feedback,
							gradedBy: Number(userStore.user?.id),
							gradedAt: new Date().toISOString(),
						};

						// Only update value-related fields if a valid value is provided
						if (
							scoreData &&
							typeof scoreData.value === "number" &&
							!Number.isNaN(scoreData.value) &&
							scoreData.value >= 0
						) {
							updateData.value = scoreData.value;
							updateData.percentage = Math.round(
								(scoreData.value /
									(selectedAssessmentData.assessmentTemplate
										?.maxScore || 100)) *
									100,
							);
							updateData.finalValue = scoreData.value;
						}

						const response = await fetch(
							`/api/scores?id=${Number(existingScore.id)}`,
							{
								method: "PATCH",
								headers: { "Content-Type": "application/json" },
								credentials: "include",
								body: JSON.stringify(updateData),
							},
						);

						if (!response.ok) {
							const errorText = await response.text();
							throw new Error(
								`Failed to update score: ${errorText}`,
							);
						}

						return response.json();
					} else {
						// Create new score - only if value is provided and valid
						// Allow creating a score even if only feedback is provided.
						// If value is not provided, default to 0 so the record can be created.
						const hasValidValue =
							scoreData &&
							typeof scoreData.value === "number" &&
							!Number.isNaN(scoreData.value) &&
							scoreData.value >= 0;
						const hasFeedback = Boolean(
							scoreData?.feedback &&
								scoreData.feedback.trim().length > 0,
						);
						if (!hasValidValue && !hasFeedback) {
							console.log(
								`Skipping student ${studentId} - neither valid value nor feedback provided`,
							);
							return null;
						}

						const valueToSave = hasValidValue ? scoreData.value : 0;

						const payload = {
							assessment: Number(selectedAssessment),
							student: Number(studentId),
							scoreTitle: `${students.find((s) => s.id === studentId)?.name} - ${selectedAssessmentData.title}`,
							value: valueToSave,
							maxValue:
								selectedAssessmentData.assessmentTemplate
									?.maxScore || 100,
							percentage: Math.round(
								(valueToSave /
									(selectedAssessmentData.assessmentTemplate
										?.maxScore || 100)) *
									100,
							),
							finalValue: valueToSave,
							gradedBy: Number(userStore.user?.id),
							gradedAt: new Date().toISOString(),
							feedback: scoreData.feedback,
							notes: "",
							isLate: false,
							latePenaltyApplied: 0,
							isExcused: false,
						};

						console.log("Creating score with payload:", payload);

						const response = await fetch("/api/scores", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							credentials: "include",
							body: JSON.stringify(payload),
						});

						if (!response.ok) {
							const errorText = await response.text();
							throw new Error(
								`Failed to create score: ${errorText}`,
							);
						}

						return response.json();
					}
				},
			);

			const results = await Promise.all(promises);
			console.log("Save results:", results);

			// Optimistically merge returned scores into local state so feedback/value appear immediately
			setScores((prev) => {
				const byId = new Map<string | number, any>();
				for (const s of prev) byId.set(s.id, s);
				for (const r of results) {
					if (!r) continue;
					byId.set(r.id, r);
				}
				return Array.from(byId.values());
			});

			// Trigger automatic grade calculation
			try {
				const selectedCourseData = courseInstances.find(
					(c) => c.id === selectedCourse,
				);
				if (selectedCourseData) {
					console.log(
						"Triggering grade calculation for course:",
						selectedCourse,
					);
					const calcResponse = await fetch("/api/grades/calculate", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						credentials: "include",
						body: JSON.stringify({
							courseInstanceId: selectedCourse,
						}),
					});

					if (!calcResponse.ok) {
						const errorText = await calcResponse.text();
						console.error("Grade calculation failed:", errorText);
					} else {
						console.log("Grade calculation successful");
					}
				}
			} catch (error) {
				console.error("Error calculating grades:", error);
			}

			toast.success("Scores saved and grades calculated successfully!");

			// Refresh data immediately BEFORE clearing UI state
			await fetchStudentsAndScores();

			// Also refresh assessments to update completion status
			await fetchAssessments();

			// Clear UI state AFTER data is refreshed and rendered
			setGradingMode(false);
			setNewScores({});
		} catch (error) {
			console.error("Error saving scores:", error);
			toast.error(
				`Échec de l'enregistrement des notes : ${error instanceof Error ? error.message : "Erreur inconnue"}`,
			);
		} finally {
			setIsSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-card-foreground">Chargement...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background pt-20">
			<div className="container mx-auto px-4 py-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-8"
				>
					<h1 className="text-3xl font-bold text-card-foreground mb-2">
						Tableau de bord professeur
					</h1>
					<p className="text-muted-foreground mb-6">
						Bienvenue, {userStore.user?.name}. Gérez vos cours et
						évaluez les étudiants.
					</p>

					{/* Quick Navigation */}
					<div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-8">
						<Button
							onClick={() => {
								window.location.href = "/professor/progress";
							}}
							className="bg-green-600 hover:bg-green-700 text-card-foreground h-16 flex flex-col items-center justify-center"
						>
							<Icon
								icon="lucide:bar-chart-3"
								className="h-6 w-6 mb-2"
							/>
							<span className="text-sm">Suivre les progrès</span>
						</Button>
					</div>
				</motion.div>

				{/* Unified view: Courses → Assessments → Grading */}
				<div className="space-y-6">
					<Card className="bg-card border-border">
						<CardHeader>
							<CardTitle className="text-card-foreground">
								Instances de cours
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
								{courseInstances.map((course) => (
									<motion.div
										key={course.id}
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										<Card className="bg-card border-border hover:border-border transition-colors">
											<CardHeader>
												<CardTitle className="text-card-foreground text-lg">
													{course.courseVariation
														?.course?.code ||
														course.courseVariation
															?.codeVariant ||
														"N/A"}{" "}
													- {course.instanceTitle}
												</CardTitle>
												<p className="text-muted-foreground">
													{course.courseVariation
														?.course?.name ||
														course.courseVariation
															?.titleVariant ||
														"Nom du cours non disponible"}
												</p>
											</CardHeader>
											<CardContent>
												<div className="space-y-2">
													<div className="flex items-center gap-2">
														<Icon
															icon="lucide:users"
															className="w-4 h-4 text-gray-400"
														/>
														<span className="text-muted-foreground">
															{
																course
																	.professors
																	.length
															}{" "}
															Professeur(s)
														</span>
													</div>
													<Button
														onClick={() =>
															setSelectedCourse(
																course.id,
															)
														}
														className="w-full bg-blue-600 hover:bg-blue-700"
													>
														Sélectionner le cours
													</Button>
												</div>
											</CardContent>
										</Card>
									</motion.div>
								))}
							</div>
						</CardContent>
					</Card>

					{selectedCourse && (
						<Card className="bg-card border-border">
							<CardHeader>
								<CardTitle className="text-card-foreground">
									Évaluations
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{assessments.map((assessment) => (
										<motion.div
											key={assessment.id}
											whileHover={{ scale: 1.01 }}
										>
											<Card className="bg-card border-border">
												<CardContent className="pt-6">
													<div className="flex items-center justify-between">
														<div className="space-y-2">
															<h3 className="text-card-foreground font-semibold">
																{
																	assessment.title
																}
															</h3>
															<p className="text-muted-foreground text-sm">
																{
																	assessment.description
																}
															</p>
															<div className="flex items-center gap-4 text-sm text-gray-400">
																<span>
																	<Icon
																		icon="lucide:calendar"
																		className="w-4 h-4 inline mr-1"
																	/>
																	Échéance :{" "}
																	{assessment.dueDate
																		? new Date(
																				assessment.dueDate,
																			).toLocaleDateString()
																		: "N/A"}
																</span>
																<span>
																	<Icon
																		icon="lucide:target"
																		className="w-4 h-4 inline mr-1"
																	/>
																	Score max :{" "}
																	{assessment
																		.assessmentTemplate
																		?.maxScore ||
																		"N/A"}
																</span>
																<span>
																	<Icon
																		icon="lucide:percent"
																		className="w-4 h-4 inline mr-1"
																	/>
																	Pondération :{" "}
																	{
																		assessment
																			.assessmentTemplate
																			.weightPercent
																	}
																	%
																</span>
															</div>
														</div>
														<Button
															onClick={() =>
																setSelectedAssessment(
																	assessment.id,
																)
															}
															className="bg-green-600 hover:bg-green-700"
														>
															Commencer la notation
														</Button>
													</div>
												</CardContent>
											</Card>
										</motion.div>
									))}
								</div>
							</CardContent>
						</Card>
					)}

					{selectedAssessment && (
						<Card className="bg-card border-border">
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle className="text-card-foreground">
											Noter les étudiants
										</CardTitle>
										{(() => {
											const selectedCourseData =
												courseInstances.find(
													(c) =>
														c.id === selectedCourse,
												);
											const selectedAssessmentData =
												assessments.find(
													(a) =>
														a.id ===
														selectedAssessment,
												);
											return (
												<div className="mt-2 space-y-2">
													<div className="text-sm text-muted-foreground">
														<div className="font-medium">
															{selectedCourseData
																?.courseVariation
																?.course
																?.code ||
																selectedCourseData
																	?.courseVariation
																	?.codeVariant ||
																"N/A"}{" "}
															-{" "}
															{
																selectedCourseData?.instanceTitle
															}
														</div>
														<div className="text-gray-400">
															Évaluation :{" "}
															{
																selectedAssessmentData?.title
															}{" "}
															(Max :{" "}
															{
																selectedAssessmentData
																	?.assessmentTemplate
																	?.maxScore
															}{" "}
															points • Pondération :{" "}
															{
																selectedAssessmentData
																	?.assessmentTemplate
																	?.weightPercent
															}
															%)
														</div>
													</div>
													<div className="flex items-center space-x-2">
														<Checkbox
															id={checkboxId}
															checked={
																selectedAssessmentData?.isCompleted ||
																false
															}
															onCheckedChange={(
																checked,
															) =>
																toggleAssessmentCompletion(
																	selectedAssessment,
																	!!checked,
																)
															}
														/>
														<Label
															htmlFor={checkboxId}
															className="text-sm text-muted-foreground cursor-pointer"
														>
															Marquer comme terminé
															(inclure dans la note
															finale)
														</Label>
													</div>
												</div>
											);
										})()}
									</div>
									<div className="flex gap-2">
										{!gradingMode ? (
											<Button
												onClick={() =>
													setGradingMode(true)
												}
												className="bg-blue-600 hover:bg-blue-700"
											>
												<Icon
													icon="lucide:edit"
													className="w-4 h-4 mr-2"
												/>
												Commencer la notation
											</Button>
										) : (
											<>
												<Button
													onClick={() =>
														setGradingMode(false)
													}
													variant="outline"
													className="border-border text-muted-foreground hover:bg-card"
												>
													Annuler
												</Button>
												<Button
													onClick={saveScores}
													disabled={isSaving}
													className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
												>
													<Icon
														icon={
															isSaving
																? "lucide:loader-2"
																: "lucide:save"
														}
														className={`w-4 h-4 mr-2 ${isSaving ? "animate-spin" : ""}`}
													/>
													{isSaving
														? "Enregistrement..."
														: "Enregistrer toutes les notes"}
												</Button>
											</>
										)}
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow className="border-border">
											<TableHead className="text-muted-foreground">
												Étudiant
											</TableHead>
											<TableHead className="text-muted-foreground">
												ID étudiant
											</TableHead>
											<TableHead className="text-muted-foreground">
												Note
											</TableHead>
											<TableHead className="text-muted-foreground">
												Pourcentage
											</TableHead>
											<TableHead className="text-muted-foreground">
												Commentaire
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{students.map((student) => {
											const existingScore = scores.find(
												(s) =>
													String(
														getStudentIdFromScore(
															s,
														),
													) === String(student.id),
											);
											const currentScore = gradingMode
												? (newScores[student.id]
														?.value ??
													existingScore?.value ??
													0)
												: (existingScore?.value ?? 0);
											const currentFeedback = gradingMode
												? (newScores[student.id]
														?.feedback ??
													existingScore?.feedback ??
													"")
												: (existingScore?.feedback ??
													"");

											return (
												<TableRow
													key={student.id}
													className="border-border"
												>
													<TableCell className="text-card-foreground">
														{student.name}
													</TableCell>
													<TableCell className="text-muted-foreground">
														{student.studentId}
													</TableCell>
													<TableCell>
														{gradingMode ? (
															<Input
																type="number"
																min="0"
																max={
																	assessments.find(
																		(a) =>
																			a.id ===
																			selectedAssessment,
																	)
																		?.assessmentTemplate
																		?.maxScore ||
																	100
																}
																value={
																	currentScore
																}
																onChange={(e) =>
																	handleScoreChange(
																		student.id,
																		Number(
																			e
																				.target
																				.value,
																		),
																	)
																}
																className="w-20 bg-card border-border text-card-foreground"
															/>
														) : (
															<span className="text-card-foreground">
																{currentScore}
															</span>
														)}
													</TableCell>
													<TableCell className="text-muted-foreground">
														{Math.round(
															(currentScore /
																(assessments.find(
																	(a) =>
																		a.id ===
																		selectedAssessment,
																)
																	?.assessmentTemplate
																	?.maxScore ||
																	100)) *
																100,
														)}
														%
													</TableCell>
													<TableCell>
														{gradingMode ? (
															<Textarea
																value={
																	currentFeedback
																}
																onChange={(e) =>
																	handleFeedbackChange(
																		student.id,
																		e.target
																			.value,
																	)
																}
																placeholder="Entrer un commentaire..."
																className="w-64 bg-card border-border text-card-foreground"
																rows={2}
															/>
														) : (
															<span className="text-muted-foreground">
																{currentFeedback ||
																	"Aucun commentaire"}
															</span>
														)}
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
