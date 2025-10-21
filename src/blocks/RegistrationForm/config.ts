import type { Block } from "payload";

export const RegistrationFormBlock: Block = {
	slug: "registration-form",
	labels: {
		singular: "Registration Form",
		plural: "Registration Forms",
	},
	fields: [
		{
			name: "title",
			type: "text",
			required: true,
			admin: {
				description: "Form section title",
			},
		},
		{
			name: "subtitle",
			type: "textarea",
			required: true,
			admin: {
				description: "Form section subtitle",
			},
		},
		{
			name: "programs",
			type: "array",
			required: true,
			admin: {
				description: "Available programs for selection",
			},
			fields: [
				{
					name: "label",
					type: "text",
					required: true,
					admin: {
						description: "Display label for the program",
					},
				},
				{
					name: "value",
					type: "text",
					required: true,
					admin: {
						description: "Value for the program option",
					},
				},
			],
		},
		{
			name: "academicYears",
			type: "array",
			required: true,
			admin: {
				description: "Available academic years",
			},
			fields: [
				{
					name: "label",
					type: "text",
					required: true,
					admin: {
						description: "Display label for the academic year",
					},
				},
				{
					name: "value",
					type: "text",
					required: true,
					admin: {
						description: "Value for the academic year option",
					},
				},
			],
		},
	],
};
