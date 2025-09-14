(() => {
  // Dataset with categories and facets
  const products = [
    { id:'p1', name:'Velvet Skin Foundation', price:34, rating:5, reviews:312, category:'makeup', skin:['normal','combo'], best:true, image:'assets/photos/foundation.jpg' },
    { id:'p2', name:'Glow Boost Serum', price:28, rating:4, reviews:98, category:'skincare', skin:['dry','normal'], best:false, new:true, image:'assets/photos/serum.jpg' },
    { id:'p3', name:'Pro Finish Brush', price:22, rating:5, reviews:1100, category:'makeup', skin:['all'], best:true, gift:true, image:'assets/photos/brush.jpg' },
    { id:'p4', name:'Silk Matte Lipstick', price:18, rating:4, reviews:245, category:'makeup', skin:['all'], best:false, gift:true, new:true, image:'assets/photos/lipstick.jpg' },
    { id:'p5', name:'Everyday Eyeshadow Palette', price:26, rating:5, reviews:534, category:'makeup', skin:['all'], best:true, gift:true, image:'assets/photos/palette.jpg' },
    { id:'p6', name:'HydraSoft Moisturizer', price:24, rating:4, reviews:189, category:'skincare', skin:['dry','combo'], best:false, image:'assets/photos/moisturizer.jpg' },
  ];

  const qs = new URLSearchParams(location.search);
  const cat = (qs.get('cat') || '').toLowerCase();

  // Hero content per category
  const presets = {
    skincare: { title:'Skincare', tagline:'Targeted care, clean ingredients.', image:'assets/photos/serum.jpg' },
    makeup:   { title:'Makeup', tagline:'Effortless color, luxury finishes.', image:'assets/photos/palette.jpg' },
    gifts:    { title:'Gifts', tagline:'Curated sets for every occasion.', image:'assets/photos/brush.jpg' },
    new:      { title:'New Arrivals', tagline:'Fresh formulas to fall in love with.', image:'assets/photos/lipstick.jpg' }
  };
  let preset = presets[cat] || { title:'Shop', tagline:'Discover luxury essentials tailored to you.', image:'assets/photos/foundation.jpg' };
  const titleEl = document.getElementById('collection-title');
  const tagEl = document.getElementById('collection-tagline');
  titleEl && (titleEl.textContent = preset.title);
  tagEl && (tagEl.textContent = preset.tagline);

  // Banner background
  const hero = document.querySelector('.collection-hero');
  if (hero) hero.style.backgroundImage = `linear-gradient(180deg, rgba(251,248,242,.9), rgba(246,239,230,.95)), url('${preset.image}')`;

  // Load promos config for category-specific overrides
  async function loadPromos(){ try{ const res = await fetch('data/promos.json', { cache: 'no-store' }); if(!res.ok) return null; return await res.json(); }catch{ return null; } }
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

  let rendered = 0; const PAGE = 8;
  let working = products.slice();

  function applyFilters(){
    const cats = catChecks.filter(c=>c.checked).map(c=>c.value);
    const skins = skinChecks.filter(c=>c.checked).map(c=>c.value);
    const min = parseFloat(priceMin.value) || -Infinity;
    const max = parseFloat(priceMax.value) || Infinity;
    working = products.filter(p => {
      if (cats.length){
        const inCat = cats.includes('gifts') ? (p.gift===true) : (cats.includes('new') ? (p.new===true) : cats.includes(p.category));
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
    else if (v==='best') working.sort((a,b)=> (b.best===true)-(a.best===true) || b.reviews-a.reviews);
    else /* featured */ working = working; // leave as-is
    render(true);
  }

  function card(p){
    const badge = p.best ? '<span class="badge badge--best">Best</span>' : (p.new ? '<span class="badge badge--new">New</span>' : '');
    return `
      <article class="card" aria-label="${p.name}">
        <div class="card__media">
          <img src="${p.image}" alt="${p.name}" />
          ${badge?`<div class="badges">${badge}</div>`:''}
        </div>
        <div class="card__body">
          <h3 class="card__title">${p.name}</h3>
          <div class="rating" aria-label="Rated ${p.rating} out of 5">
            <span class="stars" style="--rating:${p.rating}"></span>
            <span class="rating__count">(${p.reviews})</span>
          </div>
          <div class="card__meta"><span class="price">$${p.price}</span></div>
          <div class="swatches" role="list" aria-label="Available options">
            <button class="swatch" aria-label="Option A" style="--sw:#f1d6c7"></button>
            <button class="swatch" aria-label="Option B" style="--sw:#e9c2a6"></button>
            <button class="swatch" aria-label="Option C" style="--sw:#c8926b"></button>
          </div>
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
  ;[priceMin, priceMax].forEach(i=> i.addEventListener('change', applyFilters));
  loadMoreBtn.addEventListener('click', ()=> render(false));

  // Initial
  applyFilters();
})();
