import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// User Store
interface User {
	id: string;
	name: string;
	email: string;
	role:
		| "student"
		| "professor"
		| "admin"
		| "faculty-staff"
		| "department-staff";
	university?: string;
	faculty?: string;
	department?: string;
	program?: string;
	avatar?: string;
}

interface UserState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (user: User) => void;
	logout: () => void;
	updateUser: (updates: Partial<User>) => void;
	setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>()(
	devtools(
		persist(
			immer((set) => ({
				user: null,
				isAuthenticated: false,
				isLoading: false,
				login: (user) =>
					set((state) => {
						state.user = user;
						state.isAuthenticated = true;
						state.isLoading = false;
					}),
				logout: () =>
					set((state) => {
						state.user = null;
						state.isAuthenticated = false;
						state.isLoading = false;
					}),
				updateUser: (updates) =>
					set((state) => {
						if (state.user) {
							Object.assign(state.user, updates);
						}
					}),
				setLoading: (loading) =>
					set((state) => {
						state.isLoading = loading;
					}),
			})),
			{
				name: "user-storage",
				partialize: (state) => ({
					user: state.user,
					isAuthenticated: state.isAuthenticated,
				}),
			},
		),
		{ name: "user-store" },
	),
);

// UI Store
interface UIState {
	theme: "light" | "dark" | "system";
	sidebarOpen: boolean;
	mobileMenuOpen: boolean;
	notifications: Notification[];
	modals: Record<string, boolean>;
	setTheme: (theme: "light" | "dark" | "system") => void;
	toggleSidebar: () => void;
	toggleMobileMenu: () => void;
	addNotification: (notification: Omit<Notification, "id">) => void;
	removeNotification: (id: string) => void;
	clearNotifications: () => void;
	openModal: (modalId: string) => void;
	closeModal: (modalId: string) => void;
	closeAllModals: () => void;
}

interface Notification {
	id: string;
	type: "success" | "error" | "warning" | "info";
	title: string;
	message: string;
	duration?: number;
	action?: {
		label: string;
		onClick: () => void;
	};
}

export const useUIStore = create<UIState>()(
	devtools(
		persist(
			immer((set) => ({
				theme: "system",
				sidebarOpen: true,
				mobileMenuOpen: false,
				notifications: [],
				modals: {},
				setTheme: (theme) =>
					set((state) => {
						state.theme = theme;
					}),
				toggleSidebar: () =>
					set((state) => {
						state.sidebarOpen = !state.sidebarOpen;
					}),
				toggleMobileMenu: () =>
					set((state) => {
						state.mobileMenuOpen = !state.mobileMenuOpen;
					}),
				addNotification: (notification) =>
					set((state) => {
						const id = Math.random().toString(36).substr(2, 9);
						state.notifications.push({
							...notification,
							id,
							duration: notification.duration || 5000,
						});
					}),
				removeNotification: (id) =>
					set((state) => {
						state.notifications = state.notifications.filter(
							(n) => n.id !== id,
						);
					}),
				clearNotifications: () =>
					set((state) => {
						state.notifications = [];
					}),
				openModal: (modalId) =>
					set((state) => {
						state.modals[modalId] = true;
					}),
				closeModal: (modalId) =>
					set((state) => {
						state.modals[modalId] = false;
					}),
				closeAllModals: () =>
					set((state) => {
						state.modals = {};
					}),
			})),
			{
				name: "ui-storage",
				partialize: (state) => ({ theme: state.theme }),
			},
		),
		{ name: "ui-store" },
	),
);

// Academic Store
interface Course {
	id: string;
	name: string;
	code: string;
	credits: number;
	description: string;
	professor: string;
	schedule: {
		days: string[];
		startTime: string;
		endTime: string;
		room: string;
	};
}

interface Grade {
	id: string;
	courseId: string;
	courseName: string;
	grade: string;
	percentage: number;
	semester: string;
	year: string;
}

interface AcademicState {
	courses: Course[];
	grades: Grade[];
	gpa: number;
	currentSemester: string;
	isLoading: boolean;
	setCourses: (courses: Course[]) => void;
	setGrades: (grades: Grade[]) => void;
	calculateGPA: () => void;
	setCurrentSemester: (semester: string) => void;
	setLoading: (loading: boolean) => void;
	addCourse: (course: Course) => void;
	updateCourse: (id: string, updates: Partial<Course>) => void;
	removeCourse: (id: string) => void;
}

