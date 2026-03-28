export default async function prosRoutes(app) {
  // List pros with filters
  app.get('/', async (request) => {
    const { category, sort = 'rating', filter, page = 1, limit = 10 } = request.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let where = 'WHERE 1=1';
    const params = [];

    if (category) {
      where += ' AND sc.slug = ?';
      params.push(category);
    }

    if (filter === 'top-rated') {
      where += ' AND pp.rating >= 4.8';
    } else if (filter === 'verified') {
      where += ' AND pp.is_verified = 1';
    } else if (filter === 'available-now') {
      where += ' AND pp.is_online = 1';
    }

    let orderBy = 'ORDER BY pp.rating DESC';
    if (sort === 'price-low') orderBy = 'ORDER BY pp.price_per_hour ASC';
    else if (sort === 'price-high') orderBy = 'ORDER BY pp.price_per_hour DESC';
    else if (sort === 'jobs') orderBy = 'ORDER BY pp.total_jobs DESC';

    const countRow = app.db.prepare(`
      SELECT COUNT(*) AS total
      FROM pro_profiles pp
      JOIN users u ON u.id = pp.user_id
      JOIN service_categories sc ON sc.id = pp.category_id
      ${where}
    `).get(...params);

    const pros = app.db.prepare(`
      SELECT pp.id, u.full_name AS name, u.email, u.avatar_url,
        pp.specialty, pp.tags, pp.rating, pp.total_jobs, pp.total_reviews,
        pp.price_per_hour, pp.experience_years, pp.is_verified, pp.is_online, pp.bio,
        sc.slug AS category_slug, sc.name_en AS category_name, sc.icon AS category_icon, sc.gradient AS category_gradient
      FROM pro_profiles pp
      JOIN users u ON u.id = pp.user_id
      JOIN service_categories sc ON sc.id = pp.category_id
      ${where}
      ${orderBy}
      LIMIT ? OFFSET ?
    `).all(...params, parseInt(limit), offset);

    // Parse tags JSON
    const parsed = pros.map(p => ({ ...p, tags: JSON.parse(p.tags || '[]') }));

    return {
      pros: parsed,
      total: countRow.total,
      page: parseInt(page),
      totalPages: Math.ceil(countRow.total / parseInt(limit))
    };
  });

  // Get single pro by id
  app.get('/:id', async (request, reply) => {
    const { id } = request.params;

    const pro = app.db.prepare(`
      SELECT pp.id, u.full_name AS name, u.email, u.phone, u.avatar_url,
        pp.specialty, pp.tags, pp.rating, pp.total_jobs, pp.total_reviews,
        pp.price_per_hour, pp.experience_years, pp.is_verified, pp.is_online, pp.bio,
        pp.user_id, pp.category_id,
        sc.slug AS category_slug, sc.name_en AS category_name, sc.icon AS category_icon, sc.gradient AS category_gradient
      FROM pro_profiles pp
      JOIN users u ON u.id = pp.user_id
      JOIN service_categories sc ON sc.id = pp.category_id
      WHERE pp.id = ?
    `).get(id);

    if (!pro) {
      return reply.code(404).send({ error: 'Professional not found' });
    }

    pro.tags = JSON.parse(pro.tags || '[]');

    // Get recent reviews
    const reviews = app.db.prepare(`
      SELECT r.rating, r.comment, r.created_at, u.full_name AS customer_name
      FROM reviews r
      JOIN users u ON u.id = r.customer_id
      WHERE r.pro_id = ?
      ORDER BY r.created_at DESC
      LIMIT 5
    `).all(id);

    return { pro, reviews };
  });

  // Update pro profile (pro only)
  app.put('/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params;

    const profile = app.db.prepare('SELECT * FROM pro_profiles WHERE id = ?').get(id);
    if (!profile) return reply.code(404).send({ error: 'Profile not found' });
    if (profile.user_id !== request.user.id && request.user.role !== 'admin') {
      return reply.code(403).send({ error: 'Forbidden' });
    }

    const { specialty, tags, price_per_hour, bio, is_online } = request.body || {};
    const updates = [];
    const params = [];

    if (specialty !== undefined) { updates.push('specialty = ?'); params.push(specialty); }
    if (tags !== undefined) { updates.push('tags = ?'); params.push(JSON.stringify(tags)); }
    if (price_per_hour !== undefined) { updates.push('price_per_hour = ?'); params.push(price_per_hour); }
    if (bio !== undefined) { updates.push('bio = ?'); params.push(bio); }
    if (is_online !== undefined) { updates.push('is_online = ?'); params.push(is_online ? 1 : 0); }

    if (updates.length === 0) return reply.code(400).send({ error: 'No fields to update' });

    updates.push("updated_at = datetime('now')");
    params.push(id);

    app.db.prepare(`UPDATE pro_profiles SET ${updates.join(', ')} WHERE id = ?`).run(...params);

    return { success: true };
  });
}
