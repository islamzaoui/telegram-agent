import type { PrettyOptions } from 'pino-pretty';

import pino from 'pino';
import pinoPretty from 'pino-pretty';

import env from '@/env';

const prettyOptions: PrettyOptions = {
	colorize: true,
	translateTime: 'yyyy-mm-dd HH:MM:ss',
	ignore: 'pid,hostname',
};

export default pino(
	{
		level: 'debug',
	},
	env.NODE_ENV === 'development' ? pinoPretty(prettyOptions) : undefined
);
