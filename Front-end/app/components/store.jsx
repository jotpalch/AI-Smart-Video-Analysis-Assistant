import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { nanoid } from "nanoid";

const DEFAULT_CHAT_STORAGE_NAME = "video-analysis-assistant-msg";
const DEFAULT_TOPIC = "Start a New Conversation";
const CHAT_ENDPOINT = "http://140.113.207.195:30010/chat";

const DEFAULT_CHAT_STATE = {
	sessions: [createEmptySession()],
	currentSessionIndex: 0,
};

function createEmptySession() {
	return {
		id: nanoid(),
		topic: DEFAULT_TOPIC,
		messages: [],
	};
}

async function fetchChatData(messages) {
	const response = await fetch(CHAT_ENDPOINT, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
		},
		body: JSON.stringify({
			question: messages[messages.length - 1].content,
			context: messages.map((message) => message.content).join(" \n "),
		}),
	});

	if (!response.ok) {
		throw new Error("Network response was not ok");
	}

	return response.json();
}

export function createMessage(override) {
	return {
		id: nanoid(),
		role: "user",
		content: "",
		...override,
	};
}

export const useMsgStore = create(
	persist(
		(set, get) => ({
			...DEFAULT_CHAT_STATE,

			addIndex: () =>
				set((state) => ({
					currentSessionIndex: state.currentSessionIndex + 1,
				})),

			clearSessions: () =>
				set({
					sessions: [createEmptySession()],
					currentSessionIndex: 0,
				}),

			selectSession: (index) => set({ currentSessionIndex: index }),

			newSession() {
				set((state) => ({
					sessions: [createEmptySession(), ...state.sessions],
				}));
			},

			deleteSession: (index) => {
				const deletingLastSession = get().sessions.length === 1;

				if (deletingLastSession) {
					get().clearSessions();
				} else {
					set((state) => ({
						sessions: state.sessions.filter((_, i) => i !== index),
						currentSessionIndex: 0,
					}));
				}
			},

			currentSession: () => {
				let index = get().currentSessionIndex;
				const sessions = get().sessions;

				if (index < 0 || index >= sessions.length) {
					index = Math.min(sessions.length - 1, Math.max(0, index));
					set(() => ({ currentSessionIndex: index }));
				}

				return sessions[index];
			},

			onNewMessage(message) {
				get().updateCurrentSession((session) => {
					session.messages = message;
				});
			},

			onNewTopic(topic) {
				get().updateCurrentSession((session) => {
					session.topic = topic;
				});
			},

			async onUserInput(text) {
				const session = get().currentSession();
				const messages = session.messages;
				const lastMessage = messages[messages.length - 1];
				const isUser = lastMessage && lastMessage.author === "user";
				const lastMessageText = lastMessage && lastMessage.text;

				if (lastMessageText === text) {
					return;
				}

				let userMessage = createMessage({
					role: "user",
					content: text,
				});

				const newUserMessages = get()
					.currentSession()
					.messages.concat(userMessage);
				get().onNewMessage(newUserMessages);

				const res = await fetchChatData(get().currentSession().messages);

				let botMessage = createMessage({
					role: "assissant",
					content: res?.answer,
				});

				const newBotMessages = get()
					.currentSession()
					.messages.concat(botMessage);
				get().onNewMessage(newBotMessages);

				if (newBotMessages.length > 3) {
					get().summarizeSession();
				}

				// get().onNewMessage({
				// 	...(res.choices[0].message || {}),
				// });
			},

			onBotResponse(message) {
				get().onNewMessage(message);
			},

			async summarizeSession() {
				const session = get().currentSession();

				if (session.topic !== DEFAULT_TOPIC) return;

				let newPromptMessage = createMessage({
					role: "system",
					content: "Summarize the topic succinctly in 10 words",
				});

				const newMessages = session.messages.concat(newPromptMessage);

				const res = await fetchChatData(newMessages);

				const topic = res?.answer;

				get().onNewTopic(topic);
			},

			updateStat(message) {
				get().updateCurrentSession((session) => {
					session.stat.charCount += message.content.length;
					// TODO: should update chat count and word count
				});
			},

			updateCurrentSession(updater) {
				const sessions = get().sessions;
				const index = get().currentSessionIndex;
				updater(sessions[index]);
				set(() => ({ sessions }));
			},
		}),
		{
			name: DEFAULT_CHAT_STORAGE_NAME,
			storage: createJSONStorage(() => localStorage),
		}
	)
);
