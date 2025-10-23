/**
 * Comprehensive Grading Scale Configuration
 *
 * This file contains the default grading scale configuration for the Campusnet system.
 * It includes percentages, 20-point scores, letter grades, and recognition levels
 * in both English and Latin.
 */

export interface GradeMapping {
	minPercentage: number;
	maxPercentage: number;
	minScore: number;
	maxScore: number;
	letterGrade: string;
	numericGrade: number;
	isPassing: boolean;
	description: string;
	englishRecognition: string;
	latinRecognition: string;
}

export interface GradingScaleConfig {
	name: string;
	description: string;
	scaleType: string;
	passThreshold: number;
	gradeMappings: GradeMapping[];
	isActive: boolean;
}

/**
 * Default comprehensive grading scale for the Campusnet system
 *
 * This grading scale includes:
 * - Percentages (0-100%)
 * - 20-point scores (0-20 points)
 * - Letter grades (A+ to F)
 * - Recognition levels in English and Latin
 */
export const DEFAULT_GRADING_SCALE: GradingScaleConfig = {
	name: "Comprehensive Grading Scale",
	description:
		"Comprehensive grading scale with percentages, 20-point scores, letter grades, and recognition levels",
	scaleType: "numeric-100",
	passThreshold: 50,
	gradeMappings: [
		{
			minPercentage: 95,
			maxPercentage: 100,
			minScore: 19,
			maxScore: 20,
			letterGrade: "A+",
			numericGrade: 4.0,
			isPassing: true,
			description: "Outstanding",
			englishRecognition: "Distinction",
			latinRecognition: "Summa Cum Laude",
		},
		{
			minPercentage: 90,
			maxPercentage: 94,
			minScore: 18,
			maxScore: 18,
			letterGrade: "A",
			numericGrade: 3.7,
			isPassing: true,
			description: "Excellent",
			englishRecognition: "High Distinction",
			latinRecognition: "Magna Cum Laude",
		},
		{
			minPercentage: 85,
			maxPercentage: 89,
			minScore: 17,
			maxScore: 17,
			letterGrade: "A-",
			numericGrade: 3.3,
			isPassing: true,
			description: "Very Good",
			englishRecognition: "Distinction",
			latinRecognition: "Cum Laude",
		},
		{
			minPercentage: 80,
			maxPercentage: 84,
			minScore: 16,
			maxScore: 16,
			letterGrade: "B+",
			numericGrade: 3.0,
			isPassing: true,
			description: "Good",
			englishRecognition: "Merit",
			latinRecognition: "Bene Meritus",
		},
		{
			minPercentage: 75,
			maxPercentage: 79,
			minScore: 15,
			maxScore: 15,
			letterGrade: "B",
			numericGrade: 2.7,
			isPassing: true,
			description: "Above Average",
			englishRecognition: "Satisfactory",
			latinRecognition: "Satisfecit",
		},
		{
			minPercentage: 70,
			maxPercentage: 74,
			minScore: 14,
			maxScore: 14,
			letterGrade: "B-",
			numericGrade: 2.3,
			isPassing: true,
			description: "Average",
			englishRecognition: "Pass",
			latinRecognition: "Probatus",
		},
		{
			minPercentage: 65,
			maxPercentage: 69,
			minScore: 13,
			maxScore: 13,
			letterGrade: "C+",
			numericGrade: 2.0,
			isPassing: true,
			description: "Below Average",
			englishRecognition: "Pass",
			latinRecognition: "Probatus",
		},
		{
			minPercentage: 60,
			maxPercentage: 64,
			minScore: 12,
			maxScore: 12,
			letterGrade: "C",
			numericGrade: 1.7,
			isPassing: true,
			description: "Satisfactory",
			englishRecognition: "Pass",
			latinRecognition: "Probatus",
		},
		{
			minPercentage: 55,
			maxPercentage: 59,
			minScore: 11,
			maxScore: 11,
			letterGrade: "C-",
			numericGrade: 1.3,
			isPassing: true,
			description: "Minimum Pass",
			englishRecognition: "Pass",
			latinRecognition: "Probatus",
		},
		{
			minPercentage: 50,
			maxPercentage: 54,
			minScore: 10,
			maxScore: 10,
			letterGrade: "D",
			numericGrade: 1.0,
			isPassing: true,
			description: "Conditional Pass",
			englishRecognition: "Conditional Pass",
			latinRecognition: "Sub Conditione",
		},
		{
			minPercentage: 0,
			maxPercentage: 49,
			minScore: 0,
			maxScore: 9,
			letterGrade: "F",
			numericGrade: 0.0,
			isPassing: false,
			description: "Fail",
			englishRecognition: "Fail",
			latinRecognition: "Non Probatus",
		},
	],
	isActive: true,
};

/**
 * Utility functions for working with the grading scale
 */
export namespace GradingScaleUtils {
	/**
	 * Get the grade mapping for a given percentage score
	 */
	export function getGradeByPercentage(
		percentage: number,
	): GradeMapping | null {
		return (
			DEFAULT_GRADING_SCALE.gradeMappings.find(
				(mapping) =>
					percentage >= mapping.minPercentage &&
					percentage <= mapping.maxPercentage,
			) || null
		);
	}

	/**
	 * Get the grade mapping for a given 20-point score
	 */
	export function getGradeByScore(
		score: number,
		maxScore: number = 20,
	): GradeMapping | null {
		const percentage = (score / maxScore) * 100;
		return GradingScaleUtils.getGradeByPercentage(percentage);
	}

	/**
	 * Convert a raw score to percentage
	 */
	export function scoreToPercentage(
		score: number,
		maxScore: number = 20,
	): number {
		return (score / maxScore) * 100;
	}

	/**
	 * Convert a percentage to raw score
	 */
	export function percentageToScore(
		percentage: number,
		maxScore: number = 20,
	): number {
		return (percentage / 100) * maxScore;
	}

	/**
	 * Get all passing grades
	 */
	export function getPassingGrades(): GradeMapping[] {
		return DEFAULT_GRADING_SCALE.gradeMappings.filter(
			(mapping) => mapping.isPassing,
		);
	}

	/**
	 * Get all failing grades
	 */
	export function getFailingGrades(): GradeMapping[] {
		return DEFAULT_GRADING_SCALE.gradeMappings.filter(
			(mapping) => !mapping.isPassing,
		);
	}

	/**
	 * Get grades by recognition level
	 */
	export function getGradesByRecognition(
		recognition: string,
	): GradeMapping[] {
		return DEFAULT_GRADING_SCALE.gradeMappings.filter(
			(mapping) =>
				mapping.englishRecognition === recognition ||
				mapping.latinRecognition === recognition,
		);
	}
}

/**
 * Export the grading scale configuration for use in other parts of the system
 */
export default DEFAULT_GRADING_SCALE;
