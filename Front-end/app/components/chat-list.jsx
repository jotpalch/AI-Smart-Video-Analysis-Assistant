"use client";

import { useRef, useEffect } from "react";
import { useMsgStore } from "./store";

export function ChatList() {
	const sessions = useMsgStore((state) => state.sessions);
	const currentSessionIndex = useMsgStore((state) => state.currentSessionIndex);
	const deleteSession = useMsgStore((state) => state.deleteSession);
	const selectSession = useMsgStore((state) => state.selectSession);
	const messageCounts = useMsgStore((state) =>
		state.sessions.map((session) => session.messages.length)
	);

	return (
		<div className="flex flex-col gap-3 h-full overflow-auto px-2">
			{sessions.map((session, index) => (
				<div
					onClick={() => selectSession(index)}
					key={session.id}
					className={`relative flex flex-col items-start px-4 py-2 rounded-xl border-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:cursor-pointer ${
						currentSessionIndex === index
							? " text-white dark:border-blue-600 "
							: ""
					}`}
				>
					<div
						className={`w-full my-3 font-semibold border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500`}
					>
						{session.topic}
					</div>
					<div className="flex w-full justify-between">
						<div className="block">{messageCounts[index]}</div>
						<button onClick={() => deleteSession(index)} className="flex items-center gap-1">
							<svg
								fill="none"
								viewBox="0 0 15 15"
								height="0.9em"
								width="1em"
							>
								<path
									fill="#c45c6e"
									fillRule="evenodd"
									d="M15.854 12.854L11 8l4.854-4.854a.503.503 0 000-.707L13.561.146a.499.499 0 00-.707 0L8 5 3.146.146a.5.5 0 00-.707 0L.146 2.439a.499.499 0 000 .707L5 8 .146 12.854a.5.5 0 000 .707l2.293 2.293a.499.499 0 00.707 0L8 11l4.854 4.854a.5.5 0 00.707 0l2.293-2.293a.499.499 0 000-.707z"
									clipRule="evenodd"
								/>
							</svg>
                            <span className=" font-semibold text-[#c45c6e]"> Delete </span>
						</button>
					</div>
				</div>
			))}
		</div>
	);
}
