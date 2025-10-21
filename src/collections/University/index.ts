import type { CollectionConfig } from "payload";
import { authenticated } from "../../access/authenticated";
import {
	adminAccess,
	multiRoleAccess,
	superAdminAccess,
} from "../../access/campusnet";

export const University: CollectionConfig = {
	slug: "universities",
	access: {
		admin: authenticated,
		create: multiRoleAccess(superAdminAccess, adminAccess),
		delete: superAdminAccess,
		read: authenticated,
		update: multiRoleAccess(superAdminAccess, adminAccess),
	},
	admin: {
		defaultColumns: ["name", "code", "isActive"],
		useAsTitle: "name",
	},
	fields: [
		{
			name: "name",
			type: "text",
			required: true,
		},
		{
			name: "code",
			type: "text",
			required: true,
			unique: true,
		},
		{
			name: "description",
			type: "textarea",
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
			required: true,
		},
		{
			name: "timezone",
			type: "text",
			defaultValue: "Europe/Brussels",
			required: true,
		},
		{
			name: "gradingScale",
			type: "relationship",
			relationTo: "grading-scales",
			required: true,
		},
		{
			name: "academicCalendar",
			type: "relationship",
			relationTo: "academic-calendars",
			required: true,
		},
		{
			name: "configuration",
			type: "group",
			fields: [
				{
					name: "roundingRule",
					type: "select",
					dbName: "rounding_rule",
					options: [
						{ label: "Bankers Rounding", value: "bankers" },
						{ label: "Round Half Up", value: "round-half-up" },
						{ label: "Round Half Down", value: "round-half-down" },
					],
					defaultValue: "bankers",
				},
				{
					name: "decimalPrecision",
					type: "number",
					dbName: "decimal_prec",
					defaultValue: 2,
					min: 0,
					max: 4,
				},
				{
					name: "retakePolicy",
					type: "group",
					fields: [
						{
							name: "maxRetakes",
							type: "number",
							defaultValue: 2,
							min: 0,
						},
						{
							name: "weightReplacement",
							type: "select",
							dbName: "weight_repl",
							options: [
								{ label: "Replace Original", value: "replace" },
								{ label: "Average Both", value: "average" },
								{ label: "Best Score", value: "best" },
							],
							defaultValue: "replace",
						},
						{
							name: "capRule",
							type: "select",
							dbName: "cap_rule",
							options: [
								{ label: "No Cap", value: "none" },
								{ label: "Pass Grade Cap", value: "pass-cap" },
								{ label: "Maximum Grade Cap", value: "max-cap" },
							],
							defaultValue: "pass-cap",
						},
					],
				},
				{
					name: "assessmentWindows",
					type: "group",
					dbName: "assess_windows",
					fields: [
						{
							name: "defaultOpenDays",
							type: "number",
							dbName: "open_days",
							defaultValue: 7,
							min: 1,
						},
						{
							name: "defaultCloseDays",
							type: "number",
							dbName: "close_days",
							defaultValue: 14,
							min: 1,
						},
						{
							name: "lateEntryPolicy",
							type: "select",
							dbName: "late_policy",
							options: [
								{ label: "Allow Late Entry", value: "allow" },
								{ label: "Penalty for Late Entry", value: "penalty" },
								{ label: "No Late Entry", value: "deny" },
							],
							defaultValue: "allow",
						},
					],
				},
				{
					name: "reportSettings",
					type: "group",
					dbName: "report_settings",
					fields: [
						{
							name: "headerBranding",
							type: "upload",
							dbName: "header_brand",
							relationTo: "media",
						},
						{
							name: "footerText",
							type: "textarea",
							dbName: "footer_text",
						},
						{
							name: "signatureRequired",
							type: "checkbox",
							dbName: "sig_required",
							defaultValue: true,
						},
						{
							name: "watermarking",
							type: "checkbox",
							dbName: "watermark",
							defaultValue: false,
						},
						{
							name: "exportFormat",
							type: "select",
							dbName: "export_fmt",
							options: [
								{ label: "PDF", value: "pdf" },
								{ label: "PDF + Excel", value: "pdf-excel" },
							],
							defaultValue: "pdf",
						},
					],
				},
			],
		},
		{
			name: "isActive",
			type: "checkbox",
			defaultValue: true,
		},
		{
			name: "contactInfo",
			type: "group",
			fields: [
				{
					name: "address",
					type: "textarea",
				},
				{
					name: "phone",
					type: "text",
				},
				{
					name: "email",
					type: "email",
				},
				{
					name: "website",
					type: "text",
				},
			],
		},
	],
	timestamps: true,
};
