import {
	addDays,
	addMonths,
	addWeeks,
	addYears,
	closestTo,
	differenceInDays,
	differenceInHours,
	differenceInMinutes,
	differenceInMonths,
	differenceInSeconds,
	differenceInWeeks,
	differenceInYears,
	eachDayOfInterval,
	eachMonthOfInterval,
	eachQuarterOfInterval,
	eachWeekOfInterval,
	eachYearOfInterval,
	endOfDay,
	endOfMonth,
	endOfWeek,
	endOfYear,
	format,
	formatDistance,
	formatRelative,
	getDay,
	getDayOfYear,
	getDaysInMonth,
	getDaysInYear,
	getMonth,
	getQuarter,
	getWeek,
	getWeekOfMonth,
	getYear,
	isAfter,
	isBefore,
	isLeapYear,
	isSameDay,
	isSameMonth,
	isSameYear,
	isValid,
	isWeekend,
	isWithinInterval,
	max,
	min,
	parseISO,
	setDay,
	setHours,
	setMilliseconds,
	setMinutes,
	setMonth,
	setQuarter,
	setSeconds,
	setWeek,
	setYear,
	startOfDay,
	startOfMonth,
	startOfWeek,
	startOfYear,
	subDays,
	subMonths,
	subWeeks,
	subYears,
} from "date-fns";

// Date formatting utilities
export const formatDate = {
	// Basic formats
	short: (date: Date | string) =>
		format(parseISO(date.toString()), "MMM dd, yyyy"),
	long: (date: Date | string) =>
		format(parseISO(date.toString()), "MMMM dd, yyyy"),
	full: (date: Date | string) =>
		format(parseISO(date.toString()), "EEEE, MMMM dd, yyyy"),

	// Time formats
	time: (date: Date | string) => format(parseISO(date.toString()), "h:mm a"),
	time24: (date: Date | string) => format(parseISO(date.toString()), "HH:mm"),
	datetime: (date: Date | string) =>
		format(parseISO(date.toString()), "MMM dd, yyyy h:mm a"),

	// Academic formats
	semester: (date: Date | string) => {
		const d = parseISO(date.toString());
		const month = getMonth(d);
		const year = getYear(d);

		if (month >= 0 && month <= 4) return `Spring ${year}`;
		if (month >= 5 && month <= 7) return `Summer ${year}`;
		return `Fall ${year}`;
	},

	academicYear: (date: Date | string) => {
		const d = parseISO(date.toString());
		const year = getYear(d);
		const month = getMonth(d);

		if (month >= 8) return `${year}-${year + 1}`;
		return `${year - 1}-${year}`;
	},

	// Relative formats
	relative: (date: Date | string) =>
		formatRelative(parseISO(date.toString()), new Date()),
	distance: (date: Date | string) =>
		formatDistance(parseISO(date.toString()), new Date(), {
			addSuffix: true,
		}),

	// Custom formats
	custom: (date: Date | string, formatString: string) =>
		format(parseISO(date.toString()), formatString),
};

// Date validation utilities
export const validateDate = {
	isValid: (date: Date | string) => {
		try {
			return isValid(parseISO(date.toString()));
		} catch {
			return false;
		}
	},

	isFuture: (date: Date | string) =>
		isAfter(parseISO(date.toString()), new Date()),
	isPast: (date: Date | string) =>
		isBefore(parseISO(date.toString()), new Date()),
	isToday: (date: Date | string) =>
		isSameDay(parseISO(date.toString()), new Date()),
	isThisMonth: (date: Date | string) =>
		isSameMonth(parseISO(date.toString()), new Date()),
	isThisYear: (date: Date | string) =>
		isSameYear(parseISO(date.toString()), new Date()),

	isWeekend: (date: Date | string) => isWeekend(parseISO(date.toString())),
	isLeapYear: (date: Date | string) => isLeapYear(parseISO(date.toString())),
};

