import Typesense from 'typesense';
import { TYPESENSE_API_KEY, TYPESENSE_HOST, TYPESENSE_PORT, TYPESENSE_PROTOCOL } from '$env/static/private';

export const typesenseClient = new Typesense.Client({
	nodes: [
		{
			host: TYPESENSE_HOST || 'localhost',
			port: parseInt(TYPESENSE_PORT || '8108'),
			protocol: TYPESENSE_PROTOCOL || 'http'
		}
	],
	apiKey: TYPESENSE_API_KEY || 'xyz',
	connectionTimeoutSeconds: 2
});

export const SERVERS_COLLECTION = 'servers';

export const serversSchema = {
	name: SERVERS_COLLECTION,
	fields: [
		{ name: 'id', type: 'string' as const },
		{ name: 'name', type: 'string' as const },
		{ name: 'address', type: 'string' as const },
		{ name: 'port', type: 'int32' as const },
		{ name: 'version', type: 'string' as const, optional: true },
		{ name: 'description', type: 'string' as const },
		{ name: 'playerCount', type: 'int32' as const },
		{ name: 'maxPlayers', type: 'int32' as const },
		{ name: 'gamemode', type: 'string' as const, optional: true, facet: true },
		{ name: 'tags', type: 'string[]' as const, facet: true },
		{ name: 'language', type: 'string' as const, optional: true, facet: true },
		{ name: 'region', type: 'string' as const, optional: true, facet: true },
		{ name: 'online', type: 'bool' as const, facet: true },
		{ name: 'uptime', type: 'int32' as const, optional: true },
		{ name: 'claimed', type: 'bool' as const, facet: true },
		{ name: 'iconUrl', type: 'string' as const, optional: true },
		{ name: 'createdAt', type: 'int64' as const },
		{ name: 'updatedAt', type: 'int64' as const }
	],
	default_sorting_field: 'playerCount'
};

export async function ensureServersCollection(): Promise<void> {
	try {
		await typesenseClient.collections(SERVERS_COLLECTION).retrieve();
	} catch {
		await typesenseClient.collections().create(serversSchema);
	}
}

export interface TypesenseServer {
	id: string;
	name: string;
	address: string;
	port: number;
	version?: string;
	description: string;
	playerCount: number;
	maxPlayers: number;
	gamemode?: string;
	tags: string[];
	language?: string;
	region?: string;
	online: boolean;
	uptime?: number;
	claimed: boolean;
	iconUrl?: string;
	createdAt: number;
	updatedAt: number;
}

export async function indexServer(server: TypesenseServer): Promise<void> {
	await ensureServersCollection();
	await typesenseClient.collections(SERVERS_COLLECTION).documents().upsert(server);
}

export async function removeServerFromIndex(id: string): Promise<void> {
	try {
		await typesenseClient.collections(SERVERS_COLLECTION).documents(id).delete();
	} catch {
		// Ignore if not found
	}
}

export interface SearchOptions {
	query: string;
	page?: number;
	perPage?: number;
	filters?: {
		online?: boolean;
		gamemode?: string;
		tags?: string[];
		language?: string;
		region?: string;
	};
	sortBy?: 'playerCount' | 'name' | 'createdAt';
	sortOrder?: 'asc' | 'desc';
}

export async function deleteServersCollection(): Promise<void> {
	try {
		await typesenseClient.collections(SERVERS_COLLECTION).delete();
	} catch {
		// Ignore if not found
	}
}

export async function rebuildServersCollection(): Promise<void> {
	await deleteServersCollection();
	await typesenseClient.collections().create(serversSchema);
}

export async function searchServers(options: SearchOptions) {
	await ensureServersCollection();

	const filterParts: string[] = [];

	if (options.filters?.online !== undefined) {
		filterParts.push(`online:${options.filters.online}`);
	}
	if (options.filters?.gamemode) {
		filterParts.push(`gamemode:=${options.filters.gamemode}`);
	}
	if (options.filters?.tags?.length) {
		filterParts.push(`tags:[${options.filters.tags.join(',')}]`);
	}
	if (options.filters?.language) {
		filterParts.push(`language:=${options.filters.language}`);
	}
	if (options.filters?.region) {
		filterParts.push(`region:=${options.filters.region}`);
	}

	const sortField = options.sortBy || 'playerCount';
	const sortOrder = options.sortOrder || 'desc';

	const result = await typesenseClient
		.collections(SERVERS_COLLECTION)
		.documents()
		.search({
			q: options.query || '*',
			query_by: 'name,description,tags',
			filter_by: filterParts.length > 0 ? filterParts.join(' && ') : undefined,
			sort_by: `${sortField}:${sortOrder}`,
			page: options.page || 1,
			per_page: options.perPage || 20,
			facet_by: 'gamemode,tags,language,region,online'
		});

	return result;
}
