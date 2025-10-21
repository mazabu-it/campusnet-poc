"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface University {
	id: string;
	name: string;
	code: string;
	isActive: boolean;
	locale: string;
}

interface Faculty {
	id: string;
	name: string;
	code: string;
	university: string;
	isActive: boolean;
}

interface Department {
	id: string;
	name: string;
	code: string;
	faculty: string;
	isActive: boolean;
}

interface Program {
	id: string;
	name: string;
	code: string;
	department: string;
	diplomaLevel: string;
	duration: number;
	isActive: boolean;
}

interface User {
	id: string;
	name: string;
	email: string;
	role: string;
	university: string;
	faculty?: string;
	department?: string;
	isActive: boolean;
}

export function AdminDashboard() {
	const [universities, setUniversities] = useState<University[]>([]);
	const [faculties, setFaculties] = useState<Faculty[]>([]);
	const [departments, setDepartments] = useState<Department[]>([]);
	const [programs, setPrograms] = useState<Program[]>([]);
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<
		| "overview"
		| "universities"
		| "faculties"
		| "departments"
		| "programs"
		| "users"
	>("overview");
	const [_selectedUniversity, _setSelectedUniversity] = useState<string>("");

	const fetchAdminData = useCallback(async () => {
		try {
			const [
				universitiesRes,
				facultiesRes,
				departmentsRes,
				programsRes,
				usersRes,
			] = await Promise.all([
				fetch("/api/universities"),
				fetch("/api/faculties"),
				fetch("/api/departments"),
				fetch("/api/programs"),
				fetch("/api/users"),
			]);

			const [
				universitiesData,
				facultiesData,
				departmentsData,
				programsData,
				usersData,
			] = await Promise.all([
				universitiesRes.json(),
				facultiesRes.json(),
				departmentsRes.json(),
				programsRes.json(),
				usersRes.json(),
			]);

			setUniversities(universitiesData.docs || []);
			setFaculties(facultiesData.docs || []);
			setDepartments(departmentsData.docs || []);
			setPrograms(programsData.docs || []);
			setUsers(usersData.docs || []);
		} catch (error) {
			console.error("Error fetching admin data:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchAdminData();
	}, [fetchAdminData]);

	const getRoleColor = (role: string) => {
		switch (role) {
			case "super-admin":
				return "bg-red-100 text-red-800";
			case "admin":
				return "bg-purple-100 text-purple-800";
			case "rector-dean":
				return "bg-blue-100 text-blue-800";
			case "faculty-staff":
				return "bg-green-100 text-green-800";
			case "department-staff":
				return "bg-yellow-100 text-yellow-800";
			case "professor":
				return "bg-indigo-100 text-indigo-800";
			case "assistant":
				return "bg-pink-100 text-pink-800";
			case "student":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusColor = (isActive: boolean) => {
		return isActive
			? "bg-green-100 text-green-800"
			: "bg-red-100 text-red-800";
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
					Admin Dashboard
				</h1>
				<p className="text-gray-600 mt-2">
					Manage universities, faculties, departments, programs, and
					users
				</p>
			</div>

			{/* Tab Navigation */}
			<div className="mb-6">
				<div className="border-b border-gray-200">
					<nav className="-mb-px flex space-x-8">
						{[
							{ key: "overview", label: "Overview" },
							{ key: "universities", label: "Universities" },
							{ key: "faculties", label: "Faculties" },
							{ key: "departments", label: "Departments" },
							{ key: "programs", label: "Programs" },
							{ key: "users", label: "Users" },
						].map((tab) => (
							<button
								type="button"
								key={tab.key}
								onClick={() =>
									setActiveTab(
										tab.key as "overview" | "users",
									)
								}
								className={`py-2 px-1 border-b-2 font-medium text-sm ${
									activeTab === tab.key
										? "border-blue-500 text-blue-600"
										: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
								}`}
							>
								{tab.label}
							</button>
						))}
					</nav>
				</div>
			</div>

			{/* Overview Tab */}
			{activeTab === "overview" && (
				<div className="space-y-6">
					<h2 className="text-2xl font-semibold text-gray-900">
						System Overview
					</h2>
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-gray-600">
									Universities
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{universities.length}
								</div>
								<p className="text-xs text-gray-600">
									{
										universities.filter((u) => u.isActive)
											.length
									}{" "}
									active
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-gray-600">
									Faculties
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{faculties.length}
								</div>
								<p className="text-xs text-gray-600">
									{faculties.filter((f) => f.isActive).length}{" "}
									active
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-gray-600">
									Departments
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{departments.length}
								</div>
								<p className="text-xs text-gray-600">
									{
										departments.filter((d) => d.isActive)
											.length
									}{" "}
									active
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-gray-600">
									Programs
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{programs.length}
								</div>
								<p className="text-xs text-gray-600">
									{programs.filter((p) => p.isActive).length}{" "}
									active
								</p>
							</CardContent>
						</Card>
					</div>

					<div className="grid gap-6 md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>User Distribution</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									{Object.entries(
										users.reduce(
											(acc, user) => {
												acc[user.role] =
													(acc[user.role] || 0) + 1;
												return acc;
											},
											{} as Record<string, number>,
										),
									).map(([role, count]) => (
										<div
											key={role}
											className="flex justify-between items-center"
										>
											<span className="text-sm capitalize">
												{role.replace("-", " ")}
											</span>
											<Badge variant="outline">
												{count}
											</Badge>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Recent Activity</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-sm text-gray-600">
									<p>• System initialized</p>
									<p>• All collections created</p>
									<p>• Access controls configured</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			)}

			{/* Universities Tab */}
			{activeTab === "universities" && (
				<div className="space-y-6">
					<div className="flex justify-between items-center">
						<h2 className="text-2xl font-semibold text-gray-900">
							Universities
						</h2>
						<Button
							onClick={() => {
								/* Create university */
							}}
						>
							Create University
						</Button>
					</div>

					<div className="grid gap-4">
						{universities.map((university) => (
							<Card
								key={university.id}
								className="hover:shadow-lg transition-shadow"
							>
								<CardHeader>
									<div className="flex items-center justify-between">
										<div>
											<CardTitle className="text-lg">
												{university.name}
											</CardTitle>
											<p className="text-sm text-gray-600">
												Code: {university.code}
											</p>
										</div>
										<div className="flex items-center space-x-2">
											<Badge
												className={getStatusColor(
													university.isActive,
												)}
											>
												{university.isActive
													? "Active"
													: "Inactive"}
											</Badge>
											<Badge variant="outline">
												{university.locale}
											</Badge>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<div className="flex justify-end space-x-2">
										<Button variant="outline" size="sm">
											Edit
										</Button>
										<Button variant="outline" size="sm">
											View Details
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			)}

			{/* Users Tab */}
			{activeTab === "users" && (
				<div className="space-y-6">
					<div className="flex justify-between items-center">
						<h2 className="text-2xl font-semibold text-gray-900">
							Users
						</h2>
						<Button
							onClick={() => {
								/* Create user */
							}}
						>
							Create User
						</Button>
					</div>

					<div className="grid gap-4">
						{users.map((user) => (
							<Card
								key={user.id}
								className="hover:shadow-lg transition-shadow"
							>
								<CardHeader>
									<div className="flex items-center justify-between">
										<div>
											<CardTitle className="text-lg">
												{user.name}
											</CardTitle>
											<p className="text-sm text-gray-600">
												{user.email}
											</p>
										</div>
										<div className="flex items-center space-x-2">
											<Badge
												className={getRoleColor(
													user.role,
												)}
											>
												{user.role.replace("-", " ")}
											</Badge>
											<Badge
												className={getStatusColor(
													user.isActive,
												)}
											>
												{user.isActive
													? "Active"
													: "Inactive"}
											</Badge>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<div className="text-sm text-gray-600">
										<p>University: {user.university}</p>
										{user.faculty && (
											<p>Faculty: {user.faculty}</p>
										)}
										{user.department && (
											<p>Department: {user.department}</p>
										)}
									</div>
									<div className="flex justify-end space-x-2 mt-4">
										<Button variant="outline" size="sm">
											Edit
										</Button>
										<Button variant="outline" size="sm">
											View Details
										</Button>
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