export const useAcademicStore = create<AcademicState>()(
	devtools(
		persist(
			immer((set, get) => ({
				courses: [],
				grades: [],
				gpa: 0,
				currentSemester: "Fall 2024",
				isLoading: false,
				setCourses: (courses) =>
					set((state) => {
						state.courses = courses;
					}),
				setGrades: (grades) =>
					set((state) => {
						state.grades = grades;
						// Recalculate GPA when grades change
						const gpa =
							grades.reduce((sum, grade) => {
								const gradePoints = getGradePoints(grade.grade);
								return sum + gradePoints;
							}, 0) / grades.length;
						state.gpa = isNaN(gpa) ? 0 : gpa;
					}),
				calculateGPA: () =>
					set((state) => {
						const gpa =
							state.grades.reduce((sum, grade) => {
								const gradePoints = getGradePoints(grade.grade);
								return sum + gradePoints;
							}, 0) / state.grades.length;
						state.gpa = isNaN(gpa) ? 0 : gpa;
					}),
				setCurrentSemester: (semester) =>
					set((state) => {
						state.currentSemester = semester;
					}),
				setLoading: (loading) =>
					set((state) => {
						state.isLoading = loading;
					}),
				addCourse: (course) =>
					set((state) => {
						state.courses.push(course);
					}),
				updateCourse: (id, updates) =>
					set((state) => {
						const courseIndex = state.courses.findIndex(
							(c) => c.id === id,
						);
						if (courseIndex !== -1) {
							Object.assign(state.courses[courseIndex], updates);
						}
					}),
				removeCourse: (id) =>
					set((state) => {
						state.courses = state.courses.filter(
							(c) => c.id !== id,
						);
					}),
			})),
			{
				name: "academic-storage",
			},
		),
		{ name: "academic-store" },
	),
);

// Helper function for GPA calculation
const getGradePoints = (grade: string): number => {
	const gradeMap: Record<string, number> = {
		"A+": 4.0,
		A: 4.0,
		"A-": 3.7,
		"B+": 3.3,
		B: 3.0,
		"B-": 2.7,
		"C+": 2.3,
		C: 2.0,
		"C-": 1.7,
		"D+": 1.3,
		D: 1.0,
		F: 0.0,
	};
	return gradeMap[grade] || 0;
};

// Form Store
interface FormState {
	forms: Record<string, any>;
	setFormData: (formId: string, data: any) => void;
	getFormData: (formId: string) => any;
	clearForm: (formId: string) => void;
	clearAllForms: () => void;
}

export const useFormStore = create<FormState>()(
	devtools(
		immer((set, get) => ({
			forms: {},
			setFormData: (formId, data) =>
				set((state) => {
					state.forms[formId] = data;
				}),
			getFormData: (formId) => {
				return get().forms[formId] || {};
			},
			clearForm: (formId) =>
				set((state) => {
					delete state.forms[formId];
				}),
			clearAllForms: () =>
				set((state) => {
					state.forms = {};
				}),
		})),
		{ name: "form-store" },
	),
);

// Analytics Store
interface AnalyticsState {
	pageViews: Record<string, number>;
	userInteractions: Array<{
		id: string;
		type: string;
		timestamp: Date;
		data: any;
	}>;
	trackPageView: (page: string) => void;
	trackInteraction: (type: string, data: any) => void;
	getPageViews: (page?: string) => number;
	getInteractionCount: (type?: string) => number;
}

export const useAnalyticsStore = create<AnalyticsState>()(
	devtools(
		persist(
			immer((set, get) => ({
				pageViews: {},
				userInteractions: [],
				trackPageView: (page) =>
					set((state) => {
						state.pageViews[page] =
							(state.pageViews[page] || 0) + 1;
					}),
				trackInteraction: (type, data) =>
					set((state) => {
						state.userInteractions.push({
							id: Math.random().toString(36).substr(2, 9),
							type,
							timestamp: new Date(),
							data,
						});
					}),
				getPageViews: (page) => {
					const state = get();
					return page
						? state.pageViews[page] || 0
						: Object.values(state.pageViews).reduce(
								(sum, views) => sum + views,
								0,
							);
				},
				getInteractionCount: (type) => {
					const state = get();
					return type
						? state.userInteractions.filter((i) => i.type === type)
								.length
						: state.userInteractions.length;
				},
			})),
			{
				name: "analytics-storage",
				partialize: (state) => ({ pageViews: state.pageViews }),
			},
		),
		{ name: "analytics-store" },
	),
);

// Combined Store Hook
export const useAppStore = () => {
	const user = useUserStore();
	const ui = useUIStore();
	const academic = useAcademicStore();
	const forms = useFormStore();
	const analytics = useAnalyticsStore();

	return {
		user,
		ui,
		academic,
		forms,
		analytics,
	};
};
