import type { PhotoSize } from 'gramio';

import env from '@/env';
import logger from '@/lib/logger';

interface TelegramFileResponse {
	ok: boolean;
	result?: {
		file_id: string;
		file_unique_id: string;
		file_size?: number;
		file_path?: string;
	};
	description?: string;
}

async function getFileURL(fileId: string): Promise<URL> {
	const response = await fetch(
		`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`
	);
	if (!response.ok) throw new Error('Failed to get file URL');

	const data = (await response.json()) as TelegramFileResponse;
	if (!data.result?.file_path) throw new Error('Failed to get file URL');

	const url = new URL(
		`https://api.telegram.org/file/bot${env.TELEGRAM_BOT_TOKEN}/${data.result.file_path}`
	);
	logger.info({ fileId, url }, 'Got file URL');
	return url;
}

function selectBestPhoto(photo: PhotoSize[]): PhotoSize | undefined {
	return photo.reduce((prev, curr) => ((prev.fileSize ?? 0) > (curr.fileSize ?? 0) ? prev : curr));
}

export default { getFileURL, selectBestPhoto };
