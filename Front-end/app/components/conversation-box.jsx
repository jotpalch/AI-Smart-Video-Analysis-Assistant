"use client";

import { useRef, useEffect } from "react";
import { useMsgStore } from "./store";
import dynamic from "next/dynamic";

const Markdown = dynamic(async () => (await import("./markdown")).Markdown, {
	loading: () => <div> Loading... </div>,
});

export function ConversationBox() {
	const messages = useMsgStore((state) => state.currentSession().messages);
	const topic = useMsgStore((state) => state.currentSession().topic);
	const messagesEndRef = useRef(null);

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	return (
		<>
			<div className="flex items-center">
				<div className="w-full my-3 text-2xl font-bold border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500">
					{topic}
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
									message.role === "user"
										? "bg-blue-700 text-white"
										: "bg-gray-200 text-gray-900"
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
