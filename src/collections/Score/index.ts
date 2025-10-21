import type { CollectionConfig } from "payload";
import { authenticated } from "../../access/authenticated";
import {
	adminAccess,
	assistantAccess,
	multiRoleAccess,
	professorAccess,
	studentAccess,
	superAdminAccess,
} from "../../access/campusnet";

export const Score: CollectionConfig = {
	slug: "scores",
	access: {
		admin: authenticated,
		create: multiRoleAccess(
			superAdminAccess,
			adminAccess,
			professorAccess,
			assistantAccess,
		),
		delete: superAdminAccess,
		read: multiRoleAccess(
			superAdminAccess,
			adminAccess,
			professorAccess,
			assistantAccess,
			studentAccess,
		),
		update: multiRoleAccess(
			superAdminAccess,
			adminAccess,
			professorAccess,
			assistantAccess,
		),
	},
	admin: {
		defaultColumns: [
			"assessment",
			"student",
			"value",
			"gradedBy",
			"gradedAt",
		],
		useAsTitle: "scoreTitle",
	},
	fields: [
		{
			name: "assessment",
			type: "relationship",
			relationTo: "assessments",
			required: true,
		},
		{
			name: "student",
			type: "relationship",
			relationTo: "users",
			required: true,
		},
		{
			name: "scoreTitle",
			type: "text",
			admin: {
				description: "Auto-generated title",
			},
		},
		{
			name: "value",
			type: "number",
			required: true,
			admin: {
				description: "Raw score value",
			},
		},
		{
			name: "maxValue",
			type: "number",
			admin: {
				description:
					"Maximum possible score (from assessment template)",
			},
		},
		{
			name: "percentage",
			type: "number",
			admin: {
				description: "Calculated percentage",
				readOnly: true,
			},
		},
		{
			name: "isLate",
			type: "checkbox",
			defaultValue: false,
		},
		{
			name: "latePenaltyApplied",
			type: "number",
			defaultValue: 0,
			admin: {
				description: "Penalty percentage applied for late submission",
			},
		},
		{
			name: "finalValue",
			type: "number",
			admin: {
				description: "Final score after penalties",
				readOnly: true,
			},
		},
		{
			name: "gradedBy",
			type: "relationship",
			relationTo: "users",
			required: true,
		},
		{
			name: "gradedAt",
			type: "date",
			defaultValue: () => new Date(),
		},
		{
			name: "feedback",
			type: "textarea",
			admin: {
				description: "Feedback for the student",
			},
		},
		{
			name: "notes",
			type: "textarea",
			admin: {
				description: "Internal notes for staff",
			},
		},
		{
			name: "isExcused",
			type: "checkbox",
			defaultValue: false,
			admin: {
				description: "If true, this score is excused and not counted",
			},
		},
	],
	timestamps: true,
	hooks: {
		beforeChange: [
			({ data }) => {
				if (data.assessment && data.student) {
					data.scoreTitle = `Score`;
				}

				// Calculate percentage and final value
				if (data.value && data.maxValue) {
					data.percentage = (data.value / data.maxValue) * 100;

					// Apply late penalty if applicable
					if (data.isLate && data.latePenaltyApplied > 0) {
						data.finalValue =
							data.value * (1 - data.latePenaltyApplied / 100);
					} else {
						data.finalValue = data.value;
					}
				}
			},
		],
	},
};
