const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { URL } = require('url');

const PORT = 3000;
const ROOT = __dirname;
const DB_FILE = path.join(ROOT, 'database.json');

function readDb() {
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedPassword) {
  const [salt, storedHash] = storedPassword.split(':');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
}

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); } catch { reject(new Error('JSON tidak valid')); }
    });
    req.on('error', reject);
  });
}

async function handleApi(req, res, url) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS' });
    return res.end();
  }

  const db = readDb();
  if (req.method === 'POST' && url.pathname === '/api/register') {
    const { name, email, phone, password } = await readBody(req);
    if (!name || !email || !phone || !password || password.length < 6) return sendJson(res, 400, { message: 'Data pendaftaran belum lengkap.' });
    const normalizedEmail = email.trim().toLowerCase();
    if (db.users.some(user => user.email === normalizedEmail)) return sendJson(res, 409, { message: 'Email sudah terdaftar.' });
    const user = { id: crypto.randomUUID(), name: name.trim(), email: normalizedEmail, phone: phone.trim(), password: hashPassword(password), createdAt: new Date().toISOString() };
    db.users.push(user); writeDb(db);
    return sendJson(res, 201, { message: 'Akun berhasil dibuat.', user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
  }

  if (req.method === 'POST' && url.pathname === '/api/login') {
    const { email, password } = await readBody(req);
    const user = db.users.find(entry => entry.email === String(email || '').trim().toLowerCase());
    if (!user || !verifyPassword(String(password || ''), user.password)) return sendJson(res, 401, { message: 'Email atau kata sandi salah.' });
    return sendJson(res, 200, { message: 'Login berhasil.', user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
  }

  if (req.method === 'GET' && url.pathname.startsWith('/api/orders/')) {
    const order = db.orders.find(entry => entry.number === url.pathname.split('/').pop().toUpperCase());
    return order ? sendJson(res, 200, order) : sendJson(res, 404, { message: 'Pesanan tidak ditemukan.' });
  }
  sendJson(res, 404, { message: 'Endpoint tidak ditemukan.' });
}

function serveFile(res, pathname) {
  const requested = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.normalize(path.join(ROOT, requested));
  if (!filePath.startsWith(ROOT) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) return sendJson(res, 404, { message: 'File tidak ditemukan.' });
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };
  res.writeHead(200, { 'Content-Type': `${types[path.extname(filePath).toLowerCase()] || 'application/octet-stream'}; charset=utf-8` });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try { if (url.pathname.startsWith('/api/')) await handleApi(req, res, url); else serveFile(res, decodeURIComponent(url.pathname)); }
  catch (error) { sendJson(res, 500, { message: error.message || 'Terjadi kesalahan server.' }); }
});

server.listen(PORT, () => console.log(`Dapur Mas Bayu berjalan di http://localhost:${PORT}`));
