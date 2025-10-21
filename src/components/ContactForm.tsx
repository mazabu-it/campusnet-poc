"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Link from "next/link";
import type React from "react";
import { useId, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/utilities/ui";

interface ContactFormData {
	name: string;
	email: string;
	phone: string;
	subject: string;
	message: string;
	program: string;
	academicYear: string;
	agreeTerms: boolean;
	agreeNewsletter: boolean;
}

interface ContactFormProps {
	title?: string;
	subtitle?: string;
	showProgramSelection?: boolean;
	showAcademicYear?: boolean;
	className?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({
	title = "Contact Us",
	subtitle = "Get in touch with Demo University",
	showProgramSelection = true,
	showAcademicYear = true,
	className,
}) => {
	const nameId = useId();
	const emailId = useId();
	const phoneId = useId();
	const subjectId = useId();
	const messageId = useId();
	const programId = useId();
	const academicYearId = useId();
	const agreeTermsId = useId();
	const agreeNewsletterId = useId();

	const [formData, setFormData] = useState<ContactFormData>({
		name: "",
		email: "",
		phone: "",
		subject: "",
		message: "",
		program: "",
		academicYear: "",
		agreeTerms: false,
		agreeNewsletter: false,
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState<{
		name?: string;
		email?: string;
		subject?: string;
		message?: string;
		agreeTerms?: string;
	}>({});

	const programs = [
		{ label: "Bachelor of Software Engineering", value: "bse" },
		{ label: "Master of Computer Science", value: "mcs" },
		{ label: "PhD in Information Technology", value: "phd-it" },
		{ label: "Bachelor of Data Science", value: "bds" },
		{ label: "Master of AI Engineering", value: "maie" },
	];

	const academicYears = [
		{ label: "Fall 2025", value: "fall-2025" },
		{ label: "Spring 2026", value: "spring-2026" },
		{ label: "Fall 2026", value: "fall-2026" },
		{ label: "Spring 2027", value: "spring-2027" },
	];

	const validateForm = (): boolean => {
		const newErrors: {
			name?: string;
			email?: string;
			subject?: string;
			message?: string;
			agreeTerms?: string;
		} = {};

		if (!formData.name.trim()) newErrors.name = "Name is required";
		if (!formData.email.trim()) newErrors.email = "Email is required";
		else if (!/\S+@\S+\.\S+/.test(formData.email))
			newErrors.email = "Invalid email format";
		if (!formData.subject.trim()) newErrors.subject = "Subject is required";
		if (!formData.message.trim()) newErrors.message = "Message is required";
		else if (formData.message.length < 10)
			newErrors.message = "Message must be at least 10 characters";
		if (!formData.agreeTerms)
			newErrors.agreeTerms = "You must agree to the terms";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			toast.error("Please fix the errors below");
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const result = await response.json();

			if (result.success) {
				toast.success(result.message);
				setFormData({
					name: "",
					email: "",
					phone: "",
					subject: "",
					message: "",
					program: "",
					academicYear: "",
					agreeTerms: false,
					agreeNewsletter: false,
				});
				setErrors({});
			} else {
				toast.error(result.message);
			}
		} catch (error) {
			toast.error("An error occurred. Please try again.");
			console.error("Contact form error:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleChange = (
		field: keyof ContactFormData,
		value: string | boolean,
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field as keyof typeof errors]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
			className={cn("w-full max-w-2xl mx-auto", className)}
		>
			<Card className="shadow-lg">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold flex items-center justify-center space-x-2">
						<Icon icon="lucide:mail" className="w-6 h-6" />
						<span>{title}</span>
					</CardTitle>
					<p className="text-gray-600">{subtitle}</p>
					<Badge variant="secondary" className="w-fit mx-auto">
						<Icon icon="lucide:clock" className="w-3 h-3 mr-1" />
						We respond within 24 hours
					</Badge>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Personal Information */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold flex items-center space-x-2">
								<Icon icon="lucide:user" className="w-5 h-5" />
								<span>Personal Information</span>
							</h3>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label htmlFor={nameId}>Full Name *</Label>
									<Input
										id={nameId}
										value={formData.name}
										onChange={(e) =>
											handleChange("name", e.target.value)
										}
										className={cn(
											errors.name && "border-red-500",
										)}
										placeholder="Enter your full name"
									/>
									{errors.name && (
										<p className="text-red-500 text-sm mt-1">
											{errors.name}
										</p>
									)}
								</div>

								<div>
									<Label htmlFor={emailId}>
										Email Address *
									</Label>
									<Input
										id={emailId}
										type="email"
										value={formData.email}
										onChange={(e) =>
											handleChange(
												"email",
												e.target.value,
											)
										}
										className={cn(
											errors.email && "border-red-500",
										)}
										placeholder="your.email@example.com"
									/>
									{errors.email && (
										<p className="text-red-500 text-sm mt-1">
											{errors.email}
										</p>
									)}
								</div>
							</div>

							<div>
								<Label htmlFor={phoneId}>Phone Number</Label>
								<Input
									id={phoneId}
									type="tel"
									value={formData.phone}
									onChange={(e) =>
										handleChange("phone", e.target.value)
									}
									placeholder="(555) 123-4567"
								/>
							</div>
						</div>

						{/* Academic Information */}
						{(showProgramSelection || showAcademicYear) && (
							<div className="space-y-4">
								<h3 className="text-lg font-semibold flex items-center space-x-2">
									<Icon
										icon="lucide:graduation-cap"
										className="w-5 h-5"
									/>
									<span>Academic Information</span>
								</h3>

								{showProgramSelection && (
									<div>
										<Label htmlFor={programId}>
											Program of Interest
										</Label>
										<Select
											value={formData.program}
											onValueChange={(value) =>
												handleChange("program", value)
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select a program" />
											</SelectTrigger>
											<SelectContent>
												{programs.map((program) => (
													<SelectItem
														key={program.value}
														value={program.value}
													>
														{program.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								)}

								{showAcademicYear && (
									<div>
										<Label htmlFor={academicYearId}>
											Academic Year
										</Label>
										<Select
											value={formData.academicYear}
											onValueChange={(value) =>
												handleChange(
													"academicYear",
													value,
												)
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select academic year" />
											</SelectTrigger>
											<SelectContent>
												{academicYears.map((year) => (
													<SelectItem
														key={year.value}
														value={year.value}
													>
														{year.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								)}
							</div>
						)}

						{/* Message */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold flex items-center space-x-2">
								<Icon
									icon="lucide:message-circle"
									className="w-5 h-5"
								/>
								<span>Your Message</span>
							</h3>

							<div>
								<Label htmlFor={subjectId}>Subject *</Label>
								<Input
									id={subjectId}
									value={formData.subject}
									onChange={(e) =>
										handleChange("subject", e.target.value)
									}
									className={cn(
										errors.subject && "border-red-500",
									)}
									placeholder="What is this about?"
								/>
								{errors.subject && (
									<p className="text-red-500 text-sm mt-1">
										{errors.subject}
									</p>
								)}
							</div>

							<div>
								<Label htmlFor={messageId}>Message *</Label>
								<Textarea
									id={messageId}
									value={formData.message}
									onChange={(e) =>
										handleChange("message", e.target.value)
									}
									className={cn(
										errors.message && "border-red-500",
									)}
									placeholder="Tell us more about your inquiry..."
									rows={6}
								/>
								<div className="flex justify-between items-center mt-1">
									{errors.message ? (
										<p className="text-red-500 text-sm">
											{errors.message}
										</p>
									) : (
										<p className="text-gray-500 text-sm">
											{formData.message.length}/500
											characters
										</p>
									)}
								</div>
							</div>
						</div>

						{/* Agreements */}
						<div className="space-y-4">
							<div className="flex items-start space-x-2">
								<Checkbox
									id={agreeTermsId}
									checked={formData.agreeTerms}
									onCheckedChange={(checked) =>
										handleChange("agreeTerms", !!checked)
									}
								/>
								<Label
									htmlFor={agreeTermsId}
									className="text-sm"
								>
									I agree to the{" "}
									<Link
										href="/terms"
										className="text-blue-600 hover:underline"
									>
										Terms of Service
									</Link>{" "}
									and{" "}
									<Link
										href="/privacy"
										className="text-blue-600 hover:underline"
									>
										Privacy Policy
									</Link>
									*
								</Label>
							</div>
							{errors.agreeTerms && (
								<p className="text-red-500 text-sm">
									{errors.agreeTerms}
								</p>
							)}

							<div className="flex items-start space-x-2">
								<Checkbox
									id={agreeNewsletterId}
									checked={formData.agreeNewsletter}
									onCheckedChange={(checked) =>
										handleChange(
											"agreeNewsletter",
											!!checked,
										)
									}
								/>
								<Label
									htmlFor={agreeNewsletterId}
									className="text-sm"
								>
									I would like to receive updates and
									newsletters from Demo University
								</Label>
							</div>
						</div>

						{/* Submit Button */}
						<Button
							type="submit"
							disabled={isSubmitting}
							className="w-full"
							size="lg"
						>
							{isSubmitting ? (
								<>
									<Icon
										icon="lucide:loader-2"
										className="w-4 h-4 mr-2 animate-spin"
									/>
									Sending Message...
								</>
							) : (
								<>
									<Icon
										icon="lucide:send"
										className="w-4 h-4 mr-2"
									/>
									Send Message
								</>
							)}
						</Button>

						{/* Contact Information */}
						<div className="text-center text-sm text-gray-600 pt-4 border-t">
							<p>Or contact us directly:</p>
							<div className="flex justify-center space-x-6 mt-2">
								<a
									href="mailto:info@demouniversity.edu"
									className="flex items-center space-x-1 hover:text-blue-600"
								>
									<Icon
										icon="lucide:mail"
										className="w-4 h-4"
									/>
									<span>info@demouniversity.edu</span>
								</a>
								<a
									href="tel:+15551234567"
									className="flex items-center space-x-1 hover:text-blue-600"
								>
									<Icon
										icon="lucide:phone"
										className="w-4 h-4"
									/>
									<span>(555) 123-4567</span>
								</a>
							</div>
						</div>
					</form>
				</CardContent>
			</Card>
		</motion.div>
	);
};
