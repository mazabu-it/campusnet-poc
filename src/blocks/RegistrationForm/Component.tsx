"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 2000));
			
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
		} catch (error) {
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
						{block.title}
					</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						{block.subtitle}
					</p>
				</motion.div>

				<div className="max-w-2xl mx-auto">
					<Card className="shadow-xl">
						<CardHeader className="text-center">
							<CardTitle className="text-2xl font-bold text-gray-900">
								<Icon icon="lucide:user-plus" className="mr-2 text-blue-600" />
								Student Registration
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Label htmlFor="firstName">First Name</Label>
										<Input
											id="firstName"
											value={formData.firstName}
											onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
											required
											placeholder="Enter your first name"
										/>
									</div>
									<div>
										<Label htmlFor="lastName">Last Name</Label>
										<Input
											id="lastName"
											value={formData.lastName}
											onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
											required
											placeholder="Enter your last name"
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Label htmlFor="email">Email Address</Label>
										<Input
											id="email"
											type="email"
											value={formData.email}
											onChange={(e) => setFormData({ ...formData, email: e.target.value })}
											required
											placeholder="Enter your email"
										/>
									</div>
									<div>
										<Label htmlFor="phone">Phone Number</Label>
										<Input
											id="phone"
											type="tel"
											value={formData.phone}
											onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
											placeholder="Enter your phone number"
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Label htmlFor="program">Program of Interest</Label>
										<Select
											value={formData.program}
											onValueChange={(value) => setFormData({ ...formData, program: value })}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select a program" />
											</SelectTrigger>
											<SelectContent>
												{block.programs?.map((program, index) => (
													<SelectItem key={index} value={program.value}>
														{program.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div>
										<Label htmlFor="year">Academic Year</Label>
										<Select
											value={formData.year}
											onValueChange={(value) => setFormData({ ...formData, year: value })}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select academic year" />
											</SelectTrigger>
											<SelectContent>
												{block.academicYears?.map((year, index) => (
													<SelectItem key={index} value={year.value}>
														{year.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>

								<div>
									<Label htmlFor="message">Additional Information</Label>
									<Textarea
										id="message"
										value={formData.message}
										onChange={(e) => setFormData({ ...formData, message: e.target.value })}
										placeholder="Tell us more about your academic goals..."
										rows={4}
									/>
								</div>

								<div className="flex items-center space-x-2">
									<Checkbox
										id="agreeToTerms"
										checked={formData.agreeToTerms}
										onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
									/>
									<Label htmlFor="agreeToTerms" className="text-sm">
										I agree to the terms and conditions and privacy policy
									</Label>
								</div>

								<Button
									type="submit"
									className="w-full"
									size="lg"
									disabled={isSubmitting || !formData.agreeToTerms}
								>
									{isSubmitting ? (
										<>
											<Icon icon="lucide:loader-2" className="mr-2 animate-spin" />
											Submitting...
										</>
									) : (
										<>
											<Icon icon="lucide:send" className="mr-2" />
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
