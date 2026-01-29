const fs = require('fs');
const path = require('path');

// Try multiple locations to find db.json so the function works both locally and on Netlify
function readDB() {
  // 1) try require relative to function file (bundler-friendly)
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const data = require(path.resolve(__dirname, '../../db.json'));
    if (data) return data;
  } catch (err) {
    // ignore
  }

  // 2) try reading from project root (process.cwd())
  try {
    const DB_PATH = path.resolve(process.cwd(), 'db.json');
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    // ignore
  }

  // 3) try reading next to the function file
  try {
    const DB_PATH2 = path.resolve(__dirname, '../../db.json');
    const raw2 = fs.readFileSync(DB_PATH2, 'utf8');
    return JSON.parse(raw2);
  } catch (err) {
    // fallback
  }

  return { posts: [], newsletter: [], contact: [] };
}

function tryWriteDB(db) {
  // best-effort write to project root if available
  try {
    const DB_PATH = path.resolve(process.cwd(), 'db.json');
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    return;
  } catch (err) {
    // ignore
  }

  try {
    const DB_PATH2 = path.resolve(__dirname, '../../db.json');
    fs.writeFileSync(DB_PATH2, JSON.stringify(db, null, 2));
  } catch (err) {
    // ignore write errors (read-only environment on some hosts)
  }
}

function makeId() {
  return Math.random().toString(16).slice(2, 6);
}

exports.handler = async function (event) {
  const method = event.httpMethod;
  const prefix = '/.netlify/functions/api';
  const rawPath = event.path || '';
  const route = rawPath.startsWith(prefix) ? rawPath.slice(prefix.length) : rawPath;
  const qs = event.queryStringParameters || {};
  const db = readDB();

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  const json = (obj, status = 200) => ({
    statusCode: status,
    headers,
    body: JSON.stringify(obj),
  });

  // Handle preflight
  if (method === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: '',
    };
  }

  // GET /posts?_page=1&_limit=6&_order=desc&_sort=id
  if (route === '/posts' && method === 'GET') {
    let posts = Array.isArray(db.posts) ? db.posts.slice() : [];
    if (qs._sort === 'id') {
      posts.sort((a, b) => (a.id || 0) - (b.id || 0));
      if (qs._order === 'desc') posts.reverse();
    }
    const page = Number(qs._page) || 1;
    const limit = Number(qs._limit) || 10;
    const start = (page - 1) * limit;
    const result = posts.slice(start, start + limit);
    return json(result);
  }

  // GET /posts/:id
  if (route.startsWith('/posts/') && method === 'GET') {
    const parts = route.split('/').filter(Boolean);
    const id = Number(parts[1]);
    const post = db.posts.find((p) => Number(p.id) === id);
    if (!post) return json({ message: 'Not found' }, 404);
    return json(post);
  }

  // GET /newsletter?email=...
  if (route === '/newsletter' && method === 'GET') {
    if (qs.email) {
      const found = db.newsletter.filter((n) => n.email === qs.email);
      return json(found);
    }
    return json(db.newsletter || []);
  }

  // POST /newsletter
  if (route === '/newsletter' && method === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      if (!body.email) return json({ message: 'Email required' }, 400);
      const exists = (db.newsletter || []).some((n) => n.email === body.email);
      if (exists) return json({ message: 'Exists' }, 200);
      const entry = { id: makeId(), email: body.email };
      db.newsletter = db.newsletter || [];
      db.newsletter.push(entry);
      tryWriteDB(db);
      return json(entry, 201);
    } catch (err) {
      return json({ message: 'Invalid body' }, 400);
    }
  }

  // POST /contact
  if (route === '/contact' && method === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      const entry = Object.assign({}, body, { id: makeId() });
      db.contact = db.contact || [];
      db.contact.push(entry);
      tryWriteDB(db);
      return json(entry, 201);
    } catch (err) {
      return json({ message: 'Invalid body' }, 400);
    }
  }

  return json({ message: 'Not found' }, 404);
};
