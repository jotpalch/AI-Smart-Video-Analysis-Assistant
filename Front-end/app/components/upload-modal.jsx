"use client";

import { useState, useRef } from "react";
import { useMsgStore, useSettingStore } from "./store";

import {
	DEFAULT_SETTINGS,
	LANGUAGELIST,
	MODELSIZE,
	ApiPath,
	Steps,
} from "../config";

export function UploadModal({ onClose }) {
	const modalRef = useRef();
	const [file, setFile] = useState(null);
	const [uploadMode, setUploadMode] = useState(null); // "file" or "youtube"

	const { newSessionWithSetting, updateStep, updateSessionWithTranscript } =
		useMsgStore((state) => state);
	const { setting, updateModelSize, updateLanguage, updateNeedTranslation } =
		useSettingStore((state) => state);

	const handleCloseOnOverlay = (e) => {
		if (e.target === modalRef.current) {
			onClose();
		}
	};

	const handleFileChange = (e) => {
		if (e.target.files && e.target.files.length > 0) {
			setFile([...e.target.files]);
		}
	};

	const fetchTranscript = async (id) => {
		let transcriptData = null;
		let transcriptResult = null;

		do {
			transcriptResult = await fetch(`${ApiPath.Transcript}/${id}`);
			if (transcriptResult.status === 200) {
				transcriptData = await transcriptResult.json();
				updateSessionWithTranscript(transcriptData.srt);
				// updateStep(Steps.Transcript_Done);
				break;
			} else if (transcriptResult.status === 202) {
				updateStep(Steps.Transcript_Processing);
				// Wait for 1 second before trying again
				await new Promise((resolve) => setTimeout(resolve, 1000));
			} else {
				updateStep(Steps.Transcript_Fail);
				throw new Error(
					`Unexpected response status: ${transcriptResult.status}`
				);
			}
		} while (true);
	};

	const handleUpload = async () => {
		if (file) {
			console.log("Uploading file...");
			console.log(setting);

			newSessionWithSetting(setting, "");

			const formData = new FormData();
			formData.append("up_file", file[0]);
			formData.append("language_tag", setting.language);
			formData.append("translate_tag", setting.needTranslation);
			formData.append("model_size", setting.modelSize);

			try {
				const result = await fetch(ApiPath.FileUpload, {
					method: "POST",
					body: formData,
					headers: {
						"Access-Control-Allow-Origin": "*",
					},
				});

				const data = await result.json();

				if (data.id) {
					updateStep(Steps.Upload_Done);
					await fetchTranscript(data.id);
				}
			} catch (error) {
				updateStep(Steps.Upload_Fail);
				console.error(error);
			}
		}
	};

	const handleYoutubeUpload = async () => {
		console.log("Uploading Youtube URL...");
		console.log(setting);

		const url = document.getElementById("search").value;

		newSessionWithSetting(setting, url);

		onClose();

		try {
			const result = await fetch(
				`${ApiPath.YoutubeQuery}?url=${url}&language_tag=${setting.language}&translate_tag=${setting.needTranslation}&model_size=${setting.modelSize}`,
				{
					headers: {
						"Access-Control-Allow-Origin": "*",
					},
				}
			);

			const data = await result.json();

			if (data?.id) {
				updateStep(Steps.Upload_Done);
				await fetchTranscript(data.id);
			}
		} catch (error) {
			updateStep(Steps.Upload_Fail);
			console.error(error);
		}
	};

	const removeFile = (name, idx) => {
		const newFiles = file.filter((file, index) => index !== idx);
		if (newFiles.length === 0) {
			setFile(null);
		} else {
			setFile(newFiles);
		}
	};

	const InputYoutubeUrl = () => {
		return (
			<div className="p-4 md:p-5 space-y-4 border-t border-gray-200 dark:border-gray-600">
				<form
					action={() => {
						onClose();
						handleYoutubeUpload();
					}}
				>
					<label
						htmlFor="search"
						className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
					>
						Search
					</label>
					<div className="relative">
						<div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								className="bi bi-youtube"
								viewBox="0 0 16 16"
							>
								<path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z" />
							</svg>
						</div>
						<input
							type="search"
							id="search"
							className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
							placeholder="Youtube URL"
							pattern="^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtube\.com|youtu\.?be)\/.+$"
							required
						/>
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
					</div>
				</form>
			</div>
		);
	};

	const DragUploadField = () => {
		return (
			<div className="flex items-center p-4 md:p-5 space-x-3 rtl:space-x-reverse border-t border-gray-200 rounded-b dark:border-gray-600">
				<form className="flex items-center justify-center w-full">
					<label
						htmlFor="dropzone-file"
						className="relative flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
					>
						<div className="flex flex-col gap-2 items-center justify-center pt-4 pb-3">
							<svg
								className="w-8 h-8 text-gray-500 dark:text-gray-400"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 20 16"
							>
								<path
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
								/>
							</svg>
							<p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
								<span className="font-semibold">Click to upload</span> or drag
								and drop
							</p>
							<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
								MP3, MP4 (MAX. 30min)
							</p>
						</div>
						<input
							id="dropzone-file"
							type="file"
							className="hidden"
							onChange={handleFileChange}
							accept=".mp3, .mp4"
							required
						/>
					</label>
				</form>
			</div>
		);
	};

	const SelectionLanguage = () => {
		return (
			<div className="grow mx-2">
				<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
					Select Video Language
				</label>
				<select
					value={setting.language}
					onChange={(e) => {
						updateLanguage(e.target.value);
					}}
					className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				>
					{LANGUAGELIST.map((lang) => (
						<option key={lang.code} value={lang.code}>
							{lang.name}
						</option>
					))}
				</select>
			</div>
		);
	};

	const SelectionNeedTranslation = () => {
		return (
			<div className="grow mx-2">
				<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
					Need translation back to English
				</label>
				<select
					value={setting.needTranslation.toString()}
					onChange={(e) => {
						updateNeedTranslation(e.target.value === "true");
					}}
					className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				>
					<option key="true" value="true">
						Yes
					</option>
					<option key="false" value="false">
						No
					</option>
				</select>
			</div>
		);
	};

	const SelectionModelSize = () => {
		return (
			<div className="grow mx-2">
				<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
					Select Model Size
				</label>
				<select
					value={setting.modelSize}
					onChange={(e) => {
						updateModelSize(e.target.value);
					}}
					className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				>
					{MODELSIZE.map((size) => (
						<option key={size.code} value={size.code}>
							{size.name}
						</option>
					))}
				</select>
			</div>
		);
	};

	const SelectionUploadModeBtns = () => {
		return (
			<div className="flex justify-center text-2xl font-bold tracking-wider p-4 border-t border-gray-200 dark:border-gray-600">
				<button
					className="w-full bg-red-700 mx-10 my-5 rounded-xl p-4 hover:bg-red-600"
					onClick={() => setUploadMode("youtube")}
				>
					Youtube
				</button>
				<button
					className="w-full bg-blue-700 mx-10 my-5 rounded-xl p-4 hover:bg-blue-600"
					onClick={() => setUploadMode("file")}
				>
					File
				</button>
			</div>
		);
	};

	return (
		<div
			tabIndex="-1"
			className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-black bg-opacity-70 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
			onClick={handleCloseOnOverlay}
			ref={modalRef}
		>
			<div className="relative w-full max-w-4xl max-h-full">
				<div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
					<div className="flex items-center justify-between pt-5 px-5 rounded-t">
						<h3 className="text-xl font-medium text-gray-900 dark:text-white">
							Add New Video Materials
						</h3>
						<button
							type="button"
							onClick={onClose}
							className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
						>
							<svg
								className="w-3 h-3"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 14 14"
							>
								<path
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
								/>
							</svg>
							<span className="sr-only">Close modal</span>
						</button>
					</div>

					<div className="px-5 py-3 text-sm text-gray-400">
						Select the video materials and choose the way to upload the video
					</div>

					<div className="flex justify-center p-4 border-t border-gray-200 dark:border-gray-600">
						<SelectionLanguage />
						<SelectionNeedTranslation />
						<SelectionModelSize />
					</div>

					{!uploadMode && <SelectionUploadModeBtns />}

					{uploadMode === "youtube" && <InputYoutubeUrl />}
					{uploadMode === "file" && !file && <DragUploadField />}

					<div
						className={`flex flex-col items-center ${file ? " py-10 " : ""}`}
					>
						{file?.map((file, idx) => (
							<div key={idx} className="flex flex-row space-x-20">
								<span>{file.name}</span>
								<span className=" text-gray-400">
									({(file.size / 1048576).toFixed(2)} MB)
								</span>
								<span
									className="text-red-500 cursor-pointer"
									onClick={() => removeFile(file.name, idx)}
								>
									remove
								</span>
							</div>
						))}
					</div>

					<div className="flex justify-center">
						{file && (
							<button
								onClick={() => {
									onClose();
									handleUpload();
								}}
								className="block w-full bg-blue-700 mb-5 mx-5 rounded-xl p-3 text-lg font-semibold tracking-wider hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-700"
							>
								UPLOAD
							</button>
						)}
					</div>

					{uploadMode && (
						<div className="flex justify-center">
							<button
								className="w-full bg-slate-900 mb-5 mx-5 rounded-xl p-3 text-lg font-semibold tracking-wider hover:bg-slate-800"
								onClick={() => {
									setUploadMode(null);
									setFile(null);
								}}
							>
								BACK
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
