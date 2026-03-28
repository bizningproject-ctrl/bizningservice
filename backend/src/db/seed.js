import { initDB } from './index.js';
import bcrypt from 'bcryptjs';

const db = await initDB();

// Clear existing data
db.exec(`
  DELETE FROM reviews;
  DELETE FROM bookings;
  DELETE FROM applications;
  DELETE FROM pro_profiles;
  DELETE FROM users;
  DELETE FROM service_categories;
`);

// Seed service categories
const insertCategory = db.prepare(`
  INSERT INTO service_categories (slug, name_en, name_ru, name_uz, desc_en, desc_ru, desc_uz, short_desc_en, short_desc_ru, short_desc_uz, icon, gradient, sort_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const categories = [
  { slug: 'plumbing', name_en: 'Plumbing', name_ru: 'Сантехника', name_uz: 'Santexnika', desc_en: 'Browse verified plumbing professionals in your area.', desc_ru: 'Найдите проверенных сантехников в вашем районе.', desc_uz: 'Hududingizdagi tasdiqlangan santexniklarni toping.', short_en: 'Pipe repairs, drain cleaning, fixture installation, water heater service.', short_ru: 'Ремонт труб, прочистка канализации, установка смесителей.', short_uz: 'Quvur ta\'miri, kanalizatsiya tozalash, kran o\'rnatish.', icon: '🔧', gradient: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)', order: 1 },
  { slug: 'electrical', name_en: 'Electrical', name_ru: 'Электрика', name_uz: 'Elektr ishlari', desc_en: 'Find licensed electricians for wiring, panel upgrades, and smart home.', desc_ru: 'Лицензированные электрики для проводки и установки.', desc_uz: 'Simlar, panellar va aqlli uy uchun elektrchilar.', short_en: 'Wiring, panel upgrades, outlet installation, lighting, smart home.', short_ru: 'Проводка, щиты, розетки, освещение, умный дом.', short_uz: 'Simlar, panellar, rozetkalar, yoritish, aqlli uy.', icon: '⚡', gradient: 'linear-gradient(135deg, #E0E7FF, #C7D2FE)', order: 2 },
  { slug: 'cleaning', name_en: 'Cleaning', name_ru: 'Уборка', name_uz: 'Tozalash', desc_en: 'Book professional home cleaners for deep cleaning and recurring service.', desc_ru: 'Профессиональная уборка: генеральная, регулярная.', desc_uz: 'Umumiy tozalash, muntazam xizmat uchun professional tozalovchilar.', short_en: 'Deep cleaning, recurring service, move-in/move-out, carpet cleaning.', short_ru: 'Генеральная уборка, регулярный сервис, мойка окон.', short_uz: 'Umumiy tozalash, muntazam xizmat, deraza yuvish.', icon: '✨', gradient: 'linear-gradient(135deg, #D1E5F7, #B8D4EE)', order: 3 },
  { slug: 'painting', name_en: 'Painting', name_ru: 'Покраска', name_uz: 'Bo\'yash', desc_en: 'Hire professional painters for interior and exterior work.', desc_ru: 'Профессиональные маляры для внутренних и наружных работ.', desc_uz: 'Ichki va tashqi bo\'yash uchun professional bo\'yoqchilar.', short_en: 'Interior & exterior painting, wallpaper, cabinet refinishing.', short_ru: 'Покраска стен, обои, ремонт гипсокартона.', short_uz: 'Devor bo\'yash, devor qog\'ozi, mebel bo\'yash.', icon: '🎨', gradient: 'linear-gradient(135deg, #FCE7F3, #F5D0FE)', order: 4 },
  { slug: 'hvac', name_en: 'HVAC', name_ru: 'Кондиционеры', name_uz: 'Konditsioner', desc_en: 'Connect with HVAC specialists for AC repair and heating service.', desc_ru: 'Специалисты по ремонту кондиционеров и отоплению.', desc_uz: 'Konditsioner ta\'miri va isitish uchun mutaxassislar.', short_en: 'AC repair, heating service, duct cleaning, thermostat installation.', short_ru: 'Ремонт кондиционеров, отопление, чистка воздуховодов.', short_uz: 'Konditsioner ta\'miri, isitish, kanal tozalash.', icon: '❄', gradient: 'linear-gradient(135deg, #E2E8F0, #CBD5E1)', order: 5 },
  { slug: 'handyman', name_en: 'Handyman', name_ru: 'Мастер', name_uz: 'Usta', desc_en: 'Find reliable handymen for furniture assembly, repairs, and maintenance.', desc_ru: 'Надёжные мастера для сборки мебели и ремонта.', desc_uz: 'Mebel yig\'ish, ta\'mirlash va umumiy xizmat uchun ustalar.', short_en: 'Furniture assembly, shelf mounting, door repairs, general maintenance.', short_ru: 'Сборка мебели, монтаж полок, ремонт дверей.', short_uz: 'Mebel yig\'ish, tokcha o\'rnatish, eshik ta\'miri.', icon: '🔨', gradient: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', order: 6 },
];

const categoryIds = {};
for (const c of categories) {
  const result = insertCategory.run(c.slug, c.name_en, c.name_ru, c.name_uz, c.desc_en, c.desc_ru, c.desc_uz, c.short_en, c.short_ru, c.short_uz, c.icon, c.gradient, c.order);
  categoryIds[c.slug] = result.lastInsertRowid;
}

// Seed admin user
const adminHash = bcrypt.hashSync('admin123', 10);
db.prepare(`INSERT INTO users (email, password, full_name, phone, role) VALUES (?, ?, ?, ?, ?)`)
  .run('admin@fixit.uz', adminHash, 'Admin', '+998901234567', 'admin');

// Seed pro users and profiles
const proHash = bcrypt.hashSync('pro123', 10);

const pros = [
  { email: 'marcus@fixit.uz', name: 'Marcus Rivera', phone: '+998901111111', cat: 'plumbing', specialty: 'Master Plumber • Emergency Specialist', tags: '["Emergency","24/7","Licensed"]', rating: 4.9, jobs: 847, price: 65, exp: 12, verified: 1, online: 1 },
  { email: 'james@fixit.uz', name: 'James Mitchell', phone: '+998901111112', cat: 'plumbing', specialty: 'Residential Plumbing • Pipe Repair', tags: '["Pipe Repair","Water Heater"]', rating: 4.9, jobs: 1240, price: 55, exp: 15, verified: 1, online: 1 },
  { email: 'carlos@fixit.uz', name: 'Carlos Mendez', phone: '+998901111113', cat: 'plumbing', specialty: 'Drain Cleaning • Sewer Line', tags: '["Drain","Sewer","Camera Inspect"]', rating: 4.8, jobs: 623, price: 60, exp: 9, verified: 1, online: 0 },
  { email: 'tony@fixit.uz', name: 'Tony Ricci', phone: '+998901111114', cat: 'plumbing', specialty: 'Commercial & Residential Plumbing', tags: '["Commercial","Remodel","New Construction"]', rating: 4.7, jobs: 534, price: 70, exp: 20, verified: 1, online: 1 },
  { email: 'sarah@fixit.uz', name: 'Sarah Chen', phone: '+998902111111', cat: 'electrical', specialty: 'Licensed Electrician • Smart Home', tags: '["Smart Home","Panel Upgrade"]', rating: 4.8, jobs: 623, price: 70, exp: 8, verified: 1, online: 1 },
  { email: 'lisa@fixit.uz', name: 'Lisa Nakamura', phone: '+998902111112', cat: 'electrical', specialty: 'Licensed Electrician • Smart Home', tags: '["Smart Home","Automation","EV Charger"]', rating: 5.0, jobs: 892, price: 68, exp: 10, verified: 1, online: 1 },
  { email: 'robert@fixit.uz', name: 'Robert Garcia', phone: '+998902111113', cat: 'electrical', specialty: 'Residential Wiring • Code Compliance', tags: '["Rewiring","Code","Inspection"]', rating: 4.7, jobs: 445, price: 65, exp: 12, verified: 1, online: 0 },
  { email: 'ana@fixit.uz', name: 'Ana Kowalski', phone: '+998903111111', cat: 'cleaning', specialty: 'Deep Cleaning • Move-in/Move-out', tags: '["Deep Clean","Move-in","Eco-Friendly"]', rating: 5.0, jobs: 1204, price: 45, exp: 5, verified: 1, online: 1 },
  { email: 'maria@fixit.uz', name: 'Maria Santos', phone: '+998903111112', cat: 'cleaning', specialty: 'Deep Cleaning • Move-in Specialist', tags: '["Deep Clean","Recurring","Commercial"]', rating: 4.9, jobs: 2100, price: 40, exp: 8, verified: 1, online: 1 },
  { email: 'frank@fixit.uz', name: 'Frank DeLuca', phone: '+998904111111', cat: 'painting', specialty: 'Interior & Exterior Painting', tags: '["Interior","Exterior","Residential"]', rating: 4.9, jobs: 678, price: 55, exp: 18, verified: 1, online: 1 },
  { email: 'david@fixit.uz', name: 'David Okonkwo', phone: '+998905111111', cat: 'hvac', specialty: 'HVAC Technician • Energy Auditor', tags: '["AC Repair","Energy Audit","Install"]', rating: 4.8, jobs: 760, price: 72, exp: 11, verified: 1, online: 1 },
  { email: 'jake@fixit.uz', name: 'Jake Morrison', phone: '+998906111111', cat: 'handyman', specialty: 'General Handyman • All Trades', tags: '["Assembly","Repair","Mounting"]', rating: 4.8, jobs: 1567, price: 45, exp: 10, verified: 1, online: 1 },
  { email: 'luis@fixit.uz', name: 'Luis Hernandez', phone: '+998906111112', cat: 'handyman', specialty: 'Furniture Assembly • IKEA Specialist', tags: '["IKEA","Assembly","Shelving"]', rating: 4.9, jobs: 890, price: 40, exp: 6, verified: 1, online: 1 },
];

const insertUser = db.prepare(`INSERT INTO users (email, password, full_name, phone, role) VALUES (?, ?, ?, ?, 'pro')`);
const insertPro = db.prepare(`
  INSERT INTO pro_profiles (user_id, category_id, specialty, tags, rating, total_jobs, price_per_hour, experience_years, is_verified, is_online)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const p of pros) {
  const userResult = insertUser.run(p.email, proHash, p.name, p.phone);
  insertPro.run(userResult.lastInsertRowid, categoryIds[p.cat], p.specialty, p.tags, p.rating, p.jobs, p.price, p.exp, p.verified, p.online);
}

// Seed a test customer
const custHash = bcrypt.hashSync('customer123', 10);
db.prepare(`INSERT INTO users (email, password, full_name, phone, role) VALUES (?, ?, ?, ?, 'customer')`)
  .run('test@customer.com', custHash, 'Test Customer', '+998907777777');

db.saveNow();
console.log('Database seeded successfully!');
console.log(`  - ${categories.length} service categories`);
console.log(`  - ${pros.length} pro profiles`);
console.log(`  - 1 admin (admin@fixit.uz / admin123)`);
console.log(`  - 1 test customer (test@customer.com / customer123)`);
console.log(`  - All pros password: pro123`);
