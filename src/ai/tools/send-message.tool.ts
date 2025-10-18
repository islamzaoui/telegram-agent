import { tool } from 'ai';
import z from 'zod';

import { sendMessage } from '@/utils/bot-send';

const inputSchema = z.object({
	chatId: z.coerce.number().describe('The ID of the chat to send the message to'),
	message: z.string().describe('The message to send'),
});

export const sendMessageTool = tool({
	name: 'send_message',
	description: 'Send a message to a user',
	inputSchema,
	execute: async ({ chatId, message }) => {
		await sendMessage({ chatId, message });
	},
});
