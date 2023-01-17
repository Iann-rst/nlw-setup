/**
 * Back-end API RESTful
 */

import Fastify from 'fastify';

const app = Fastify();

app.get('/', () => {
  return 'Hello NLW Setup'
})

app.listen({
  port: 3333
})