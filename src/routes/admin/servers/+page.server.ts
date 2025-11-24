import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { findAllServers, createServer, deleteServer, findServerByAddress, updateServer, rebuildSearchIndex } from '$lib/server/repositories/servers';
import type { Server } from '$lib/types/server';
import { randomUUID } from 'crypto';

export const load: PageServerLoad = async () => {
	const servers = await findAllServers({ limit: 100 });

	// Convert to plain objects (remove MongoDB _id and serialize dates)
	const serializedServers = servers.map((server) => {
		const { _id, ...rest } = server as Server & { _id?: unknown };
		return {
			...rest,
			createdAt: rest.createdAt.toISOString(),
			lastSeenAt: rest.lastSeenAt.toISOString(),
			updatedAt: rest.updatedAt.toISOString()
		};
	});

	return {
		servers: serializedServers
	};
};

export const actions: Actions = {
	add: async ({ request }) => {
		const data = await request.formData();

		const name = data.get('name') as string;
		const address = data.get('address') as string;
		const port = parseInt(data.get('port') as string) || 25565;
		const version = data.get('version') as string || '';
		const description = data.get('description') as string;
		const maxPlayers = parseInt(data.get('maxPlayers') as string) || 100;
		const gamemode = data.get('gamemode') as string || undefined;
		const tagsStr = data.get('tags') as string || '';
		const language = data.get('language') as string || undefined;
		const region = data.get('region') as string || undefined;
		const website = data.get('website') as string || undefined;
		const discord = data.get('discord') as string || undefined;

		if (!name || !address || !description) {
			return fail(400, { error: 'Name, address, and description are required' });
		}

		// Check if server already exists
		const existing = await findServerByAddress(address, port);
		if (existing) {
			return fail(400, { error: 'A server with this address and port already exists' });
		}

		const tags = tagsStr
			.split(',')
			.map((t) => t.trim().toLowerCase())
			.filter((t) => t.length > 0);

		const now = new Date();

		const server: Server = {
			id: randomUUID(),
			name,
			address,
			port,
			version,
			description,
			playerCount: 0,
			maxPlayers,
			gamemode,
			tags,
			language,
			region,
			website,
			discord,
			online: false,
			claimed: false,
			createdAt: now,
			lastSeenAt: now,
			updatedAt: now
		};

		await createServer(server);

		return { success: true };
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id') as string;

		if (!id) {
			return fail(400, { error: 'Server ID is required' });
		}

		await deleteServer(id);

		return { success: true };
	},

	edit: async ({ request }) => {
		const data = await request.formData();

		const id = data.get('id') as string;
		const name = data.get('name') as string;
		const address = data.get('address') as string;
		const port = parseInt(data.get('port') as string) || 25565;
		const version = data.get('version') as string || '';
		const description = data.get('description') as string;
		const longDescription = data.get('longDescription') as string || undefined;
		const playerCount = parseInt(data.get('playerCount') as string) || 0;
		const maxPlayers = parseInt(data.get('maxPlayers') as string) || 100;
		const motd = data.get('motd') as string || undefined;
		const iconUrl = data.get('iconUrl') as string || undefined;
		const bannerUrl = data.get('bannerUrl') as string || undefined;
		const gamemode = data.get('gamemode') as string || undefined;
		const tagsStr = data.get('tags') as string || '';
		const language = data.get('language') as string || undefined;
		const region = data.get('region') as string || undefined;
		const website = data.get('website') as string || undefined;
		const discord = data.get('discord') as string || undefined;
		const online = data.get('online') === 'true';
		const claimed = data.get('claimed') === 'true';
		const uptime = parseInt(data.get('uptime') as string) || undefined;
		const latency = parseInt(data.get('latency') as string) || undefined;

		if (!id || !name || !address || !description) {
			return fail(400, { error: 'ID, name, address, and description are required' });
		}

		const tags = tagsStr
			.split(',')
			.map((t) => t.trim().toLowerCase())
			.filter((t) => t.length > 0);

		await updateServer(id, {
			name,
			address,
			port,
			version,
			description,
			longDescription,
			playerCount,
			maxPlayers,
			motd,
			iconUrl,
			bannerUrl,
			gamemode,
			tags,
			language,
			region,
			website,
			discord,
			online,
			claimed,
			uptime,
			latency
		});

		return { success: true, action: 'edit' };
	},

	rebuildIndex: async () => {
		const count = await rebuildSearchIndex();
		return { success: true, action: 'rebuildIndex', count };
	}
};
