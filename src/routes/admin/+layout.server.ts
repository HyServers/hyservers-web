import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { isAuthenticated } from '$lib/server/auth';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	// Don't check auth on login page
	if (url.pathname === '/admin/login') {
		return {};
	}

	if (!isAuthenticated(cookies)) {
		throw redirect(302, '/admin/login');
	}

	return {};
};
