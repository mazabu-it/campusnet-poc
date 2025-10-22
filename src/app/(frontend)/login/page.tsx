"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useId, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
	const emailId = useId();
	const passwordId = useId();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		const requestData = { email, password };
		console.log("Sending login request:", requestData);

		try {
			const response = await fetch("/api/users/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(requestData),
			});

			if (response.ok) {
				await response.json();
				// Redirect to dashboard or home page
				router.push("/dashboard");
			} else {
				// Try to parse error response as JSON
				try {
					const errorData = await response.json();
					setError(errorData.message || "Login failed");
				} catch (_jsonError) {
					// If JSON parsing fails, use status text
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

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				{/* Header */}
				<div className="text-center">
					<Link
						href="/"
						className="flex items-center justify-center mb-6"
					>
						<div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
							<Icon
								icon="lucide:graduation-cap"
								className="w-6 h-6 text-white"
							/>
						</div>
						<div>
							<h1 className="text-2xl font-bold text-gray-900">
								Demo University
							</h1>
							<p className="text-gray-600 text-sm">
								Excellence in Education
							</p>
						</div>
					</Link>
					<h2 className="text-3xl font-bold text-gray-900">
						Sign in to your account
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						Or{" "}
						<Link
							href="/admin"
							className="font-medium text-blue-600 hover:text-blue-500"
						>
							access admin panel
						</Link>
					</p>
				</div>

				{/* Login Form */}
				<Card>
					<CardHeader>
						<CardTitle className="text-center">Login</CardTitle>
					</CardHeader>
					<CardContent>
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
								<Label htmlFor={emailId}>Email address</Label>
								<Input
									id={emailId}
									type="email"
									placeholder="Enter your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor={passwordId}>Password</Label>
								<Input
									id={passwordId}
									type="password"
									placeholder="Enter your password"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									required
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
											className="w-4 h-4 mr-2 animate-spin"
										/>
										Signing in...
									</>
								) : (
									<>
										<Icon
											icon="lucide:log-in"
											className="w-4 h-4 mr-2"
										/>
										Sign in
									</>
								)}
							</Button>
						</form>

						<div className="mt-6 text-center">
							<p className="text-sm text-gray-600">
								Don&apos;t have an account?{" "}
								<Link
									href="/register"
									className="font-medium text-blue-600 hover:text-blue-500"
								>
									Sign up here
								</Link>
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Demo Credentials */}
				<Card className="bg-blue-50 border-blue-200">
					<CardHeader>
						<CardTitle className="text-blue-800 text-sm">
							Demo Credentials
						</CardTitle>
					</CardHeader>
					<CardContent className="text-sm text-blue-700">
						<p className="mb-3">
							For testing purposes, you can use:
						</p>
						<div className="space-y-3">
							<div className="p-2 bg-white rounded border">
								<p className="font-semibold text-green-700 mb-1">
									👨‍🎓 Student
								</p>
								<p>
									<strong>Email:</strong> student@test.com
								</p>
								<p>
									<strong>Password:</strong> test123
								</p>
							</div>
							<div className="p-2 bg-white rounded border">
								<p className="font-semibold text-blue-700 mb-1">
									👨‍🏫 Professor
								</p>
								<p>
									<strong>Email:</strong> professor@test.com
								</p>
								<p>
									<strong>Password:</strong> test123
								</p>
							</div>
							<div className="p-2 bg-white rounded border">
								<p className="font-semibold text-purple-700 mb-1">
									👨‍💼 Admin
								</p>
								<p>
									<strong>Email:</strong>{" "}
									admin@demouniversity.edu
								</p>
								<p>
									<strong>Password:</strong> password123
								</p>
							</div>
						</div>
						<p className="mt-3 text-xs text-blue-600">
							Or access the admin panel at{" "}
							<Link href="/admin" className="underline">
								/admin
							</Link>
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
