import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { clearAuthCookie } from '$lib/server/auth';

export const actions: Actions = {
	default: async ({ cookies }) => {
		clearAuthCookie(cookies);
		throw redirect(302, '/admin/login');
	}
};