// Date manipulation utilities
export const manipulateDate = {
	add: {
		days: (date: Date | string, amount: number) =>
			addDays(parseISO(date.toString()), amount),
		weeks: (date: Date | string, amount: number) =>
			addWeeks(parseISO(date.toString()), amount),
		months: (date: Date | string, amount: number) =>
			addMonths(parseISO(date.toString()), amount),
		years: (date: Date | string, amount: number) =>
			addYears(parseISO(date.toString()), amount),
	},

	subtract: {
		days: (date: Date | string, amount: number) =>
			subDays(parseISO(date.toString()), amount),
		weeks: (date: Date | string, amount: number) =>
			subWeeks(parseISO(date.toString()), amount),
		months: (date: Date | string, amount: number) =>
			subMonths(parseISO(date.toString()), amount),
		years: (date: Date | string, amount: number) =>
			subYears(parseISO(date.toString()), amount),
	},

	set: {
		day: (date: Date | string, day: number) =>
			setDay(parseISO(date.toString()), day),
		month: (date: Date | string, month: number) =>
			setMonth(parseISO(date.toString()), month),
		year: (date: Date | string, year: number) =>
			setYear(parseISO(date.toString()), year),
		quarter: (date: Date | string, quarter: number) =>
			setQuarter(parseISO(date.toString()), quarter),
		week: (date: Date | string, week: number) =>
			setWeek(parseISO(date.toString()), week),
		hours: (date: Date | string, hours: number) =>
			setHours(parseISO(date.toString()), hours),
		minutes: (date: Date | string, minutes: number) =>
			setMinutes(parseISO(date.toString()), minutes),
		seconds: (date: Date | string, seconds: number) =>
			setSeconds(parseISO(date.toString()), seconds),
	},
};

// Date range utilities
export const dateRange = {
	startOf: {
		day: (date: Date | string) => startOfDay(parseISO(date.toString())),
		week: (date: Date | string) => startOfWeek(parseISO(date.toString())),
		month: (date: Date | string) => startOfMonth(parseISO(date.toString())),
		year: (date: Date | string) => startOfYear(parseISO(date.toString())),
	},

	endOf: {
		day: (date: Date | string) => endOfDay(parseISO(date.toString())),
		week: (date: Date | string) => endOfWeek(parseISO(date.toString())),
		month: (date: Date | string) => endOfMonth(parseISO(date.toString())),
		year: (date: Date | string) => endOfYear(parseISO(date.toString())),
	},

	isWithin: (date: Date | string, start: Date | string, end: Date | string) =>
		isWithinInterval(parseISO(date.toString()), {
			start: parseISO(start.toString()),
			end: parseISO(end.toString()),
		}),

	eachDay: (start: Date | string, end: Date | string) =>
		eachDayOfInterval({
			start: parseISO(start.toString()),
			end: parseISO(end.toString()),
		}),

	eachWeek: (start: Date | string, end: Date | string) =>
		eachWeekOfInterval({
			start: parseISO(start.toString()),
			end: parseISO(end.toString()),
		}),

	eachMonth: (start: Date | string, end: Date | string) =>
		eachMonthOfInterval({
			start: parseISO(start.toString()),
			end: parseISO(end.toString()),
		}),

	eachYear: (start: Date | string, end: Date | string) =>
		eachYearOfInterval({
			start: parseISO(start.toString()),
			end: parseISO(end.toString()),
		}),
};

// Date difference utilities
export const dateDifference = {
	days: (date1: Date | string, date2: Date | string) =>
		differenceInDays(
			parseISO(date1.toString()),
			parseISO(date2.toString()),
		),

	weeks: (date1: Date | string, date2: Date | string) =>
		differenceInWeeks(
			parseISO(date1.toString()),
			parseISO(date2.toString()),
		),

	months: (date1: Date | string, date2: Date | string) =>
		differenceInMonths(
			parseISO(date1.toString()),
			parseISO(date2.toString()),
		),

	years: (date1: Date | string, date2: Date | string) =>
		differenceInYears(
			parseISO(date1.toString()),
			parseISO(date2.toString()),
		),

	hours: (date1: Date | string, date2: Date | string) =>
		differenceInHours(
			parseISO(date1.toString()),
			parseISO(date2.toString()),
		),

	minutes: (date1: Date | string, date2: Date | string) =>
		differenceInMinutes(
			parseISO(date1.toString()),
			parseISO(date2.toString()),
		),

	seconds: (date1: Date | string, date2: Date | string) =>
		differenceInSeconds(
			parseISO(date1.toString()),
			parseISO(date2.toString()),
		),
};

