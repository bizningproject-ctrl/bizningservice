export default async function servicesRoutes(app) {
  // Get all service categories
  app.get('/', async (request) => {
    const lang = request.query.lang || 'en';
    const categories = app.db.prepare(`
      SELECT id, slug, icon, gradient, sort_order, is_active,
        name_${lang} AS name, desc_${lang} AS description, short_desc_${lang} AS short_desc,
        name_en, name_ru, name_uz,
        (SELECT COUNT(*) FROM pro_profiles WHERE category_id = service_categories.id) AS pro_count
      FROM service_categories
      WHERE is_active = 1
      ORDER BY sort_order
    `.replace(/name_(?!en|ru|uz)/g, 'name_en')).all();

    return { categories };
  });

  // Get single category by slug
  app.get('/:slug', async (request, reply) => {
    const { slug } = request.params;
    const lang = request.query.lang || 'en';

    const validLangs = ['en', 'ru', 'uz'];
    const safeLang = validLangs.includes(lang) ? lang : 'en';

    const category = app.db.prepare(`
      SELECT id, slug, icon, gradient,
        name_${safeLang} AS name, desc_${safeLang} AS description, short_desc_${safeLang} AS short_desc,
        (SELECT COUNT(*) FROM pro_profiles WHERE category_id = service_categories.id) AS pro_count
      FROM service_categories
      WHERE slug = ? AND is_active = 1
    `).get(slug);

    if (!category) {
      return reply.code(404).send({ error: 'Service category not found' });
    }

    return { category };
  });
}
