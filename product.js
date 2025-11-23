(() => {
  let allProducts = [];
  const getParam = (k) => new URLSearchParams(location.search).get(k);
  const pid = getParam('id');

  async function loadAndRender() {
    try {
      const res = await fetch('data/products.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load products');
      allProducts = await res.json();
      
      const prod = allProducts.find(p => p.id === pid) || allProducts[0];
      if (!prod) {
        document.getElementById('main').innerHTML = '<div class="container"><p>Product not found.</p></div>';
        return;
      }

      // Populate main fields
      document.title = `${prod.name} — Foireme`;
      const img = document.getElementById('prod-image');
      const title = document.getElementById('prod-title');
      const price = document.getElementById('prod-price');
      const reviews = document.getElementById('prod-reviews');
      const addBtn = document.getElementById('prod-add');
      if (img) { img.src = prod.image; img.alt = prod.alt || prod.name; }
      if (title) title.textContent = prod.name;
      if (price) price.textContent = `$${prod.price}`;
      if (reviews) { reviews.textContent = `(${prod.reviews})`; }
      if (addBtn) addBtn.setAttribute('data-id', prod.id);

      // Wishlist
      const wlBtn = document.getElementById('prod-wish');
      wlBtn && wlBtn.addEventListener('click', () => {
        try {
          const KEY = 'foireme_wishlist';
          const arr = JSON.parse(localStorage.getItem(KEY) || '[]') || [];
          if (!arr.find(x => x.id === prod.id)) arr.push({ id: prod.id, name: prod.name, price: prod.price, image: prod.image });
          localStorage.setItem(KEY, JSON.stringify(arr));
          wlBtn.textContent = 'Saved to Wishlist';
        } catch {}
      });

      // Recommendations carousel
      renderRecs(prod.id);

    } catch (err) {
      console.error('Failed to load product page', err);
      document.getElementById('main').innerHTML = '<div class="container"><p>There was an error loading this page.</p></div>';
    }
  }

  // Zoom interaction (move origin)
  const wrap = document.querySelector('.zoom-wrap');
  const zoomImg = document.querySelector('.zoom-img');
  if (wrap && zoomImg){
    wrap.addEventListener('mousemove', (e)=>{
      const r = wrap.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      zoomImg.style.transformOrigin = `${x}% ${y}%`;
    });
    wrap.addEventListener('mouseleave', ()=>{ zoomImg.style.transformOrigin = 'center center'; });
  }

  // Tabs
  const tabs = Array.from(document.querySelectorAll('.tab'));
  const panels = Array.from(document.querySelectorAll('.tab-panel'));
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-selected','false'); });
      panels.forEach(p => p.classList.remove('is-active'));
      btn.classList.add('is-active'); btn.setAttribute('aria-selected','true');
      const id = btn.getAttribute('aria-controls');
      const panel = document.getElementById(id);
      panel && panel.classList.add('is-active');
    });
  });

  // Recommendations carousel
  function renderRecs(currentId) {
    const track = document.getElementById('recs-track');
    if (track) {
      const recs = allProducts.filter(p => p.id !== currentId).slice(0, 8);
      track.innerHTML = recs.map(p => `
        <article class="card" aria-label="${p.name}">
          <a href="product.html?id=${p.id}" class="card__thumb">
            <img src="${p.image}" alt="${p.alt || p.name}" width="600" height="600" loading="lazy" />
          </a>
          <div class="card__body">
            <h3 class="card__title"><a href="product.html?id=${p.id}" class="card__link">${p.name}</a></h3>
            <div class="rating" aria-label="Rated ${p.rating} out of 5">
              <span class="stars" style="--rating:${p.rating}"></span>
              <span class="rating__count">(${p.reviews})</span>
            </div>
            <div class="card__meta"><span class="price">$${p.price}</span></div>
            <a href="product.html?id=${p.id}" class="btn btn--sm" style="background:#fff;border:1px solid var(--divider);color:var(--ink)">View</a>
          </div>
        </article>
      `).join('');

      const prev = document.querySelector('.recs__nav--prev');
      const next = document.querySelector('.recs__nav--next');
      const scrollBy = () => track.scrollBy({ left: 260, behavior: 'smooth' });
      prev && prev.addEventListener('click', () => track.scrollBy({ left: -260, behavior: 'smooth' }));
      next && next.addEventListener('click', scrollBy);
    }
  }

  loadAndRender();
})();
