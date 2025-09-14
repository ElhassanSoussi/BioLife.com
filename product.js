(() => {
  // Minimal product dataset for the template; id matches app.js products
  const products = [
    { id: 'p1', name: 'Velvet Skin Foundation', price: 34, reviews: 312, rating: 5, image: 'assets/photos/foundation.jpg' },
    { id: 'p2', name: 'Glow Boost Serum', price: 28, reviews: 98, rating: 4, image: 'assets/photos/serum.jpg' },
    { id: 'p3', name: 'Pro Finish Brush', price: 22, reviews: 1100, rating: 5, image: 'assets/photos/brush.jpg' },
    { id: 'p4', name: 'Silk Matte Lipstick', price: 18, reviews: 245, rating: 4, image: 'assets/photos/lipstick.jpg' },
    { id: 'p5', name: 'Everyday Eyeshadow Palette', price: 26, reviews: 534, rating: 5, image: 'assets/photos/palette.jpg' },
    { id: 'p6', name: 'HydraSoft Moisturizer', price: 24, reviews: 189, rating: 4, image: 'assets/photos/moisturizer.jpg' }
  ];

  const getParam = (k) => new URLSearchParams(location.search).get(k);
  const pid = getParam('id') || 'p1';
  const prod = products.find(p=>p.id===pid) || products[0];

  // Populate main fields
  const img = document.getElementById('prod-image');
  const title = document.getElementById('prod-title');
  const price = document.getElementById('prod-price');
  const reviews = document.getElementById('prod-reviews');
  const addBtn = document.getElementById('prod-add');
  if (img) { img.src = prod.image; img.alt = prod.name; }
  if (title) title.textContent = prod.name;
  if (price) price.textContent = `$${prod.price}`;
  if (reviews) { reviews.textContent = `(${prod.reviews})`; }
  if (addBtn) addBtn.setAttribute('data-id', prod.id);
  // Wishlist
  const wlBtn = document.getElementById('prod-wish');
  wlBtn && wlBtn.addEventListener('click', ()=>{
    try{
      const KEY='foireme_wishlist';
      const arr = JSON.parse(localStorage.getItem(KEY)||'[]')||[];
      if (!arr.find(x=>x.id===prod.id)) arr.push({ id: prod.id, name: prod.name, price: prod.price, image: prod.image });
      localStorage.setItem(KEY, JSON.stringify(arr));
      wlBtn.textContent = 'Saved to Wishlist';
    }catch{}
  });

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
  const track = document.getElementById('recs-track');
  if (track){
    const recs = products.filter(p => p.id !== prod.id).slice(0, 8);
    track.innerHTML = recs.map(p => `
      <article class="card" aria-label="${p.name}">
        <div class="card__media">
          <img src="${p.image}" alt="${p.name}" />
        </div>
        <div class="card__body">
          <h3 class="card__title">${p.name}</h3>
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
})();
