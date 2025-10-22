"use client";

import {
	AlertCircle,
	Award,
	BookOpen,
	Loader2,
	TrendingUp,
	Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Line,
	LineChart,
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
			name: string;
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
			const response = await fetch("/api/course-instances");
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
				`/api/enrollments?courseInstanceId=${courseInstanceId}`,
			);
			if (!response.ok) throw new Error("Failed to fetch enrollments");
			const data = await response.json();
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
				`/api/assessments?courseInstanceId=${courseInstanceId}`,
			);
			if (!response.ok) throw new Error("Failed to fetch assessments");
			const data = await response.json();
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
			);
			if (!response.ok) throw new Error("Failed to fetch scores");
			const data = await response.json();
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

	// Load initial data
	useEffect(() => {
		const loadData = async () => {
			setLoading(true);
			await fetchCourseInstances();
			setLoading(false);
		};
		loadData();
	}, [fetchCourseInstances]);

	// Handle course instance selection
	const handleCourseInstanceSelect = async (
		courseInstance: CourseInstance,
	) => {
		setSelectedCourseInstance(courseInstance);
		await Promise.all([
			fetchEnrollments(courseInstance.id),
			fetchAssessments(courseInstance.id),
			fetchScores(courseInstance.id),
			fetchGradeAggregates(courseInstance.id),
		]);
	};

	// Get scores for a specific student
	const getStudentScores = (studentId: string): Score[] => {
		return scores.filter((score) => score.student === studentId);
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

	// Calculate average score for a student
	const calculateAverageScore = (studentId: string): number => {
		const studentScores = getStudentScores(studentId);
		if (studentScores.length === 0) return 0;
		const totalScore = studentScores.reduce(
			(sum, score) => sum + score.percentage,
			0,
		);
		return Math.round(totalScore / studentScores.length);
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

		gradeAggregates.forEach((grade) => {
			const letter = grade.finalLetter.charAt(0);
			if (letter === "A") distribution.A++;
			else if (letter === "B") distribution.B++;
			else if (letter === "C") distribution.C++;
			else if (letter === "D") distribution.D++;
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

	// Get assessment performance data
	const getAssessmentPerformance = () => {
		return assessments.map((assessment) => {
			const assessmentScores = scores.filter(
				(score) => score.assessment === assessment.id,
			);
			const averageScore =
				assessmentScores.length > 0
					? Math.round(
							assessmentScores.reduce(
								(sum, score) => sum + score.percentage,
								0,
							) / assessmentScores.length,
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
			<div className="min-h-screen bg-gray-900 pt-20">
				<div className="container mx-auto px-4 py-8">
					<div className="flex items-center justify-center">
						<Loader2 className="h-8 w-8 animate-spin text-white" />
						<span className="ml-2 text-white">
							Loading progress tracking...
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
						Student Progress Tracking
					</h1>
					<p className="text-gray-300">
						Monitor student performance and progress across your
						courses
					</p>
				</div>

				{!selectedCourseInstance ? (
					<Card className="bg-gray-800 border-gray-700">
						<CardHeader>
							<CardTitle className="text-white">
								Select a Course
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid gap-4">
								{courseInstances.map((courseInstance) => (
									<Card
										key={courseInstance.id}
										className="bg-gray-700 border-gray-600 cursor-pointer hover:bg-gray-600 transition-colors"
										onClick={() =>
											handleCourseInstanceSelect(
												courseInstance,
											)
										}
									>
										<CardContent className="p-4">
											<div className="flex justify-between items-start">
												<div>
													<h3 className="text-lg font-semibold text-white">
														{
															courseInstance
																.courseVariation
																.course.code
														}{" "}
														-{" "}
														{
															courseInstance
																.courseVariation
																.course.name
														}
													</h3>
													<p className="text-gray-300 text-sm">
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
												<Button className="bg-blue-600 hover:bg-blue-700 text-white">
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
						<Card className="bg-gray-800 border-gray-700">
							<CardHeader>
								<div className="flex justify-between items-center">
									<div>
										<CardTitle className="text-white">
											{
												selectedCourseInstance
													.courseVariation.course.code
											}{" "}
											-{" "}
											{
												selectedCourseInstance
													.courseVariation.course.name
											}
										</CardTitle>
										<p className="text-gray-300">
											{
												selectedCourseInstance.instanceTitle
											}
										</p>
									</div>
									<Button
										variant="outline"
										onClick={() =>
											setSelectedCourseInstance(null)
										}
										className="border-gray-600 text-gray-300 hover:bg-gray-700"
									>
										Back to Courses
									</Button>
								</div>
							</CardHeader>
						</Card>

						{/* Overview Stats */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
							<Card className="bg-gray-800 border-gray-700">
								<CardContent className="p-6">
									<div className="flex items-center">
										<Users className="h-8 w-8 text-blue-500" />
										<div className="ml-4">
											<p className="text-sm font-medium text-gray-300">
												Total Students
											</p>
											<p className="text-2xl font-bold text-white">
												{enrollments.length}
											</p>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card className="bg-gray-800 border-gray-700">
								<CardContent className="p-6">
									<div className="flex items-center">
										<BookOpen className="h-8 w-8 text-green-500" />
										<div className="ml-4">
											<p className="text-sm font-medium text-gray-300">
												Assessments
											</p>
											<p className="text-2xl font-bold text-white">
												{assessments.length}
											</p>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card className="bg-gray-800 border-gray-700">
								<CardContent className="p-6">
									<div className="flex items-center">
										<TrendingUp className="h-8 w-8 text-yellow-500" />
										<div className="ml-4">
											<p className="text-sm font-medium text-gray-300">
												Avg Score
											</p>
											<p className="text-2xl font-bold text-white">
												{enrollments.length > 0
													? Math.round(
															enrollments.reduce(
																(
																	sum,
																	enrollment,
																) =>
																	sum +
																	calculateAverageScore(
																		enrollment
																			.student
																			.id,
																	),
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

							<Card className="bg-gray-800 border-gray-700">
								<CardContent className="p-6">
									<div className="flex items-center">
										<Award className="h-8 w-8 text-purple-500" />
										<div className="ml-4">
											<p className="text-sm font-medium text-gray-300">
												Pass Rate
											</p>
											<p className="text-2xl font-bold text-white">
												{gradeAggregates.length > 0
													? Math.round(
															(gradeAggregates.filter(
																(grade) =>
																	grade.passFail ===
																	"pass",
															).length /
																gradeAggregates.length) *
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
									<Card className="bg-gray-800 border-gray-700">
										<CardHeader>
											<CardTitle className="text-white">
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
									<Card className="bg-gray-800 border-gray-700">
										<CardHeader>
											<CardTitle className="text-white">
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
								<Card className="bg-gray-800 border-gray-700">
									<CardHeader>
										<CardTitle className="text-white">
											Student Performance
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											{enrollments.map((enrollment) => {
												const studentScores =
													getStudentScores(
														enrollment.student.id,
													);
												const averageScore =
													calculateAverageScore(
														enrollment.student.id,
													);
												const gradeAggregate =
													getStudentGradeAggregate(
														enrollment.student.id,
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
															<div className="flex justify-between items-start">
																<div>
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
																		}{" "}
																		•{" "}
																		{
																			enrollment
																				.student
																				.email
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
																	<p className="text-lg font-bold text-white">
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
																					? "bg-green-600 text-white"
																					: "bg-red-600 text-white"
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
								<Card className="bg-gray-800 border-gray-700">
									<CardHeader>
										<CardTitle className="text-white">
											Assessment Details
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											{assessments.map((assessment) => {
												const assessmentScores =
													scores.filter(
														(score) =>
															score.assessment ===
															assessment.id,
													);
												const averageScore =
													assessmentScores.length > 0
														? Math.round(
																assessmentScores.reduce(
																	(
																		sum,
																		score,
																	) =>
																		sum +
																		score.percentage,
																	0,
																) /
																	assessmentScores.length,
															)
														: 0;

												return (
													<Card
														key={assessment.id}
														className="bg-gray-700 border-gray-600"
													>
														<CardContent className="p-4">
															<div className="flex justify-between items-start">
																<div>
																	<h4 className="font-semibold text-white">
																		{
																			assessment
																				.assessmentTemplate
																				.name
																		}
																	</h4>
																	<p className="text-gray-300 text-sm">
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
																	<p className="text-lg font-bold text-white">
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
																	<Badge
																		variant="secondary"
																		className="bg-blue-600 text-white"
																	>
																		{
																			assessment.status
																		}
																	</Badge>
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
