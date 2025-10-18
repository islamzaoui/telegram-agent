import { tool } from 'ai';
import z from 'zod';

import bot from '@/bot';

const inputSchema = z.object({
	chatId: z.string().describe('The ID of the chat to send the message to'),
	message: z.string().describe('The message to send'),
});

export const sendMessageTool = tool({
	name: 'send_message',
	description: 'Send a message to a user',
	inputSchema,
	execute: async ({ chatId, message }) => {
		await bot.api.sendMessage({
			chat_id: chatId,
			text: message,
		});
	},
});
