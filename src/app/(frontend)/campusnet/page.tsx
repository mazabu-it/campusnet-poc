"use client";

import { useState } from "react";
import { AdminDashboard } from "@/components/AdminDashboard";
import { ProfessorDashboard } from "@/components/ProfessorDashboard";
import { StudentDashboard } from "@/components/StudentDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CampusnetDemo() {
	const [currentView, setCurrentView] = useState<
		"demo" | "student" | "professor" | "admin"
	>("demo");
	const [isSeeded, setIsSeeded] = useState(false);
	const [seeding, setSeeding] = useState(false);

	const handleSeedData = async () => {
		setSeeding(true);
		try {
			const response = await fetch("/api/seed-campusnet", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.ok) {
				setIsSeeded(true);
				alert("Campusnet data seeded successfully!");
			} else {
				const error = await response.json();
				alert(`Error seeding data: ${error.details || error.error}`);
			}
		} catch (error) {
			console.error("Error seeding data:", error);
			alert("Failed to seed data. Please check the console for details.");
		} finally {
			setSeeding(false);
		}
	};

	if (currentView === "student") {
		return <StudentDashboard />;
	}

	if (currentView === "professor") {
		return <ProfessorDashboard />;
	}

	if (currentView === "admin") {
		return <AdminDashboard />;
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Campusnet MVP Demo
					</h1>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						A comprehensive academic management system for
						universities and faculties. Manage student registration,
						course enrollment, assessments, grading, and reporting.
					</p>
				</div>

				{!isSeeded && (
					<div className="max-w-2xl mx-auto mb-12">
						<Card>
							<CardHeader>
								<CardTitle className="text-center">
									Initialize System
								</CardTitle>
							</CardHeader>
							<CardContent className="text-center">
								<p className="text-gray-600 mb-6">
									First, seed the system with sample data
									including universities, faculties,
									departments, programs, courses, and grading
									scales.
								</p>
								<Button
									onClick={handleSeedData}
									disabled={seeding}
									size="lg"
								>
									{seeding
										? "Seeding Data..."
										: "Seed Sample Data"}
								</Button>
							</CardContent>
						</Card>
					</div>
				)}

				{isSeeded && (
					<div className="grid gap-8 md:grid-cols-3">
						<Card
							className="hover:shadow-lg transition-shadow cursor-pointer"
							onClick={() => setCurrentView("student")}
						>
							<CardHeader>
								<CardTitle className="text-center text-blue-600">
									Student Portal
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-center space-y-4">
									<div className="text-6xl">🎓</div>
									<p className="text-gray-600">
										Register for courses, view grades,
										download reports, and manage your
										academic journey.
									</p>
									<ul className="text-sm text-gray-500 space-y-1">
										<li>• Course enrollment</li>
										<li>• Grade viewing</li>
										<li>• Report generation</li>
										<li>• Academic progress tracking</li>
									</ul>
								</div>
							</CardContent>
						</Card>

						<Card
							className="hover:shadow-lg transition-shadow cursor-pointer"
							onClick={() => setCurrentView("professor")}
						>
							<CardHeader>
								<CardTitle className="text-center text-green-600">
									Professor Portal
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-center space-y-4">
									<div className="text-6xl">👨‍🏫</div>
									<p className="text-gray-600">
										Manage courses, create assessments,
										enter grades, and track student
										progress.
									</p>
									<ul className="text-sm text-gray-500 space-y-1">
										<li>• Course management</li>
										<li>• Assessment creation</li>
										<li>• Grade entry</li>
										<li>• Student progress monitoring</li>
									</ul>
								</div>
							</CardContent>
						</Card>

						<Card
							className="hover:shadow-lg transition-shadow cursor-pointer"
							onClick={() => setCurrentView("admin")}
						>
							<CardHeader>
								<CardTitle className="text-center text-purple-600">
									Admin Portal
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-center space-y-4">
									<div className="text-6xl">⚙️</div>
									<p className="text-gray-600">
										Configure universities, manage users,
										set up programs, and oversee system
										operations.
									</p>
									<ul className="text-sm text-gray-500 space-y-1">
										<li>• University configuration</li>
										<li>• User management</li>
										<li>• Program setup</li>
										<li>• System administration</li>
									</ul>
								</div>
							</CardContent>
						</Card>
					</div>
				)}

				<div className="mt-16 max-w-4xl mx-auto">
					<h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
						Key Features Implemented
					</h2>
					<div className="grid gap-6 md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Academic Structure</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li>
										✅ University, Faculty, Department
										hierarchy
									</li>
									<li>✅ Programs and Program Years</li>
									<li>✅ Courses and Course Variations</li>
									<li>✅ Academic Years and Calendars</li>
									<li>
										✅ Diploma Levels (Bachelor, Master,
										PhD)
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Assessment & Grading</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li>
										✅ Assessment Templates and Assessments
									</li>
									<li>✅ Score Entry and Management</li>
									<li>✅ Grade Calculation Engine</li>
									<li>✅ Configurable Grading Scales</li>
									<li>✅ Weighted Grade Calculations</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>User Management</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li>✅ Role-based Access Control</li>
									<li>✅ Student, Professor, Admin roles</li>
									<li>✅ University-scoped permissions</li>
									<li>✅ Course Enrollment System</li>
									<li>✅ User Profile Management</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Configuration</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-sm">
									<li>✅ Per-university settings</li>
									<li>✅ Grading scale configuration</li>
									<li>✅ Rounding rules and policies</li>
									<li>✅ Assessment windows</li>
									<li>✅ Report settings</li>
								</ul>
							</CardContent>
						</Card>
					</div>
				</div>

				<div className="mt-12 text-center">
					<p className="text-gray-600">
						This MVP demonstrates the core functionality of
						Campusnet. Click on any portal above to explore the
						different user interfaces.
					</p>
				</div>
			</div>
		</div>
	);
}
