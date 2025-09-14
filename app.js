// Temporary hardcoded product data and renderer
// Replace these with real images/data later.
(function () {
  const products = [
    {
      id: 'p1',
      name: 'Velvet Skin Foundation',
      image: 'https://source.unsplash.com/600x600/?foundation,makeup',
      alt: 'Velvet Skin Foundation bottle',
      price: 34,
      rating: 5,
      reviews: 312,
      size: '30 ml',
      tags: ['Best Seller'],
      swatches: [
        { name: 'Porcelain', hex: '#f2d6c9' },
        { name: 'Sand', hex: '#e6b89f' },
        { name: 'Honey', hex: '#c88f6d' },
        { name: 'Mocha', hex: '#8a5a40' },
      ],
    },
    {
      id: 'p2',
      name: 'Glow Boost Serum',
      image: 'https://source.unsplash.com/600x600/?serum,skincare',
      alt: 'Glow Boost Serum bottle',
      price: 28,
      rating: 4,
      reviews: 98,
      size: '50 ml',
      tags: ['New'],
      swatches: [
        { name: 'Clear', hex: '#ffffff' },
        { name: 'Rose', hex: '#ffd1dc' },
        { name: 'Champagne', hex: '#ffe1a8' },
      ],
    },
    {
      id: 'p3',
      name: 'Pro Finish Brush',
      image: 'https://source.unsplash.com/600x600/?brush,makeup',
      alt: 'Pro Finish Brush',
      price: 22,
      rating: 5,
      reviews: 1100,
      tags: ['Best Seller'],
      swatches: [
        { name: 'Matte Black', hex: '#111111' },
        { name: 'Champagne Gold', hex: '#e9b17d' },
        { name: 'Pearl', hex: '#faf7f2' },
      ],
    },
    {
      id: 'p4',
      name: 'Silk Matte Lipstick',
      image: 'https://source.unsplash.com/600x600/?lipstick,makeup',
      alt: 'Silk Matte Lipstick',
      price: 18,
      rating: 4,
      reviews: 245,
      tags: ['Limited'],
      swatches: [
        { name: 'Rosewood', hex: '#a3484a' },
        { name: 'Coral', hex: '#ff6f61' },
        { name: 'Ruby', hex: '#c21807' },
        { name: 'Nude', hex: '#caa186' },
      ],
    },
    {
      id: 'p5',
      name: 'Everyday Eyeshadow Palette',
      image: 'https://source.unsplash.com/600x600/?palette,makeup',
      alt: 'Everyday Eyeshadow Palette',
      price: 26,
      rating: 5,
      reviews: 534,
      swatches: [
        { name: 'Cool Taupe', hex: '#b4a89e' },
        { name: 'Warm Bronze', hex: '#b08157' },
        { name: 'Deep Espresso', hex: '#3b2b20' },
      ],
    },
    {
      id: 'p6',
      name: 'HydraSoft Moisturizer',
      image: 'https://source.unsplash.com/600x600/?moisturizer,skincare',
      alt: 'HydraSoft Moisturizer',
      price: 24,
      rating: 4,
      reviews: 189,
      tags: [],
      swatches: [
        { name: 'Travel', hex: '#cfd8dc' },
        { name: 'Standard', hex: '#eceff1' },
      ],
    },
  ];

  const badgeClass = (tag) => {
    const t = tag.toLowerCase();
    if (t.includes('best')) return 'badge badge--best';
    if (t.includes('new')) return 'badge badge--new';
    if (t.includes('limit')) return 'badge badge--limited';
    return 'badge';
  };

  const formatCount = (n) => {
    if (typeof n !== 'number') return String(n);
    if (n >= 1000) return (Math.round((n / 1000) * 10) / 10).toFixed(1) + 'k';
    return String(n);
  };

  function render(products) {
    const grid = document.querySelector('.product-grid');
    if (!grid) return;
    grid.innerHTML = products
      .map((p, i) => {
        const pid = p.id || `p${i + 1}`;
        const badges = (p.tags || [])
          .map((t) => `<span class="${badgeClass(t)}">${t}</span>`) 
          .join('');
        const swatches = (p.swatches || [])
          .map((s) => `<button class="swatch" aria-label="${s.name}" style="--sw:${s.hex}"></button>`) 
          .join('');
        const meta = [
          `<span class="price">$${p.price}</span>`,
          p.size ? '<span class="meta-dot" aria-hidden="true">•</span><span class="size">' + p.size + '</span>' : ''
        ].join('');
        return `
          <article class="card" aria-labelledby="${pid}-title">
            <div class="card__media">
              <img src="${p.image}" alt="${p.alt || p.name}" width="600" height="600" loading="lazy" />
              ${badges ? `<div class="badges">${badges}</div>` : ''}
              <div class="quickadd">
                <button class="btn btn--primary btn--sm js-add" data-id="${pid}" type="button" aria-label="Quick add ${p.name}">Quick Add</button>
                <button class="btn btn--sm js-view" data-id="${pid}" type="button" aria-label="Quick view ${p.name}" style="background:#fff;border:1px solid var(--divider);color:var(--ink)">Quick View</button>
              </div>
            </div>
            <div class="card__body">
              <h3 id="${pid}-title" class="card__title">${p.name}</h3>
              <div class="rating" aria-label="Rated ${p.rating} out of 5">
                <span class="stars" style="--rating:${p.rating}" aria-hidden="true"></span>
                <span class="rating__count">(${formatCount(p.reviews)})</span>
              </div>
              <div class="card__meta">${meta}</div>
              ${swatches ? `<div class="swatches" role="list" aria-label="Available options">${swatches}</div>` : ''}
            </div>
          </article>
        `;
      })
      .join('');
  }

  render(products);

  // Cart counter wiring
  const CART_KEY = 'foireme_cart_count';
  const getCart = () => parseInt(localStorage.getItem(CART_KEY) || '0', 10);
  const setCart = (n) => localStorage.setItem(CART_KEY, String(n));
  const badge = document.querySelector('.cart__count');
  if (badge) badge.textContent = String(getCart());

  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.js-add');
    const viewBtn = e.target.closest('.js-view');
    if (addBtn) {
      const next = getCart() + 1;
      setCart(next);
      if (badge) badge.textContent = String(next);
    }
    if (viewBtn) {
      const id = viewBtn.getAttribute('data-id');
      const p = products.find(x => (x.id || '') === id || (('p'+(products.indexOf(x)+1)) === id));
      if (p) openModal(p);
    }
  });

  // Search expand toggle
  const search = document.querySelector('.search--compact');
  const toggle = document.querySelector('.search__toggle');
  if (search && toggle) {
    toggle.addEventListener('click', () => search.classList.toggle('is-open'));
  }

  // Quick View modal
  function openModal(p){
    let el = document.getElementById('quickview');
    if (!el){
      el = document.createElement('div');
      el.id = 'quickview';
      el.className = 'modal';
      el.innerHTML = `
        <div class="modal__overlay" data-dismiss></div>
        <div class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="qv-title">
          <button class="modal__close" data-dismiss aria-label="Close">×</button>
          <div class="modal__content"></div>
        </div>`;
      document.body.appendChild(el);
      el.addEventListener('click', (e)=>{ if(e.target.matches('[data-dismiss]')) closeModal(); });
      el.querySelector('.modal__close').addEventListener('click', closeModal);
    }
    const content = el.querySelector('.modal__content');
    content.innerHTML = `
      <div class="qv">
        <img src="${p.image}" alt="${p.alt || p.name}" width="320" height="320" class="qv__img" />
        <div class="qv__info">
          <h3 id="qv-title">${p.name}</h3>
          <div class="rating"><span class="stars" style="--rating:${p.rating}">★★★★★</span><span class="rating__count">(${p.reviews})</span></div>
          <div class="card__meta"><span class="price">$${p.price}</span></div>
          <button class="btn btn--primary btn--sm js-add" data-id="${p.id}">Add to Cart</button>
        </div>
      </div>`;
    el.classList.add('is-open');
  }
  function closeModal(){
    const el = document.getElementById('quickview');
    if (el) el.classList.remove('is-open');
  }
})();
