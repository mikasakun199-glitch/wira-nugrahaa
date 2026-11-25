function localDatabase() {
  const key = 'dapur-mas-bayu-local-db';
  const saved = localStorage.getItem(key);
  if (saved) return JSON.parse(saved);
  const initial = { users: [], orders: [{ order_number: 'DMB-12345', customer_name: 'Pelanggan Dapur Mas Bayu', method: 'Ambil Sendiri', status: 'Sedang Diproses', total: 0, items: [{ name: 'Contoh pesanan', quantity: 1, total: 0 }] }] };
  localStorage.setItem(key, JSON.stringify(initial));
  return initial;
}

function saveLocalDatabase(db) { localStorage.setItem('dapur-mas-bayu-local-db', JSON.stringify(db)); }

async function requestApi(endpoint, options = {}) {
  if (window.location.protocol !== 'file:') return fetch(endpoint, options);

  const db = localDatabase();
  const body = options.body ? JSON.parse(options.body) : {};
  let data;
  let ok = true;
  let status = 200;

  if (endpoint.includes('register.php')) {
    if (db.users.some(user => user.email === body.email.toLowerCase())) { data = { message: 'Email sudah terdaftar.' }; ok = false; status = 409; }
    else { db.users.push({ id: Date.now(), name: body.name, email: body.email.toLowerCase(), phone: body.phone, password: body.password }); saveLocalDatabase(db); data = { message: 'Akun berhasil dibuat.' }; status = 201; }
  } else if (endpoint.includes('login.php')) {
    const user = db.users.find(entry => entry.email === body.email.toLowerCase() && entry.password === body.password);
    if (!user) { data = { message: 'Email atau kata sandi salah.' }; ok = false; status = 401; }
    else { const { password: ignoredPassword, ...safeUser } = user; data = { message: 'Login berhasil.', user: safeUser }; }
  } else if (endpoint.includes('order.php')) {
    const number = new URL(endpoint, window.location.href).searchParams.get('number');
    const order = db.orders.find(entry => entry.order_number === number);
    if (!order) { data = { message: 'Pesanan tidak ditemukan.' }; ok = false; status = 404; }
    else data = order;
  }
  return { ok, status, json: async () => data };
}
