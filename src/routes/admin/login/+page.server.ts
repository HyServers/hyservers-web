import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { verifyPassword, setAuthCookie, isAuthenticated } from '$lib/server/auth';

export const load: PageServerLoad = async ({ cookies }) => {
	if (isAuthenticated(cookies)) {
		throw redirect(302, '/admin');
	}
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const password = data.get('password') as string;

		if (!password) {
			return fail(400, { error: 'Password is required' });
		}

		const valid = await verifyPassword(password);

		if (!valid) {
			return fail(401, { error: 'Invalid password' });
		}

		setAuthCookie(cookies);
		throw redirect(302, '/admin');
	}
};
