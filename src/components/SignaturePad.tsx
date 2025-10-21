"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import type React from "react";
import { useCallback, useRef, useState } from "react";
import SignaturePad from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SignaturePadComponentProps {
	onSave: (signatureData: string) => void;
	onClear: () => void;
	title?: string;
	description?: string;
	width?: number;
	height?: number;
}

export const SignaturePadComponent: React.FC<SignaturePadComponentProps> = ({
	onSave,
	onClear,
	title = "Digital Signature",
	description = "Please sign in the box below",
	width = 400,
	height = 200,
}) => {
	const signaturePadRef = useRef<SignaturePad>(null);
	const [isSigned, setIsSigned] = useState(false);

	const handleClear = useCallback(() => {
		if (signaturePadRef.current) {
			signaturePadRef.current.clear();
			setIsSigned(false);
			onClear();
		}
	}, [onClear]);

	const handleSave = useCallback(() => {
		if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
			const signatureData = signaturePadRef.current.toDataURL();
			setIsSigned(true);
			onSave(signatureData);
		}
	}, [onSave]);

	const handleBegin = useCallback(() => {
		setIsSigned(false);
	}, []);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<Card className="w-full max-w-md mx-auto">
				<CardHeader>
					<CardTitle className="flex items-center space-x-2">
						<Icon icon="lucide:pen-tool" className="w-5 h-5" />
						<span>{title}</span>
					</CardTitle>
					<p className="text-sm text-gray-600">{description}</p>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Signature Canvas */}
					<div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
						<SignaturePad
							ref={signaturePadRef}
							canvasProps={{
								width,
								height,
								className:
									"signature-canvas border border-gray-200 rounded bg-white",
							}}
							onBegin={handleBegin}
						/>
					</div>

					{/* Status Indicator */}
					<div className="flex items-center space-x-2">
						<Icon
							icon={
								isSigned
									? "lucide:check-circle"
									: "lucide:circle"
							}
							className={`w-4 h-4 ${isSigned ? "text-green-500" : "text-gray-400"}`}
						/>
						<span
							className={`text-sm ${isSigned ? "text-green-600" : "text-gray-500"}`}
						>
							{isSigned ? "Document signed" : "Please sign above"}
						</span>
					</div>

					{/* Action Buttons */}
					<div className="flex space-x-2">
						<Button
							variant="outline"
							onClick={handleClear}
							className="flex-1"
						>
							<Icon
								icon="lucide:trash-2"
								className="w-4 h-4 mr-2"
							/>
							Clear
						</Button>
						<Button
							onClick={handleSave}
							disabled={
								!signaturePadRef.current ||
								signaturePadRef.current.isEmpty()
							}
							className="flex-1"
						>
							<Icon icon="lucide:save" className="w-4 h-4 mr-2" />
							Save Signature
						</Button>
					</div>

					{/* Instructions */}
					<div className="text-xs text-gray-500 space-y-1">
						<p>• Use your mouse or touch to sign</p>
						<p>• Click &quot;Clear&quot; to start over</p>
						<p>• Click &quot;Save Signature&quot; when done</p>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

// Document Signing Component
interface DocumentSigningProps {
	documentTitle: string;
	documentContent: string;
	onSign: (signatureData: string) => void;
}

export const DocumentSigningComponent: React.FC<DocumentSigningProps> = ({
	documentTitle,
	documentContent,
	onSign,
}) => {
	const [currentStep, setCurrentStep] = useState<
		"review" | "sign" | "complete"
	>("review");
	const [_signatureData, setSignatureData] = useState<string>("");

	const handleSignatureSave = useCallback(
		(data: string) => {
			setSignatureData(data);
			setCurrentStep("complete");
			onSign(data);
		},
		[onSign],
	);

	const handleSignatureClear = useCallback(() => {
		setSignatureData("");
	}, []);

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-6">
			{/* Progress Steps */}
			<div className="flex items-center justify-center space-x-8">
				{[
					{
						key: "review",
						label: "Review Document",
						icon: "lucide:file-text",
					},
					{
						key: "sign",
						label: "Sign Document",
						icon: "lucide:pen-tool",
					},
					{
						key: "complete",
						label: "Complete",
						icon: "lucide:check-circle",
					},
				].map((step, index) => (
					<motion.div
						key={step.key}
						className={`flex items-center space-x-2 ${
							currentStep === step.key
								? "text-blue-600"
								: "text-gray-400"
						}`}
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: index * 0.1 }}
					>
						<Icon icon={step.icon} className="w-5 h-5" />
						<span className="font-medium">{step.label}</span>
						{index < 2 && (
							<Icon
								icon="lucide:chevron-right"
								className="w-4 h-4 ml-4"
							/>
						)}
					</motion.div>
				))}
			</div>

			{/* Document Review */}
			{currentStep === "review" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<Card>
						<CardHeader>
							<CardTitle>{documentTitle}</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="prose max-w-none">
								<pre className="whitespace-pre-wrap text-sm">
									{documentContent}
								</pre>
							</div>
							<div className="mt-6 flex justify-end">
								<Button onClick={() => setCurrentStep("sign")}>
									<Icon
										icon="lucide:pen-tool"
										className="w-4 h-4 mr-2"
									/>
									Proceed to Sign
								</Button>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			)}

			{/* Signature Step */}
			{currentStep === "sign" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<SignaturePadComponent
						onSave={handleSignatureSave}
						onClear={handleSignatureClear}
						title="Sign Document"
						description="Please sign to confirm your agreement with the document terms"
					/>
				</motion.div>
			)}

			{/* Completion Step */}
			{currentStep === "complete" && (
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5 }}
				>
					<Card className="text-center">
						<CardContent className="pt-6">
							<Icon
								icon="lucide:check-circle"
								className="w-16 h-16 text-green-500 mx-auto mb-4"
							/>
							<h3 className="text-xl font-semibold mb-2">
								Document Signed Successfully!
							</h3>
							<p className="text-gray-600 mb-4">
								Your signature has been recorded and the
								document is now complete.
							</p>
							<div className="space-x-4">
								<Button variant="outline">
									<Icon
										icon="lucide:download"
										className="w-4 h-4 mr-2"
									/>
									Download Signed Document
								</Button>
								<Button>
									<Icon
										icon="lucide:mail"
										className="w-4 h-4 mr-2"
									/>
									Email Copy
								</Button>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			)}
		</div>
	);
};
