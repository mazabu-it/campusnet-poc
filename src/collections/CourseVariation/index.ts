import type { CollectionConfig } from "payload";
import { authenticated } from "../../access/authenticated";

export const CourseVariation: CollectionConfig = {
	slug: "course-variations",
	access: {
		admin: authenticated,
		create: authenticated,
		delete: authenticated,
		read: authenticated,
		update: authenticated,
	},
	admin: {
		defaultColumns: ["course", "department", "codeVariant", "locale"],
		useAsTitle: "codeVariant",
	},
	fields: [
		{
			name: "course",
			type: "relationship",
			relationTo: "courses",
			required: true,
		},
		{
			name: "department",
			type: "relationship",
			relationTo: "departments",
			required: true,
		},
		{
			name: "programYear",
			type: "relationship",
			relationTo: "program-years",
		},
		{
			name: "codeVariant",
			type: "text",
			required: true,
			admin: {
				description: "Department-specific course code variant",
			},
		},
		{
			name: "titleVariant",
			type: "text",
			admin: {
				description: "Department-specific course title variant",
			},
		},
		{
			name: "descriptionVariant",
			type: "textarea",
			admin: {
				description: "Department-specific course description",
			},
		},
		{
			name: "locale",
			type: "select",
			options: [
				{ label: "English", value: "en" },
				{ label: "Dutch", value: "nl" },
				{ label: "French", value: "fr" },
				{ label: "German", value: "de" },
			],
			defaultValue: "en",
		},
		{
			name: "credits",
			type: "number",
			admin: {
				description: "Override credits for this variation (optional)",
			},
			min: 1,
			max: 30,
		},
		{
			name: "isActive",
			type: "checkbox",
			defaultValue: true,
		},
	],
	timestamps: true,
};
