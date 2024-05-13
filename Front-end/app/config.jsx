export const REPO_URL =
	"https://github.com/jotpalch/AI-Smart-Video-Analysis-Assistant";

export const DEFAULT_CHAT_STORAGE_NAME = "video-analysis-assistant-msg";
export const DEFAULT_TOPIC = "Start a New Conversation";

export const ApiPath = {
	Chat: "http://140.113.207.195:30010/chat",
	FileUpload: "http://140.113.207.195:30011/audio",
	YoutubeQuery: "http://140.113.207.195:30011/youtube",
	Transcript: "http://140.113.207.195:30011/transcript",
};

export const MODELS = [
	{ name: "Llama 3 8B (Local)", code: "llama3" },
	{ name: "Gemini", code: "gemini" },
	{ name: "TAIDE 8B (Local)", code: "taide" },
];

export const LANGUAGELIST = [
	{ name: "English", code: "en" },
	{ name: "繁體中文", code: "zh" },
];

export const MODELSIZE = [
	{ name: "Tiny", code: "tiny" },
	{ name: "Base", code: "base" },
	{ name: "Small", code: "small" },
	{ name: "Medium", code: "medium" },
	{ name: "Large", code: "large" },
];

export const DEFAULT_SETTINGS = {
    model: "llama3",
    modelSize: "base",
    language: "en",
};

export const Steps = {
	Upload_Processing: 0,
	Upload_Fail: 1,
	Upload_Done: 2,
	Transcript_Processing: 3,
	Transcript_Fail: 4,
	Transcript_Done: 5,
	Task_Processing: 6,
	Task_Fail: 7,
	Task_Done: 8,
};
