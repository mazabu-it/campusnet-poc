"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CourseInstance {
	id: string;
	title: string;
	code: string;
	academicYear: string;
	professors: string[];
	assistants: string[];
	status: string;
	currentEnrollment: number;
	maxEnrollment?: number;
}

interface Assessment {
	id: string;
	title: string;
	date: string;
	status: string;
	submissionWindow: {
		opensAt: string;
		closesAt: string;
	};
	gradingWindow: {
		opensAt: string;
		closesAt: string;
	};
}

interface StudentScore {
	id: string;
	student: {
		id: string;
		name: string;
		studentId: string;
	};
	value?: number;
	maxValue: number;
	feedback?: string;
	gradedAt?: string;
}

export function ProfessorDashboard() {
	const [courseInstances, setCourseInstances] = useState<CourseInstance[]>(
		[],
	);
	const [assessments, setAssessments] = useState<Assessment[]>([]);
	const [_selectedCourse, setSelectedCourse] = useState<string>("");
	const [selectedAssessment, setSelectedAssessment] = useState<string>("");
	const [studentScores, setStudentScores] = useState<StudentScore[]>([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<
		"courses" | "assessments" | "grading"
	>("courses");

	const fetchProfessorData = useCallback(async () => {
		try {
			// Fetch course instances where user is professor
			const coursesResponse = await fetch(
				"/api/course-instances?professor=true",
			);
			const coursesData = await coursesResponse.json();
			setCourseInstances(coursesData.docs || []);
		} catch (error) {
			console.error("Error fetching professor data:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchProfessorData();
	}, [fetchProfessorData]);

	const fetchAssessments = async (courseInstanceId: string) => {
		try {
			const response = await fetch(
				`/api/assessments?courseInstance=${courseInstanceId}`,
			);
			const data = await response.json();
			setAssessments(data.docs || []);
		} catch (error) {
			console.error("Error fetching assessments:", error);
		}
	};

	const fetchStudentScores = async (assessmentId: string) => {
		try {
			const response = await fetch(
				`/api/scores?assessment=${assessmentId}`,
			);
			const data = await response.json();
			setStudentScores(data.docs || []);
		} catch (error) {
			console.error("Error fetching student scores:", error);
		}
	};

	const handleCourseSelect = (courseId: string) => {
		setSelectedCourse(courseId);
		fetchAssessments(courseId);
		setActiveTab("assessments");
	};

	const handleAssessmentSelect = (assessmentId: string) => {
		setSelectedAssessment(assessmentId);
		fetchStudentScores(assessmentId);
		setActiveTab("grading");
	};

	const _handleScoreSubmit = async (
		scoreId: string,
		value: number,
		feedback: string,
	) => {
		try {
			const response = await fetch("/api/submit-score", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					scoreId,
					value,
					feedback,
				}),
			});

			if (response.ok) {
				// Refresh scores
				fetchStudentScores(selectedAssessment);
			}
		} catch (error) {
			console.error("Error submitting score:", error);
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "active":
				return "bg-green-100 text-green-800";
			case "open":
				return "bg-blue-100 text-blue-800";
			case "locked":
				return "bg-yellow-100 text-yellow-800";
			case "published":
				return "bg-purple-100 text-purple-800";
			case "planning":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900">
					Professor Dashboard
				</h1>
				<p className="text-gray-600 mt-2">
					Manage your courses, assessments, and grades
				</p>
			</div>

			{/* Tab Navigation */}
			<div className="mb-6">
				<div className="border-b border-gray-200">
					<nav className="-mb-px flex space-x-8">
						<button
							type="button"
							onClick={() => setActiveTab("courses")}
							className={`py-2 px-1 border-b-2 font-medium text-sm ${
								activeTab === "courses"
									? "border-blue-500 text-blue-600"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
							}`}
						>
							My Courses
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("assessments")}
							className={`py-2 px-1 border-b-2 font-medium text-sm ${
								activeTab === "assessments"
									? "border-blue-500 text-blue-600"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
							}`}
						>
							Assessments
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("grading")}
							className={`py-2 px-1 border-b-2 font-medium text-sm ${
								activeTab === "grading"
									? "border-blue-500 text-blue-600"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
							}`}
						>
							Grading
						</button>
					</nav>
				</div>
			</div>

			{/* Courses Tab */}
			{activeTab === "courses" && (
				<div className="space-y-6">
					<h2 className="text-2xl font-semibold text-gray-900">
						My Courses
					</h2>
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{courseInstances.map((course) => (
							<Card
								key={course.id}
								className="hover:shadow-lg transition-shadow"
							>
								<CardHeader>
									<CardTitle className="text-lg">
										{course.title}
									</CardTitle>
									<div className="flex items-center justify-between">
										<span className="text-sm text-gray-600">
											{course.code}
										</span>
										<Badge
											className={getStatusColor(
												course.status,
											)}
										>
											{course.status}
										</Badge>
									</div>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										<div className="flex justify-between text-sm">
											<span className="text-gray-600">
												Academic Year:
											</span>
											<span className="font-medium">
												{course.academicYear}
											</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-gray-600">
												Enrollment:
											</span>
											<span className="font-medium">
												{course.currentEnrollment}
												{course.maxEnrollment &&
													`/${course.maxEnrollment}`}
											</span>
										</div>
									</div>
									<div className="mt-4">
										<Button
											variant="outline"
											size="sm"
											className="w-full"
											onClick={() =>
												handleCourseSelect(course.id)
											}
										>
											Manage Course
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			)}

			{/* Assessments Tab */}
			{activeTab === "assessments" && (
				<div className="space-y-6">
					<div className="flex justify-between items-center">
						<h2 className="text-2xl font-semibold text-gray-900">
							Assessments
						</h2>
						<Button
							onClick={() => {
								/* Create new assessment */
							}}
						>
							Create Assessment
						</Button>
					</div>

					<div className="space-y-4">
						{assessments.map((assessment) => (
							<Card
								key={assessment.id}
								className="hover:shadow-lg transition-shadow"
							>
								<CardHeader>
									<div className="flex items-center justify-between">
										<div>
											<CardTitle className="text-lg">
												{assessment.title}
											</CardTitle>
											<p className="text-sm text-gray-600">
												{assessment.date}
											</p>
										</div>
										<div className="flex items-center space-x-2">
											<Badge
												className={getStatusColor(
													assessment.status,
												)}
											>
												{assessment.status}
											</Badge>
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													handleAssessmentSelect(
														assessment.id,
													)
												}
											>
												Grade
											</Button>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-2 gap-4 text-sm">
										<div>
											<span className="text-gray-600">
												Submission Window:
											</span>
											<p className="font-medium">
												{new Date(
													assessment.submissionWindow
														.opensAt,
												).toLocaleDateString()}{" "}
												-
												{new Date(
													assessment.submissionWindow
														.closesAt,
												).toLocaleDateString()}
											</p>
										</div>
										<div>
											<span className="text-gray-600">
												Grading Window:
											</span>
											<p className="font-medium">
												{new Date(
													assessment.gradingWindow
														.opensAt,
												).toLocaleDateString()}{" "}
												-
												{new Date(
													assessment.gradingWindow
														.closesAt,
												).toLocaleDateString()}
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			)}

			{/* Grading Tab */}
			{activeTab === "grading" && (
				<div className="space-y-6">
					<h2 className="text-2xl font-semibold text-gray-900">
						Grading
					</h2>
					<div className="space-y-4">
						{studentScores.map((score) => (
							<Card
								key={score.id}
								className="hover:shadow-lg transition-shadow"
							>
								<CardHeader>
									<CardTitle className="text-lg">
										{score.student.name}
									</CardTitle>
									<p className="text-sm text-gray-600">
										Student ID: {score.student.studentId}
									</p>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="grid grid-cols-2 gap-4">
											<div>
												<Label
													htmlFor={`score-${score.id}`}
												>
													Score
												</Label>
												<Input
													id={`score-${score.id}`}
													type="number"
													min="0"
													max={score.maxValue}
													defaultValue={
														score.value || ""
													}
													onChange={(_e) => {
														// Handle score change
													}}
												/>
												<p className="text-sm text-gray-600">
													Max: {score.maxValue}
												</p>
											</div>
											<div>
												<Label
													htmlFor={`feedback-${score.id}`}
												>
													Feedback
												</Label>
												<Textarea
													id={`feedback-${score.id}`}
													defaultValue={
														score.feedback || ""
													}
													rows={3}
												/>
											</div>
										</div>
										<div className="flex justify-end space-x-2">
											<Button variant="outline" size="sm">
												Save Draft
											</Button>
											<Button size="sm">
												Submit Grade
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
