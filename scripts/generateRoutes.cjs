const fs = require("fs");
const path = require("path");
const he = require('he');

const BASE_PATH = process.env.HTML_BASE_PATH || './dist';
const API_BASE = "https://misscandle.com.vn/api";
const SITE_URL = "https://misscandle.com.vn";
const DEFAULT_IMAGE = `${SITE_URL}/banner/openGraph.jpg`;

// ─── Helpers ────────────────────────────────────────────────────────────────

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function stripHtml(str) {
  return he.decode(String(str || '').replace(/<[^>]*>/g, '')).trim();
}

function resolveImage(img) {
  if (!img) return DEFAULT_IMAGE;
  if (img.startsWith('http')) return img;
  const imgPath = img.startsWith('/') ? img : `/${img}`;
  return `${SITE_URL}${imgPath}`;
}

function injectMeta(templateHtml, { title, description, image, url, type = 'website' }) {
  const t = escapeHtml(title);
  const d = escapeHtml(stripHtml(description).slice(0, 160));
  const i = escapeHtml(resolveImage(image));
  const u = escapeHtml(url);

  // Xóa các thẻ meta og/twitter/description cũ + dòng trắng thừa
  let html = templateHtml
    .replace(/<meta\s+name="description"[^>]*>\n?/gi, '')
    .replace(/<meta\s+property="og:[^"]*"[^>]*>\n?/gi, '')
    .replace(/<meta\s+name="twitter:[^"]*"[^>]*>\n?/gi, '')
    .replace(/\n{3,}/g, '\n\n'); // gộp nhiều dòng trắng thành tối đa 2

  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
    .replace('</head>', `  <meta name="description" content="${d}" />
  <meta property="og:type" content="${type}" />
  <meta property="og:title" content="${t}" />
  <meta property="og:description" content="${d}" />
  <meta property="og:image" content="${i}" />
  <meta property="og:url" content="${u}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${t}" />
  <meta name="twitter:description" content="${d}" />
  <meta name="twitter:image" content="${i}" />
</head>`);
}

function writeHtml(dir, html) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

// ─── API fetchers ────────────────────────────────────────────────────────────

async function getProducts() {
  const res = await fetch(`${API_BASE}/products?status=LIST_ALL`);
  const data = await res.json();
  return data.data || [];
}

async function getBlogs() {
  const res = await fetch(`${API_BASE}/posts?status=SHOW`);
  const data = await res.json();
  return data.data || [];
}

async function getCategories() {
  const res = await fetch(`${API_BASE}/categories?status=LIST_ALL`);
  const data = await res.json();
  return data.data || [];
}

async function getPages() {
  const res = await fetch(`${API_BASE}/pages?status=SHOW`);
  const data = await res.json();
  if (Array.isArray(data.data)) return data.data;
  if (data.data) return [data.data];
  return [];
}

// ─── Generators ─────────────────────────────────────────────────────────────

async function generateProducts(templateHtml) {
  const products = await getProducts();
  let count = 0;

  for (const product of products) {
    const category =
      product.categories?.find((c) => c.name !== 'TẤT CẢ') || product.categories?.[0];
    if (!category) continue;

    const dir = path.join(BASE_PATH, 'products', 'category', category.name, category.id, 'detail', product.id);
    writeHtml(dir, injectMeta(templateHtml, {
      title: `${product.name} - MissCandle`,
      description: product.description,
      image: product.images?.[0],
      url: `${SITE_URL}/products/category/${encodeURIComponent(category.name)}/${category.id}/detail/${product.id}`,
      type: 'product',
    }));
    count++;
  }

  console.log(`✅ Products: ${count} files`);
}

async function generateBlogs(templateHtml) {
  const blogs = await getBlogs();
  let count = 0;

  writeHtml(path.join(BASE_PATH, 'blog'), injectMeta(templateHtml, {
    title: 'Blog - MissCandle',
    description: 'Khám phá các bài viết về nến thơm, phong cách sống và xu hướng trang trí từ MissCandle.',
    image: DEFAULT_IMAGE,
    url: `${SITE_URL}/blog`,
  }));

  for (const blog of blogs) {
    if (!blog.slug) continue;
    writeHtml(path.join(BASE_PATH, 'blog', blog.slug), injectMeta(templateHtml, {
      title: `${blog.title} - MissCandle`,
      description: blog.short_text || blog.title,
      image: blog.image,
      url: `${SITE_URL}/blog/${blog.slug}`,
      type: 'article',
    }));
    count++;
  }

  console.log(`✅ Blogs: 1 list + ${count} detail files`);
}

async function generateCategories(templateHtml) {
  const categories = await getCategories();
  let count = 0;

  writeHtml(path.join(BASE_PATH, 'products'), injectMeta(templateHtml, {
    title: 'Sản Phẩm - MissCandle',
    description: 'Khám phá các dòng nến thơm handmade cao cấp của MissCandle. Giao hàng toàn quốc.',
    image: DEFAULT_IMAGE,
    url: `${SITE_URL}/products`,
  }));

  for (const cat of categories) {
    if (cat.name === 'TẤT CẢ') continue;
    writeHtml(path.join(BASE_PATH, 'products', 'category', cat.name, cat.id), injectMeta(templateHtml, {
      title: `${cat.name} - MissCandle`,
      description: cat.note1 || cat.description || cat.name,
      image: cat.image_url,
      url: `${SITE_URL}/products/category/${encodeURIComponent(cat.name)}/${cat.id}`,
    }));
    count++;
  }

  console.log(`✅ Categories: 1 list + ${count} category files`);
}

async function generatePages(templateHtml) {
  const pages = await getPages();
  let count = 0;

  for (const page of pages) {
    if (!page.slug || page.status !== 1) continue;
    writeHtml(path.join(BASE_PATH, 'page', page.slug), injectMeta(templateHtml, {
      title: `${page.title} - MissCandle`,
      description: page.short_text || page.title,
      image: page.image,
      url: `${SITE_URL}/page/${page.slug}`,
    }));
    count++;
  }

  console.log(`✅ Pages: ${count} files`);
}

// ─── Main ────────────────────────────────────────────────────────────────────

(async () => {
  const templateHtml = fs.readFileSync(path.join(BASE_PATH, 'index.html'), 'utf-8');

  await Promise.all([
    generateProducts(templateHtml),
    generateBlogs(templateHtml),
    generateCategories(templateHtml),
    generatePages(templateHtml),
  ]);

  console.log('🎉 Done generating all static HTML files');
})();
