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
					className={`relative flex flex-col items-start p-3 rounded-xl border-2 bg-gray-50 dark:bg-gray-900 dark:text-white hover:cursor-pointer ${
						currentSessionIndex === index
							? " dark:border-blue-500 "
							: " dark:border-gray-600 "
					}`}
				>
					<div
						className="w-full mt-1 mb-2 truncate tracking-tight font-semibold rounded-lg dark:text-gray-200"
					>
						{session.topic}
					</div>
					<div className="flex w-full justify-between">
						<div className="block text-gray-500">{messageCounts[index]} messages</div>
					</div>
					<button
						onClick={() => deleteSession(index)}
						className="flex items-center absolute end-2 bottom-2"
					>
						<svg fill="none" viewBox="0 0 15 15" height="1em" width="1em">
							<path
								fill="gray"
								fillRule="evenodd"
								d="M.877 7.5a6.623 6.623 0 1113.246 0 6.623 6.623 0 01-13.246 0zM7.5 1.827a5.673 5.673 0 100 11.346 5.673 5.673 0 000-11.346zm2.354 3.32a.5.5 0 010 .707L8.207 7.5l1.647 1.646a.5.5 0 01-.708.708L7.5 8.207 5.854 9.854a.5.5 0 01-.708-.708L6.793 7.5 5.146 5.854a.5.5 0 01.708-.708L7.5 6.793l1.646-1.647a.5.5 0 01.708 0z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
				</div>
			))}
		</div>
	);
}
