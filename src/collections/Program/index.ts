import type { CollectionConfig } from "payload";
import { authenticated } from "../../access/authenticated";

export const Program: CollectionConfig = {
	slug: "programs",
	access: {
		admin: authenticated,
		create: authenticated,
		delete: authenticated,
		read: authenticated,
		update: authenticated,
	},
	admin: {
		defaultColumns: ["name", "code", "department", "diplomaLevel"],
		useAsTitle: "name",
	},
	fields: [
		{
			name: "department",
			type: "relationship",
			relationTo: "departments",
			required: true,
		},
		{
			name: "name",
			type: "text",
			required: true,
		},
		{
			name: "code",
			type: "text",
			required: true,
		},
		{
			name: "description",
			type: "textarea",
		},
		{
			name: "diplomaLevel",
			type: "relationship",
			relationTo: "diploma-levels",
			required: true,
		},
		{
			name: "duration",
			type: "number",
			label: "Duration (years)",
			required: true,
			min: 1,
			max: 10,
		},
		{
			name: "curriculumRules",
			type: "group",
			fields: [
				{
					name: "totalCreditsRequired",
					type: "number",
					required: true,
					min: 1,
				},
				{
					name: "electiveCreditsAllowed",
					type: "number",
					defaultValue: 0,
					min: 0,
				},
				{
					name: "maxCreditsPerSemester",
					type: "number",
					defaultValue: 30,
					min: 1,
				},
				{
					name: "minCreditsPerSemester",
					type: "number",
					defaultValue: 12,
					min: 1,
				},
				{
					name: "prerequisiteRules",
					type: "textarea",
					label: "Prerequisite Rules (text description)",
				},
			],
		},
		{
			name: "programDirector",
			type: "relationship",
			relationTo: "users",
		},
		{
			name: "isActive",
			type: "checkbox",
			defaultValue: true,
		},
	],
	timestamps: true,
};
