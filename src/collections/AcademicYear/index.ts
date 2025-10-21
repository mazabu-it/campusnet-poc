import type { CollectionConfig } from "payload";
import { authenticated } from "../../access/authenticated";

export const AcademicYear: CollectionConfig = {
	slug: "academic-years",
	access: {
		admin: authenticated,
		create: authenticated,
		delete: authenticated,
		read: authenticated,
		update: authenticated,
	},
	admin: {
		defaultColumns: ["yearLabel", "startDate", "endDate", "isActive"],
		useAsTitle: "yearLabel",
	},
	fields: [
		{
			name: "yearLabel",
			type: "text",
			required: true,
			label: "Academic Year Label",
			admin: {
				description: "e.g., 2025-2026",
			},
		},
		{
			name: "startDate",
			type: "date",
			required: true,
		},
		{
			name: "endDate",
			type: "date",
			required: true,
		},
		{
			name: "semesters",
			type: "array",
			fields: [
				{
					name: "name",
					type: "text",
					required: true,
				},
				{
					name: "startDate",
					type: "date",
					required: true,
				},
				{
					name: "endDate",
					type: "date",
					required: true,
				},
				{
					name: "isActive",
					type: "checkbox",
					defaultValue: true,
				},
			],
		},
		{
			name: "isActive",
			type: "checkbox",
			defaultValue: true,
		},
		{
			name: "description",
			type: "textarea",
		},
	],
	timestamps: true,
};
