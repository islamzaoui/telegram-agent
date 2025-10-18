import { Bot } from 'gramio';

import env from '@/env';
import { logger } from '@/lib/logger';

import { chatAgent } from './ai';

const bot = new Bot(env.TELEGRAM_BOT_TOKEN);

bot.hears(/larry (.*)/i, async (c) => {
	if (c.args && c.args.input) {
		console.log(c.args);
		await chatAgent({ chatId: c.chat.id, user: c.from, message: c.args.input });
	}
});

bot.onStart(({ info }) => {
	logger.info(`bot https://t.me/${info.username} started`);
});

export default bot;
