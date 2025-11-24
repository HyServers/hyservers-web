export interface Server {
	/** Unique identifier for the server */
	id: string;

	/** Display name of the server */
	name: string;

	/** Server address (hostname or IP) */
	address: string;

	/** Server port (default likely 25565 like Minecraft, but TBD) */
	port: number;

	/** Hytale version the server is running */
	version: string;

	/** Short description or tagline */
	description: string;

	/** Full description with markdown support */
	longDescription?: string;

	/** Current number of players online */
	playerCount: number;

	/** Maximum player capacity */
	maxPlayers: number;

	/** Server's message of the day / status text */
	motd?: string;

	/** URL to server icon/logo */
	iconUrl?: string;

	/** URL to server banner image */
	bannerUrl?: string;

	/** Server gamemode or type (e.g., "Survival", "Creative", "Minigames", "RPG") */
	gamemode?: string;

	/** Tags for categorization and search */
	tags: string[];

	/** Primary language of the server community */
	language?: string;

	/** Country/region where the server is hosted */
	region?: string;

	/** Whether the server is currently online */
	online: boolean;

	/** Server uptime percentage (0-100) */
	uptime?: number;

	/** Average ping/latency in ms (from our monitoring) */
	latency?: number;

	/** Website URL */
	website?: string;

	/** Discord invite URL */
	discord?: string;

	/** Whether the server has been claimed by its owner */
	claimed: boolean;

	/** Owner's user ID (if claimed) */
	ownerId?: string;

	/** When the server was first discovered/added */
	createdAt: Date;

	/** When the server was last seen online */
	lastSeenAt: Date;

	/** When server info was last updated */
	updatedAt: Date;
}

export interface ServerStats {
	/** Server ID */
	serverId: string;

	/** Timestamp of the stats snapshot */
	timestamp: Date;

	/** Player count at this time */
	playerCount: number;

	/** Whether server was online */
	online: boolean;

	/** Latency in ms */
	latency?: number;
}
