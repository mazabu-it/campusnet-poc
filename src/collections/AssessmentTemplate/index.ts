import type { CollectionConfig } from "payload";
import { authenticated } from "../../access/authenticated";

export const AssessmentTemplate: CollectionConfig = {
	slug: "assessment-templates",
	access: {
		admin: authenticated,
		create: authenticated,
		delete: authenticated,
		read: authenticated,
		update: authenticated,
	},
	admin: {
		defaultColumns: [
			"name",
			"courseInstance",
			"weightPercent",
			"isOptional",
		],
		useAsTitle: "name",
	},
	fields: [
		{
			name: "courseInstance",
			type: "relationship",
			relationTo: "course-instances",
			required: true,
		},
		{
			name: "name",
			type: "text",
			required: true,
		},
		{
			name: "description",
			type: "textarea",
		},
		{
			name: "weightPercent",
			type: "number",
			required: true,
			min: 0,
			max: 100,
			admin: {
				description:
					"Percentage weight of this assessment in final grade",
			},
		},
		{
			name: "minScore",
			type: "number",
			defaultValue: 0,
			admin: {
				description: "Minimum possible score",
			},
		},
		{
			name: "maxScore",
			type: "number",
			required: true,
			admin: {
				description: "Maximum possible score",
			},
		},
		{
			name: "isOptional",
			type: "checkbox",
			defaultValue: false,
			admin: {
				description: "If true, missing scores are not counted as zero",
			},
		},
		{
			name: "assessmentType",
			type: "select",
			options: [
				{ label: "Exam", value: "exam" },
				{ label: "Quiz", value: "quiz" },
				{ label: "Assignment", value: "assignment" },
				{ label: "Project", value: "project" },
				{ label: "Presentation", value: "presentation" },
				{ label: "Lab Work", value: "lab" },
				{ label: "Participation", value: "participation" },
				{ label: "Other", value: "other" },
			],
			required: true,
		},
		{
			name: "instructions",
			type: "textarea",
			admin: {
				description: "Instructions for students",
			},
		},
		{
			name: "rubric",
			type: "array",
			fields: [
				{
					name: "criteria",
					type: "text",
					required: true,
				},
				{
					name: "description",
					type: "textarea",
				},
				{
					name: "maxPoints",
					type: "number",
					required: true,
				},
			],
		},
		{
			name: "isActive",
			type: "checkbox",
			defaultValue: true,
		},
	],
	timestamps: true,
};
