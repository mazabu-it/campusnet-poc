"use client";

import { Icon } from "@iconify/react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalyticsStore } from "@/stores/app-store";

interface ErrorBoundaryState {
	hasError: boolean;
	error?: Error;
	errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
	children: React.ReactNode;
	fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("ErrorBoundary caught an error:", error, errorInfo);

		// Track error in analytics
		if (typeof window !== "undefined") {
			try {
				const analytics = useAnalyticsStore.getState();
				analytics.trackInteraction("error", {
					error: error.message,
					stack: error.stack,
					componentStack: errorInfo.componentStack,
					timestamp: new Date().toISOString(),
					url: window.location.href,
					userAgent: navigator.userAgent,
				});
			} catch (analyticsError) {
				console.error("Failed to track error:", analyticsError);
			}
		}

		// Report error to external service in production
		if (process.env.NODE_ENV === "production") {
			this.reportError(error, errorInfo);
		}

		this.setState({ error, errorInfo });
	}

	private reportError = async (error: Error, errorInfo: React.ErrorInfo) => {
		try {
			// In a real application, you would send this to an error reporting service
			// like Sentry, LogRocket, or Bugsnag
			const errorReport = {
				message: error.message,
				stack: error.stack,
				componentStack: errorInfo.componentStack,
				timestamp: new Date().toISOString(),
				url:
					typeof window !== "undefined"
						? window.location.href
						: "unknown",
				userAgent:
					typeof window !== "undefined"
						? navigator.userAgent
						: "unknown",
				userId:
					typeof window !== "undefined"
						? localStorage.getItem("userId")
						: null,
			};

			// Example: Send to your error reporting endpoint
			// await fetch('/api/errors', {
			//   method: 'POST',
			//   headers: { 'Content-Type': 'application/json' },
			//   body: JSON.stringify(errorReport),
			// });

			console.log("Error reported:", errorReport);
		} catch (reportError) {
			console.error("Failed to report error:", reportError);
		}
	};

	resetError = () => {
		this.setState({
			hasError: false,
			error: undefined,
			errorInfo: undefined,
		});
	};

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				const FallbackComponent = this.props.fallback;
				return (
					<FallbackComponent
						error={this.state.error!}
						resetError={this.resetError}
					/>
				);
			}

			return (
				<DefaultErrorFallback
					error={this.state.error!}
					resetError={this.resetError}
				/>
			);
		}

		return this.props.children;
	}
}

