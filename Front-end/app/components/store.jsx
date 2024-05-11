import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { nanoid } from "nanoid";

function createEmptySession() {
	return {
		id: nanoid(),
		topic: "Start a New Conversation",
		messages: [],
	};
}

export function createMessage(override) {
	return {
		id: nanoid(),
		role: "user",
		content: "",
		...override,
	};
}

const DEFAULT_CHAT_STATE = {
	sessions: [createEmptySession()],
	currentSessionIndex: 0,
};

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
                set((state) => ({ sessions: [...state.sessions, createEmptySession()] }));
			},

			deleteSession: (index) => {
				const deletingLastSession = get().sessions.length === 1;
				const deletedSession = get().sessions.at(index);

				if (deletingLastSession) {
					get().clearSessions();
				} else {
					set((state) => ({
						sessions:  state.sessions.filter((_, i) => i !== index),
						currentSessionIndex: 0
					}));
				}
			},

			currentSession: () => get().sessions[get().currentSessionIndex],

			onNewMessage(message) {
				get().updateCurrentSession((session) => {
					session.messages = message;
				});
				// get().updateStat(message);
				// get().summarizeSession();
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

				const newMessages = get().currentSession().messages.concat(userMessage);
				get().onNewMessage(newMessages);

				const requestChat = async (messages) => {
					try {
						const response = await fetch("http://140.113.207.195:30010/chat", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								// Remove the "Access-Control-Allow-Origin" header
							},
							mode: "cors", // Add this line to enable CORS
							body: JSON.stringify({
								question: messages[messages.length - 1].content,
								context: messages
									.map((message) => message.content)
									.join(" \n "),
							}),
						});
						const data = await response.json();
						return data;
					} catch (error) {
						console.error("Error:", error);
					}
				};

				console.log("messages:" + get().currentSession().messages);

				const res = await requestChat(get().currentSession().messages);

				// console.log("res:" + res);

				// get().onNewMessage({
				// 	...(res.choices[0].message || {}),
				// });
			},

			onBotResponse(message) {
				get().onNewMessage(message);
			},

			summarizeSession() {
				const session = get().currentSession();

				if (session.topic !== DEFAULT_TOPIC) return;

				requestWithPrompt(
					session.messages,
					"简明扼要地 10 字以内总结主题"
				).then((res) => {
					get().updateCurrentSession(
						(session) => (session.topic = trimTopic(res))
					);
				});
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
			name: "video-analysis-assistant-msg",
			storage: createJSONStorage(() => localStorage),
		}
	)
);

const useBearStore = create((set) => ({
	bears: 0,
	increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
	removeAllBears: () => set({ bears: 0 }),
}));
