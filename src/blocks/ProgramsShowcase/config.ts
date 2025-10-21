import type { Block } from "payload";

export const ProgramsShowcaseBlock: Block = {
	slug: "programs-showcase",
	labels: {
		singular: "Programs Showcase",
		plural: "Programs Showcases",
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
				description: "Section subtitle or description",
			},
		},
		{
			name: "programs",
			type: "array",
			required: true,
			admin: {
				description: "Programs to showcase",
			},
			fields: [
				{
					name: "name",
					type: "text",
					required: true,
					admin: {
						description: "Program name",
					},
				},
				{
					name: "description",
					type: "textarea",
					required: true,
					admin: {
						description: "Program description",
					},
				},
				{
					name: "icon",
					type: "text",
					required: true,
					admin: {
						description: "Iconify icon name",
					},
				},
				{
					name: "level",
					type: "text",
					required: true,
					admin: {
						description: "Program level (e.g., Bachelor, Master)",
					},
				},
				{
					name: "duration",
					type: "text",
					required: true,
					admin: {
						description: "Program duration (e.g., '4 years')",
					},
				},
				{
					name: "credits",
					type: "number",
					required: true,
					admin: {
						description: "Total credits required",
					},
				},
				{
					name: "studentCount",
					type: "text",
					required: true,
					admin: {
						description: "Number of students (e.g., '500+')",
					},
				},
			],
		},
	],
};
