import type { Access } from "payload";

// Super Admin - Full access to everything
export const superAdminAccess: Access = ({ req: { user } }) => {
	if (user?.role === "super-admin") {
		return true;
	}
	return false;
};

// Admin - Access within their university
export const adminAccess: Access = ({ req: { user } }) => {
	if (user?.role === "admin" && user?.university) {
		return {
			university: {
				equals: user.university,
			},
		};
	}
	return false;
};

// Rector/Dean - Read access to their scope
export const rectorDeanAccess: Access = ({ req: { user } }) => {
	if (user?.role === "rector-dean") {
		const where: any = {};

		if (user.university) {
			where.university = { equals: user.university };
		}
		if (user.faculty) {
			where.faculty = { equals: user.faculty };
		}

		return where;
	}
	return false;
};

// Faculty Staff - Access within their faculty
export const facultyStaffAccess: Access = ({ req: { user } }) => {
	if (user?.role === "faculty-staff" && user?.faculty) {
		return {
			faculty: {
				equals: user.faculty,
			},
		};
	}
	return false;
};

// Department Staff - Access within their department
export const departmentStaffAccess: Access = ({ req: { user } }) => {
	if (user?.role === "department-staff" && user?.department) {
		return {
			department: {
				equals: user.department,
			},
		};
	}
	return false;
};

// Professor - Access to their courses
export const professorAccess: Access = ({ req: { user } }) => {
	if (user?.role === "professor") {
		return {
			professors: {
				contains: user.id,
			},
		};
	}
	return false;
};

// Assistant - Access to assigned assessments
export const assistantAccess: Access = ({ req: { user } }) => {
	if (user?.role === "assistant") {
		return {
			assistants: {
				contains: user.id,
			},
		};
	}
	return false;
};

// Student - Access to their own data
export const studentAccess: Access = ({ req: { user } }) => {
	if (user?.role === "student") {
		return {
			student: {
				equals: user.id,
			},
		};
	}
	return false;
};

// Combined access for multiple roles
export const multiRoleAccess = (...accessFunctions: Access[]): Access => {
	return ({ req, ...args }) => {
		for (const accessFn of accessFunctions) {
			const result = accessFn({ req, ...args });
			if (result !== false) {
				return result;
			}
		}
		return false;
	};
};

// University-scoped access
export const universityScopedAccess: Access = ({ req: { user } }) => {
	if (user?.university) {
		return {
			university: {
				equals: user.university,
			},
		};
	}
	return false;
};

// Faculty-scoped access
export const facultyScopedAccess: Access = ({ req: { user } }) => {
	if (user?.faculty) {
		return {
			faculty: {
				equals: user.faculty,
			},
		};
	}
	return false;
};

// Department-scoped access
export const departmentScopedAccess: Access = ({ req: { user } }) => {
	if (user?.department) {
		return {
			department: {
				equals: user.department,
			},
		};
	}
	return false;
};
