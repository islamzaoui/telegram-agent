import { Bot } from 'gramio';

import env from '@/env';
import { logger } from '@/lib/logger';
import isAllowedTag from '@/utils/allowed-tags';

import { chatAgent } from './ai';

const bot = new Bot(env.TELEGRAM_BOT_TOKEN);

bot.hears(/(.*)/, async (c) => {
	if (c.args && c.args.input && isAllowedTag(c.args.input)) {
		await chatAgent({
			chatId: c.chat.id,
			user: c.from,
			messageId: c.id,
			content: c.args.input,
		});
	}
});

bot.onStart(({ info }) => {
	logger.info(`bot https://t.me/${info.username} started`);
});

export default bot;
