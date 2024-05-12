"use client";

import { useState } from "react";
import { useMsgStore } from "./store";

import TextareaAutosize from 'react-textarea-autosize';

export function Chat() {
	const [value, setValue] = useState("");
	const msg = useMsgStore((state) => state.currentSessionIndex);
	const onUserInput = useMsgStore((state) => state.onUserInput);

	const onSubmit = (e) => {
		e.preventDefault();
		onUserInput(value);
		setValue("");
	};

	const onChange = (e) => {
		setValue(e.target.value);
	};

	const onKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			onSubmit(e);
		}
	};

	return (
		<div className="relative">
			<form onSubmit={onSubmit}>
				<TextareaAutosize
					minRows={3}
					maxRows={20}
					placeholder="Press Enter to send message and Shift + Enter for new line"
					value={value}
					onChange={onChange}
					onKeyDown={onKeyDown}
					className="block w-full p-4 ps-5 text-sm text-gray-900 border resize-none border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				></TextareaAutosize>
				<button
					type="submit"
					className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						className="bi bi-cursor-fill"
						viewBox="0 0 16 16"
					>
						<path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
					</svg>
				</button>
			</form>
		</div>
	);
}
