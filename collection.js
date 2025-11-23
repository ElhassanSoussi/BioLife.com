(() => {
  let allProducts = [];

  async function loadProducts() {
    try {
      const res = await fetch('data/products.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load products');
      allProducts = await res.json();
      return allProducts;
    } catch (err) {
      console.warn('Products failed to load; using empty array', err);
      return [];
    }
  }

  const qs = new URLSearchParams(location.search);
  const cat = (qs.get('cat') || '').toLowerCase();

  // Hero content per category
  const presets = {
    skincare: { title:'Skincare', tagline:'Targeted care, clean ingredients.', image:'https://images.unsplash.com/photo-1556228852-6d45a7d8e44a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80' },
    makeup:   { title:'Makeup', tagline:'Effortless color, luxury finishes.', image:'https://images.unsplash.com/photo-1629904852311-5a8f224951b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
    gifts:    { title:'Gifts', tagline:'Curated sets for every occasion.', image:'https://images.unsplash.com/photo-1590439242252-086a784998c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' },
    new:      { title:'New Arrivals', tagline:'Fresh formulas to fall in love with.', image:'https://images.unsplash.com/photo-1586495733353-5adef1041158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80' }
  };
  let preset = presets[cat] || { title:'Shop', tagline:'Discover luxury essentials tailored to you.', image:'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' };
  const titleEl = document.getElementById('collection-title');
  const tagEl = document.getElementById('collection-tagline');
  titleEl && (titleEl.textContent = preset.title);
  tagEl && (tagEl.textContent = preset.tagline);

  // Banner background
  const hero = document.querySelector('.collection-hero');
  if (hero) hero.style.backgroundImage = `linear-gradient(180deg, rgba(251,248,242,.9), rgba(246,239,230,.95)), url('${preset.image}')`;

  // Load promos config for category-specific overrides
  async function loadPromos(){
    if (window.FOIREME_PROMOS) return window.FOIREME_PROMOS;
    if (location.protocol === 'file:') return null;
    try{ const res = await fetch('data/promos.json', { cache: 'no-store' }); if(!res.ok) return null; return await res.json(); }catch{ return null; }
  }
  loadPromos().then(cfg => {
    if (cfg && cfg.categories && cfg.categories[cat] && cfg.categories[cat].enabled){
      const c = cfg.categories[cat];
      titleEl && (titleEl.textContent = c.title || titleEl.textContent);
      tagEl && (tagEl.textContent = c.tagline || tagEl.textContent);
      if (hero && c.image){ hero.style.backgroundImage = `linear-gradient(180deg, rgba(251,248,242,.9), rgba(246,239,230,.95)), url('${c.image}')`; }
    }
  });

  // Filter elements
  const grid = document.getElementById('collection-grid');
  const sortSel = document.getElementById('sort');
  const loadMoreBtn = document.getElementById('load-more');
  const catChecks = Array.from(document.querySelectorAll('input[name="cat"]'));
  const skinChecks = Array.from(document.querySelectorAll('input[name="skin"]'));
  const priceMin = document.getElementById('price-min');
  const priceMax = document.getElementById('price-max');

  // Pre-check selected category
  if (cat) {
    const found = catChecks.find(c=>c.value===cat);
    if (found) found.checked = true;
  }

  let rendered = 0; const PAGE = 12;
  let working = [];

  function applyFilters(){
    const cats = catChecks.filter(c=>c.checked).map(c=>c.value);
    const skins = skinChecks.filter(c=>c.checked).map(c=>c.value);
    const min = parseFloat(priceMin.value) || -Infinity;
    const max = parseFloat(priceMax.value) || Infinity;
    working = allProducts.filter(p => {
      const pCat = (p.category || '').toLowerCase();
      const pTags = (p.tags || []).map(t => t.toLowerCase());

      if (cats.length){
        const inCat = cats.some(c => {
          if (c === 'gifts') return pTags.includes('gift');
          if (c === 'new') return pTags.includes('new');
          return pCat === c;
        });
        if (!inCat) return false;
      }
      const priceOk = p.price >= min && p.price <= max;
      const skinOk = !skins.length || skins.some(s=> (p.skin||[]).includes(s) || (p.skin||[]).includes('all'));
      return priceOk && skinOk;
    });
    applySort();
  }

  function applySort(){
    const v = sortSel.value;
    if (v==='price-asc') working.sort((a,b)=>a.price-b.price);
    else if (v==='price-desc') working.sort((a,b)=>b.price-a.price);
    else if (v==='best') working.sort((a,b)=> {
      const aIsBest = (a.tags || []).includes('Best Seller');
      const bIsBest = (b.tags || []).includes('Best Seller');
      return (bIsBest - aIsBest) || (b.reviews - a.reviews);
    });
    else /* featured */ working.sort((a, b) => allProducts.indexOf(a) - allProducts.indexOf(b));
    render(true);
  }

  function card(p){
    const badgeClass = (tag) => {
      const t = (tag || '').toLowerCase();
      if (t.includes('best')) return 'badge badge--best';
      if (t.includes('new')) return 'badge badge--new';
      if (t.includes('limit')) return 'badge badge--limited';
      return 'badge';
    };
    const badges = (p.tags || []).map(t => `<span class="${badgeClass(t)}">${t}</span>`).join('');

    return `
      <article class="card" data-id="${p.id}" aria-labelledby="${p.id}-title">
        <div class="card__media">
          <a href="product.html?id=${p.id}" class="card__thumb" aria-label="${p.name}">
            <img src="${p.image}" alt="${p.alt || p.name}" width="600" height="600" loading="lazy" />
          </a>
          ${badges ? `<div class="badges">${badges}</div>` : ''}
        </div>
        <div class="card__body">
          <h3 id="${p.id}-title" class="card__title"><a href="product.html?id=${p.id}" class="card__link">${p.name}</a></h3>
          <div class="rating" aria-label="Rated ${p.rating} out of 5">
            <span class="stars" style="--rating:${p.rating}" aria-hidden="true"></span>
            <span class="rating__count">(${p.reviews})</span>
          </div>
          <div class="card__meta"><span class="price">$${p.price}</span></div>
          <div class="quickadd" style="position: static; transform: none; opacity: 1; margin-top: 10px;">
            <button class="btn btn--primary btn--sm js-add" data-id="${p.id}" type="button">Add to Cart</button>
            <a class="btn btn--sm" style="background:#fff;border:1px solid var(--divider);color:var(--ink)" href="product.html?id=${p.id}">View</a>
          </div>
        </div>
      </article>`;
  }

  function render(reset){
    if (!grid) return;
    if (reset){ grid.innerHTML=''; rendered=0; }
    const slice = working.slice(rendered, rendered+PAGE);
    grid.insertAdjacentHTML('beforeend', slice.map(card).join(''));
    rendered += slice.length;
    loadMoreBtn.style.display = (rendered < working.length) ? 'inline-flex' : 'none';
  }

  // Hook up controls
  catChecks.concat(skinChecks).forEach(c=>c.addEventListener('change', applyFilters));
  sortSel.addEventListener('change', applySort);
  ;[priceMin, priceMax].forEach(i=> i.addEventListener('input', applyFilters));
  loadMoreBtn.addEventListener('click', ()=> render(false));

  // Initial
  async function init() {
    await loadProducts();
    applyFilters();
  }
  init();
})();
