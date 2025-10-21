"use client";

import { Icon } from "@iconify/react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useState } from "react";
import {
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	useGradeAggregates,
	useStudentEnrollments,
	useUser,
} from "@/hooks/use-queries";
import { useAppStore } from "@/stores/app-store";

const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"];

export default function StudentDashboard() {
	const { user: userStore } = useAppStore();
	const { data: _userData, isLoading: userLoading } = useUser();
	const { data: enrollments, isLoading: enrollmentsLoading } =
		useStudentEnrollments(userStore.user?.id || "");
	const { data: gradeAggregates, isLoading: gradesLoading } =
		useGradeAggregates();

	const [activeTab, setActiveTab] = useState("overview");

	if (userLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	if (!userStore.user || userStore.user.role !== "student") {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Card className="w-full max-w-md">
					<CardContent className="text-center p-8">
						<Icon
							icon="lucide:lock"
							className="text-4xl text-gray-400 mx-auto mb-4"
						/>
						<h2 className="text-xl font-bold text-gray-900 mb-2">
							Access Denied
						</h2>
						<p className="text-gray-600">
							You need to be logged in as a student to access this
							dashboard.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	const studentGrades = Array.isArray(gradeAggregates)
		? gradeAggregates.filter(
				(grade) =>
					Array.isArray(enrollments) &&
					enrollments.some(
						(enrollment) => enrollment.id === grade.enrollment,
					),
			)
		: [];

	const gpa =
		studentGrades.length > 0
			? studentGrades.reduce((sum, grade) => sum + grade.gpaPoints, 0) /
				studentGrades.length
			: 0;

	const creditsCompleted = studentGrades.reduce((sum, _grade) => sum + 3, 0); // Assuming 3 credits per course
	const creditsRequired = 120; // Typical bachelor's degree
	const progressPercentage = (creditsCompleted / creditsRequired) * 100;

	// Sample data for charts
	const gradeDistribution = [
		{
			grade: "A",
			count: studentGrades.filter((g) => g.finalLetter === "A").length,
		},
		{
			grade: "B",
			count: studentGrades.filter((g) => g.finalLetter === "B").length,
		},
		{
			grade: "C",
			count: studentGrades.filter((g) => g.finalLetter === "C").length,
		},
		{
			grade: "D",
			count: studentGrades.filter((g) => g.finalLetter === "D").length,
		},
		{
			grade: "F",
			count: studentGrades.filter((g) => g.finalLetter === "F").length,
		},
	];

	const semesterProgress = [
		{ semester: "Fall 2023", gpa: 3.2 },
		{ semester: "Spring 2024", gpa: 3.4 },
		{ semester: "Fall 2024", gpa: 3.6 },
		{ semester: "Spring 2025", gpa: gpa },
	];

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="bg-white shadow-sm border-b"
			>
				<div className="container mx-auto px-4 py-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">
								Welcome back, {userStore.user?.name}!
							</h1>
							<p className="text-gray-600 mt-1">
								Student ID: {userStore.user?.id} • Program:{" "}
								{userStore.user?.program}
							</p>
						</div>
						<div className="flex items-center space-x-4">
							<Badge
								variant="secondary"
								className="bg-green-100 text-green-800"
							>
								<Icon
									icon="lucide:check-circle"
									className="mr-1"
								/>
								Active Student
							</Badge>
							<Button variant="outline" size="sm">
								<Icon icon="lucide:settings" className="mr-2" />
								Settings
							</Button>
						</div>
					</div>
				</div>
			</motion.div>

			{/* Main Content */}
			<div className="container mx-auto px-4 py-8">
				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className="space-y-6"
				>
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="courses">Courses</TabsTrigger>
						<TabsTrigger value="grades">Grades</TabsTrigger>
						<TabsTrigger value="progress">Progress</TabsTrigger>
					</TabsList>

					{/* Overview Tab */}
					<TabsContent value="overview" className="space-y-6">
						{/* Key Metrics */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.1, duration: 0.6 }}
							>
								<Card>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium text-gray-600">
											Current GPA
										</CardTitle>
										<Icon
											icon="lucide:trending-up"
											className="h-4 w-4 text-green-600"
										/>
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold text-gray-900">
											{gpa.toFixed(2)}
										</div>
										<p className="text-xs text-gray-500">
											+0.2 from last semester
										</p>
									</CardContent>
								</Card>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2, duration: 0.6 }}
							>
								<Card>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium text-gray-600">
											Credits Completed
										</CardTitle>
										<Icon
											icon="lucide:book-open"
											className="h-4 w-4 text-blue-600"
										/>
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold text-gray-900">
											{creditsCompleted}
										</div>
										<p className="text-xs text-gray-500">
											of {creditsRequired} required
										</p>
									</CardContent>
								</Card>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3, duration: 0.6 }}
							>
								<Card>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium text-gray-600">
											Active Courses
										</CardTitle>
										<Icon
											icon="lucide:calendar"
											className="h-4 w-4 text-purple-600"
										/>
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold text-gray-900">
											{enrollments?.filter(
												(e) => e.status === "active",
											).length || 0}
										</div>
										<p className="text-xs text-gray-500">
											This semester
										</p>
									</CardContent>
								</Card>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4, duration: 0.6 }}
							>
								<Card>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium text-gray-600">
											Graduation Progress
										</CardTitle>
										<Icon
											icon="lucide:graduation-cap"
											className="h-4 w-4 text-orange-600"
										/>
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold text-gray-900">
											{progressPercentage.toFixed(0)}%
										</div>
										<Progress
											value={progressPercentage}
											className="mt-2"
										/>
									</CardContent>
								</Card>
							</motion.div>
						</div>

						{/* Charts */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.5, duration: 0.6 }}
							>
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center">
											<Icon
												icon="lucide:trending-up"
												className="mr-2 text-blue-600"
											/>
											GPA Trend
										</CardTitle>
									</CardHeader>
									<CardContent>
										<ResponsiveContainer
											width="100%"
											height={300}
										>
											<LineChart data={semesterProgress}>
												<CartesianGrid strokeDasharray="3 3" />
												<XAxis dataKey="semester" />
												<YAxis domain={[0, 4]} />
												<Tooltip />
												<Line
													type="monotone"
													dataKey="gpa"
													stroke="#3B82F6"
													strokeWidth={2}
												/>
											</LineChart>
										</ResponsiveContainer>
									</CardContent>
								</Card>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.6, duration: 0.6 }}
							>
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center">
											<Icon
												icon="lucide:pie-chart"
												className="mr-2 text-purple-600"
											/>
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
													data={gradeDistribution}
													cx="50%"
													cy="50%"
													labelLine={false}
													label={({ grade, count }) =>
														`${grade}: ${count}`
													}
													outerRadius={80}
													fill="#8884d8"
													dataKey="count"
												>
													{gradeDistribution.map(
														(entry, index) => (
															<Cell
																key={
																	entry.grade
																}
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
							</motion.div>
						</div>
					</TabsContent>

					{/* Courses Tab */}
					<TabsContent value="courses" className="space-y-6">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
						>
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center">
										<Icon
											icon="lucide:book-open"
											className="mr-2 text-blue-600"
										/>
										My Courses
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{enrollmentsLoading ? (
											<div className="text-center py-8">
												<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
												<p className="text-gray-600 mt-2">
													Loading courses...
												</p>
											</div>
										) : enrollments?.length === 0 ? (
											<div className="text-center py-8">
												<Icon
													icon="lucide:book-open"
													className="text-4xl text-gray-400 mx-auto mb-4"
												/>
												<p className="text-gray-600">
													No courses enrolled yet.
												</p>
											</div>
										) : (
											enrollments?.map(
												(enrollment, index) => (
													<motion.div
														key={enrollment.id}
														initial={{
															opacity: 0,
															y: 20,
														}}
														animate={{
															opacity: 1,
															y: 0,
														}}
														transition={{
															delay: index * 0.1,
															duration: 0.6,
														}}
														className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
													>
														<div className="flex-1">
															<h3 className="font-semibold text-gray-900">
																{
																	enrollment.enrollmentTitle
																}
															</h3>
															<p className="text-sm text-gray-600">
																Enrolled:{" "}
																{format(
																	new Date(
																		enrollment.enrolledAt,
																	),
																	"MMM dd, yyyy",
																)}
															</p>
														</div>
														<div className="flex items-center space-x-4">
															<Badge
																variant={
																	enrollment.status ===
																	"active"
																		? "default"
																		: "secondary"
																}
																className={
																	enrollment.status ===
																	"active"
																		? "bg-green-100 text-green-800"
																		: ""
																}
															>
																{
																	enrollment.status
																}
															</Badge>
															<Button
																variant="outline"
																size="sm"
															>
																<Icon
																	icon="lucide:eye"
																	className="mr-1"
																/>
																View
															</Button>
														</div>
													</motion.div>
												),
											)
										)}
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</TabsContent>

					{/* Grades Tab */}
					<TabsContent value="grades" className="space-y-6">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
						>
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center">
										<Icon
											icon="lucide:graduation-cap"
											className="mr-2 text-green-600"
										/>
										My Grades
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{gradesLoading ? (
											<div className="text-center py-8">
												<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
												<p className="text-gray-600 mt-2">
													Loading grades...
												</p>
											</div>
										) : studentGrades.length === 0 ? (
											<div className="text-center py-8">
												<Icon
													icon="lucide:graduation-cap"
													className="text-4xl text-gray-400 mx-auto mb-4"
												/>
												<p className="text-gray-600">
													No grades available yet.
												</p>
											</div>
										) : (
											studentGrades.map(
												(grade, index) => (
													<motion.div
														key={grade.id}
														initial={{
															opacity: 0,
															y: 20,
														}}
														animate={{
															opacity: 1,
															y: 0,
														}}
														transition={{
															delay: index * 0.1,
															duration: 0.6,
														}}
														className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
													>
														<div className="flex-1">
															<h3 className="font-semibold text-gray-900">
																{
																	grade.gradeTitle
																}
															</h3>
															<p className="text-sm text-gray-600">
																Calculated:{" "}
																{format(
																	new Date(
																		grade.calculatedAt,
																	),
																	"MMM dd, yyyy",
																)}
															</p>
														</div>
														<div className="flex items-center space-x-4">
															<div className="text-right">
																<div className="text-2xl font-bold text-gray-900">
																	{
																		grade.finalLetter
																	}
																</div>
																<div className="text-sm text-gray-600">
																	{
																		grade.finalNumeric
																	}
																	%
																</div>
															</div>
															<Badge
																variant={
																	grade.passFail ===
																	"pass"
																		? "default"
																		: "destructive"
																}
																className={
																	grade.passFail ===
																	"pass"
																		? "bg-green-100 text-green-800"
																		: "bg-red-100 text-red-800"
																}
															>
																{grade.passFail}
															</Badge>
														</div>
													</motion.div>
												),
											)
										)}
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</TabsContent>

					{/* Progress Tab */}
					<TabsContent value="progress" className="space-y-6">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
						>
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center">
										<Icon
											icon="lucide:target"
											className="mr-2 text-orange-600"
										/>
										Academic Progress
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="space-y-4">
										<div>
											<div className="flex items-center justify-between mb-2">
												<span className="text-sm font-medium text-gray-700">
													Degree Completion
												</span>
												<span className="text-sm text-gray-600">
													{creditsCompleted} /{" "}
													{creditsRequired} credits
												</span>
											</div>
											<Progress
												value={progressPercentage}
												className="h-3"
											/>
											<p className="text-xs text-gray-500 mt-1">
												{progressPercentage.toFixed(1)}%
												complete
											</p>
										</div>

										<div>
											<div className="flex items-center justify-between mb-2">
												<span className="text-sm font-medium text-gray-700">
													GPA Progress
												</span>
												<span className="text-sm text-gray-600">
													{gpa.toFixed(2)} / 4.0
												</span>
											</div>
											<Progress
												value={(gpa / 4) * 100}
												className="h-3"
											/>
											<p className="text-xs text-gray-500 mt-1">
												Target: 3.5+ GPA
											</p>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="p-4 bg-blue-50 rounded-lg">
											<div className="flex items-center">
												<Icon
													icon="lucide:check-circle"
													className="text-blue-600 mr-2"
												/>
												<span className="font-medium text-blue-900">
													Completed Courses
												</span>
											</div>
											<div className="text-2xl font-bold text-blue-600 mt-2">
												{studentGrades.length}
											</div>
										</div>

										<div className="p-4 bg-green-50 rounded-lg">
											<div className="flex items-center">
												<Icon
													icon="lucide:calendar"
													className="text-green-600 mr-2"
												/>
												<span className="font-medium text-green-900">
													Expected Graduation
												</span>
											</div>
											<div className="text-lg font-bold text-green-600 mt-2">
												May 2025
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
