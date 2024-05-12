"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

import { Sidebar } from "./components/sidebar";
import { Chat } from "./components/chat";
import { ConversationBox } from "./components/conversation-box";

const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
};

const loadAsyncGoogleFont = () => {
	const linkEl = document.createElement("link");
	const googleFontUrl = "https://fonts.googleapis.com";
	linkEl.rel = "stylesheet";
	linkEl.href =
		googleFontUrl +
		"/css2?family=" +
		encodeURIComponent("Noto Sans:wght@300;400;700;900") +
		"&display=swap";
	document.head.appendChild(linkEl);
};

const LoadingPage = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin">
      {/* Replace with your SVG */}
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-12 w-12 text-blue-500">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </div>
  </div>
);

export default function Home() {
	useEffect(() => {
		loadAsyncGoogleFont();
	}, []);

  if (!useHasHydrated()) {
    return <LoadingPage />;
  }

	return (
		<main className="flex h-full min-h-screen items-center justify-center m-0 p-0 px-24 gap-5">
			<div className="container flex h-[90vh] rounded-[20px] min-w-[600px] min-h-[370px] overflow-hidden box-border w-full justify-between bg-gray-600 border-[5px] border-gray-500 dark:text-gray-200 ">
				<Sidebar />

				<div className="grow flex flex-col justify-between gap-3 p-5 max-w-[70vw]">
					<ConversationBox />
					<Chat />
				</div>
			</div>
		</main>
	);
}
