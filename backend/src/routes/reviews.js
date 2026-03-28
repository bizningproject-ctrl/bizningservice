export default async function reviewsRoutes(app) {
  // Create review (customer, after completed booking)
  app.post('/', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { booking_id, rating, comment } = request.body || {};

    if (!booking_id || !rating) {
      return reply.code(400).send({ error: 'booking_id and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return reply.code(400).send({ error: 'Rating must be between 1 and 5' });
    }

    const booking = app.db.prepare('SELECT * FROM bookings WHERE id = ?').get(booking_id);
    if (!booking) return reply.code(404).send({ error: 'Booking not found' });
    if (booking.customer_id !== request.user.id) return reply.code(403).send({ error: 'Forbidden' });
    if (booking.status !== 'completed') return reply.code(400).send({ error: 'Can only review completed bookings' });
    if (!booking.pro_id) return reply.code(400).send({ error: 'Booking has no assigned professional' });

    // Check if already reviewed
    const existing = app.db.prepare('SELECT id FROM reviews WHERE booking_id = ?').get(booking_id);
    if (existing) return reply.code(409).send({ error: 'Booking already reviewed' });

    const result = app.db.prepare(
      'INSERT INTO reviews (booking_id, customer_id, pro_id, rating, comment) VALUES (?, ?, ?, ?, ?)'
    ).run(booking_id, request.user.id, booking.pro_id, rating, comment || null);

    // Update pro rating
    const stats = app.db.prepare(
      'SELECT COUNT(*) AS count, AVG(rating) AS avg FROM reviews WHERE pro_id = ?'
    ).get(booking.pro_id);

    app.db.prepare('UPDATE pro_profiles SET rating = ROUND(?, 1), total_reviews = ? WHERE id = ?')
      .run(stats.avg, stats.count, booking.pro_id);

    return reply.code(201).send({
      id: result.lastInsertRowid,
      message: 'Review submitted successfully'
    });
  });

  // Get reviews for a pro
  app.get('/pro/:proId', async (request) => {
    const { page = 1, limit = 10 } = request.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const proId = request.params.proId;

    const countRow = app.db.prepare('SELECT COUNT(*) AS total FROM reviews WHERE pro_id = ?').get(proId);

    const reviews = app.db.prepare(`
      SELECT r.id, r.rating, r.comment, r.created_at, u.full_name AS customer_name
      FROM reviews r
      JOIN users u ON u.id = r.customer_id
      WHERE r.pro_id = ?
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `).all(proId, parseInt(limit), offset);

    // Rating breakdown
    const breakdown = app.db.prepare(`
      SELECT rating, COUNT(*) AS count
      FROM reviews WHERE pro_id = ?
      GROUP BY rating ORDER BY rating DESC
    `).all(proId);

    return {
      reviews,
      breakdown,
      total: countRow.total,
      page: parseInt(page),
      totalPages: Math.ceil(countRow.total / parseInt(limit))
    };
  });
}