interface ErrorFallbackProps {
	error: Error;
	resetError: () => void;
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({
	error,
	resetError,
}) => {
	const [showDetails, setShowDetails] = React.useState(false);
	const [isReporting, setIsReporting] = React.useState(false);

	const handleReportError = async () => {
		setIsReporting(true);
		try {
			// In a real application, you would send this to your error reporting service
			await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
			console.log("Error reported to support team");
		} catch (reportError) {
			console.error("Failed to report error:", reportError);
		} finally {
			setIsReporting(false);
		}
	};

	const getErrorType = (error: Error): string => {
		if (error.message.includes("Network")) return "Network Error";
		if (error.message.includes("404")) return "Page Not Found";
		if (error.message.includes("500")) return "Server Error";
		if (error.message.includes("ChunkLoadError")) return "Loading Error";
		return "Application Error";
	};

	const errorType = getErrorType(error);

	return (
		<motion.div
			className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-red-50 p-4"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
		>
			<Card className="w-full max-w-lg shadow-xl">
				<CardHeader className="text-center">
					<motion.div
						className="mx-auto mb-4 w-20 h-20 bg-red-100 rounded-full flex items-center justify-center"
						animate={{ rotate: [0, 10, -10, 0] }}
						transition={{ duration: 2, repeat: Infinity }}
					>
						<Icon
							icon="lucide:alert-triangle"
							className="text-3xl text-red-600"
						/>
					</motion.div>
					<CardTitle className="text-2xl font-bold text-gray-900 mb-2">
						Oops! Something went wrong
					</CardTitle>
					<Badge variant="destructive" className="w-fit mx-auto">
						{errorType}
					</Badge>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="text-center">
						<p className="text-gray-600 mb-2">
							We&apos;re sorry, but something unexpected happened.
						</p>
						<p className="text-sm text-gray-500">
							Error occurred at {format(new Date(), "PPpp")}
						</p>
					</div>

					{/* Error Message */}
					<div className="bg-red-50 border border-red-200 rounded-lg p-4">
						<div className="flex items-start space-x-3">
							<Icon
								icon="lucide:info"
								className="w-5 h-5 text-red-600 mt-0.5"
							/>
							<div>
								<p className="text-sm font-medium text-red-800">
									Error Details:
								</p>
								<p className="text-sm text-red-700 mt-1">
									{error.message}
								</p>
							</div>
						</div>
					</div>

					{/* Development Details */}
					{process.env.NODE_ENV === "development" && (
						<div className="space-y-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setShowDetails(!showDetails)}
								className="w-full"
							>
								<Icon
									icon={
										showDetails
											? "lucide:chevron-up"
											: "lucide:chevron-down"
									}
									className="w-4 h-4 mr-2"
								/>
								{showDetails ? "Hide" : "Show"} Technical
								Details
							</Button>
							{showDetails && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									className="bg-gray-100 p-3 rounded-md"
								>
									<pre className="text-xs text-gray-600 overflow-auto max-h-40">
										{error.message}
										{error.stack && `\n\n${error.stack}`}
									</pre>
								</motion.div>
							)}
						</div>
					)}

					{/* Action Buttons */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
						<Button onClick={resetError} className="sm:col-span-1">
							<Icon
								icon="lucide:refresh-cw"
								className="w-4 h-4 mr-2"
							/>
							Try Again
						</Button>
						<Button
							variant="outline"
							onClick={() => (window.location.href = "/")}
							className="sm:col-span-1"
						>
							<Icon icon="lucide:home" className="w-4 h-4 mr-2" />
							Go Home
						</Button>
						<Button
							variant="outline"
							onClick={handleReportError}
							disabled={isReporting}
							className="sm:col-span-1"
						>
							<Icon
								icon={
									isReporting
										? "lucide:loader-2"
										: "lucide:bug"
								}
								className={`w-4 h-4 mr-2 ${isReporting ? "animate-spin" : ""}`}
							/>
							{isReporting ? "Reporting..." : "Report Bug"}
						</Button>
					</div>

					{/* Support Information */}
					<div className="text-center pt-4 border-t">
						<p className="text-sm text-gray-500 mb-2">
							Need help? Contact our support team:
						</p>
						<div className="flex justify-center space-x-4 text-sm">
							<a
								href="mailto:support@demouniversity.edu"
								className="text-blue-600 hover:underline"
							>
								<Icon
									icon="lucide:mail"
									className="w-4 h-4 inline mr-1"
								/>
								support@demouniversity.edu
							</a>
							<a
								href="tel:+15551234567"
								className="text-blue-600 hover:underline"
							>
								<Icon
									icon="lucide:phone"
									className="w-4 h-4 inline mr-1"
								/>
								(555) 123-4567
							</a>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

// Hook for functional components
export const useErrorHandler = () => {
	const [error, setError] = React.useState<Error | null>(null);

	const resetError = React.useCallback(() => {
		setError(null);
	}, []);

	const captureError = React.useCallback((error: Error) => {
		console.error("Captured error:", error);
		setError(error);
	}, []);

	React.useEffect(() => {
		if (error) {
			throw error;
		}
	}, [error]);

	return { captureError, resetError };
};

// Higher-order component for error handling
export const withErrorBoundary = <P extends object>(
	Component: React.ComponentType<P>,
	fallback?: React.ComponentType<{ error: Error; resetError: () => void }>,
) => {
	const WrappedComponent = (props: P) => (
		<ErrorBoundary fallback={fallback}>
			<Component {...props} />
		</ErrorBoundary>
	);

	WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

	return WrappedComponent;
};
