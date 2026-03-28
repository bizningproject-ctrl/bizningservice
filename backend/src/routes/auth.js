import bcrypt from 'bcryptjs';

export default async function authRoutes(app) {
  // Register
  app.post('/register', async (request, reply) => {
    const { email, password, full_name, phone, role = 'customer' } = request.body || {};

    if (!email || !password || !full_name) {
      return reply.code(400).send({ error: 'Email, password, and full_name are required' });
    }

    if (!['customer', 'pro'].includes(role)) {
      return reply.code(400).send({ error: 'Role must be customer or pro' });
    }

    const existing = app.db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return reply.code(409).send({ error: 'Email already registered' });
    }

    const hash = bcrypt.hashSync(password, 10);
    const result = app.db.prepare(
      'INSERT INTO users (email, password, full_name, phone, role) VALUES (?, ?, ?, ?, ?)'
    ).run(email, hash, full_name, phone || null, role);

    const token = app.jwt.sign({ id: result.lastInsertRowid, email, role });

    return reply.code(201).send({
      token,
      user: { id: result.lastInsertRowid, email, full_name, role }
    });
  });

  // Login
  app.post('/login', async (request, reply) => {
    const { email, password } = request.body || {};

    if (!email || !password) {
      return reply.code(400).send({ error: 'Email and password are required' });
    }

    const user = app.db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return reply.code(401).send({ error: 'Invalid email or password' });
    }

    const token = app.jwt.sign({ id: user.id, email: user.email, role: user.role });

    return {
      token,
      user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role }
    };
  });

  // Get current user
  app.get('/me', { preHandler: [app.authenticate] }, async (request) => {
    const user = app.db.prepare('SELECT id, email, full_name, phone, role, avatar_url, created_at FROM users WHERE id = ?')
      .get(request.user.id);

    if (!user) return { error: 'User not found' };

    // If pro, include profile
    if (user.role === 'pro') {
      const profile = app.db.prepare('SELECT * FROM pro_profiles WHERE user_id = ?').get(user.id);
      return { ...user, profile };
    }

    return user;
  });
}
