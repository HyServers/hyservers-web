import type { PageServerLoad } from './$types';
import { countServers } from '$lib/server/repositories/servers';

export const load: PageServerLoad = async () => {
	const [serverCount, onlineCount] = await Promise.all([
		countServers(),
		countServers(true)
	]);

	return {
		serverCount,
		onlineCount
	};
};
