const allowedTags = ['larry', 'لاري', '@bro_larry_bot'];

export default function isAllowedTag(userInput: string) {
	return allowedTags.some((tag) => userInput.toLowerCase().startsWith(tag));
}
