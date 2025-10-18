import process from 'node:process';
import { z } from 'zod';

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
	TELEGRAM_BOT_TOKEN: z.string(),
	GEMINI_API_KEY: z.string(),
});

const { data: env, error } = envSchema.safeParse({
	NODE_ENV: Bun.env.NODE_ENV,
	TELEGRAM_BOT_TOKEN: Bun.env.TELEGRAM_BOT_TOKEN,
	GEMINI_API_KEY: Bun.env.GEMINI_API_KEY,
});

if (error) {
	console.error(`❌ Invalid env: ${JSON.stringify(z.flattenError(error).fieldErrors, null, 2)}`);
	process.exit(1);
}

export default env!;
