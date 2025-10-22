"use client";

import { AlertCircle, Loader2, Save } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/stores/app-store";

interface Assessment {
	id: string;
	title: string;
	description: string;
	date: string;
	startTime: string;
	endTime: string;
	location: string;
	status: string;
	assessmentTemplate: {
		id: string;
		name: string;
		description: string;
		weightPercent: number;
		minScore: number;
		maxScore: number;
		assessmentType: string;
		courseInstance: {
			id: string;
			instanceTitle: string;
			courseVariation: {
				codeVariant: string;
				titleVariant: string;
				course: {
					code: string;
					name: string;
				};
			};
		};
	};
}

interface Student {
	id: string;
	name: string;
	email: string;
	studentId: string;
}

interface Score {
	id?: string;
	student: string;
	assessment: string;
	value: number;
	maxValue: number;
	percentage: number;
	feedback?: string;
	notes?: string;
	isLate: boolean;
	gradedBy: string;
	gradedAt: string;
}

interface Enrollment {
	id: string;
	student: Student;
	courseInstance: {
		id: string;
		instanceTitle: string;
		courseVariation: {
			codeVariant: string;
			titleVariant: string;
			course: {
				code: string;
				name: string;
			};
		};
	};
	status: string;
}

export default function ProfessorGradingPage() {
	const { user } = useAppStore();
	const [assessments, setAssessments] = useState<Assessment[]>([]);
	const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
	const [scores, setScores] = useState<Score[]>([]);
	const [selectedAssessment, setSelectedAssessment] =
		useState<Assessment | null>(null);
	// const [selectedCourseInstance, setSelectedCourseInstance] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Fetch assessments
	const fetchAssessments = useCallback(async () => {
		try {
			const response = await fetch("/api/assessments", {
				credentials: "include",
			});
			if (!response.ok) throw new Error("Failed to fetch assessments");
			const data = await response.json();
			setAssessments(data.docs || []);
		} catch (err) {
			console.error("Error fetching assessments:", err);
			setError("Failed to load assessments");
		}
	}, []);

	// Fetch enrollments for a specific course instance
	const fetchEnrollments = useCallback(async (courseInstanceId: string) => {
		try {
			const response = await fetch(
				`/api/enrollments?courseInstanceId=${courseInstanceId}`,
				{ credentials: "include" },
			);
			if (!response.ok) throw new Error("Failed to fetch enrollments");
			const data = await response.json();
			setEnrollments(data.docs || []);
		} catch (err) {
			console.error("Error fetching enrollments:", err);
			setError("Failed to load student enrollments");
		}
	}, []);

	// Fetch existing scores for an assessment
	const fetchScores = useCallback(async (assessmentId: string) => {
		try {
			const response = await fetch(
				`/api/scores?where[assessment][equals]=${assessmentId}`,
				{ credentials: "include" },
			);
			if (!response.ok) throw new Error("Failed to fetch scores");
			const data = await response.json();
			setScores(data.docs || []);
		} catch (err) {
			console.error("Error fetching scores:", err);
			setError("Failed to load existing scores");
		}
	}, []);

	// Load initial data
	useEffect(() => {
		const loadData = async () => {
			setLoading(true);
			await fetchAssessments();
			setLoading(false);
		};
		loadData();
	}, [fetchAssessments]);

	// Handle assessment selection
	const handleAssessmentSelect = async (assessment: Assessment) => {
		setSelectedAssessment(assessment);
		await Promise.all([
			fetchEnrollments(assessment.assessmentTemplate.courseInstance.id),
			fetchScores(assessment.id),
		]);
	};

	// Get score for a student
	const getScoreForStudent = (studentId: string): Score | null => {
		return scores.find((score) => score.student === studentId) || null;
	};

	// Update score for a student
	const updateScore = (studentId: string, field: keyof Score, value: any) => {
		setScores((prevScores) => {
			const existingScore = prevScores.find(
				(score) => score.student === studentId,
			);
			if (existingScore) {
				return prevScores.map((score) =>
					score.student === studentId
						? { ...score, [field]: value }
						: score,
				);
			} else {
				// Create new score
				const newScore: Score = {
					student: studentId,
					assessment: selectedAssessment?.id || "",
					value: 0,
					maxValue:
						selectedAssessment?.assessmentTemplate.maxScore || 100,
					percentage: 0,
					gradedBy: (user as any)?.id || "",
					gradedAt: new Date().toISOString(),
					isLate: false,
					[field]: value,
				};
				return [...prevScores, newScore];
			}
		});
	};

	// Calculate percentage
	const calculatePercentage = (value: number, maxValue: number): number => {
		return maxValue > 0 ? Math.round((value / maxValue) * 100) : 0;
	};

	// Save all scores
	const saveScores = async () => {
		if (!selectedAssessment) return;

		setSaving(true);
		try {
			const promises = scores.map(async (score) => {
				const scoreData = {
					...score,
					percentage: calculatePercentage(
						score.value,
						score.maxValue,
					),
				};

				if (score.id) {
					// Update existing score
					const response = await fetch(`/api/scores?id=${score.id}`, {
						method: "PATCH",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(scoreData),
					});
					if (!response.ok)
						throw new Error(
							`Failed to update score for student ${score.student}`,
						);
				} else {
					// Create new score
					const response = await fetch("/api/scores", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						credentials: "include",
						body: JSON.stringify({
							assessment: Number(
								selectedAssessment?.id ?? selectedAssessment,
							),
							student: Number(score.student),
							value: scoreData.value,
							maxValue: scoreData.maxValue,
							percentage: scoreData.percentage,
							finalValue: scoreData.value,
							gradedBy: Number((user as any)?.id ?? 0),
							gradedAt: new Date().toISOString(),
							feedback: scoreData.feedback,
							notes: scoreData.notes ?? "",
							isLate: Boolean(scoreData.isLate),
							latePenaltyApplied: Number(
								scoreData.latePenaltyApplied || 0,
							),
							isExcused: Boolean(
								(scoreData as any).isExcused || false,
							),
						}),
					});
					if (!response.ok)
						throw new Error(
							`Failed to create score for student ${score.student}`,
						);
				}
			});

			await Promise.all(promises);
			toast.success("All scores saved successfully!");

			// Refresh scores
			await fetchScores(selectedAssessment.id);
		} catch (err) {
			console.error("Error saving scores:", err);
			toast.error("Failed to save scores");
		} finally {
			setSaving(false);
		}
	};

	// Filter assessments by course instance
	// const filteredAssessments = selectedCourseInstance
	// 	? assessments.filter(
	// 			(assessment) => assessment.assessmentTemplate.courseInstance.id === selectedCourseInstance,
	// 		)
	// 	: assessments;

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-900 pt-20">
				<div className="container mx-auto px-4 py-8">
					<div className="flex items-center justify-center">
						<Loader2 className="h-8 w-8 animate-spin text-white" />
						<span className="ml-2 text-white">
							Loading grading interface...
						</span>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-900 pt-20">
				<div className="container mx-auto px-4 py-8">
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-900 pt-20">
			<div className="container mx-auto px-4 py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-white mb-2">
						Grade Management
					</h1>
					<p className="text-gray-300">
						Input and manage student scores for assessments
					</p>
				</div>

				<Tabs defaultValue="assessments" className="space-y-6">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="assessments">
							Select Assessment
						</TabsTrigger>
						<TabsTrigger
							value="grading"
							disabled={!selectedAssessment}
						>
							Grade Students
						</TabsTrigger>
					</TabsList>

					<TabsContent value="assessments" className="space-y-6">
						<Card className="bg-gray-800 border-gray-700">
							<CardHeader>
								<CardTitle className="text-white">
									Available Assessments
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid gap-4">
									{assessments.map((assessment) => (
										<Card
											key={assessment.id}
											className="bg-gray-700 border-gray-600 cursor-pointer hover:bg-gray-600 transition-colors"
											onClick={() =>
												handleAssessmentSelect(
													assessment,
												)
											}
										>
											<CardContent className="p-4">
												<div className="flex justify-between items-start">
													<div>
														<h3 className="text-lg font-semibold text-white">
															{assessment.title}
														</h3>
														<p className="text-gray-300 text-sm">
															{
																assessment
																	.assessmentTemplate
																	.courseInstance
																	.courseVariation
																	.course.code
															}{" "}
															-{" "}
															{
																assessment
																	.assessmentTemplate
																	.courseInstance
																	.courseVariation
																	.course.name
															}
														</p>
														<p className="text-gray-400 text-sm">
															{
																assessment
																	.assessmentTemplate
																	.name
															}{" "}
															• Max Score:{" "}
															{
																assessment
																	.assessmentTemplate
																	.maxScore
															}
														</p>
														<p className="text-gray-400 text-sm">
															Weight:{" "}
															{
																assessment
																	.assessmentTemplate
																	.weightPercent
															}
															% • Type:{" "}
															{
																assessment
																	.assessmentTemplate
																	.assessmentType
															}
														</p>
													</div>
													<Badge
														variant="secondary"
														className="bg-blue-600 text-white"
													>
														{assessment.status}
													</Badge>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="grading" className="space-y-6">
						{selectedAssessment && (
							<>
								<Card className="bg-gray-800 border-gray-700">
									<CardHeader>
										<CardTitle className="text-white">
											Grading: {selectedAssessment.title}
										</CardTitle>
										<p className="text-gray-300">
											{selectedAssessment
												?.assessmentTemplate
												?.courseInstance
												?.courseVariation?.course
												?.code ??
												selectedAssessment
													?.assessmentTemplate
													?.courseInstance
													?.courseVariation
													?.codeVariant ??
												"N/A"}{" "}
											-{" "}
											{selectedAssessment
												?.assessmentTemplate
												?.courseInstance
												?.courseVariation?.course
												?.name ??
												selectedAssessment
													?.assessmentTemplate
													?.courseInstance
													?.courseVariation
													?.titleVariant ??
												"Course name not available"}
										</p>
										<p className="text-gray-400 text-sm">
											Max Score:{" "}
											{
												selectedAssessment
													.assessmentTemplate.maxScore
											}{" "}
											• Weight:{" "}
											{
												selectedAssessment
													.assessmentTemplate
													.weightPercent
											}
											%
										</p>
									</CardHeader>
								</Card>

								<Card className="bg-gray-800 border-gray-700">
									<CardHeader>
										<div className="flex justify-between items-center">
											<CardTitle className="text-white">
												Student Scores (
												{enrollments.length} students)
											</CardTitle>
											<Button
												onClick={saveScores}
												disabled={
													saving ||
													scores.length === 0
												}
												className="bg-green-600 hover:bg-green-700 text-white"
											>
												{saving ? (
													<>
														<Loader2 className="h-4 w-4 animate-spin mr-2" />
														Saving...
													</>
												) : (
													<>
														<Save className="h-4 w-4 mr-2" />
														Save All Scores
													</>
												)}
											</Button>
										</div>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											{enrollments.map((enrollment) => {
												const score =
													getScoreForStudent(
														enrollment.student.id,
													);
												const studentScore =
													score?.value || 0;
												const maxScore =
													selectedAssessment
														.assessmentTemplate
														.maxScore;
												const percentage =
													calculatePercentage(
														studentScore,
														maxScore,
													);

												return (
													<Card
														key={
															enrollment.student
																.id
														}
														className="bg-gray-700 border-gray-600"
													>
														<CardContent className="p-4">
															<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
																<div className="md:col-span-1">
																	<div className="space-y-2">
																		<h4 className="font-semibold text-white">
																			{
																				enrollment
																					.student
																					.name
																			}
																		</h4>
																		<p className="text-gray-300 text-sm">
																			{
																				enrollment
																					.student
																					.studentId
																			}
																		</p>
																		<p className="text-gray-400 text-sm">
																			{
																				enrollment
																					.student
																					.email
																			}
																		</p>
																	</div>
																</div>

																<div className="md:col-span-1">
																	<Label
																		htmlFor={`score-${enrollment.student.id}`}
																		className="text-white"
																	>
																		Score
																	</Label>
																	<Input
																		id={`score-${enrollment.student.id}`}
																		type="number"
																		min="0"
																		max={
																			maxScore
																		}
																		value={
																			studentScore
																		}
																		onChange={(
																			e,
																		) =>
																			updateScore(
																				enrollment
																					.student
																					.id,
																				"value",
																				parseInt(
																					e
																						.target
																						.value,
																					10,
																				) ||
																					0,
																			)
																		}
																		className="bg-gray-600 border-gray-500 text-white"
																	/>
																	<p className="text-gray-400 text-sm">
																		{
																			percentage
																		}
																		% of{" "}
																		{
																			maxScore
																		}
																	</p>
																</div>

																<div className="md:col-span-1">
																	<Label
																		htmlFor={`feedback-${enrollment.student.id}`}
																		className="text-white"
																	>
																		Feedback
																	</Label>
																	<Textarea
																		id={`feedback-${enrollment.student.id}`}
																		value={
																			score?.feedback ||
																			""
																		}
																		onChange={(
																			e,
																		) =>
																			updateScore(
																				enrollment
																					.student
																					.id,
																				"feedback",
																				e
																					.target
																					.value,
																			)
																		}
																		placeholder="Enter feedback for this student..."
																		className="bg-gray-600 border-gray-500 text-white"
																		rows={2}
																	/>
																</div>

																<div className="md:col-span-1">
																	<Label
																		htmlFor={`notes-${enrollment.student.id}`}
																		className="text-white"
																	>
																		Notes
																	</Label>
																	<Textarea
																		id={`notes-${enrollment.student.id}`}
																		value={
																			score?.notes ||
																			""
																		}
																		onChange={(
																			e,
																		) =>
																			updateScore(
																				enrollment
																					.student
																					.id,
																				"notes",
																				e
																					.target
																					.value,
																			)
																		}
																		placeholder="Internal notes..."
																		className="bg-gray-600 border-gray-500 text-white"
																		rows={2}
																	/>
																	<div className="flex items-center mt-2">
																		<input
																			type="checkbox"
																			id={`late-${enrollment.student.id}`}
																			checked={
																				score?.isLate ||
																				false
																			}
																			onChange={(
																				e,
																			) =>
																				updateScore(
																					enrollment
																						.student
																						.id,
																					"isLate",
																					e
																						.target
																						.checked,
																				)
																			}
																			className="mr-2"
																		/>
																		<Label
																			htmlFor={`late-${enrollment.student.id}`}
																			className="text-gray-300 text-sm"
																		>
																			Late
																			submission
																		</Label>
																	</div>
																</div>
															</div>
														</CardContent>
													</Card>
												);
											})}
										</div>
									</CardContent>
								</Card>
							</>
						)}
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
