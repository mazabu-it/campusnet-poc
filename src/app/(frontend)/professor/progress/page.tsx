"use client";

import {
	AlertCircle,
	Award,
	BookOpen,
	Loader2,
	RefreshCw,
	TrendingUp,
	Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/stores/app-store";

interface Student {
	id: string;
	name: string;
	email: string;
	studentId: string;
	role: string;
}

interface CourseInstance {
	id: string;
	instanceTitle: string;
	courseVariation: {
		codeVariant: string;
		titleVariant: string;
		course: {
			code: string;
			title: string;
		};
	};
	professors: Array<{
		id: string;
		name: string;
		email: string;
	}>;
}

interface Enrollment {
	id: string;
	student: Student;
	courseInstance: CourseInstance;
	status: string;
	enrolledAt: string;
}

interface Assessment {
	id: string;
	title: string;
	description: string;
	date: string;
	status: string;
	isCompleted?: boolean;
	assessmentTemplate: {
		id: string;
		name: string;
		weightPercent: number;
		maxScore: number;
		assessmentType: string;
		courseInstance: {
			id: string;
		};
	};
}

interface Score {
	id: string;
	student: string;
	assessment: string;
	value: number;
	maxValue: number;
	percentage: number;
	feedback?: string;
	gradedAt: string;
}

interface GradeAggregate {
	id: string;
	enrollment: string;
	finalNumeric: number;
	finalLetter: string;
	passFail: string;
	gpaPoints: number;
	calculationMethod: string;
	calculatedAt: string;
}

export default function ProfessorProgressPage() {
	const { user: _user } = useAppStore();
	const [courseInstances, setCourseInstances] = useState<CourseInstance[]>(
		[],
	);
	const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
	const [assessments, setAssessments] = useState<Assessment[]>([]);
	const [scores, setScores] = useState<Score[]>([]);
	const [gradeAggregates, setGradeAggregates] = useState<GradeAggregate[]>(
		[],
	);
	const [selectedCourseInstance, setSelectedCourseInstance] =
		useState<CourseInstance | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch course instances for the professor
	const fetchCourseInstances = useCallback(async () => {
		try {
			const response = await fetch("/api/course-instances", {
				credentials: "include",
			});
			if (!response.ok)
				throw new Error("Failed to fetch course instances");
			const data = await response.json();
			setCourseInstances(data.docs || []);
		} catch (err) {
			console.error("Error fetching course instances:", err);
			setError("Failed to load course instances");
		}
	}, []);

	// Fetch enrollments for a specific course instance
	const fetchEnrollments = useCallback(async (courseInstanceId: string) => {
		try {
			const response = await fetch(
				`/api/enrollments?where[courseInstance][equals]=${courseInstanceId}`,
				{
					credentials: "include",
				},
			);
			if (!response.ok) throw new Error("Failed to fetch enrollments");
			const data = await response.json();
			console.log("Enrollments data:", data.docs);
			setEnrollments(data.docs || []);
		} catch (err) {
			console.error("Error fetching enrollments:", err);
			setError("Failed to load student enrollments");
		}
	}, []);

	// Fetch assessments for a specific course instance
	const fetchAssessments = useCallback(async (courseInstanceId: string) => {
		try {
			const response = await fetch(
				`/api/assessments?where[assessmentTemplate.courseInstance][equals]=${courseInstanceId}`,
				{
					credentials: "include",
				},
			);
			if (!response.ok) throw new Error("Failed to fetch assessments");
			const data = await response.json();
			console.log("Assessments data:", data.docs);
			setAssessments(data.docs || []);
		} catch (err) {
			console.error("Error fetching assessments:", err);
			setError("Failed to load assessments");
		}
	}, []);

	// Fetch scores for a specific course instance
	const fetchScores = useCallback(async (courseInstanceId: string) => {
		try {
			const response = await fetch(
				`/api/scores?courseInstanceId=${courseInstanceId}`,
				{
					credentials: "include",
				},
			);
			if (!response.ok) throw new Error("Failed to fetch scores");
			const data = await response.json();
			console.log(`Fetched ${data.docs?.length || 0} scores:`, data.docs);
			console.log("Course instance ID used:", courseInstanceId);
			setScores(data.docs || []);
		} catch (err) {
			console.error("Error fetching scores:", err);
			setError("Failed to load scores");
		}
	}, []);

	// Fetch grade aggregates for a specific course instance
	const fetchGradeAggregates = useCallback(
		async (courseInstanceId: string) => {
			try {
				const response = await fetch(
					`/api/grade-aggregates?courseInstanceId=${courseInstanceId}`,
					{
						credentials: "include",
					},
				);
				if (!response.ok)
					throw new Error("Failed to fetch grade aggregates");
				const data = await response.json();
				setGradeAggregates(data.docs || []);
			} catch (err) {
				console.error("Error fetching grade aggregates:", err);
				setError("Failed to load grade aggregates");
			}
		},
		[],
	);

	// Handle course instance selection
	const handleCourseInstanceSelect = useCallback(
		async (courseInstance: CourseInstance) => {
			setSelectedCourseInstance(courseInstance);
			await Promise.all([
				fetchEnrollments(courseInstance.id),
				fetchAssessments(courseInstance.id),
				fetchScores(courseInstance.id),
				fetchGradeAggregates(courseInstance.id),
			]);
		},
		[fetchEnrollments, fetchAssessments, fetchScores, fetchGradeAggregates],
	);

	// Load initial data
	useEffect(() => {
		const loadData = async () => {
			setLoading(true);
			await fetchCourseInstances();
			setLoading(false);
		};
		loadData();
	}, [fetchCourseInstances]);

	// Refresh data when component becomes visible (e.g., when navigating back)
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (!document.hidden && selectedCourseInstance) {
				// Refresh data when page becomes visible
				handleCourseInstanceSelect(selectedCourseInstance);
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);
		return () => {
			document.removeEventListener(
				"visibilitychange",
				handleVisibilityChange,
			);
		};
	}, [selectedCourseInstance, handleCourseInstanceSelect]);

	// Helper to extract student ID from score
	const getScoreStudentId = (score: Score): string => {
		if (typeof score.student === "string") {
			return score.student;
		}
		if (typeof score.student === "number") {
			return String(score.student);
		}
		return String((score.student as any)?.id || "");
	};

	// Get scores for a specific student
	const getStudentScores = (studentId: string): Score[] => {
		const filtered = scores.filter(
			(score) => getScoreStudentId(score) === String(studentId),
		);
		console.log(
			`getStudentScores(${studentId}): found ${filtered.length} scores`,
			filtered,
		);
		return filtered;
	};

	// Get grade aggregate for a specific student
	const getStudentGradeAggregate = (
		studentId: string,
	): GradeAggregate | null => {
		const enrollment = enrollments.find(
			(enrollment) => enrollment.student.id === studentId,
		);
		if (!enrollment) return null;
		return (
			gradeAggregates.find(
				(grade) => grade.enrollment === enrollment.id,
			) || null
		);
	};

	// Calculate weighted score for a student based on completed assessments
	const calculateAverageScore = (studentId: string): number => {
		const studentScores = getStudentScores(studentId);
		if (studentScores.length === 0) {
			console.log(`Student ${studentId}: No scores found`);
			return 0;
		}

		// Get only scores for completed assessments
		const completedScores = studentScores.filter((score) => {
			const assessmentId = getScoreAssessmentId(score);
			const assessment = assessments.find(
				(a) => String(a.id) === String(assessmentId),
			);
			const isCompleted = assessment?.isCompleted === true;

			console.log(
				`  Score ${score.id}: assessment ${assessmentId}, found: ${!!assessment}, completed: ${isCompleted}`,
			);
			return isCompleted;
		});

		console.log(`Student ${studentId}:`, {
			totalScores: studentScores.length,
			completedScores: completedScores.length,
			assessments: assessments.map((a) => ({
				id: a.id,
				title: a.title,
				isCompleted: a.isCompleted,
			})),
		});

		if (completedScores.length === 0) {
			console.log(`Student ${studentId}: No completed assessments`);
			return 0;
		}

		// Calculate weighted score
		let totalWeightedScore = 0;
		let totalWeight = 0;

		completedScores.forEach((score) => {
			const assessmentId = getScoreAssessmentId(score);
			const assessment = assessments.find(
				(a) => String(a.id) === String(assessmentId),
			);

			if (assessment?.assessmentTemplate?.weightPercent) {
				const weight = assessment.assessmentTemplate.weightPercent;
				const maxScore =
					assessment.assessmentTemplate.maxScore ||
					score.maxValue ||
					100;
				const scoreValue = score.value || 0;

				// Calculate percentage from value and max score
				const scorePercentage =
					maxScore > 0 ? (scoreValue / maxScore) * 100 : 0;
				const contribution = (scorePercentage * weight) / 100;

				totalWeightedScore += contribution;
				totalWeight += weight;

				console.log(`  Score calculation:`, {
					assessment: assessment.title,
					scoreValue,
					maxScore,
					scorePercentage: Math.round(scorePercentage * 10) / 10,
					weight,
					contribution: Math.round(contribution * 10) / 10,
				});
			} else {
				console.log(
					`  Score ${score.id}: No assessment template or weight found`,
				);
			}
		});

		// Return weighted score as a percentage of total completed weight
		if (totalWeight === 0) {
			console.log(`Student ${studentId}: No valid weights found`);
			return 0;
		}

		const finalScore = Math.round((totalWeightedScore / totalWeight) * 100);
		console.log(
			`Student ${studentId} final: ${totalWeightedScore}/${totalWeight} = ${finalScore}%`,
		);
		return finalScore;
	};

	// Get grade distribution data
	const getGradeDistribution = () => {
		const distribution = {
			A: 0,
			B: 0,
			C: 0,
			D: 0,
			F: 0,
		};

		// Calculate current grades for all students
		enrollments.forEach((enrollment) => {
			const studentId =
				typeof enrollment.student === "string"
					? enrollment.student
					: enrollment.student.id;
			const avgScore = calculateAverageScore(studentId);

			// Convert numeric score to letter grade
			if (avgScore >= 80) distribution.A++;
			else if (avgScore >= 70) distribution.B++;
			else if (avgScore >= 60) distribution.C++;
			else if (avgScore >= 50) distribution.D++;
			else distribution.F++;
		});

		return Object.entries(distribution).map(([grade, count]) => ({
			grade,
			count,
			percentage:
				enrollments.length > 0
					? Math.round((count / enrollments.length) * 100)
					: 0,
		}));
	};

	// Helper to extract assessment ID from score
	const getScoreAssessmentId = (score: Score): string => {
		if (typeof score.assessment === "string") {
			return score.assessment;
		}
		if (typeof score.assessment === "number") {
			return String(score.assessment);
		}
		return (score.assessment as any)?.id || "";
	};

	// Get assessment performance data
	const getAssessmentPerformance = () => {
		return assessments.map((assessment) => {
			const assessmentScores = scores.filter(
				(score) => getScoreAssessmentId(score) === assessment.id,
			);
			const averageScore =
				assessmentScores.length > 0
					? Math.round(
							assessmentScores.reduce((sum, score) => {
								const maxScore =
									assessment.assessmentTemplate.maxScore ||
									score.maxValue ||
									100;
								const scorePercentage =
									maxScore > 0
										? (score.value / maxScore) * 100
										: 0;
								return sum + scorePercentage;
							}, 0) / assessmentScores.length,
						)
					: 0;

			return {
				assessment: assessment.assessmentTemplate.name,
				averageScore,
				totalStudents: assessmentScores.length,
			};
		});
	};

	// Get student progress over time
	// const getStudentProgressData = (studentId: string) => {
	// 	const studentScores = getStudentScores(studentId);
	// 	return studentScores
	// 		.sort((a, b) => new Date(a.gradedAt).getTime() - new Date(b.gradedAt).getTime())
	// 		.map((score, index) => ({
	// 			assessment: `Assessment ${index + 1}`,
	// 			score: score.percentage,
	// 			date: new Date(score.gradedAt).toLocaleDateString(),
	// 		}));
	// };

	const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"];

	if (loading) {
		return (
			<div className="min-h-screen bg-background pt-20">
				<div className="container mx-auto px-4 py-8">
					<div className="flex items-center justify-center">
						<Loader2 className="h-8 w-8 animate-spin text-foreground" />
						<span className="ml-2 text-foreground">
							Loading progress tracking...
						</span>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-background pt-20">
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
		<div className="min-h-screen bg-background pt-20">
			<div className="container mx-auto px-4 py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-foreground mb-2">
						Student Progress Tracking
					</h1>
					<p className="text-muted-foreground">
						Monitor student performance and progress across your
						courses
					</p>
				</div>

				{!selectedCourseInstance ? (
					<Card className="bg-card border-border">
						<CardHeader>
							<CardTitle className="text-card-foreground">
								Select a Course
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid gap-4">
								{courseInstances.map((courseInstance) => (
									<Card
										key={courseInstance.id}
										className="bg-card border-border cursor-pointer hover:bg-muted transition-colors"
										onClick={() =>
											handleCourseInstanceSelect(
												courseInstance,
											)
										}
									>
										<CardContent className="p-4">
											<div className="flex justify-between items-start">
												<div>
													<h3 className="text-lg font-semibold text-card-foreground">
														{
															courseInstance
																.courseVariation
																.course.code
														}{" "}
														-{" "}
														{
															courseInstance
																.courseVariation
																.course.title
														}
													</h3>
													<p className="text-muted-foreground text-sm">
														{
															courseInstance.instanceTitle
														}
													</p>
													<p className="text-gray-400 text-sm">
														{courseInstance.professors
															.map(
																(prof) =>
																	prof.name,
															)
															.join(", ")}
													</p>
												</div>
												<Button className="bg-blue-600 hover:bg-blue-700 text-card-foreground">
													View Progress
												</Button>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</CardContent>
					</Card>
				) : (
					<div className="space-y-6">
						{/* Course Header */}
						<Card className="bg-card border-border">
							<CardHeader>
								<div className="flex justify-between items-center">
									<div>
										<CardTitle className="text-card-foreground">
											{
												selectedCourseInstance
													.courseVariation.course.code
											}{" "}
											-{" "}
											{
												selectedCourseInstance
													.courseVariation.course
													.title
											}
										</CardTitle>
										<p className="text-muted-foreground">
											{
												selectedCourseInstance.instanceTitle
											}
										</p>
									</div>
									<div className="flex gap-2">
										<Button
											variant="outline"
											onClick={() =>
												handleCourseInstanceSelect(
													selectedCourseInstance,
												)
											}
											className="border-border text-muted-foreground hover:bg-card"
										>
											<RefreshCw className="h-4 w-4 mr-2" />
											Refresh Data
										</Button>
										<Button
											variant="outline"
											onClick={() =>
												setSelectedCourseInstance(null)
											}
											className="border-border text-muted-foreground hover:bg-card"
										>
											Back to Courses
										</Button>
									</div>
								</div>
							</CardHeader>
						</Card>

						{/* Overview Stats */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
							<Card className="bg-card border-border">
								<CardContent className="p-6">
									<div className="flex items-center">
										<Users className="h-8 w-8 text-blue-500" />
										<div className="ml-4">
											<p className="text-sm font-medium text-muted-foreground">
												Total Students
											</p>
											<p className="text-2xl font-bold text-card-foreground">
												{enrollments.length}
											</p>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card className="bg-card border-border">
								<CardContent className="p-6">
									<div className="flex items-center">
										<BookOpen className="h-8 w-8 text-green-500" />
										<div className="ml-4">
											<p className="text-sm font-medium text-muted-foreground">
												Completed Assessments
											</p>
											<p className="text-2xl font-bold text-card-foreground">
												{
													assessments.filter(
														(a) => a.isCompleted,
													).length
												}
											</p>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card className="bg-card border-border">
								<CardContent className="p-6">
									<div className="flex items-center">
										<TrendingUp className="h-8 w-8 text-yellow-500" />
										<div className="ml-4">
											<p className="text-sm font-medium text-muted-foreground">
												Avg Score
											</p>
											<p className="text-2xl font-bold text-card-foreground">
												{enrollments.length > 0
													? Math.round(
															enrollments.reduce(
																(
																	sum,
																	enrollment,
																) => {
																	const studentId =
																		typeof enrollment.student ===
																		"string"
																			? enrollment.student
																			: enrollment
																					.student
																					.id;
																	return (
																		sum +
																		calculateAverageScore(
																			studentId,
																		)
																	);
																},
																0,
															) /
																enrollments.length,
														)
													: 0}
												%
											</p>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card className="bg-card border-border">
								<CardContent className="p-6">
									<div className="flex items-center">
										<Award className="h-8 w-8 text-purple-500" />
										<div className="ml-4">
											<p className="text-sm font-medium text-muted-foreground">
												Pass Rate
											</p>
											<p className="text-2xl font-bold text-card-foreground">
												{enrollments.length > 0
													? Math.round(
															(enrollments.filter(
																(
																	enrollment,
																) => {
																	const studentId =
																		typeof enrollment.student ===
																		"string"
																			? enrollment.student
																			: enrollment
																					.student
																					.id;
																	const avgScore =
																		calculateAverageScore(
																			studentId,
																		);
																	// Pass threshold is typically 50%
																	return (
																		avgScore >=
																		50
																	);
																},
															).length /
																enrollments.length) *
																100,
														)
													: 0}
												%
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						<Tabs defaultValue="overview" className="space-y-6">
							<TabsList className="grid w-full grid-cols-3">
								<TabsTrigger value="overview">
									Overview
								</TabsTrigger>
								<TabsTrigger value="students">
									Student Details
								</TabsTrigger>
								<TabsTrigger value="assessments">
									Assessment Analysis
								</TabsTrigger>
							</TabsList>

							<TabsContent value="overview" className="space-y-6">
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
									{/* Grade Distribution */}
									<Card className="bg-card border-border">
										<CardHeader>
											<CardTitle className="text-card-foreground">
												Grade Distribution
											</CardTitle>
										</CardHeader>
										<CardContent>
											<ResponsiveContainer
												width="100%"
												height={300}
											>
												<PieChart>
													<Pie
														data={getGradeDistribution()}
														cx="50%"
														cy="50%"
														labelLine={false}
														label={({
															grade,
															percentage,
														}) =>
															`${grade}: ${percentage}%`
														}
														outerRadius={80}
														fill="#8884d8"
														dataKey="count"
													>
														{getGradeDistribution().map(
															(entry, index) => (
																<Cell
																	key={`cell-${entry.grade}`}
																	fill={
																		COLORS[
																			index %
																				COLORS.length
																		]
																	}
																/>
															),
														)}
													</Pie>
													<Tooltip />
												</PieChart>
											</ResponsiveContainer>
										</CardContent>
									</Card>

									{/* Assessment Performance */}
									<Card className="bg-card border-border">
										<CardHeader>
											<CardTitle className="text-card-foreground">
												Assessment Performance
											</CardTitle>
										</CardHeader>
										<CardContent>
											<ResponsiveContainer
												width="100%"
												height={300}
											>
												<BarChart
													data={getAssessmentPerformance()}
												>
													<CartesianGrid
														strokeDasharray="3 3"
														stroke="#374151"
													/>
													<XAxis
														dataKey="assessment"
														stroke="#9CA3AF"
													/>
													<YAxis stroke="#9CA3AF" />
													<Tooltip
														contentStyle={{
															backgroundColor:
																"#374151",
															border: "1px solid #6B7280",
															borderRadius: "6px",
															color: "#F9FAFB",
														}}
													/>
													<Bar
														dataKey="averageScore"
														fill="#3B82F6"
													/>
												</BarChart>
											</ResponsiveContainer>
										</CardContent>
									</Card>
								</div>
							</TabsContent>

							<TabsContent value="students" className="space-y-6">
								<Card className="bg-card border-border">
									<CardHeader>
										<CardTitle className="text-card-foreground">
											Student Performance
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											{enrollments.map((enrollment) => {
												// Extract student ID properly
												const studentId =
													typeof enrollment.student ===
													"string"
														? enrollment.student
														: enrollment.student.id;

												const studentScores =
													getStudentScores(studentId);
												const averageScore =
													calculateAverageScore(
														studentId,
													);
												const gradeAggregate =
													getStudentGradeAggregate(
														studentId,
													);

												// Get course info - try multiple ways to access the data
												console.log(
													"Enrollment data:",
													enrollment,
												);

												// Try different ways to access course information
												let courseInfo =
													enrollment.courseInstance
														?.courseVariation
														?.course;

												// If that doesn't work, try accessing it directly from courseInstance
												if (
													!courseInfo &&
													enrollment.courseInstance
												) {
													console.log(
														"Course instance:",
														enrollment.courseInstance,
													);
													// Check if courseInstance has course data directly
													if (
														(
															enrollment.courseInstance as any
														).course
													) {
														courseInfo = (
															enrollment.courseInstance as any
														).course;
													}
													// Or if it has courseVariation with course
													else if (
														enrollment
															.courseInstance
															.courseVariation
															?.course
													) {
														courseInfo =
															enrollment
																.courseInstance
																.courseVariation
																.course;
													}
												}

												console.log(
													"Course info:",
													courseInfo,
												);

												const courseName = courseInfo
													? `${courseInfo.code} - ${courseInfo.title}`
													: `Course Instance: ${enrollment.courseInstance?.instanceTitle || "Unknown"}`;

												return (
													<Card
														key={enrollment.id}
														className="bg-card border-border"
													>
														<CardContent className="p-4">
															<div className="flex justify-between items-start">
																<div>
																	<h4 className="font-semibold text-card-foreground">
																		{
																			enrollment
																				.student
																				.name
																		}
																	</h4>
																	<p className="text-muted-foreground text-sm">
																		{
																			enrollment
																				.student
																				.studentId
																		}{" "}
																		•{" "}
																		{
																			enrollment
																				.student
																				.email
																		}
																	</p>
																	<p className="text-muted-foreground text-sm font-medium">
																		📚{" "}
																		{
																			courseName
																		}
																	</p>
																	<p className="text-gray-400 text-sm">
																		{
																			studentScores.length
																		}{" "}
																		assessments
																		completed
																	</p>
																</div>
																<div className="text-right">
																	<p className="text-lg font-bold text-card-foreground">
																		{
																			averageScore
																		}
																		%
																	</p>
																	{gradeAggregate && (
																		<Badge
																			variant="secondary"
																			className={
																				gradeAggregate.passFail ===
																				"pass"
																					? "bg-green-600 text-card-foreground"
																					: "bg-red-600 text-card-foreground"
																			}
																		>
																			{
																				gradeAggregate.finalLetter
																			}{" "}
																			(
																			{
																				gradeAggregate.passFail
																			}
																			)
																		</Badge>
																	)}
																</div>
															</div>
														</CardContent>
													</Card>
												);
											})}
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent
								value="assessments"
								className="space-y-6"
							>
								<Card className="bg-card border-border">
									<CardHeader>
										<CardTitle className="text-card-foreground">
											Assessment Details
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											{assessments.map((assessment) => {
												const assessmentScores =
													scores.filter(
														(score) =>
															getScoreAssessmentId(
																score,
															) === assessment.id,
													);
												const averageScore =
													assessmentScores.length > 0
														? Math.round(
																assessmentScores.reduce(
																	(
																		sum,
																		score,
																	) => {
																		const maxScore =
																			assessment
																				.assessmentTemplate
																				.maxScore ||
																			score.maxValue ||
																			100;
																		const scorePercentage =
																			maxScore >
																			0
																				? (score.value /
																						maxScore) *
																					100
																				: 0;
																		return (
																			sum +
																			scorePercentage
																		);
																	},
																	0,
																) /
																	assessmentScores.length,
															)
														: 0;

												return (
													<Card
														key={assessment.id}
														className="bg-card border-border"
													>
														<CardContent className="p-4">
															<div className="flex justify-between items-start">
																<div>
																	<h4 className="font-semibold text-card-foreground">
																		{
																			assessment
																				.assessmentTemplate
																				.name
																		}
																	</h4>
																	<p className="text-muted-foreground text-sm">
																		{
																			assessment.title
																		}
																	</p>
																	<p className="text-gray-400 text-sm">
																		Weight:{" "}
																		{
																			assessment
																				.assessmentTemplate
																				.weightPercent
																		}
																		% • Max
																		Score:{" "}
																		{
																			assessment
																				.assessmentTemplate
																				.maxScore
																		}{" "}
																		• Type:{" "}
																		{
																			assessment
																				.assessmentTemplate
																				.assessmentType
																		}
																	</p>
																</div>
																<div className="text-right">
																	<p className="text-lg font-bold text-card-foreground">
																		{
																			averageScore
																		}
																		%
																	</p>
																	<p className="text-gray-400 text-sm">
																		{
																			assessmentScores.length
																		}{" "}
																		students
																	</p>
																	<div className="flex gap-2">
																		<Badge
																			variant="secondary"
																			className="bg-blue-600 text-card-foreground"
																		>
																			{
																				assessment.status
																			}
																		</Badge>
																		{assessment.isCompleted ? (
																			<Badge
																				variant="secondary"
																				className="bg-green-600 text-card-foreground"
																			>
																				completed
																			</Badge>
																		) : (
																			<Badge
																				variant="secondary"
																				className="bg-yellow-600 text-card-foreground"
																			>
																				not
																				completed
																			</Badge>
																		)}
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
							</TabsContent>
						</Tabs>
					</div>
				)}
			</div>
		</div>
	);
}
