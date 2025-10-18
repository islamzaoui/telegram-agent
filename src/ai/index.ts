import type { User } from 'gramio';

import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, stepCountIs } from 'ai';

import bot from '@/bot';
import env from '@/env';

import { LARRY_SYSTEM_PROMPT } from './system';
import { sendMessageTool } from './tools/send-message.tool';

const google = createGoogleGenerativeAI({
	apiKey: env.GEMINI_API_KEY,
});

const model = google('gemini-2.5-flash-lite-preview-09-2025');

export interface ChatAgentInput {
	chatId: number;
	user: User;
	messageId: number;
	content: string;
}

function inputToPrompt({ chatId, user, messageId, content }: ChatAgentInput) {
	return `message ${messageId} from user ${`${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}${user.username ? ` with username ${user.username}` : ''}`} in chat ${chatId} said: ${content}`;
}

export async function chatAgent(input: ChatAgentInput) {
	try {
		await generateText({
			prompt: inputToPrompt(input),
			model,
			system: LARRY_SYSTEM_PROMPT,
			stopWhen: stepCountIs(5),
			tools: {
				sendMessageTool,
			},
		});
	} catch {
		await bot.api.sendMessage({
			chat_id: input.chatId,
			text: 'Larry is currently unavailable, please try again later.',
		});
	}
}
