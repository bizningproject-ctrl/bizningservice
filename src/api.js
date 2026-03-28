const API_BASE = 'http://localhost:3001/api';

function getToken() {
  return localStorage.getItem('fixit-token');
}

function setToken(token) {
  localStorage.setItem('fixit-token', token);
}

function clearToken() {
  localStorage.removeItem('fixit-token');
  localStorage.removeItem('fixit-user');
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('fixit-user'));
  } catch { return null; }
}

function setUser(user) {
  localStorage.setItem('fixit-user', JSON.stringify(user));
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw { status: res.status, ...data };
  }
  return data;
}

export const api = {
  // Auth
  async login(email, password) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    setToken(data.token);
    setUser(data.user);
    return data;
  },

  async register(email, password, full_name, phone, role = 'customer') {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name, phone, role })
    });
    setToken(data.token);
    setUser(data.user);
    return data;
  },

  logout() {
    clearToken();
  },

  getUser,
  isLoggedIn() { return !!getToken(); },

  async me() {
    return request('/auth/me');
  },

  // Services
  async getServices(lang = 'en') {
    return request(`/services?lang=${lang}`);
  },

  async getService(slug, lang = 'en') {
    return request(`/services/${slug}?lang=${lang}`);
  },

  // Pros
  async getPros({ category, sort, filter, page, limit } = {}) {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (sort) params.set('sort', sort);
    if (filter) params.set('filter', filter);
    if (page) params.set('page', page);
    if (limit) params.set('limit', limit);
    return request(`/pros?${params}`);
  },

  async getPro(id) {
    return request(`/pros/${id}`);
  },

  // Bookings
  async createBooking(data) {
    return request('/bookings', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getBookings({ status, page } = {}) {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (page) params.set('page', page);
    return request(`/bookings?${params}`);
  },

  async updateBookingStatus(id, status) {
    return request(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  // Applications
  async submitApplication(data) {
    return request('/applications', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Reviews
  async createReview(data) {
    return request('/reviews', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getProReviews(proId, page = 1) {
    return request(`/reviews/pro/${proId}?page=${page}`);
  },
};
