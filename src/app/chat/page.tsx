"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRouter } from "next/navigation";
import { useGemini } from "./hooks/useGemini";

type GeminiMessage = { from: "user" | "bot"; text: string };

export default function ChatPage() {
	const [messages, setMessages] = useState<GeminiMessage[]>([
		{ from: "bot", text: "Hello! How can I assist you today?" },
	]);
	const [input, setInput] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const router = useRouter();

	const { streamPrompt, resetChat } = useGemini({});

	// Scroll to bottom on new message
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSend = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim()) return;
		const userMessage: GeminiMessage = { from: "user", text: input };
		const newHistory: GeminiMessage[] = [...messages, userMessage];
		setMessages(newHistory);
		setInput("");
		setIsGenerating(true);

		// Streaming Gemini response
		let botText = "";
		setMessages((prev) => [...prev, { from: "bot", text: "..." }]);
		try {
			for await (const chunk of streamPrompt(newHistory)) {
				botText += chunk;
				setMessages((prev) => {
					// Replace the last bot message with the streaming text
					const lastBotIdx = prev.findIndex(
						(m, i) => m.from === "bot" && i === prev.length - 1
					);
					if (lastBotIdx !== -1) {
						const updated = [...prev];
						updated[lastBotIdx] = { from: "bot", text: botText };
						return updated;
					}
					return prev;
				});
			}
		} catch {
			setMessages((prev) => [
				...prev.slice(0, -1),
				{
					from: "bot",
					text: "Sorry, there was an error processing your request.",
				},
			]);
		}
		setIsGenerating(false);
	};

	const handleClearChat = () => {
		setMessages([
			{ from: "bot", text: "Hello! How can I assist you today?" },
		]);
		resetChat();
	};

	return (
		<div className="min-h-screen bg-red-50 flex flex-col">
			<header className="bg-red-500 text-white py-4 shadow">
				<div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<button
							onClick={() => router.back()}
							className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
						>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M10 19l-7-7m0 0l7-7m-7 7h18"
								/>
							</svg>
							Back to Home
						</button>
						<h1 className="text-2xl font-bold font-serif">
							AI Chat Assistant
						</h1>
					</div>
					<button
						onClick={handleClearChat}
						className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-medium transition-colors"
						disabled={isGenerating}
					>
						Clear Chat
					</button>
				</div>
			</header>
			<main className="flex-1 flex flex-col items-center justify-center">
				<div
					className="w-full max-w-[1200px] flex flex-col flex-1 bg-white rounded-lg shadow-lg mt-8 mb-4 overflow-hidden mx-4"
					style={{ height: 600 }}
				>
					<div
						className="flex-1 px-4 py-6 space-y-4 overflow-y-auto"
						style={{
							minHeight: 400,
							maxHeight: 520,
							overflowY: "auto",
						}}
					>
						{messages.map((msg, idx) => (
							<div
								key={idx}
								className={`flex ${
									msg.from === "user"
										? "justify-end"
										: "justify-start"
								}`}
							>
								<div
									className={`px-4 py-2 rounded-lg break-words ${
										msg.from === "user"
											? "bg-red-100 text-red-800 max-w-lg"
											: "bg-sky-100 text-sky-800 max-w-4xl"
									}`}
								>
									<ReactMarkdown
										remarkPlugins={[remarkGfm]}
										components={{
											table: ({ children }) => (
												<div className="overflow-x-auto my-4">
													<table className="min-w-full border-collapse border border-gray-300">
														{children}
													</table>
												</div>
											),
											thead: ({ children }) => (
												<thead className="bg-gray-100">
													{children}
												</thead>
											),
											tbody: ({ children }) => (
												<tbody>{children}</tbody>
											),
											tr: ({ children }) => (
												<tr className="border-b border-gray-200">
													{children}
												</tr>
											),
											th: ({ children }) => (
												<th className="border border-gray-300 px-4 py-2 text-left font-semibold">
													{children}
												</th>
											),
											td: ({ children }) => (
												<td className="border border-gray-300 px-4 py-2">
													{children}
												</td>
											),
										}}
									>
										{msg.text}
									</ReactMarkdown>
								</div>
							</div>
						))}
						<div ref={messagesEndRef} />
					</div>
					<form
						onSubmit={handleSend}
						className="flex items-center border-t px-4 py-3 bg-gray-50"
					>
						<input
							type="text"
							className="flex-1 border border-gray-300 rounded px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-red-400"
							placeholder="Type your message..."
							value={input}
							onChange={(e) => setInput(e.target.value)}
							autoFocus
							disabled={isGenerating}
						/>
						<button
							type="submit"
							className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded transition-colors"
							disabled={isGenerating}
						>
							{isGenerating ? "Generating..." : "Send"}
						</button>
					</form>
				</div>
			</main>
		</div>
	);
}
