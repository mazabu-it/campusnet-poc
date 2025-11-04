"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	useGradeAggregates,
	useStudentEnrollments,
	useUser,
} from "@/hooks/use-queries";
import { useAppStore } from "@/stores/app-store";

export default function StudentDashboard() {
	const { user: userStore } = useAppStore();
	const { data: _userData, isLoading: userLoading } = useUser();
	const { data: enrollments, isLoading: enrollmentsLoading } =
		useStudentEnrollments(userStore.user?.id || "");
	const { data: gradeAggregates, isLoading: gradesLoading } =
		useGradeAggregates();

	if (userLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Icon icon="lucide:loader-2" className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	if (!userStore.user) {
		return (
			<div className="flex items-center justify-center min-h-screen px-4">
				<Card className="w-full max-w-md">
					<CardContent className="pt-6 text-center">
						<Icon
							icon="lucide:lock"
							className="h-12 w-12 mx-auto mb-4 text-muted-foreground"
						/>
						<h2 className="text-xl font-semibold mb-2">
							Accès refusé
						</h2>
						<p className="text-sm text-muted-foreground mb-4">
							Vous devez être connecté pour accéder à ce tableau de bord.
						</p>
						<Button asChild>
							<Link href="/login">Aller à la connexion</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Redirect professors to their dashboard
	if (
		userStore.user.role === "professor" ||
		userStore.user.role === "faculty-staff"
	) {
		window.location.href = "/professor";
		return null;
	}

	// Only allow students to access this dashboard
	if (userStore.user.role !== "student") {
		return (
			<div className="flex items-center justify-center min-h-screen px-4">
				<Card className="w-full max-w-md">
					<CardContent className="pt-6 text-center">
						<Icon
							icon="lucide:lock"
							className="h-12 w-12 mx-auto mb-4 text-muted-foreground"
						/>
						<h2 className="text-xl font-semibold mb-2">
							Accès refusé
						</h2>
						<p className="text-sm text-muted-foreground">
							Vous n'avez pas la permission d'accéder à ce tableau de bord.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	const loading = enrollmentsLoading || gradesLoading;

	// Type assertion for the data
	const enrollmentsList = (enrollments || []) as Array<{
		id: string;
		courseInstance: unknown;
		student: unknown;
		[key: string]: unknown;
	}>;
	const gradesList = (gradeAggregates || []) as Array<{
		id: string;
		weightedAverage?: number;
		passFail?: string;
		enrollment: unknown;
		letterGrade?: string;
		[key: string]: unknown;
	}>;

	// Calculate statistics
	const totalCourses = enrollmentsList.length;
	const averageGrade =
		gradesList.reduce(
			(acc, grade) => acc + (grade.weightedAverage || 0),
			0,
		) / (gradesList.length || 1);
	const passedCourses = gradesList.filter(
		(grade) => grade.passFail === "pass",
	).length;

	return (
		<div className="min-h-screen bg-background">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-semibold tracking-tight mb-2">
						Bon retour,{" "}
						{(userStore.user as { firstName?: string }).firstName ||
							"Étudiant"}
					</h1>
					<p className="text-muted-foreground">
						Voici un aperçu de votre progression académique
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid gap-4 md:grid-cols-3 mb-8">
					<Card className="bg-card">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium text-card-foreground">
								Total de cours
							</CardTitle>
							<Icon
								icon="lucide:book-open"
								className="h-4 w-4 text-muted-foreground"
							/>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-card-foreground">
								{totalCourses}
							</div>
							<p className="text-xs text-muted-foreground mt-1">
								Inscriptions actives
							</p>
						</CardContent>
					</Card>

					<Card className="bg-card">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium text-card-foreground">
								Note moyenne
							</CardTitle>
							<Icon
								icon="lucide:trending-up"
								className="h-4 w-4 text-muted-foreground"
							/>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-card-foreground">
								{averageGrade.toFixed(1)}%
							</div>
							<p className="text-xs text-muted-foreground mt-1">
								Tous cours confondus
							</p>
						</CardContent>
					</Card>

					<Card className="bg-card">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium text-card-foreground">
								Cours réussis
							</CardTitle>
							<Icon
								icon="lucide:check-circle"
								className="h-4 w-4 text-muted-foreground"
							/>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-card-foreground">
								{passedCourses}/{totalCourses}
							</div>
							<p className="text-xs text-muted-foreground mt-1">
								Taux de réussite :{" "}
								{totalCourses > 0
									? (
											(passedCourses / totalCourses) *
											100
										).toFixed(0)
									: 0}
								%
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Enrolled Courses */}
				<Card className="mb-8 bg-card">
					<CardHeader>
						<CardTitle className="text-card-foreground">
							Cours inscrits
						</CardTitle>
					</CardHeader>
					<CardContent>
						{loading ? (
							<div className="flex items-center justify-center py-8">
								<Icon
									icon="lucide:loader-2"
									className="h-6 w-6 animate-spin"
								/>
							</div>
						) : enrollmentsList && enrollmentsList.length > 0 ? (
							<div className="space-y-4">
								{enrollmentsList.map((enrollment) => {
									const courseInstance =
										typeof enrollment.courseInstance ===
										"object"
											? (enrollment.courseInstance as {
													courseVariation?: unknown;
													semester?: string;
													[key: string]: unknown;
												})
											: null;
									const courseVariation =
										courseInstance &&
										typeof courseInstance.courseVariation ===
											"object"
											? (courseInstance.courseVariation as {
													course?: unknown;
													[key: string]: unknown;
												})
											: null;
									const course =
										courseVariation &&
										typeof courseVariation.course ===
											"object"
											? (courseVariation.course as {
													code?: string;
													title?: string;
													credits?: number;
													[key: string]: unknown;
												})
											: null;

									if (!course) return null;

									const gradeAggregate = gradesList.find(
										(grade) =>
											typeof grade.enrollment ===
												"object" &&
											(grade.enrollment as { id: string })
												.id === enrollment.id,
									);

									return (
										<div
											key={enrollment.id}
											className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors bg-card"
										>
											<div className="space-y-1">
												<div className="flex items-center gap-2">
													<h3 className="font-medium text-card-foreground">
														{course.code || "N/A"} -{" "}
														{course.title || "N/A"}
													</h3>
													{gradeAggregate && (
														<Badge
															variant={
																gradeAggregate.passFail ===
																"pass"
																	? "default"
																	: "destructive"
															}
														>
															{
																gradeAggregate.passFail
															}
														</Badge>
													)}
												</div>
												<div className="flex items-center gap-4 text-sm text-muted-foreground">
													<span className="flex items-center gap-1">
														<Icon
															icon="lucide:calendar"
															className="h-3 w-3"
														/>
														{courseInstance?.semester ||
															"N/A"}
													</span>
													<span className="flex items-center gap-1">
														<Icon
															icon="lucide:users"
															className="h-3 w-3"
														/>
														{course.credits || 0}{" "}
														crédits
													</span>
												</div>
											</div>
											<div className="text-right space-y-1">
												{gradeAggregate?.weightedAverage !==
												undefined ? (
													<>
														<div className="text-2xl font-bold text-card-foreground">
															{gradeAggregate.weightedAverage.toFixed(
																1,
															)}
															%
														</div>
														<div className="text-xs text-muted-foreground">
															{gradeAggregate.letterGrade ||
																"N/A"}
														</div>
													</>
												) : (
													<div className="text-sm text-muted-foreground">
														Pas encore de note
													</div>
												)}
											</div>
										</div>
									);
								})}
							</div>
						) : (
							<div className="text-center py-8 text-muted-foreground">
								<Icon
									icon="lucide:book-x"
									className="h-12 w-12 mx-auto mb-2 opacity-50"
								/>
								<p>Aucun cours inscrit pour le moment</p>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Course Performance */}
				{gradesList && gradesList.length > 0 && (
					<Card className="bg-card">
						<CardHeader>
							<CardTitle className="text-card-foreground">
								Performance des cours
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{gradesList.map((grade) => {
									const enrollment =
										typeof grade.enrollment === "object"
											? (grade.enrollment as {
													courseInstance?: unknown;
													[key: string]: unknown;
												})
											: null;
									const courseInstance =
										enrollment &&
										typeof enrollment.courseInstance ===
											"object"
											? (enrollment.courseInstance as {
													courseVariation?: unknown;
													[key: string]: unknown;
												})
											: null;
									const courseVariation =
										courseInstance &&
										typeof courseInstance.courseVariation ===
											"object"
											? (courseInstance.courseVariation as {
													course?: unknown;
													[key: string]: unknown;
												})
											: null;
									const course =
										courseVariation &&
										typeof courseVariation.course ===
											"object"
											? (courseVariation.course as {
													code?: string;
													[key: string]: unknown;
												})
											: null;

									if (!course || !course.code) return null;

									return (
										<div
											key={grade.id}
											className="space-y-2"
										>
											<div className="flex items-center justify-between">
												<span className="text-sm font-medium text-card-foreground">
													{course.code}
												</span>
												<span className="text-sm text-muted-foreground">
													{grade.weightedAverage?.toFixed(
														1,
													)}
													%
												</span>
											</div>
											<Progress
												value={
													grade.weightedAverage || 0
												}
												className="h-2"
											/>
										</div>
									);
								})}
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
