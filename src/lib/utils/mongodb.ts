import { MongoClient, type Db } from 'mongodb';
import { MONGODB_URI } from '$env/static/private';

const client = new MongoClient(MONGODB_URI);

let db: Db;

export async function getDb(): Promise<Db> {
	if (!db) {
		await client.connect();
		db = client.db('hyservers');
	}
	return db;
}

export { client };
