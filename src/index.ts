import process from 'node:process';

import bot from '@/bot';
import logger from '@/lib/logger';

bot.start();

const signals = ['SIGINT', 'SIGTERM'];
for (const signal of signals) {
	process.on(signal, async () => {
		logger.info(`Received ${signal}. Initiating graceful shutdown...`);
		await bot.stop();
		process.exit(0);
	});
}

process.on('uncaughtException', (err) => {
	logger.error({ err });
});

process.on('unhandledRejection', (err) => {
	logger.error({ err });
});
