import type { CollectionConfig } from "payload";
import { authenticated } from "../../access/authenticated";
import {
	adminAccess,
	facultyStaffAccess,
	multiRoleAccess,
	superAdminAccess,
} from "../../access/campusnet";

export const Faculty: CollectionConfig = {
	slug: "faculties",
	access: {
		admin: authenticated,
		create: multiRoleAccess(superAdminAccess, adminAccess),
		delete: superAdminAccess,
		read: authenticated,
		update: multiRoleAccess(
			superAdminAccess,
			adminAccess,
			facultyStaffAccess,
		),
	},
	admin: {
		defaultColumns: ["name", "code", "university"],
		useAsTitle: "name",
	},
	fields: [
		{
			name: "university",
			type: "relationship",
			relationTo: "universities",
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
			name: "dean",
			type: "relationship",
			relationTo: "users",
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
