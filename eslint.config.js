import antfu from '@antfu/eslint-config';
import prettier from 'eslint-config-prettier';

export default antfu(
	{
		type: 'app',
		stylistic: false,
		rules: {
			'no-console': ['warn'],
			'antfu/no-top-level-await': ['off'],
			'node/no-process-env': ['error'],
			'perfectionist/sort-imports': [
				'error',
				{
					tsconfigRootDir: '.',
				},
			],
			'unicorn/filename-case': [
				'error',
				{
					case: 'kebabCase',
					ignore: ['README.md'],
				},
			],
		},
	},
	prettier
);
