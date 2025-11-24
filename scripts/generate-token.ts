import bcrypt from 'bcryptjs';
import { password, confirm } from '@inquirer/prompts';
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
	console.log(colorize('\n  Admin Token Generator\n', colors.bold, colors.cyan));

	const pwd = await password({
		message: 'Enter password',
		mask: '*'
	});

	if (!pwd.trim()) {
		console.error(colorize('\n  Error: Password cannot be empty\n', colors.red));
		process.exit(1);
	}

	const confirmPwd = await password({
		message: 'Confirm password',
		mask: '*'
	});

	if (pwd !== confirmPwd) {
		console.error(colorize('\n  Error: Passwords do not match\n', colors.red));
		process.exit(1);
	}

	console.log(colorize('\n  Generating hash...', colors.dim));
	const hash = await bcrypt.hash(pwd, 12);

	console.log(colorize('\n  Generated hash:', colors.green));
	console.log(colorize(`  ${hash}`, colors.dim));

	const addToEnv = await confirm({
		message: 'Add as ADMIN_TOKEN to .env?',
		default: true
	});

	if (addToEnv) {
		const envPath = path.join(process.cwd(), '.env');
		let envContent = '';

		if (fs.existsSync(envPath)) {
			envContent = fs.readFileSync(envPath, 'utf-8');

			if (envContent.includes('ADMIN_TOKEN=')) {
				envContent = envContent.replace(/^ADMIN_TOKEN=.*$/m, `ADMIN_TOKEN='${hash}'`);
			} else {
				envContent = envContent.trimEnd() + `\nADMIN_TOKEN='${hash}'\n`;
			}
		} else {
			envContent = `ADMIN_TOKEN='${hash}'\n`;
		}

		fs.writeFileSync(envPath, envContent);
		console.log(colorize('\n  ADMIN_TOKEN added to .env\n', colors.green));
	} else {
		console.log('');
	}
}

main().catch((err) => {
	console.error(colorize(`\n  Error: ${err.message}\n`, colors.red));
	process.exit(1);
});
