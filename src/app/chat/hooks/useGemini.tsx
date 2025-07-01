import { useRef } from "react";
import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTIONS } from "../instructions";

interface UseGeminiOptions {
	model?: string;
}

export function useGemini({ model = "gemini-2.5-flash" }: UseGeminiOptions) {
	const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API || "";

	const aiRef = useRef<GoogleGenAI | null>(null);
	const chatRef = useRef<Chat | null>(null);

	if (aiRef.current === null) {
		aiRef.current = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
	}

	/**
	 * Streams the response from Gemini as an async generator.
	 * @param history The conversation history
	 */
	type GeminiMessage = { from: "user" | "bot"; text: string };

	const streamPrompt = async function* (
		history: GeminiMessage[]
	): AsyncGenerator<string, void, unknown> {
		try {
			// Get the latest user message
			const latestUserMessage = history[history.length - 1];
			if (!latestUserMessage || latestUserMessage.from !== "user") {
				yield "No user message found.";
				return;
			}

			// Create or get existing chat session
			if (!chatRef.current) {
				// Convert history to proper format for initial chat creation
				// Exclude the latest user message since we'll send it separately
				const chatHistory = history.slice(0, -1).map((msg) => ({
					role:
						msg.from === "user"
							? ("user" as const)
							: ("model" as const),
					parts: [{ text: msg.text }],
				}));

				chatRef.current = await aiRef.current!.chats.create({
					model: model,
					config: {
						systemInstruction: SYSTEM_INSTRUCTIONS,
					},
					history: chatHistory,
				});
			}

			// Send the latest message and stream the response
			const stream = await chatRef.current.sendMessageStream({
				message: [{ text: latestUserMessage.text }],
			});

			// Process the stream
			for await (const chunk of stream) {
				// Extract text from the chunk
				const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
				if (text) {
					yield text;
				}
			}
		} catch (error) {
			console.error("Error in streamPrompt:", error);
			yield "Sorry, there was an error processing your request.";
		}
	};

	const resetChat = () => {
		chatRef.current = null;
	};

	return { streamPrompt, resetChat };
}
