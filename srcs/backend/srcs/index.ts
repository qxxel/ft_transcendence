import Fastify from 'fastify';
import * as fs from 'fs';
import cors from '@fastify/cors'


/* ======================= INIT CONST VARIABLES ======================= */

// FOR SQLITE
const			sqlite3 = require('sqlite3');
const			dbname = '/app/dist/db/mydatabase.db';
export const	db = new sqlite3.Database(dbname, (err: string) => {
	if (err)
		console.error(err);

	console.log(`Database started on ${dbname}`);
});


// FOR FASTIFY
export const	fastify = Fastify({
	https: {
		key: fs.readFileSync('/run/secrets/ssl_key_back', 'utf8'),
		cert: fs.readFileSync('/run/secrets/ssl_crt_back', 'utf8'),
	},
	logger: true
});


/* ======================= SERVER ======================= */


fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

const start = async () => {
	try {
		await fastify.listen({ port: 3000, host: '0.0.0.0' });
		console.log(`Server started on https://localhost:3000`);
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};
start();
