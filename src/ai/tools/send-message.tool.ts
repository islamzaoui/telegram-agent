import { tool } from 'ai';
import z from 'zod';

import { logger } from '@/lib/logger';
import { sendMessage } from '@/utils/bot-send';

const inputSchema = z.object({
	message: z.string().describe('The message to send'),
});

const outputSchema = z.union([
	z.literal('Message sent successfully.'),
	z.literal('Failed to send message.'),
]);

export function sendMessageTool(chatId: number) {
	return tool({
		name: 'send_message',
		description: 'Send a message to a user',
		inputSchema,
		outputSchema,
		execute: async ({ message }) => {
			try {
				logger.info({ chatId }, 'Agent trying to send message...');
				await sendMessage({ chatId, message });
				logger.info({ chatId }, 'Agent successfully sent message.');
				return `Message sent successfully.`;
			} catch (err) {
				logger.error({ chatId, err }, 'Agent failed to send message.');
				return `Failed to send message.`;
			}
		},
	});
}
