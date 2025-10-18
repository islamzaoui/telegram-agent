import { Bot } from 'gramio';

import env from '@/env';
import { logger } from '@/lib/logger';
import isAllowedTag from '@/utils/allowed-tags';
import { selectBestPhoto } from '@/utils/files';

import { chatAgent } from './ai';

const bot = new Bot(env.TELEGRAM_BOT_TOKEN);

bot.hears(/(.*)/, async (c) => {
	if (c.args && c.args.input && isAllowedTag(c.args.input)) {
		logger.info({ chatId: c.chat.id, username: c.from.username }, 'Chat message received');

		const photo = c.photo ? selectBestPhoto(c.photo) : undefined;
		await chatAgent({
			chatId: c.chat.id,
			user: c.from,
			messageId: c.id,
			content: c.args.input,
			photo,
			document: c.document,
		});

		logger.info({ chatId: c.chat.id, username: c.from.username }, 'Chat message processed');
	}
});

bot.onStart(({ info }) => {
	logger.info(`bot https://t.me/${info.username} started`);
});

export default bot;
