import Fastify from 'fastify';
import * as fs from 'fs';
import cors from '@fastify/cors'


/* ======================= INIT CONST VARIABLES ======================= */


// FOR FASTIFY
const	fastify = Fastify({
	https: {
		key: fs.readFileSync('/run/secrets/ssl_key_back', 'utf8'),
		cert: fs.readFileSync('/run/secrets/ssl_crt_back', 'utf8'),
	},
	logger: true
});

fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});


/* ======================= SERVER ======================= */


fastify.get('/api', async (request, reply) => {
	return { hello: 'world' };
});

fastify.get('/api/user', async (request, reply) => {
  return { message: 'Hello depuis Fastify !' };
});

fastify.post('/api/signup', async (request, reply) => {
  const body = request.body;
  return { received: body };
});

const start = async () => {
	try {
		await fastify.listen({ port: 9090, host: '0.0.0.0' });
		console.log(`Server started on https://localhost:9090`);
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};
start();
