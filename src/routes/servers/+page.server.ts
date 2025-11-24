import type { PageServerLoad } from './$types';
import { searchServers } from '$utils/typesense';

export const load: PageServerLoad = async ({ url }) => {
	const query = url.searchParams.get('q') || '';
	const page = parseInt(url.searchParams.get('page') || '1');
	const gamemode = url.searchParams.get('gamemode') || undefined;
	const region = url.searchParams.get('region') || undefined;
	const language = url.searchParams.get('language') || undefined;
	const online = url.searchParams.get('online');
	const tagsParam = url.searchParams.get('tags');
	const sortBy = (url.searchParams.get('sort') as 'playerCount' | 'name' | 'createdAt') || 'playerCount';
	const sortOrder = (url.searchParams.get('order') as 'asc' | 'desc') || 'desc';

	const tags = tagsParam ? tagsParam.split(',').filter(Boolean) : undefined;

	try {
		const result = await searchServers({
			query,
			page,
			perPage: 20,
			filters: {
				online: online === 'true' ? true : online === 'false' ? false : undefined,
				gamemode,
				region,
				language,
				tags
			},
			sortBy,
			sortOrder
		});

		const servers = (result.hits || []).map((hit) => hit.document);
		const facets = result.facet_counts || [];

		// Extract facet values
		const facetData: Record<string, { value: string; count: number }[]> = {};
		for (const facet of facets) {
			facetData[facet.field_name] = facet.counts.map((c) => ({
				value: c.value,
				count: c.count
			}));
		}

		return {
			servers,
			facets: facetData,
			totalFound: result.found || 0,
			page,
			totalPages: Math.ceil((result.found || 0) / 20),
			query,
			filters: {
				gamemode,
				region,
				language,
				online: online || undefined,
				tags: tags || []
			},
			sortBy,
			sortOrder
		};
	} catch (error) {
		console.error('Search error:', error);
		return {
			servers: [],
			facets: {},
			totalFound: 0,
			page: 1,
			totalPages: 0,
			query,
			filters: {
				gamemode,
				region,
				language,
				online: online || undefined,
				tags: tags || []
			},
			sortBy,
			sortOrder,
			error: 'Search service unavailable'
		};
	}
};
