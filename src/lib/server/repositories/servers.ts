import type { Collection } from 'mongodb';
import { getDb } from '$utils/mongodb';
import type { Server, ServerStats } from '$lib/types/server';
import { indexServer, removeServerFromIndex, rebuildServersCollection, type TypesenseServer } from '$utils/typesense';

let serversCollection: Collection<Server>;
let statsCollection: Collection<ServerStats>;

async function getServersCollection(): Promise<Collection<Server>> {
	if (!serversCollection) {
		const db = await getDb();
		serversCollection = db.collection<Server>('servers');
	}
	return serversCollection;
}

async function getStatsCollection(): Promise<Collection<ServerStats>> {
	if (!statsCollection) {
		const db = await getDb();
		statsCollection = db.collection<ServerStats>('server_stats');
	}
	return statsCollection;
}

export async function findAllServers(options?: {
	limit?: number;
	skip?: number;
	online?: boolean;
	tags?: string[];
	search?: string;
	sortBy?: 'playerCount' | 'name' | 'createdAt' | 'uptime';
	sortOrder?: 'asc' | 'desc';
}): Promise<Server[]> {
	const collection = await getServersCollection();

	const filter: Record<string, unknown> = {};

	if (options?.online !== undefined) {
		filter.online = options.online;
	}

	if (options?.tags?.length) {
		filter.tags = { $all: options.tags };
	}

	if (options?.search) {
		filter.$or = [
			{ name: { $regex: options.search, $options: 'i' } },
			{ description: { $regex: options.search, $options: 'i' } }
		];
	}

	const sortField = options?.sortBy || 'playerCount';
	const sortOrder = options?.sortOrder === 'asc' ? 1 : -1;

	return collection
		.find(filter)
		.sort({ [sortField]: sortOrder })
		.skip(options?.skip || 0)
		.limit(options?.limit || 50)
		.toArray();
}

export async function findServerById(id: string): Promise<Server | null> {
	const collection = await getServersCollection();
	return collection.findOne({ id });
}

export async function findServerByAddress(address: string, port: number): Promise<Server | null> {
	const collection = await getServersCollection();
	return collection.findOne({ address, port });
}

function serverToTypesense(server: Server): TypesenseServer {
	return {
		id: server.id,
		name: server.name,
		address: server.address,
		port: server.port,
		version: server.version,
		description: server.description,
		playerCount: server.playerCount,
		maxPlayers: server.maxPlayers,
		gamemode: server.gamemode,
		tags: server.tags,
		language: server.language,
		region: server.region,
		online: server.online,
		uptime: server.uptime,
		claimed: server.claimed,
		iconUrl: server.iconUrl,
		createdAt: server.createdAt.getTime(),
		updatedAt: server.updatedAt.getTime()
	};
}

export async function createServer(server: Server): Promise<void> {
	const collection = await getServersCollection();
	await collection.insertOne(server);
	await indexServer(serverToTypesense(server));
}

export async function updateServer(id: string, updates: Partial<Server>): Promise<void> {
	const collection = await getServersCollection();
	await collection.updateOne({ id }, { $set: { ...updates, updatedAt: new Date() } });

	// Re-index in Typesense
	const updated = await findServerById(id);
	if (updated) {
		await indexServer(serverToTypesense(updated));
	}
}

export async function deleteServer(id: string): Promise<void> {
	const collection = await getServersCollection();
	await collection.deleteOne({ id });
	await removeServerFromIndex(id);
}

export async function countServers(online?: boolean): Promise<number> {
	const collection = await getServersCollection();
	const filter = online !== undefined ? { online } : {};
	return collection.countDocuments(filter);
}

export async function addServerStats(stats: ServerStats): Promise<void> {
	const collection = await getStatsCollection();
	await collection.insertOne(stats);
}

export async function getServerStats(
	serverId: string,
	options?: { from?: Date; to?: Date; limit?: number }
): Promise<ServerStats[]> {
	const collection = await getStatsCollection();

	const filter: Record<string, unknown> = { serverId };

	if (options?.from || options?.to) {
		filter.timestamp = {};
		if (options.from) (filter.timestamp as Record<string, Date>).$gte = options.from;
		if (options.to) (filter.timestamp as Record<string, Date>).$lte = options.to;
	}

	return collection
		.find(filter)
		.sort({ timestamp: -1 })
		.limit(options?.limit || 100)
		.toArray();
}

export async function rebuildSearchIndex(): Promise<number> {
	// Delete and recreate the Typesense collection
	await rebuildServersCollection();

	// Get all servers from MongoDB
	const collection = await getServersCollection();
	const servers = await collection.find({}).toArray();

	// Re-index all servers
	for (const server of servers) {
		await indexServer(serverToTypesense(server));
	}

	return servers.length;
}
