export default async function bookingsRoutes(app) {
  // Create booking (customer)
  app.post('/', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { pro_id, category_slug, preferred_date, preferred_time, address, description } = request.body || {};

    if (!category_slug || !preferred_date || !address) {
      return reply.code(400).send({ error: 'category_slug, preferred_date, and address are required' });
    }

    const category = app.db.prepare('SELECT id FROM service_categories WHERE slug = ?').get(category_slug);
    if (!category) return reply.code(404).send({ error: 'Service category not found' });

    // Validate pro if provided
    if (pro_id) {
      const pro = app.db.prepare('SELECT id FROM pro_profiles WHERE id = ? AND category_id = ?').get(pro_id, category.id);
      if (!pro) return reply.code(404).send({ error: 'Professional not found in this category' });
    }

    const result = app.db.prepare(`
      INSERT INTO bookings (customer_id, pro_id, category_id, preferred_date, preferred_time, address, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(request.user.id, pro_id || null, category.id, preferred_date, preferred_time || null, address, description || null);

    return reply.code(201).send({
      id: result.lastInsertRowid,
      status: 'pending',
      message: 'Booking created successfully'
    });
  });

  // Get my bookings (customer or pro)
  app.get('/', { preHandler: [app.authenticate] }, async (request) => {
    const { status, page = 1, limit = 10 } = request.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const userId = request.user.id;
    const role = request.user.role;

    let where;
    const params = [];

    if (role === 'pro') {
      const profile = app.db.prepare('SELECT id FROM pro_profiles WHERE user_id = ?').get(userId);
      if (!profile) return { bookings: [], total: 0 };
      where = 'WHERE b.pro_id = ?';
      params.push(profile.id);
    } else if (role === 'admin') {
      where = 'WHERE 1=1';
    } else {
      where = 'WHERE b.customer_id = ?';
      params.push(userId);
    }

    if (status) {
      where += ' AND b.status = ?';
      params.push(status);
    }

    const countRow = app.db.prepare(`SELECT COUNT(*) AS total FROM bookings b ${where}`).get(...params);

    const bookings = app.db.prepare(`
      SELECT b.*,
        cust.full_name AS customer_name, cust.email AS customer_email, cust.phone AS customer_phone,
        sc.slug AS category_slug, sc.name_en AS category_name, sc.icon AS category_icon,
        pro_user.full_name AS pro_name
      FROM bookings b
      JOIN users cust ON cust.id = b.customer_id
      JOIN service_categories sc ON sc.id = b.category_id
      LEFT JOIN pro_profiles pp ON pp.id = b.pro_id
      LEFT JOIN users pro_user ON pro_user.id = pp.user_id
      ${where}
      ORDER BY b.created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, parseInt(limit), offset);

    return {
      bookings,
      total: countRow.total,
      page: parseInt(page),
      totalPages: Math.ceil(countRow.total / parseInt(limit))
    };
  });

  // Get single booking
  app.get('/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
    const booking = app.db.prepare(`
      SELECT b.*,
        cust.full_name AS customer_name, cust.email AS customer_email,
        sc.slug AS category_slug, sc.name_en AS category_name,
        pro_user.full_name AS pro_name, pp.price_per_hour AS pro_rate
      FROM bookings b
      JOIN users cust ON cust.id = b.customer_id
      JOIN service_categories sc ON sc.id = b.category_id
      LEFT JOIN pro_profiles pp ON pp.id = b.pro_id
      LEFT JOIN users pro_user ON pro_user.id = pp.user_id
      WHERE b.id = ?
    `).get(request.params.id);

    if (!booking) return reply.code(404).send({ error: 'Booking not found' });

    // Access control
    const userId = request.user.id;
    const role = request.user.role;
    if (role !== 'admin' && booking.customer_id !== userId) {
      const profile = app.db.prepare('SELECT id FROM pro_profiles WHERE user_id = ?').get(userId);
      if (!profile || profile.id !== booking.pro_id) {
        return reply.code(403).send({ error: 'Forbidden' });
      }
    }

    return { booking };
  });

  // Update booking status
  app.patch('/:id/status', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { status } = request.body || {};
    const validStatuses = ['confirmed', 'in_progress', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return reply.code(400).send({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const booking = app.db.prepare('SELECT * FROM bookings WHERE id = ?').get(request.params.id);
    if (!booking) return reply.code(404).send({ error: 'Booking not found' });

    // Access control
    const role = request.user.role;
    if (role === 'customer' && status !== 'cancelled') {
      return reply.code(403).send({ error: 'Customers can only cancel bookings' });
    }

    app.db.prepare("UPDATE bookings SET status = ?, updated_at = datetime('now') WHERE id = ?")
      .run(status, request.params.id);

    // If completed, update pro job count
    if (status === 'completed' && booking.pro_id) {
      app.db.prepare('UPDATE pro_profiles SET total_jobs = total_jobs + 1 WHERE id = ?')
        .run(booking.pro_id);
    }

    return { success: true, status };
  });
}
