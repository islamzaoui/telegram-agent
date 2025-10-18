import type { FilePart, ImagePart, TextPart } from 'ai';
import type { DocumentAttachment, PhotoSize, User } from 'gramio';

import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, stepCountIs } from 'ai';

import env from '@/env';
import { logger } from '@/lib/logger';
import { sendMessage } from '@/utils/bot-send';
import { getFileURL } from '@/utils/files';

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
	photo?: PhotoSize;
	document?: DocumentAttachment;
}

function inputToTextPart({ chatId, user, messageId, content }: ChatAgentInput): TextPart {
	return {
		type: 'text',
		text: `message ${messageId} from user ${`${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}${user.username ? ` with username ${user.username}` : ''}`} in chat ${chatId} said: ${content}`,
	};
}

async function photosToImagePart({ photo }: ChatAgentInput): Promise<ImagePart[]> {
	if (!photo) return [];

	return [
		{
			type: 'image',
			image: await getFileURL(photo.fileId),
		},
	];
}

async function documentToFilePart({ document }: ChatAgentInput): Promise<FilePart[]> {
	if (!document) return [];

	return [
		{
			type: 'file',
			data: await getFileURL(document.fileId),
			mediaType: document.mimeType ?? 'application/octet-stream',
		},
	];
}

export async function chatAgent(input: ChatAgentInput) {
	try {
		await generateText({
			messages: [
				{
					role: 'user',
					content: [
						inputToTextPart(input),
						...(await photosToImagePart(input)),
						...(await documentToFilePart(input)),
					],
				},
			],
			model,
			system: LARRY_SYSTEM_PROMPT,
			stopWhen: stepCountIs(5),
			tools: {
				sendMessageTool: sendMessageTool(input.chatId),
			},
		});
	} catch (err) {
		logger.error({ err }, 'Failed to generate response');

		sendMessage({
			chatId: input.chatId,
			message: 'Larry is currently unavailable, please try again later.',
		});
	}
}
