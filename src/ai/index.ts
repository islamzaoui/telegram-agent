import type { User } from 'gramio';

import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, stepCountIs } from 'ai';

import env from '@/env';

import { sendMessageTool } from './tools/send-message.tool';
import { LARRY_SYSTEM_PROMPT } from './system';

const google = createGoogleGenerativeAI({
	apiKey: env.GEMINI_API_KEY,
});

const model = google('gemini-2.5-flash');

export interface ChatAgentInput {
	chatId: number;
	user: User;
	message: string;
}

function inputToPrompt({ chatId, user, message }: ChatAgentInput) {
	return `user ${user.firstName} with username ${user.username} in chat ${chatId} said: ${message}`;
}

export async function chatAgent(input: ChatAgentInput) {
	await generateText({
		prompt: inputToPrompt(input),
		model,
		system: LARRY_SYSTEM_PROMPT,
		stopWhen: stepCountIs(10),
		tools: {
			sendMessageTool,
		},
	});
}
