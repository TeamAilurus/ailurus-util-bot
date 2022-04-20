import * as fs from 'fs';
import * as path from 'path';

export function readdirRecursive(directory: string): string[] {
	const result = [];

	(function read(dir) {
		const files = fs.readdirSync(dir);

		for (const file of files) {
			const filepath = path.join(dir, file);

			if (fs.statSync(filepath).isDirectory()) {
				read(filepath);
			} else {
				result.push(filepath);
			}
		}
	})(directory);

	return result;
}
