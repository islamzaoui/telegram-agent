import { withRetries } from 'gramio/utils';

import bot from '@/bot';

interface SendMessageArgs {
	chatId: number;
	message: string;
}

async function sendMessage({ chatId, message }: SendMessageArgs) {
	await withRetries(() =>
		bot.api.sendMessage({
			suppress: true,
			chat_id: chatId,
			text: message,
		})
	);
}

export default { sendMessage };
