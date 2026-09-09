export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const { password, article } = req.body || {};
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  if (!process.env.GITHUB_TOKEN) return res.status(500).json({ error: 'Falta configurar GITHUB_TOKEN' });
  if (!article?.title || !article?.deck || !article?.body) return res.status(400).json({ error: 'Faltan campos obligatorios' });

  const owner = process.env.GITHUB_OWNER || 'danielromann197-hub';
  const repo = process.env.GITHUB_REPO || 'IconMedia';
  const branch = process.env.GITHUB_BRANCH || 'main';
  const path = 'news-data.js';
  const api = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json'
  };

  const current = await fetch(`${api}?ref=${encodeURIComponent(branch)}`, { headers });
  if (!current.ok) return res.status(502).json({ error: 'No se pudo leer el archivo editorial' });
  const file = await current.json();
  const decoded = Buffer.from(file.content.replace(/\n/g, ''), 'base64').toString('utf8');
  const match = decoded.match(/window\.ICON_NEWS\s*=\s*(\[[\s\S]*?\]);\s*\n\s*window\.getIconNews/);
  if (!match) return res.status(500).json({ error: 'Formato de news-data.js no reconocido' });

  let articles;
  try { articles = Function(`"use strict"; return (${match[1]});`)(); } catch { return res.status(500).json({ error: 'No se pudo interpretar el contenido editorial' }); }

  const slug = (article.slug || article.title).toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
  if (!slug) return res.status(400).json({ error: 'El titular no permite crear un slug' });
  if (articles.some(item => item.slug === slug)) return res.status(409).json({ error: 'Ya existe una noticia con ese slug' });

  const now = new Date();
  const clean = {
    slug,
    category: String(article.category || 'VIRAL').toUpperCase(),
    title: String(article.title).trim(),
    deck: String(article.deck).trim(),
    body: Array.isArray(article.body) ? article.body.map(String).map(s => s.trim()).filter(Boolean) : String(article.body).split(/\n\s*\n/).map(s => s.trim()).filter(Boolean),
    image: String(article.image || '').trim(),
    time: 'AHORA',
    date: String(article.date || now.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })).toUpperCase(),
    read: String(article.read || '3 MIN DE LECTURA').toUpperCase(),
    author: String(article.author || 'Redacción ICON').trim(),
    featured: Boolean(article.featured)
  };

  if (clean.featured) articles = articles.map(item => ({ ...item, featured: false }));
  articles.unshift(clean);

  const next = `window.ICON_NEWS = ${JSON.stringify(articles, null, 2)};\n\nwindow.getIconNews = function (slug) {\n  return window.ICON_NEWS.find(article => article.slug === slug) || window.ICON_NEWS[0];\n};\n`;
  const body = {
    message: `Publicar noticia: ${clean.title}`,
    content: Buffer.from(next, 'utf8').toString('base64'),
    sha: file.sha,
    branch
  };
  const update = await fetch(api, { method: 'PUT', headers, body: JSON.stringify(body) });
  if (!update.ok) {
    const detail = await update.text();
    return res.status(502).json({ error: 'GitHub rechazó la publicación', detail: detail.slice(0, 500) });
  }
  return res.status(200).json({ ok: true, slug, message: 'Noticia publicada correctamente' });
}
