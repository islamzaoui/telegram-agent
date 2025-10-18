import { Bot } from 'gramio';

import env from '@/env';
import { logger } from '@/lib/logger';

import { chatAgent } from './ai';

const bot = new Bot(env.TELEGRAM_BOT_TOKEN);

bot.hears(/.*/, async (c) => {
	if (c.hasText()) {
		await chatAgent({ chatId: c.chat.id, user: c.from, message: c.text });
	}
});

bot.onStart(({ info }) => {
	logger.info(`bot https://t.me/${info.username} started`);
});

export default bot;
