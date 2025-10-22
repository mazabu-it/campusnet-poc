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
	// Unified view - no tabs
	const [newScores, setNewScores] = useState<
		Record<string, { value: number; feedback: string }>
	>({});

	const fetchCourseInstances = useCallback(async () => {
		try {
			const response = await fetch("/api/course-instances", {
				credentials: "include",
			});
			if (response.ok) {
				const data = await response.json();
				setCourseInstances(data.docs || []);
			}
		} catch (error) {
			console.error("Error fetching course instances:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchAssessments = useCallback(async () => {
		if (!selectedCourse) return;
		try {
			const response = await fetch(
				`/api/assessments?where[assessmentTemplate.courseInstance][equals]=${selectedCourse}`,
				{
					credentials: "include",
				},
			);
			if (response.ok) {
				const data = await response.json();
				setAssessments(data.docs || []);
			}
		} catch (error) {
			console.error("Error fetching assessments:", error);
		}
	}, [selectedCourse]);

	// Helper function to extract student ID from score
	const getStudentIdFromScore = (score: any): string | number => {
		if (
			typeof score.student === "string" ||
			typeof score.student === "number"
		) {
			return score.student;
		}
		return score.student?.id;
	};

	const fetchStudentsAndScores = useCallback(async () => {
		if (!selectedAssessment) return;
		try {
			// Fetch students enrolled in the course
			const enrollmentsResponse = await fetch(
				`/api/enrollments?where[courseInstance][equals]=${selectedCourse}`,
				{
					credentials: "include",
				},
			);
			if (enrollmentsResponse.ok) {
				const enrollmentsData = await enrollmentsResponse.json();
				const studentIds =
					enrollmentsData.docs?.map((enrollment: unknown) => {
						const student = (
							enrollment as { student: string | { id: string } }
						).student;
						// Handle both cases: student as ID string or student as object
						return typeof student === "string"
							? student
							: student.id;
					}) || [];

				// Remove duplicate student IDs
				const uniqueStudentIds = Array.from(new Set(studentIds));

				if (uniqueStudentIds.length > 0) {
					const studentsResponse = await fetch(
						`/api/users?where[id][in]=${uniqueStudentIds.join(",")}`,
						{
							credentials: "include",
						},
					);
					if (studentsResponse.ok) {
						const studentsData = await studentsResponse.json();
						// Ensure students are unique by ID
						const uniqueStudents = (studentsData.docs || []).filter(
							(student: any, index: number, self: any[]) =>
								index ===
								self.findIndex((s: any) => s.id === student.id),
						);
						console.log("Unique students:", uniqueStudents);
						setStudents(uniqueStudents);
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
				console.log("Fetched scores:", scoresData.docs);
				setScores(scoresData.docs || []);
			}
		} catch (error) {
			console.error("Error fetching students and scores:", error);
		}
	}, [selectedAssessment, selectedCourse]);

	useEffect(() => {
		fetchCourseInstances();
	}, [fetchCourseInstances]);

	useEffect(() => {
		if (selectedCourse) {
			fetchAssessments();
		}
	}, [selectedCourse, fetchAssessments]);

	useEffect(() => {
		if (selectedAssessment) {
			fetchStudentsAndScores();
			// removed tab switch in unified view
		}
	}, [selectedAssessment, fetchStudentsAndScores]);

	// Check if user is professor or faculty-staff
	if (!userStore.user) {
		return (
			<div className="min-h-screen bg-gray-900 flex items-center justify-center">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	if (
		userStore.user.role !== "professor" &&
		userStore.user.role !== "faculty-staff"
	) {
		return (
			<div className="min-h-screen bg-gray-900 flex items-center justify-center">
				<Card className="w-full max-w-md bg-gray-800 border-gray-700">
					<CardContent className="pt-6">
						<div className="text-center">
							<Icon
								icon="lucide:lock"
								className="w-12 h-12 text-red-500 mx-auto mb-4"
							/>
							<h2 className="text-xl font-semibold text-white mb-2">
								Access Denied
							</h2>
							<p className="text-gray-300">
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
		setNewScores((prev) => ({
			...prev,
			[studentId]: {
				...prev[studentId],
				value,
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
		try {
			const selectedAssessmentData = assessments.find(
				(a) => a.id === selectedAssessment,
			);
			if (!selectedAssessmentData) {
				toast.error("Assessment not found");
				return;
			}

			if (Object.keys(newScores).length === 0) {
				toast.error("No scores to save");
				return;
			}

			console.log("Saving scores:", newScores);
			console.log("Selected course:", selectedCourse);
			console.log("Selected assessment:", selectedAssessment);

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
						// Update existing score
						const response = await fetch(
							`/api/scores?id=${Number(existingScore.id)}`,
							{
								method: "PATCH",
								headers: { "Content-Type": "application/json" },
								credentials: "include",
								body: JSON.stringify({
									value: scoreData.value,
									percentage: Math.round(
										(scoreData.value /
											selectedAssessmentData.maxScore) *
											100,
									),
									finalValue: scoreData.value,
									feedback: scoreData.feedback,
									gradedBy: Number(userStore.user?.id),
									gradedAt: new Date().toISOString(),
								}),
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
						// Create new score
						const payload = {
							assessment: Number(selectedAssessment),
							student: Number(studentId),
							scoreTitle: `${students.find((s) => s.id === studentId)?.name} - ${selectedAssessmentData.title}`,
							value: scoreData.value,
							maxValue: selectedAssessmentData.maxScore,
							percentage: Math.round(
								(scoreData.value /
									selectedAssessmentData.maxScore) *
									100,
							),
							finalValue: scoreData.value,
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
			setGradingMode(false);
			setNewScores({});
			fetchStudentsAndScores(); // Refresh data
		} catch (error) {
			console.error("Error saving scores:", error);
			toast.error(
				`Failed to save scores: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-900 flex items-center justify-center">
				<div className="text-white">Loading...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-900 pt-20">
			<div className="container mx-auto px-4 py-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-8"
				>
					<h1 className="text-3xl font-bold text-white mb-2">
						Professor Dashboard
					</h1>
					<p className="text-gray-300 mb-6">
						Welcome, {userStore.user?.name}. Manage your courses and
						grade assessments.
					</p>

					{/* Quick Navigation */}
					<div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-8">
						<Button
							onClick={() => {
								window.location.href = "/professor/progress";
							}}
							className="bg-green-600 hover:bg-green-700 text-white h-16 flex flex-col items-center justify-center"
						>
							<Icon
								icon="lucide:bar-chart-3"
								className="h-6 w-6 mb-2"
							/>
							<span className="text-sm">Track Progress</span>
						</Button>
					</div>
				</motion.div>

				{/* Unified view: Courses → Assessments → Grading */}
				<div className="space-y-6">
					<Card className="bg-gray-800 border-gray-700">
						<CardHeader>
							<CardTitle className="text-white">
								Course Instances
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
										<Card className="bg-gray-700 border-gray-600 hover:border-gray-500 transition-colors">
											<CardHeader>
												<CardTitle className="text-white text-lg">
													{course.courseVariation
														?.course?.code ||
														course.courseVariation
															?.codeVariant ||
														"N/A"}{" "}
													- {course.instanceTitle}
												</CardTitle>
												<p className="text-gray-300">
													{course.courseVariation
														?.course?.name ||
														course.courseVariation
															?.titleVariant ||
														"Course name not available"}
												</p>
											</CardHeader>
											<CardContent>
												<div className="space-y-2">
													<div className="flex items-center gap-2">
														<Icon
															icon="lucide:users"
															className="w-4 h-4 text-gray-400"
														/>
														<span className="text-gray-300">
															{
																course
																	.professors
																	.length
															}{" "}
															Professor(s)
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
														Select Course
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
						<Card className="bg-gray-800 border-gray-700">
							<CardHeader>
								<CardTitle className="text-white">
									Assessments
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{assessments.map((assessment) => (
										<motion.div
											key={assessment.id}
											whileHover={{ scale: 1.01 }}
										>
											<Card className="bg-gray-700 border-gray-600">
												<CardContent className="pt-6">
													<div className="flex items-center justify-between">
														<div className="space-y-2">
															<h3 className="text-white font-semibold">
																{
																	assessment.title
																}
															</h3>
															<p className="text-gray-300 text-sm">
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
																	Due:{" "}
																	{new Date(
																		assessment.dueDate,
																	).toLocaleDateString()}
																</span>
																<span>
																	<Icon
																		icon="lucide:target"
																		className="w-4 h-4 inline mr-1"
																	/>
																	Max Score:{" "}
																	{
																		assessment.maxScore
																	}
																</span>
																<span>
																	<Icon
																		icon="lucide:percent"
																		className="w-4 h-4 inline mr-1"
																	/>
																	Weight:{" "}
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
															Start Grading
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
						<Card className="bg-gray-800 border-gray-700">
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle className="text-white">
											Grade Students
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
													<div className="text-sm text-gray-300">
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
															Assessment:{" "}
															{
																selectedAssessmentData?.title
															}{" "}
															(Max:{" "}
															{
																selectedAssessmentData?.maxScore
															}{" "}
															points • Weight:{" "}
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
															className="text-sm text-gray-300 cursor-pointer"
														>
															Mark as completed
															(include in final
															grade)
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
												Start Grading
											</Button>
										) : (
											<>
												<Button
													onClick={() =>
														setGradingMode(false)
													}
													variant="outline"
													className="border-gray-600 text-gray-300 hover:bg-gray-700"
												>
													Cancel
												</Button>
												<Button
													onClick={saveScores}
													className="bg-green-600 hover:bg-green-700"
												>
													<Icon
														icon="lucide:save"
														className="w-4 h-4 mr-2"
													/>
													Save All Scores
												</Button>
											</>
										)}
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow className="border-gray-700">
											<TableHead className="text-gray-300">
												Student
											</TableHead>
											<TableHead className="text-gray-300">
												Student ID
											</TableHead>
											<TableHead className="text-gray-300">
												Score
											</TableHead>
											<TableHead className="text-gray-300">
												Percentage
											</TableHead>
											<TableHead className="text-gray-300">
												Feedback
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
													className="border-gray-700"
												>
													<TableCell className="text-white">
														{student.name}
													</TableCell>
													<TableCell className="text-gray-300">
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
																className="w-20 bg-gray-700 border-gray-600 text-white"
															/>
														) : (
															<span className="text-white">
																{currentScore}
															</span>
														)}
													</TableCell>
													<TableCell className="text-gray-300">
														{Math.round(
															(currentScore /
																(assessments.find(
																	(a) =>
																		a.id ===
																		selectedAssessment,
																)?.maxScore ||
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
																placeholder="Enter feedback..."
																className="w-64 bg-gray-700 border-gray-600 text-white"
																rows={2}
															/>
														) : (
															<span className="text-gray-300">
																{currentFeedback ||
																	"No feedback"}
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
