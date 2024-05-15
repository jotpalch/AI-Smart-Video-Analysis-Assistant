"use client";

import { useState, useRef } from "react";
import { useSettingStore } from "./store";
import { MODELS } from "../config";

import { ChatList } from "./chat-list";
import { UploadModal } from "./upload-modal";

export function Sidebar() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { setting, updateModel } = useSettingStore((state) => state);

	function switchModal() {
		setIsModalOpen(!isModalOpen);
	}

	return (
		<div className="flex flex-col gap-2 h-full min-w-[18vw] max-w-[35%] p-5 bg-slate-800">
			<div className="w-full px-2 py-4 text-3xl tracking-tight font-bold">
				<h1 className="inline-block bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-400 text-transparent bg-clip-text">AI Video Analysis Assistant</h1>
				{/* <h1 className="inline-block bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-300 text-transparent bg-clip-text">AI Learning Platform</h1> */}
			</div>
			<div className="relative p-3">
				<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
					Select Model
				</label>
				<select
					value={setting.model}
					onChange={(e) => {
						updateModel(e.target.value);
					}}
					className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				>
					{MODELS.map((model) => (
						<option key={model.code} value={model.code}>
							{model.name}
						</option>
					))}
				</select>
			</div>
			<div className="grow shrink overflow-auto ">
				<div className="block w-full h-full overflow-auto rounded-lg dark:placeholder-gray-400 dark:text-white ">
					<ChatList />
				</div>
			</div>
			<div className="relative flex">
				<button
					data-modal-target="large-modal"
					data-modal-toggle="large-modal"
					onClick={switchModal}
					className="grow block w-full md:w-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					type="button"
				>
					Add New Video
				</button>
			</div>

			{isModalOpen ? <UploadModal onClose={switchModal} /> : null}
		</div>
	);
}
