import process from 'node:process';
import { z } from 'zod';

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
	TELEGRAM_BOT_TOKEN: z.string(),
	GEMINI_API_KEY: z.string(),
});

const { data: env, error } = envSchema.safeParse(Bun.env);

if (error) {
	console.error(`❌ Invalid env: ${JSON.stringify(z.flattenError(error).fieldErrors, null, 2)}`);
	process.exit(1);
}

export default env!;
