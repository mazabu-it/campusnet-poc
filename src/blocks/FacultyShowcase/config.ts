import type { Block } from "payload";

export const FacultyShowcaseBlock: Block = {
	slug: "faculty-showcase",
	labels: {
		singular: "Faculty Showcase",
		plural: "Faculty Showcases",
	},
	fields: [
		{
			name: "title",
			type: "text",
			required: true,
			admin: {
				description: "Section title",
			},
		},
		{
			name: "subtitle",
			type: "textarea",
			required: true,
			admin: {
				description: "Section subtitle",
			},
		},
		{
			name: "faculty",
			type: "array",
			required: true,
			admin: {
				description: "Faculty members to showcase",
			},
			fields: [
				{
					name: "name",
					type: "text",
					required: true,
					admin: {
						description: "Faculty member name",
					},
				},
				{
					name: "title",
					type: "text",
					required: true,
					admin: {
						description: "Job title or position",
					},
				},
				{
					name: "department",
					type: "text",
					required: true,
					admin: {
						description: "Department affiliation",
					},
				},
				{
					name: "avatar",
					type: "text",
					admin: {
						description: "Avatar image URL",
					},
				},
				{
					name: "bio",
					type: "textarea",
					required: true,
					admin: {
						description: "Short biography",
					},
				},
				{
					name: "education",
					type: "text",
					required: true,
					admin: {
						description: "Educational background",
					},
				},
				{
					name: "email",
					type: "email",
					required: true,
					admin: {
						description: "Contact email",
					},
				},
				{
					name: "experience",
					type: "number",
					required: true,
					admin: {
						description: "Years of experience",
					},
				},
				{
					name: "specializations",
					type: "array",
					admin: {
						description: "Areas of specialization",
					},
					fields: [
						{
							name: "specialization",
							type: "text",
							required: true,
						},
					],
				},
			],
		},
	],
};
