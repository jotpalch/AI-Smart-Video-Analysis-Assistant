"use client";

import { useState, useRef } from "react";
import { useMsgStore } from "./store";

import { ChatList } from "./chat-list";

function Modal({ onClose }) {
	const modalRef = useRef();
    const newSession = useMsgStore((state) => state.newSession);

	const handleCloseOnOverlay = (e) => {
		if (e.target === modalRef.current) {
			onClose();
		}
	};

    const newcl = () => {
        newSession();
    }

	return (
		<div
			id="large-modal"
			tabIndex="-1"
			className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-black bg-opacity-70 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
			onClick={handleCloseOnOverlay}
			ref={modalRef}
		>
			<div className="relative w-full max-w-4xl max-h-full">
				{/* <!-- Modal content --> */}
				<div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
					{/* <!-- Modal header --> */}
					<div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
						<h3 className="text-xl font-medium text-gray-900 dark:text-white">
							Add New Video Materials
						</h3>
						<button
							type="button"
							onClick={onClose}
							className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
							data-modal-hide="large-modal"
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
                    <button onClick={newcl}>
                        new session
                    </button>
					<div className="p-4 md:p-5 space-y-4">
						<form>
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
									className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									placeholder="Youtube URL"
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
									multiple
									required
								/>
							</label>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

export function Sidebar() {

	const [isModalOpen, setIsModalOpen] = useState(false);

	function switchModal() {
		setIsModalOpen(!isModalOpen);
	}

	return (
		<div className="flex flex-col gap-2 h-full min-w-[18vw] p-5 bg-slate-800">
			<div className="w-full px-2 py-4 text-xl tracking-tight font-bold border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-blue-500 dark:focus:border-blue-500">
				VideoAnalysisAssistant
			</div>
			<div className="grow shrink overflow-auto ">
				<div className="block w-full h-full overflow-auto border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
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

			{isModalOpen ? <Modal onClose={switchModal} /> : null}
		</div>
	);
}
