"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useAppStore } from "@/stores/app-store";

// API base URL
const API_BASE = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

// Query keys
export const queryKeys = {
	user: ["user"],
	courses: ["courses"],
	courseInstances: ["courseInstances"],
	enrollments: ["enrollments"],
	assessments: ["assessments"],
	scores: ["scores"],
	gradeAggregates: ["gradeAggregates"],
	studentEnrollments: (studentId: string) => [
		"enrollments",
		"student",
		studentId,
	],
	professorCourses: (professorId: string) => [
		"courseInstances",
		"professor",
		professorId,
	],
	courseGrades: (courseInstanceId: string) => [
		"gradeAggregates",
		"course",
		courseInstanceId,
	],
} as const;

// API functions
const api = {
	// User
	getUser: async (): Promise<any> => {
		const response = await fetch(`${API_BASE}/api/users/me`, {
			credentials: "include",
		});
		if (!response.ok) throw new Error("Failed to fetch user");
		return response.json();
	},

	// Courses
	getCourses: async (): Promise<any[]> => {
		const response = await fetch(`${API_BASE}/api/courses`, {
			credentials: "include",
		});
		if (!response.ok) throw new Error("Failed to fetch courses");
		const data = await response.json();
		return data.docs || [];
	},

	// Course Instances
	getCourseInstances: async (): Promise<any[]> => {
		const response = await fetch(`${API_BASE}/api/course-instances`, {
			credentials: "include",
		});
		if (!response.ok) throw new Error("Failed to fetch course instances");
		const data = await response.json();
		return data.docs || [];
	},

	// Enrollments
	getEnrollments: async (): Promise<any[]> => {
		const response = await fetch(`${API_BASE}/api/enrollments`, {
			credentials: "include",
		});
		if (!response.ok) throw new Error("Failed to fetch enrollments");
		const data = await response.json();
		return data.docs || [];
	},

	getStudentEnrollments: async (studentId: string): Promise<any[]> => {
		const response = await fetch(
			`${API_BASE}/api/enrollments?where[student][equals]=${studentId}`,
			{
				credentials: "include",
			},
		);
		if (!response.ok)
			throw new Error("Failed to fetch student enrollments");
		const data = await response.json();
		return data.docs || [];
	},

	// Assessments
	getAssessments: async (): Promise<any[]> => {
		const response = await fetch(`${API_BASE}/api/assessments`, {
			credentials: "include",
		});
		if (!response.ok) throw new Error("Failed to fetch assessments");
		const data = await response.json();
		return data.docs || [];
	},

	// Scores
	getScores: async (): Promise<any[]> => {
		const response = await fetch(`${API_BASE}/api/scores`, {
			credentials: "include",
		});
		if (!response.ok) throw new Error("Failed to fetch scores");
		const data = await response.json();
		return data.docs || [];
	},

	// Grade Aggregates
	getGradeAggregates: async (): Promise<any[]> => {
		const response = await fetch(`${API_BASE}/api/grade-aggregates`, {
			credentials: "include",
		});
		if (!response.ok) throw new Error("Failed to fetch grade aggregates");
		const data = await response.json();
		return data.docs || [];
	},

	// Mutations
	enrollStudent: async (data: {
		studentId: string;
		courseInstanceId: string;
	}) => {
		const response = await fetch(`${API_BASE}/api/enroll-student`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		if (!response.ok) throw new Error("Failed to enroll student");
		return response.json();
	},

	submitScore: async (data: {
		assessmentId: string;
		studentId: string;
		value: number;
		feedback?: string;
		notes?: string;
	}) => {
		const response = await fetch(`${API_BASE}/api/submit-score`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		if (!response.ok) throw new Error("Failed to submit score");
		return response.json();
	},

	calculateGrade: async (enrollmentId: string) => {
		const response = await fetch(
			`${API_BASE}/api/calculate-grade/${enrollmentId}`,
			{
				method: "POST",
			},
		);
		if (!response.ok) throw new Error("Failed to calculate grade");
		return response.json();
	},
};

// React Query hooks
export const useUser = () => {
	const { user } = useAppStore();
	const setUser = user.login;
	const logout = user.logout;
	const setAuthenticated = user.setLoading;

	const query = useQuery({
		queryKey: queryKeys.user,
		queryFn: api.getUser,
		retry: false,
	});

	React.useEffect(() => {
		if (query.data) {
			setUser(query.data.user);
			setAuthenticated(true);
		} else if (query.error) {
			logout();
			setAuthenticated(false);
		}
	}, [query.data, query.error, setUser, setAuthenticated, logout]);

	return query;
};

export const useCourses = () => {
	const { academic } = useAppStore();
	const setCourses = academic.setCourses;

	const query = useQuery({
		queryKey: queryKeys.courses,
		queryFn: api.getCourses,
	});

	React.useEffect(() => {
		if (query.data) {
			setCourses(query.data);
		}
	}, [query.data, setCourses]);

	return query;
};

export const useCourseInstances = () => {
	const { academic } = useAppStore();
	const setCourseInstances = academic.setCourses; // Using setCourses as placeholder

	const query = useQuery({
		queryKey: queryKeys.courseInstances,
		queryFn: api.getCourseInstances,
	});

	React.useEffect(() => {
		if (query.data) {
			setCourseInstances(query.data);
		}
	}, [query.data, setCourseInstances]);

	return query;
};

export const useEnrollments = () => {
	const { academic } = useAppStore();
	const _setEnrollments = academic.setGrades; // Using setGrades as placeholder

	return useQuery({
		queryKey: queryKeys.enrollments,
		queryFn: api.getEnrollments,
	});
};

export const useStudentEnrollments = (studentId: string) => {
	return useQuery({
		queryKey: queryKeys.studentEnrollments(studentId),
		queryFn: () => api.getStudentEnrollments(studentId),
		enabled: !!studentId,
	});
};

export const useAssessments = () => {
	const { academic } = useAppStore();
	const _setAssessments = academic.setGrades; // Using setGrades as placeholder

	return useQuery({
		queryKey: queryKeys.assessments,
		queryFn: api.getAssessments,
	});
};

export const useScores = () => {
	const { academic } = useAppStore();
	const _setScores = academic.setGrades; // Using setGrades as placeholder

	return useQuery({
		queryKey: queryKeys.scores,
		queryFn: api.getScores,
	});
};

export const useGradeAggregates = () => {
	const { academic } = useAppStore();
	const _setGradeAggregates = academic.setGrades; // Using setGrades as placeholder

	return useQuery({
		queryKey: queryKeys.gradeAggregates,
		queryFn: api.getGradeAggregates,
	});
};

// Mutation hooks
export const useEnrollStudent = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: api.enrollStudent,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.enrollments });
			queryClient.invalidateQueries({
				queryKey: queryKeys.courseInstances,
			});
		},
	});
};

export const useSubmitScore = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: api.submitScore,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.scores });
			queryClient.invalidateQueries({
				queryKey: queryKeys.gradeAggregates,
			});
		},
	});
};

export const useCalculateGrade = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: api.calculateGrade,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.gradeAggregates,
			});
		},
	});
};
