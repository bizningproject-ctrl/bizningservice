export default async function applicationsRoutes(app) {
  // Submit application (public)
  app.post('/', async (request, reply) => {
    const { first_name, last_name, email, phone, category_slug, experience_years, about } = request.body || {};

    if (!first_name || !last_name || !email || !phone || !category_slug) {
      return reply.code(400).send({ error: 'first_name, last_name, email, phone, and category_slug are required' });
    }

    const category = app.db.prepare('SELECT id FROM service_categories WHERE slug = ?').get(category_slug);
    if (!category) return reply.code(404).send({ error: 'Service category not found' });

    // Check duplicate
    const existing = app.db.prepare('SELECT id FROM applications WHERE email = ? AND status = ?').get(email, 'pending');
    if (existing) {
      return reply.code(409).send({ error: 'You already have a pending application' });
    }

    const result = app.db.prepare(`
      INSERT INTO applications (first_name, last_name, email, phone, category_id, experience_years, about)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(first_name, last_name, email, phone, category.id, experience_years || null, about || null);

    return reply.code(201).send({
      id: result.lastInsertRowid,
      status: 'pending',
      message: 'Application submitted successfully'
    });
  });

  // List applications (admin only)
  app.get('/', { preHandler: [app.authenticate] }, async (request, reply) => {
    if (request.user.role !== 'admin') {
      return reply.code(403).send({ error: 'Admin access required' });
    }

    const { status, page = 1, limit = 20 } = request.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let where = 'WHERE 1=1';
    const params = [];

    if (status) {
      where += ' AND a.status = ?';
      params.push(status);
    }

    const countRow = app.db.prepare(`SELECT COUNT(*) AS total FROM applications a ${where}`).get(...params);

    const applications = app.db.prepare(`
      SELECT a.*, sc.slug AS category_slug, sc.name_en AS category_name
      FROM applications a
      JOIN service_categories sc ON sc.id = a.category_id
      ${where}
      ORDER BY a.created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, parseInt(limit), offset);

    return {
      applications,
      total: countRow.total,
      page: parseInt(page),
      totalPages: Math.ceil(countRow.total / parseInt(limit))
    };
  });

  // Approve/reject application (admin only)
  app.patch('/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
    if (request.user.role !== 'admin') {
      return reply.code(403).send({ error: 'Admin access required' });
    }

    const { status } = request.body || {};
    if (!['approved', 'rejected'].includes(status)) {
      return reply.code(400).send({ error: 'Status must be approved or rejected' });
    }

    const application = app.db.prepare('SELECT * FROM applications WHERE id = ?').get(request.params.id);
    if (!application) return reply.code(404).send({ error: 'Application not found' });

    app.db.prepare('UPDATE applications SET status = ? WHERE id = ?').run(status, request.params.id);

    // If approved, create user + pro profile
    if (status === 'approved') {
      const bcrypt = await import('bcryptjs');
      const tempPassword = bcrypt.default.hashSync('welcome123', 10);

      const userResult = app.db.prepare(
        "INSERT INTO users (email, password, full_name, phone, role) VALUES (?, ?, ?, ?, 'pro')"
      ).run(application.email, tempPassword, `${application.first_name} ${application.last_name}`, application.phone);

      app.db.prepare(`
        INSERT INTO pro_profiles (user_id, category_id, specialty, tags, price_per_hour, experience_years)
        VALUES (?, ?, ?, '[]', 50, ?)
      `).run(userResult.lastInsertRowid, application.category_id, 'New Professional', application.experience_years || 0);
    }

    return { success: true, status };
  });
}
