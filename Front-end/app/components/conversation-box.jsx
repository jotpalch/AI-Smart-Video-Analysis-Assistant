"use client";

import { useRef, useEffect } from "react";
import { useMsgStore } from "./store";
import dynamic from "next/dynamic";

import { Steps } from "../config";
import Link from "next/link";

const Markdown = dynamic(async () => (await import("./markdown")).Markdown, {
	loading: () => <div> Loading... </div>,
});

const Spinner = () => {
	return (
		<div role="status" className="mr-3">
			<svg
				aria-hidden="true"
				className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-600"
				viewBox="0 0 100 101"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
					fill="currentColor"
				/>
				<path
					d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
					fill="currentFill"
				/>
			</svg>
			<span className="sr-only">Loading...</span>
		</div>
	);
};

const CheckIcon = () => {
	return (
		<svg
			className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			fill="currentColor"
			viewBox="0 0 20 20"
		>
			<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
		</svg>
	);
};

const ErrorIcon = () => {
	return (
		<svg
			className="w-6 h-6 me-2.5 text-gray-800 dark:text-red-400"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			fill="none"
			viewBox="0 0 24 24"
		>
			<path
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
			/>
		</svg>
	);
};

const Stepper = () => {
	const step = useMsgStore((state) => state.currentSession().step);

	return (
		<ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
			<li className="flex md:w-full items-center text-blue-600 dark:text-blue-500 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
				{(() => {
					if (step >= Steps.Upload_Done) {
						return (
							<span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:text-green-500">
								<CheckIcon />
								Upload
							</span>
						);
					} else if (step === Steps.Upload_Processing) {
						return (
							<span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 text-yellow-600">
								<Spinner />
								Upload
							</span>
						);
					} else if (step === Steps.Upload_Fail) {
						return (
							<span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:text-red-400">
								<ErrorIcon />
								Upload
							</span>
						);
					} else {
						return (
							<span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
								<span className="me-2">1</span>; Upload
							</span>
						);
					}
				})()}
			</li>
			<li className="flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700">
				{(() => {
					if (step >= Steps.Transcript_Done) {
						return (
							<span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:text-green-500">
								<CheckIcon />
								Generate
								<span className="hidden sm:inline-flex sm:ms-2">Transcript</span>
							</span>
						);
					} else if (step === Steps.Transcript_Processing) {
						return (
							<span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 text-yellow-600">
								<Spinner />
								Generate
								<span className="hidden sm:inline-flex sm:ms-2">Transcript</span>
							</span>
						);
					} else if (step === Steps.Transcript_Fail) {
						return (
							<span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:text-red-400">
								<ErrorIcon />
								Generate
								<span className="hidden sm:inline-flex sm:ms-2">Transcript</span>
							</span>
						);
					} else {
						return (
							<span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
								<span className="me-2">2</span>Generate
								<span className="hidden sm:inline-flex sm:ms-2">Transcript</span>
							</span>
						);
					}
				})()}
			</li>
			<li className="flex items-center">
				{(() => {
					if (step >= Steps.Task_Done) {
						return (
							<span className="flex items-center sm:after:hidden after:mx-2 after:text-gray-200 dark:text-green-500">
								<CheckIcon />
								Execute
								<span className="hidden sm:inline-flex sm:ms-2">Specific</span>
								<span className="hidden sm:inline-flex sm:ms-2">Tasks</span>
							</span>
						);
					} else if (step === Steps.Task_Processing) {
						return (
							<span className="flex items-center sm:after:hidden after:mx-2 after:text-gray-200 text-yellow-600">
								<Spinner />
								Execute
								<span className="hidden sm:inline-flex sm:ms-2">Specific</span>
								<span className="hidden sm:inline-flex sm:ms-2">Tasks</span>
							</span>
						);
					} else if (step === Steps.Task_Fail) {
						return (
							<span className="flex items-center sm:after:hidden after:mx-2 after:text-gray-200 dark:text-red-400">
								<ErrorIcon />
								Execute
								<span className="hidden sm:inline-flex sm:ms-2">Specific</span>
								<span className="hidden sm:inline-flex sm:ms-2">Tasks</span>
							</span>
						);
					} else {
						return (
							<span className="flex items-center sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
								<span className="me-2">3</span>Execute
								<span className="hidden sm:inline-flex sm:ms-2">Specific</span>
								<span className="hidden sm:inline-flex sm:ms-2">Tasks</span>
							</span>
						);
					}
				})()}
			</li>
		</ol>
	);
};

export function ConversationBox() {
	const { messages, topic, url, setting } = useMsgStore((state) => ({
		messages: state.currentSession().messages,
		topic: state.currentSession().topic,
		url: state.currentSession().url,
		setting: state.currentSession().setting,
	}));

	const messagesEndRef = useRef(null);

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	return (
		<>
			<div className="bg-gray-800 rounded-lg">
				<div className="flex items-center">
					<div className="p-4 text-3xl font-bold tracking-tight border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500">
						{topic}
					</div>
				</div>
				<div className="flex items-center capitalize text-gray-500">
					<span className="hidden sm:inline-flex sm:ms-4">
						LLM model: {setting.model}
					</span>
					<span className="hidden sm:inline-flex sm:ms-4">
						whisper model size: {setting.modelSize}
					</span>
					<span className="hidden sm:inline-flex sm:ms-4">
						language: {setting.language}
					</span>
					{url.length > 10 ? (
						<span className="relative hidden sm:inline-flex sm:ms-4 text-blue-600 hover:text-blue-400">
							<Link href={url} target="_blank">
								Youtube Link
							</Link>
						</span>
					) : (
						<span className="hidden sm:inline-flex sm:ms-4 text-gray-400">
							Via Uploaded File{" "}
						</span>
					)}
				</div>
				<div className="flex items-center p-5">
					<Stepper />
				</div>
			</div>

			<div className="grow shrink overflow-auto ">
				<div className="block flex flex-col w-full h-full overflow-auto border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
					{messages.map((message, idx) => (
						<div
							ref={idx === messages.length - 1 ? messagesEndRef : null}
							key={message.id}
							className={`relative flex ${
								message.role === "user" ? "justify-end" : "justify-start"
							} p-4`}
						>
							<div
								className={`p-4 whitespace-pre-line rounded-lg border-[1.5px] border-gray-500 max-w-[80%] ${
									message.role === "user" ? "bg-blue-900" : "bg-gray-900"
								}`}
							>
								<Markdown
									content={message.content}
									loading={
										(message.preview || message.streaming) &&
										message.content.length === 0 &&
										!isUser
									}
									fontSize={16}
									parentRef={messagesEndRef}
									defaultShow={idx >= messages.length - 6}
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
}
