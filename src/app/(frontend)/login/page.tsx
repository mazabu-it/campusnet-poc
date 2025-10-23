"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useId, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/stores/app-store";

export default function LoginPage() {
	const emailId = useId();
	const passwordId = useId();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();
	const { user: userStore } = useAppStore();

	// Redirect already authenticated users
	useEffect(() => {
		if (userStore.user) {
			console.log(
				"User already authenticated, redirecting...",
				userStore.user.role,
			);
			if (
				userStore.user.role === "professor" ||
				userStore.user.role === "faculty-staff"
			) {
				router.push("/professor");
			} else if (userStore.user.role === "admin") {
				router.push("/admin");
			} else {
				router.push("/dashboard");
			}
		}
	}, [userStore.user, router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		const requestData = { email, password };

		try {
			const response = await fetch("/api/users/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(requestData),
			});

			if (response.ok) {
				const data = await response.json();
				console.log("Login successful, user data:", data.user);

				// Store user data in the store
				userStore.login(data.user);

				// Redirect based on user role
				if (
					data.user.role === "professor" ||
					data.user.role === "faculty-staff"
				) {
					router.push("/professor");
				} else if (data.user.role === "admin") {
					router.push("/admin");
				} else {
					router.push("/dashboard");
				}
			} else {
				try {
					const errorData = await response.json();
					setError(errorData.message || "Login failed");
				} catch (_jsonError) {
					setError(
						`Login failed: ${response.status} ${response.statusText}`,
					);
				}
			}
		} catch (_err) {
			setError("An error occurred during login");
		} finally {
			setLoading(false);
		}
	};

	const fillDemoCredentials = (role: "student" | "professor" | "admin") => {
		const credentials = {
			student: { email: "student@test.com", password: "test123" },
			professor: { email: "professor@test.com", password: "test123" },
			admin: {
				email: "admin@demouniversity.edu",
				password: "password123",
			},
		};
		setEmail(credentials[role].email);
		setPassword(credentials[role].password);
	};

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-8">
				{/* Logo and Title */}
				<div className="text-center">
					<Link
						href="/"
						className="inline-flex items-center space-x-2 mb-8"
					>
						<Icon
							icon="lucide:graduation-cap"
							className="h-8 w-8"
						/>
						<span className="text-xl font-semibold">Campusnet</span>
					</Link>
					<h2 className="text-3xl font-semibold tracking-tight">
						Welcome back
					</h2>
					<p className="mt-2 text-sm text-muted-foreground">
						Sign in to your account to continue
					</p>
				</div>

				{/* Login Form */}
				<Card>
					<CardHeader className="space-y-1">
						<CardTitle className="text-2xl font-semibold tracking-tight">
							Sign in
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<form onSubmit={handleSubmit} className="space-y-4">
							{error && (
								<Alert variant="destructive">
									<Icon
										icon="lucide:alert-circle"
										className="h-4 w-4"
									/>
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}

							<div className="space-y-2">
								<Label htmlFor={emailId}>Email</Label>
								<Input
									id={emailId}
									type="email"
									placeholder="name@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									autoComplete="email"
								/>
							</div>

							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label htmlFor={passwordId}>Password</Label>
									<Link
										href="/forgot-password"
										className="text-sm text-muted-foreground hover:text-foreground"
									>
										Forgot password?
									</Link>
								</div>
								<Input
									id={passwordId}
									type="password"
									placeholder="••••••••"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									required
									autoComplete="current-password"
								/>
							</div>

							<Button
								type="submit"
								className="w-full"
								disabled={loading}
							>
								{loading ? (
									<>
										<Icon
											icon="lucide:loader-2"
											className="mr-2 h-4 w-4 animate-spin"
										/>
										Signing in...
									</>
								) : (
									"Sign in"
								)}
							</Button>
						</form>

						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-card px-2 text-muted-foreground">
									Or continue with
								</span>
							</div>
						</div>

						<Tabs defaultValue="student" className="w-full">
							<TabsList className="grid w-full grid-cols-3">
								<TabsTrigger value="student">
									Student
								</TabsTrigger>
								<TabsTrigger value="professor">
									Professor
								</TabsTrigger>
								<TabsTrigger value="admin">Admin</TabsTrigger>
							</TabsList>
							<TabsContent
								value="student"
								className="space-y-2 pt-4"
							>
								<Button
									variant="outline"
									className="w-full"
									onClick={() =>
										fillDemoCredentials("student")
									}
								>
									<Icon
										icon="lucide:graduation-cap"
										className="mr-2 h-4 w-4"
									/>
									Use Student Demo
								</Button>
								<p className="text-xs text-center text-muted-foreground">
									student@test.com / test123
								</p>
							</TabsContent>
							<TabsContent
								value="professor"
								className="space-y-2 pt-4"
							>
								<Button
									variant="outline"
									className="w-full"
									onClick={() =>
										fillDemoCredentials("professor")
									}
								>
									<Icon
										icon="lucide:user-check"
										className="mr-2 h-4 w-4"
									/>
									Use Professor Demo
								</Button>
								<p className="text-xs text-center text-muted-foreground">
									professor@test.com / test123
								</p>
							</TabsContent>
							<TabsContent
								value="admin"
								className="space-y-2 pt-4"
							>
								<Button
									variant="outline"
									className="w-full"
									onClick={() => fillDemoCredentials("admin")}
								>
									<Icon
										icon="lucide:shield"
										className="mr-2 h-4 w-4"
									/>
									Use Admin Demo
								</Button>
								<p className="text-xs text-center text-muted-foreground">
									admin@demouniversity.edu / password123
								</p>
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>

				<p className="text-center text-sm text-muted-foreground">
					Don't have an account?{" "}
					<Link
						href="/register"
						className="font-medium underline underline-offset-4 hover:text-foreground"
					>
						Sign up
					</Link>
				</p>

				<p className="text-center text-xs text-muted-foreground">
					Or access the{" "}
					<Link
						href="/admin"
						className="underline underline-offset-4 hover:text-foreground"
					>
						admin panel
					</Link>
				</p>
			</div>
		</div>
	);
}
