import Fastify from 'fastify';
import * as fs from 'fs';

const sqlite3 = require('sqlite3').verbose();

const fastify = Fastify({
	logger: true
});


const db = new sqlite3.Database('/app/dist/db/mydatabase.db', (err: string) => {
  if (err) console.error(err);
});

fastify.get('/', async (request, reply) => {
	return { hello: 'world' };
});


const start = async () => {
	try {
		await fastify.listen({ port: 9090 });
		console.log(`Server started on http://localhost:9090`);
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
}
start()
