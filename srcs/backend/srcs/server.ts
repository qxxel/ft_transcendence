import Fastify from 'fastify';
import * as fs from 'fs';


/* ======================= INIT CONST VARIABLES ======================= */

// FOR DATABASE
const	sqlite3 = require('sqlite3')//.verbose();
const	dbname = '/app/dist/db/mydatabase.db'

// FOR FASTIFY
const	fastify = Fastify({
	logger: true
});


/* ======================= DATABASE ======================= */

/*	SQLITE METHODS

	SELECT
		.get	=> get back the first line
		.all	=> get back all the lines
		.each	=> get back the lines one by one
	
	CREATE / INSERT / ...
		.run

*/

const db = new sqlite3.Database(dbname, (err: string) => {
	if (err)
		console.error(err);

	console.log("Database started");
});

db.run();

// db.close((err: string) => {
// 	if (err)
// 		console.error(err);

// 	console.log('Database closed');
// });


/* ======================= SERVER ======================= */


// Autoriser le front à appeler ton API
await fastify.register(cors, {
  origin: '*', // ou précise ton front: 'http://localhost:3000'
});

fastify.get('/', async (request, reply) => {
	return { hello: 'world' };
});

fastify.get('/api/hello', async (request, reply) => {
  return { message: 'Hello depuis Fastify !' };
});

fastify.post('/api/data', async (request, reply) => {
  const body = request.body;
  return { received: body };
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
