import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { nanoid } from "nanoid";

import {
	DEFAULT_TOPIC,
	DEFAULT_CHAT_STORAGE_NAME,
	DEFAULT_SETTINGS,
	ApiPath,
	Steps,
} from "../config";

const DEFAULT_CHAT_STATE = {
	sessions: [createEmptySession()],
	currentSessionIndex: 0,
};

function createEmptySession() {
	return {
		id: nanoid(),
		url: "",
		topic: DEFAULT_TOPIC,
		step: -1,
		setting: {
			model: DEFAULT_SETTINGS.model,
			modelSize: DEFAULT_SETTINGS.modelSize,
			language: DEFAULT_SETTINGS.language,
			needTranslation: false,
		},
		messages: [],
	};
}

async function fetchChatData(messages, model, language) {
	const response = await fetch(ApiPath.Chat, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
		},
		body: JSON.stringify({
			context: messages,
			model: model,
			language_tag: language,
		}),
	});

	if (!response.ok) {
		throw new Error("Network response was not ok");
	}

	return response.json();
}

async function fetchTaskData(messages, model, language) {
	const response = await fetch(ApiPath.Task, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
		},
		body: JSON.stringify({
			context: messages,
			model: model,
			language_tag: language,
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

			newSessionWithSetting(setting, url = "") {
				const newSession = createEmptySession();
				newSession.url = url;
				newSession.setting = setting;
				set((state) => ({
					sessions: [newSession, ...state.sessions],
					currentSessionIndex: 0,
				}));
			},

			newSessionWithText(text) {
				const newSession = createEmptySession();
				let botMessage = createMessage({
					role: "assissant",
					content: text,
				});
				newSession.messages.push(botMessage);
				set((state) => ({
					sessions: [newSession, ...state.sessions],
					currentSessionIndex: 0,
				}));

				if (get().currentSession().messages.length >= 1) {
					get().summarizeSession();
				}
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
				const model = session.setting.model;
				const language = session.setting.language;
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

				const res = await fetchChatData(
					get().currentSession().messages,
					model,
					language
				);

				let botMessage = createMessage({
					role: "assissant",
					content: res?.answer,
				});

				const newBotMessages = get()
					.currentSession()
					.messages.concat(botMessage);
				get().onNewMessage(newBotMessages);

				if (newBotMessages.length >= 1) {
					get().summarizeSession();
				}

				// get().onNewMessage({
				// 	...(res.choices[0].message || {}),
				// });
			},

			onBotResponse(message) {
				get().onNewMessage(message);
			},

			async runTaskSession() {
				console.log("Run the task...");

				const session = get().currentSession();
				const model = session.setting.model;
				const language = session.setting.language;
				const messages = session.messages;

				get().updateStep(Steps.Task_Processing);

				const res = await fetchTaskData(messages, model, language);

				let botMessage = createMessage({
					role: "assissant",
					content: res?.answer,
				});

				const newMessages = session.messages.concat(botMessage);
				get().onNewMessage(newMessages);

				get().updateStep(Steps.Task_Done);
			},

			async summarizeSession() {
				console.log("Get summary topic...");

				const session = get().currentSession();
				const model = session.setting.model;
				const language = session.setting.language;
				let promptMsg = "Summarize the topic succinctly in 7 words";

				if (session.topic !== DEFAULT_TOPIC) return;

				if (session.setting.language === "zh") {
					promptMsg = "請用十個字簡潔地歸納主題 用繁體中文";
				}

				let newPromptMessage = createMessage({
					role: "system",
					content: promptMsg,
				});

				const newMessages = session.messages.concat(newPromptMessage);

				const res = await fetchChatData(newMessages, model, language);

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

			updateStep(step) {
				get().updateCurrentSession((session) => {
					session.step = step;
				});
			},

			updateSessionWithTranscript(transcript) {
				const session = get().currentSession();
				let botMessage = createMessage({
					role: "assissant",
					content: transcript,
				});
				session.messages.push(botMessage);
				get().onNewMessage(session.messages);
				get().updateStep(Steps.Transcript_Done);
				get().summarizeSession();
				get().runTaskSession();
			},
		}),
		{
			name: DEFAULT_CHAT_STORAGE_NAME,
			storage: createJSONStorage(() => localStorage),
		}
	)
);

export const useSettingStore = create((set) => ({
	setting: {
		model: DEFAULT_SETTINGS.model,
		modelSize: DEFAULT_SETTINGS.modelSize,
		language: DEFAULT_SETTINGS.language,
		needTranslation: false,
	},

	updateSetting: (setting) => set({ setting }),
	updateModel: (model) =>
		set((state) => ({ setting: { ...state.setting, model } })),
	updateModelSize: (modelSize) =>
		set((state) => ({ setting: { ...state.setting, modelSize } })),
	updateLanguage: (language) =>
		set((state) => ({ setting: { ...state.setting, language } })),
	updateNeedTranslation: (needTranslation) =>
		set((state) => ({ setting: { ...state.setting, needTranslation } })),
}));
