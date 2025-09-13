// Minimal e‑commerce frontend utilities
// Loads catalog JSON and renders product grids, rankings, and search.

const CATALOG_URL = 'data/products.json';
const MERCH_URL = 'data/merchandising.json';

async function fetchJSON(url) {
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json();
}

function currencyFormat(value, currency = 'USD') {
  try { return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value); }
  catch { return `$${value.toFixed(2)}`; }
}

function getQueryParam(key) {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.href);
  return url.searchParams.get(key) || '';
}

// Simple fuzzy match helpers
function levenshtein(a, b) {
  a = a.toLowerCase(); b = b.toLowerCase();
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

function textScore(query, text) {
  if (!query || !text) return 0;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t.includes(q)) return Math.min(1, q.length / (t.length + 1));
  if (q.length >= 4) {
    const dist = levenshtein(q, t.slice(0, Math.min(t.length, q.length + 2)));
    if (dist <= 1) return 0.6;
    if (dist === 2) return 0.3;
  }
  return 0;
}

function weightedSearchScore(q, product) {
  const name = product.name || '';
  const brand = product.brand || '';
  const tagsText = (product.tags || []).join(' ');
  return textScore(q, name) * 3 + textScore(q, brand) * 2 + textScore(q, tagsText) * 1;
}

function parseDate(str) {
  const d = new Date(str);
  return isNaN(d) ? new Date(0) : d;
}

function applyMerchandisingScore(product, merch) {
  let score = 1;
  const md = product.metadata || {};
  const tags = product.tags || [];
  const boosts = merch?.boost || [];
  const demotes = merch?.demote || [];

  // Demote rules
  for (const rule of demotes) {
    if (rule.type === 'out_of_stock' && (product.stock_count ?? 0) <= 0) {
      score *= rule.weight ?? 0; // could be 0 to fully hide
    }
  }

  // Boost rules
  for (const rule of boosts) {
    if (rule.type === 'tag' && tags.includes(rule.value)) score *= rule.weight ?? 1;
    if (rule.type === 'margin_pct_min' && (md.margin_pct ?? 0) >= (rule.value ?? 0)) score *= rule.weight ?? 1;
  }
  return score;
}

function sortByNew(products) {
  return [...products].sort((a, b) => parseDate(b.metadata?.created_at) - parseDate(a.metadata?.created_at));
}

function sortByBest(products) {
  return [...products].sort((a, b) => (b.metadata?.clicks ?? 0) - (a.metadata?.clicks ?? 0));
}

function sortByTrending(products) {
  return [...products].sort((a, b) => {
    const as = (a.metadata?.clicks7d ?? 0) * 2 + (a.metadata?.views7d ?? 0) * 0.2;
    const bs = (b.metadata?.clicks7d ?? 0) * 2 + (b.metadata?.views7d ?? 0) * 0.2;
    return bs - as;
  });
}

function pinFirst(products, merch) {
  const pins = merch?.pin || [];
  if (!pins.length) return products;
  const map = new Map(products.map(p => [p.id, p]));
  const pinned = pins.map(id => map.get(id)).filter(Boolean);
  const rest = products.filter(p => !pins.includes(p.id));
  return [...pinned, ...rest];
}

function filterByCategory(products, categoryId) {
  return products.filter(p => (p.category_ids || []).includes(categoryId));
}

function relatedByTags(product, all) {
  const tags = new Set(product.tags || []);
  const scored = all.filter(p => p.id !== product.id).map(p => {
    const overlap = (p.tags || []).filter(t => tags.has(t)).length;
    return { p, s: overlap };
  }).filter(x => x.s > 0).sort((a, b) => b.s - a.s);
  return scored.slice(0, 8).map(x => x.p);
}

function cardHTML(p) {
  const price = currencyFormat(p.price, p.currency);
  const badges = [];
  if ((p.metadata?.created_at) && (Date.now() - parseDate(p.metadata.created_at)) / (1000*60*60*24) <= 14) badges.push('New');
  if ((p.tags || []).includes('bestseller')) badges.push('Best');
  return `
    <a class="product-card" href="#" aria-label="${p.name}">
      <img src="${p.image}" alt="${p.name}">
      <div class="info">
        <div class="brand">${p.brand}</div>
        <div class="name">${p.name}</div>
        <div class="price">${price}</div>
        ${badges.length ? `<div class="badges">${badges.map(b => `<span class="badge">${b}</span>`).join('')}</div>` : ''}
      </div>
    </a>`;
}

async function loadAndRender() {
  const grid = document.getElementById('product-grid');
  const isSearch = document.getElementById('search-results') !== null;
  if (!grid && !isSearch) return; // nothing to do on this page

  const [catalog, merch] = await Promise.all([
    fetchJSON(CATALOG_URL),
    fetchJSON(MERCH_URL).catch(() => ({}))
  ]);
  let products = catalog.products || [];

  // Apply merchandising scores (boost/demote) as a multiplicative factor used in sorts as tie-breaker
  const merchScore = new Map(products.map(p => [p.id, applyMerchandisingScore(p, merch)]));

  if (isSearch) {
    const q = getQueryParam('q');
    const scored = products.map(p => ({ p, s: weightedSearchScore(q, p) * (merchScore.get(p.id) || 1) }))
      .filter(x => x.s > 0.05)
      .sort((a, b) => b.s - a.s)
      .slice(0, 24)
      .map(x => x.p);
    renderGrid(document.getElementById('search-results'), scored);
    const qEl = document.getElementById('search-query');
    if (qEl) qEl.textContent = q;
    return;
  }

  // Category or curated list
  const category = grid.dataset.category;
  const list = grid.dataset.list; // new | best | trending
  let subset = products;
  if (category) subset = filterByCategory(products, category);
  if (list === 'new') subset = sortByNew(subset);
  else if (list === 'best') subset = sortByBest(subset);
  else if (list === 'trending') subset = sortByTrending(subset);

  // Apply merchandising pin to final ordering
  subset = pinFirst(subset, merch)
    .filter(p => (merchScore.get(p.id) ?? 1) > 0)
    .slice(0, 24);

  renderGrid(grid, subset);
}

function renderGrid(root, items) {
  if (!root) return;
  root.innerHTML = items.map(cardHTML).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  loadAndRender().catch(err => {
    // Fail silently in UI but log for debugging
    console.error(err);
  });
});