// Date information utilities
export const dateInfo = {
	day: (date: Date | string) => getDay(parseISO(date.toString())),
	month: (date: Date | string) => getMonth(parseISO(date.toString())),
	year: (date: Date | string) => getYear(parseISO(date.toString())),
	quarter: (date: Date | string) => getQuarter(parseISO(date.toString())),
	week: (date: Date | string) => getWeek(parseISO(date.toString())),
	weekOfMonth: (date: Date | string) =>
		getWeekOfMonth(parseISO(date.toString())),
	dayOfYear: (date: Date | string) => getDayOfYear(parseISO(date.toString())),
	daysInMonth: (date: Date | string) =>
		getDaysInMonth(parseISO(date.toString())),
	daysInYear: (date: Date | string) =>
		getDaysInYear(parseISO(date.toString())),
};

// Academic calendar utilities
export const academicCalendar = {
	getCurrentSemester: () => {
		const now = new Date();
		const month = getMonth(now);
		const year = getYear(now);

		if (month >= 0 && month <= 4) return `Spring ${year}`;
		if (month >= 5 && month <= 7) return `Summer ${year}`;
		return `Fall ${year}`;
	},

	getCurrentAcademicYear: () => {
		const now = new Date();
		const year = getYear(now);
		const month = getMonth(now);

		if (month >= 8) return `${year}-${year + 1}`;
		return `${year - 1}-${year}`;
	},

	getSemesterStart: (semester: string, year: number) => {
		const semesterMap: Record<string, number> = {
			Spring: 0, // January
			Summer: 5, // June
			Fall: 8, // September
		};

		const month = semesterMap[semester] || 8;
		return new Date(year, month, 1);
	},

	getSemesterEnd: (semester: string, year: number) => {
		const semesterMap: Record<string, number> = {
			Spring: 4, // May
			Summer: 7, // August
			Fall: 11, // December
		};

		const month = semesterMap[semester] || 11;
		const daysInMonth = getDaysInMonth(new Date(year, month));
		return new Date(year, month, daysInMonth);
	},

	isWithinSemester: (date: Date | string, semester: string, year: number) => {
		const start = academicCalendar.getSemesterStart(semester, year);
		const end = academicCalendar.getSemesterEnd(semester, year);
		return dateRange.isWithin(date, start, end);
	},
};

// Utility functions
export const dateUtils = {
	min: (...dates: (Date | string)[]) =>
		min(dates.map((d) => parseISO(d.toString()))),
	max: (...dates: (Date | string)[]) =>
		max(dates.map((d) => parseISO(d.toString()))),
	closest: (dateToCompare: Date | string, datesArray: (Date | string)[]) =>
		closestTo(
			parseISO(dateToCompare.toString()),
			datesArray.map((d) => parseISO(d.toString())),
		),

	parse: (dateString: string) => parseISO(dateString),
	now: () => new Date(),
	today: () => startOfDay(new Date()),

	// Common date patterns
	patterns: {
		iso: "yyyy-MM-dd",
		us: "MM/dd/yyyy",
		eu: "dd/MM/yyyy",
		readable: "MMMM dd, yyyy",
		short: "MMM dd, yyyy",
		time: "h:mm a",
		datetime: "MMM dd, yyyy h:mm a",
	},
};

// Export all utilities as a single object
export const dateHelpers = {
	format: formatDate,
	validate: validateDate,
	manipulate: manipulateDate,
	range: dateRange,
	difference: dateDifference,
	info: dateInfo,
	academic: academicCalendar,
	utils: dateUtils,
};

export default dateHelpers;
