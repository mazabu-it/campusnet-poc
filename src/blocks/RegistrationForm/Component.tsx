"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useId, useState } from "react";
import { toast } from "sonner";
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

interface RegistrationFormData {
	title: string;
	subtitle: string;
	programs?: Array<{
		label: string;
		value: string;
	}>;
	academicYears?: Array<{
		label: string;
		value: string;
	}>;
}

interface Props {
	block: RegistrationFormData;
}

export const RegistrationFormComponent: React.FC<Props> = ({ block }) => {
	// Generate unique IDs for form fields
	const firstNameId = useId();
	const lastNameId = useId();
	const emailId = useId();
	const phoneId = useId();
	const programId = useId();
	const yearId = useId();
	const messageId = useId();
	const agreeToTermsId = useId();

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		program: "",
		year: "",
		message: "",
		agreeToTerms: false,
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	// Add error handling and default values
	if (!block) {
		return (
			<section className="py-20 bg-white">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-gray-900 mb-4">
							Start Your Journey
						</h2>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							Apply to Demo University and begin your path to
							success
						</p>
					</div>
				</div>
			</section>
		);
	}

	const {
		title = "Start Your Journey",
		subtitle = "Apply to Demo University and begin your path to success",
		programs = [],
		academicYears = [],
	} = block;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 2000));

			toast.success("Registration submitted successfully!");
			setFormData({
				firstName: "",
				lastName: "",
				email: "",
				phone: "",
				program: "",
				year: "",
				message: "",
				agreeToTerms: false,
			});
		} catch (_error) {
			toast.error("Failed to submit registration. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<motion.section
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			viewport={{ once: true }}
			transition={{ duration: 0.6 }}
			className="py-20 bg-white"
		>
			<div className="container mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.2, duration: 0.6 }}
					className="text-center mb-16"
				>
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
						{title}
					</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						{subtitle}
					</p>
				</motion.div>

				<div className="max-w-2xl mx-auto">
					<Card className="shadow-xl">
						<CardHeader className="text-center">
							<CardTitle className="text-2xl font-bold text-gray-900">
								<Icon
									icon="lucide:user-plus"
									className="mr-2 text-blue-600"
								/>
								Student Registration
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Label htmlFor={firstNameId}>
											First Name
										</Label>
										<Input
											id={firstNameId}
											value={formData.firstName}
											onChange={(e) =>
												setFormData({
													...formData,
													firstName: e.target.value,
												})
											}
											required
											placeholder="Enter your first name"
										/>
									</div>
									<div>
										<Label htmlFor={lastNameId}>
											Last Name
										</Label>
										<Input
											id={lastNameId}
											value={formData.lastName}
											onChange={(e) =>
												setFormData({
													...formData,
													lastName: e.target.value,
												})
											}
											required
											placeholder="Enter your last name"
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Label htmlFor={emailId}>
											Email Address
										</Label>
										<Input
											id={emailId}
											type="email"
											value={formData.email}
											onChange={(e) =>
												setFormData({
													...formData,
													email: e.target.value,
												})
											}
											required
											placeholder="Enter your email"
										/>
									</div>
									<div>
										<Label htmlFor={phoneId}>
											Phone Number
										</Label>
										<Input
											id={phoneId}
											type="tel"
											value={formData.phone}
											onChange={(e) =>
												setFormData({
													...formData,
													phone: e.target.value,
												})
											}
											placeholder="Enter your phone number"
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Label htmlFor={programId}>
											Program of Interest
										</Label>
										<Select
											value={formData.program}
											onValueChange={(value) =>
												setFormData({
													...formData,
													program: value,
												})
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select a program" />
											</SelectTrigger>
											<SelectContent>
												{programs?.map(
													(program, index) => (
														<SelectItem
															key={
																program.value ||
																index
															}
															value={
																program.value
															}
														>
															{program.label}
														</SelectItem>
													),
												)}
											</SelectContent>
										</Select>
									</div>
									<div>
										<Label htmlFor={yearId}>
											Academic Year
										</Label>
										<Select
											value={formData.year}
											onValueChange={(value) =>
												setFormData({
													...formData,
													year: value,
												})
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select academic year" />
											</SelectTrigger>
											<SelectContent>
												{academicYears?.map(
													(year, index) => (
														<SelectItem
															key={
																year.value ||
																index
															}
															value={year.value}
														>
															{year.label}
														</SelectItem>
													),
												)}
											</SelectContent>
										</Select>
									</div>
								</div>

								<div>
									<Label htmlFor={messageId}>
										Additional Information
									</Label>
									<Textarea
										id={messageId}
										value={formData.message}
										onChange={(e) =>
											setFormData({
												...formData,
												message: e.target.value,
											})
										}
										placeholder="Tell us more about your academic goals..."
										rows={4}
									/>
								</div>

								<div className="flex items-center space-x-2">
									<Checkbox
										id={agreeToTermsId}
										checked={formData.agreeToTerms}
										onCheckedChange={(checked) =>
											setFormData({
												...formData,
												agreeToTerms:
													checked as boolean,
											})
										}
									/>
									<Label
										htmlFor={agreeToTermsId}
										className="text-sm"
									>
										I agree to the terms and conditions and
										privacy policy
									</Label>
								</div>

								<Button
									type="submit"
									className="w-full"
									size="lg"
									disabled={
										isSubmitting || !formData.agreeToTerms
									}
								>
									{isSubmitting ? (
										<>
											<Icon
												icon="lucide:loader-2"
												className="mr-2 animate-spin"
											/>
											Submitting...
										</>
									) : (
										<>
											<Icon
												icon="lucide:send"
												className="mr-2"
											/>
											Submit Registration
										</>
									)}
								</Button>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</motion.section>
	);
};
