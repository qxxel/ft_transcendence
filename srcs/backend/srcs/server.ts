import Fastify from 'fastify';

const fastify = Fastify({
	logger: true
});


fastify.get('/', async (request, reply) => {
	return { hello: 'world' };
});


const start = async () => {
	try {
		await fastify.listen({ port: 9092 });
		console.log(`Server started on http://localhost:9092`);
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
}
start()
