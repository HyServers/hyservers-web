import * as crypto from 'crypto';
import { confirm } from '@inquirer/prompts';
import * as fs from 'fs';
import * as path from 'path';

// Colors
const colors = {
	reset: '\x1b[0m',
	bold: '\x1b[1m',
	dim: '\x1b[2m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	cyan: '\x1b[36m'
};

function colorize(text: string, ...codes: string[]): string {
	return codes.join('') + text + colors.reset;
}

async function main() {
	console.log(colorize('\n  JWT Secret Generator\n', colors.bold, colors.cyan));

	const secret = crypto.randomBytes(32).toString('hex');

	console.log(colorize('  Generated secret:', colors.green));
	console.log(colorize(`  ${secret}`, colors.dim));

	const addToEnv = await confirm({
		message: 'Add as JWT_SECRET to .env?',
		default: true
	});

	if (addToEnv) {
		const envPath = path.join(process.cwd(), '.env');
		let envContent = '';

		if (fs.existsSync(envPath)) {
			envContent = fs.readFileSync(envPath, 'utf-8');

			if (envContent.includes('JWT_SECRET=')) {
				envContent = envContent.replace(/^JWT_SECRET=.*$/m, `JWT_SECRET='${secret}'`);
			} else {
				envContent = envContent.trimEnd() + `\nJWT_SECRET='${secret}'\n`;
			}
		} else {
			envContent = `JWT_SECRET='${secret}'\n`;
		}

		fs.writeFileSync(envPath, envContent);
		console.log(colorize('\n  JWT_SECRET added to .env\n', colors.green));
	} else {
		console.log('');
	}
}

main().catch((err) => {
	console.error(colorize(`\n  Error: ${err.message}\n`, colors.red));
	process.exit(1);
});
