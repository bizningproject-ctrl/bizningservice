import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { initDB } from './src/db/index.js';
import authRoutes from './src/routes/auth.js';
import servicesRoutes from './src/routes/services.js';
import prosRoutes from './src/routes/pros.js';
import bookingsRoutes from './src/routes/bookings.js';
import applicationsRoutes from './src/routes/applications.js';
import reviewsRoutes from './src/routes/reviews.js';

const app = Fastify({ logger: true });

// Plugins
await app.register(cors, { origin: true });
await app.register(jwt, { secret: process.env.JWT_SECRET || 'fixit-dev-secret-change-in-prod' });

// Database
const db = await initDB();
app.decorate('db', db);

// Auth decorator
app.decorate('authenticate', async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized' });
  }
});

// Routes
await app.register(authRoutes, { prefix: '/api/auth' });
await app.register(servicesRoutes, { prefix: '/api/services' });
await app.register(prosRoutes, { prefix: '/api/pros' });
await app.register(bookingsRoutes, { prefix: '/api/bookings' });
await app.register(applicationsRoutes, { prefix: '/api/applications' });
await app.register(reviewsRoutes, { prefix: '/api/reviews' });

// Health check
app.get('/api/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

// Start
const PORT = process.env.PORT || 3001;
try {
  await app.listen({ port: PORT, host: '0.0.0.0' });
  console.log(`Fixit API running on http://localhost:${PORT}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
