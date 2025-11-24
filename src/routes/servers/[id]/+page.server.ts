import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { findServerById } from '$lib/server/repositories/servers';
import type { Server } from '$lib/types/server';

export const load: PageServerLoad = async ({ params }) => {
	const server = await findServerById(params.id);

	if (!server) {
		throw error(404, 'Server not found');
	}

	// Convert to plain object (remove MongoDB _id and serialize dates)
	const { _id, ...rest } = server as Server & { _id?: unknown };
	const serializedServer = {
		...rest,
		createdAt: rest.createdAt.toISOString(),
		lastSeenAt: rest.lastSeenAt.toISOString(),
		updatedAt: rest.updatedAt.toISOString()
	};

	return {
		server: serializedServer
	};
};
