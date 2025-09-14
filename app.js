// Temporary hardcoded product data and renderer
// Replace these with real images/data later.
(function () {
  // Load promos config (robust for file:// and errors)
  const defaultPromos = {
    global: { enabled: true, text: 'Free shipping over $50 · Use code FOIREME10', link: 'collection.html?cat=skincare', bg: '#111111', fg: '#ffffff', dismissible: true },
    homepage_hero: { enabled: true, title: 'Free Brush & More', subtitle: 'Upgrade your routine with our best-sellers for a flawless finish.', cta: { label: 'Shop Now', href: '#shop' } }
  };
  async function loadPromos(){
    if (window.FOIREME_PROMOS) return window.FOIREME_PROMOS;
    if (location.protocol === 'file:') return defaultPromos;
    try{
      const res = await fetch('data/promos.json', { cache: 'no-store' });
      if (!res.ok) return defaultPromos;
      const json = await res.json();
      return json || defaultPromos;
    }catch(err){
      console.warn('Promos config failed to load; using defaults', err);
      return defaultPromos;
    }
  }

  function renderGlobalPromo(cfg){
    if (!cfg || !cfg.global || !cfg.global.enabled) return;
    const dismissed = localStorage.getItem('foireme_promo_global_dismissed') === '1';
    if (dismissed && cfg.global.dismissible) return;
    const bar = document.createElement('div');
    bar.className = 'promo-bar';
    bar.setAttribute('role','region');
    bar.setAttribute('aria-label','Site announcement');
    bar.style.background = cfg.global.bg || '#111';
    bar.innerHTML = `<div class="promo-bar__inner container">
      <div class="promo-bar__text">${cfg.global.link ? `<a href="${cfg.global.link}" style="color:${cfg.global.fg||'#fff'}; text-decoration: none;">${cfg.global.text}</a>` : `<span style="color:${cfg.global.fg||'#fff'}">${cfg.global.text}</span>`}</div>
      ${cfg.global.dismissible ? '<button class="promo-bar__close" aria-label="Dismiss">×</button>' : ''}
    </div>`;
    document.body.prepend(bar);
    requestAnimationFrame(()=> bar.classList.add('is-show'));
    const close = bar.querySelector('.promo-bar__close');
    if (close){ close.addEventListener('click', ()=>{ bar.remove(); localStorage.setItem('foireme_promo_global_dismissed','1'); }); }
  }

  function applyHomepageHero(cfg){
    if (!cfg || !cfg.homepage_hero || !cfg.homepage_hero.enabled) return;
    const title = document.querySelector('.hero__title');
    const subtitle = document.querySelector('.hero__subtitle');
    const cta = document.querySelector('.hero .btn.btn--primary');
    if (title) title.textContent = cfg.homepage_hero.title || title.textContent;
    if (subtitle) subtitle.textContent = cfg.homepage_hero.subtitle || subtitle.textContent;
    if (cta && cfg.homepage_hero.cta){ cta.textContent = cfg.homepage_hero.cta.label || cta.textContent; cta.setAttribute('href', cfg.homepage_hero.cta.href || cta.getAttribute('href')); }
  }

  loadPromos().then(cfg => { renderGlobalPromo(cfg); applyHomepageHero(cfg); });
  const allProducts = [
    {
      id: 'p1',
      name: 'Velvet Skin Foundation',
      image: 'assets/photos/foundation.jpg',
      alt: 'Velvet Skin Foundation bottle',
      description: 'Weightless, buildable coverage with a natural finish.',
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
      image: 'assets/photos/serum.jpg',
      alt: 'Glow Boost Serum bottle',
      description: 'Brightens dull skin and boosts radiance.',
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
      image: 'assets/photos/brush.jpg',
      alt: 'Pro Finish Brush',
      description: 'Soft synthetic bristles for streak-free blending.',
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
      image: 'assets/photos/lipstick.jpg',
      alt: 'Silk Matte Lipstick',
      description: 'Velvety-matte color that feels comfortable.',
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
      image: 'assets/photos/palette.jpg',
      alt: 'Everyday Eyeshadow Palette',
      description: 'Nine wearable shades in matte and shimmer.',
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
      image: 'assets/photos/moisturizer.jpg',
      alt: 'HydraSoft Moisturizer',
      description: 'Lightweight daily hydration that lasts 24 hours.',
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
              <a href="product.html?id=${pid}" class="card__thumb" aria-label="${p.name}">
                <img src="${p.image}" alt="${p.alt || p.name}" width="600" height="600" loading="lazy" />
              </a>
              ${badges ? `<div class="badges">${badges}</div>` : ''}
              <div class="quickadd">
                <button class="btn btn--primary btn--sm js-add" data-id="${pid}" type="button" aria-label="Quick add ${p.name}">Quick Add</button>
                <button class="btn btn--sm js-view" data-id="${pid}" type="button" aria-label="Quick view ${p.name}" style="background:#fff;border:1px solid var(--divider);color:var(--ink)">Quick View</button>
              </div>
            </div>
            <div class="card__body">
              <h3 id="${pid}-title" class="card__title">${p.name}</h3>
              <p class="card__desc">${p.description || ''}</p>
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

  // Initial render
  render(allProducts);

  // Search filtering (by name or description)
  const searchEl = document.querySelector('.search--compact .search__input');
  if (searchEl){
    const doFilter = () => {
      const q = (searchEl.value || '').toLowerCase();
      if (!q){ render(allProducts); return; }
      render(allProducts.filter(p => (p.name+" "+(p.description||'')).toLowerCase().includes(q)));
    };
    searchEl.addEventListener('input', doFilter);
  }

  // Mobile menu toggle
  const menu = document.getElementById('mobile-menu');
  const menuBtn = document.querySelector('.menu-toggle');
  if (menu && menuBtn){
    const open = () => {
      menu.classList.add('is-open');
      menu.removeAttribute('hidden');
      menuBtn.setAttribute('aria-expanded','true');
    };
    const close = () => {
      menu.classList.remove('is-open');
      menu.setAttribute('hidden','');
      menuBtn.setAttribute('aria-expanded','false');
    };
    menuBtn.addEventListener('click', () => {
      if (menu.classList.contains('is-open')) close(); else open();
    });
    menu.addEventListener('click', (e) => {
      if (e.target.matches('[data-dismiss]') || e.target.closest('[data-dismiss]')) close();
    });
    // Close when a link is clicked
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  }

  // Cart state
  const CART_KEY = 'foireme_cart_count'; // legacy (count only)
  const CART_ITEMS_KEY = 'foireme_cart_items';
  let cartItems = [];
  try { cartItems = JSON.parse(localStorage.getItem(CART_ITEMS_KEY) || '[]') || []; } catch {}

  const saveCart = () => {
    localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(cartItems));
    // keep legacy count updated
    const count = cartItems.reduce((s,i)=>s+i.qty,0);
    localStorage.setItem(CART_KEY, String(count));
  };
  const badge = document.querySelector('.cart__count');
  const updateBadge = () => { if (badge) badge.textContent = String(cartItems.reduce((s,i)=>s+i.qty,0)); };
  updateBadge();

  // Helpers
  const findProduct = (pid) => allProducts.find(p => p.id === pid || `p${allProducts.indexOf(p)+1}` === pid);
  const addToCart = (pid, qty=1, opts) => {
    const p = findProduct(pid);
    if (!p) return null;
    const idx = cartItems.findIndex(i => i.id === p.id);
    if (idx >= 0) {
      cartItems[idx].qty += qty;
      // update options only if provided
      if (opts) cartItems[idx].options = opts;
    } else {
      cartItems.push({ id: p.id, name: p.name, price: p.price, image: p.image, qty, options: opts });
    }
    saveCart(); updateBadge(); renderMiniCart(); updateBar();
    return { id: p.id, qty };
  };
  const removeFromCart = (pid, qty=1) => {
    const i = cartItems.findIndex(x=>x.id===pid);
    if (i<0) return;
    cartItems[i].qty -= qty;
    if (cartItems[i].qty <= 0) cartItems.splice(i,1);
    saveCart(); updateBadge(); renderMiniCart(); updateBar();
  };

  // Mini cart UI
  const mini = document.getElementById('mini-cart');
  const miniItems = () => mini && mini.querySelector('.mini-cart__items');
  const subtotalEl = () => mini && mini.querySelector('.mini-cart__subtotal-value');
  const checkoutBtn = () => mini && mini.querySelector('.mini-cart__checkout');
  const openMini = () => { if (!mini) return; mini.classList.add('is-open'); mini.removeAttribute('hidden'); };
  const closeMini = () => { if (!mini) return; mini.classList.remove('is-open'); mini.setAttribute('hidden',''); };
  const renderMiniCart = () => {
    const list = miniItems(); if (!list) return;
    if (!cartItems.length){ list.innerHTML = '<li class="mini-cart__empty">Your cart is empty.</li>'; if (checkoutBtn()) checkoutBtn().disabled = true; if (subtotalEl()) subtotalEl().textContent = '$0'; return; }
    list.innerHTML = cartItems.map(i => {
      const p = findProduct(i.id) || i;
      const line = (i.qty * (p.price || 0)).toFixed(2);
      const optText = i.options ? [i.options.shade && `Shade: ${i.options.shade}`, i.options.size && `Size: ${i.options.size}`].filter(Boolean).join(' • ') : '';
      return `<li class="mini-cart__item" data-id="${i.id}">
        <img src="${p.image}" alt="${p.name}" class="mini-cart__img"/>
        <div>
          <p class="mini-cart__name">${p.name}</p>
          ${optText ? `<p class="mini-cart__price" style="margin:0 0 4px">${optText}</p>` : ''}
          <p class="mini-cart__price">$${p.price} × ${i.qty} = $${line}</p>
          <div class="mini-cart__qty">
            <button class="mini-cart__btn js-qty-dec" aria-label="Decrease">−</button>
            <span>${i.qty}</span>
            <button class="mini-cart__btn js-qty-inc" aria-label="Increase">+</button>
          </div>
        </div>
        <button class="mini-cart__remove js-remove" aria-label="Remove">Remove</button>
      </li>`;
    }).join('');
    const subtotal = cartItems.reduce((s,i)=>{
      const p = findProduct(i.id) || {}; return s + (p.price||0)*i.qty;
    },0).toFixed(2);
    if (subtotalEl()) subtotalEl().textContent = `$${subtotal}`;
    if (checkoutBtn()) checkoutBtn().disabled = false;
  };
  renderMiniCart();

  // Cart bar (mobile summary)
  const bar = document.getElementById('cart-bar');
  const barCount = () => bar && bar.querySelector('.cart-bar__count');
  const barSubtotal = () => bar && bar.querySelector('.cart-bar__subtotal');
  const barBtn = () => bar && bar.querySelector('.cart-bar__btn');
  const updateBar = () => {
    if (!bar) return;
    const count = cartItems.reduce((s,i)=>s+i.qty,0);
    const subtotal = cartItems.reduce((s,i)=>{ const p=findProduct(i.id)||{}; return s+(p.price||0)*i.qty; },0).toFixed(2);
    if (count>0){
      bar.hidden = false;
      if (barCount()) barCount().textContent = String(count);
      if (barSubtotal()) barSubtotal().textContent = `$${subtotal}`;
    } else {
      bar.hidden = true;
    }
  };
  updateBar();
  barBtn() && barBtn().addEventListener('click', ()=>{ window.location.assign('cart.html'); });

  // Open cart from header
  const cartBtn = document.querySelector('.cart');
  cartBtn && cartBtn.addEventListener('click', (e)=>{ e.preventDefault(); openMini(); });
  mini && mini.addEventListener('click', (e)=>{
    if (e.target.matches('[data-dismiss]') || e.target.closest('[data-dismiss]')) { closeMini(); }
    const item = e.target.closest('.mini-cart__item');
    if (!item) return;
    const id = item.getAttribute('data-id');
    if (e.target.closest('.js-qty-inc')) { addToCart(id,1); }
    if (e.target.closest('.js-qty-dec')) { removeFromCart(id,1); }
    if (e.target.closest('.js-remove')) { const it = cartItems.find(x=>x.id===id); if (it) removeFromCart(id, it.qty); }
  });

  // Hook mini-cart checkout to route
  if (checkoutBtn()){
    checkoutBtn().addEventListener('click', (e)=>{
      e.preventDefault();
      window.location.assign('checkout.html');
    });
  }

  // Toast
  const toast = document.getElementById('toast');
  let toastTimer = null; let lastAdd = null;
  const showToast = (msg, undoPayload) => {
    if (!toast) return;
    toast.innerHTML = `${msg} <button class="toast__undo" type="button">Undo</button>`;
    toast.hidden = false; toast.classList.add('is-show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(()=>{ toast.classList.remove('is-show'); toast.hidden = true; }, 3200);
    lastAdd = undoPayload || null;
  };
  toast && toast.addEventListener('click', (e)=>{
    if (e.target.closest('.toast__undo') && lastAdd){ removeFromCart(lastAdd.id, lastAdd.qty); toast.classList.remove('is-show'); toast.hidden = true; }
  });

  // Global click handler additions
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.js-add');
    const viewBtn = e.target.closest('.js-view');
    if (addBtn) {
      const id = addBtn.getAttribute('data-id');
      // collect options if present (product detail page)
      let opts;
      const shadeEl = document.getElementById('shade');
      const sizeEl = document.getElementById('size');
      if (shadeEl || sizeEl){
        opts = { shade: shadeEl ? shadeEl.value : undefined, size: sizeEl ? sizeEl.value : undefined };
      }
      const payload = addToCart(id, 1, opts);
      if (payload) showToast('Added to cart', payload);
    }
    if (viewBtn) {
      const id = viewBtn.getAttribute('data-id');
      const p = findProduct(id);
      if (p) openModal(p);
    }
  });

  // Search expand toggle
  const search = document.querySelector('.search--compact');
  const toggle = document.querySelector('.search__toggle');
  if (search && toggle) {
    toggle.addEventListener('click', () => search.classList.toggle('is-open'));
  }

  // Footer accordions: open on desktop (>=768px), collapse on mobile
  function setFooterAccState(){
    const wide = window.innerWidth >= 768;
    document.querySelectorAll('.footer-acc').forEach(col => {
      if (wide) col.classList.add('is-open'); else col.classList.remove('is-open');
    });
  }
  setFooterAccState();
  window.addEventListener('resize', setFooterAccState);
  document.querySelectorAll('.footer-acc .footer-title').forEach(title => {
    title.addEventListener('click', () => {
      if (window.innerWidth < 768){
        const parent = title.closest('.footer-acc');
        if (!parent) return;
        const isOpen = parent.classList.toggle('is-open');
        title.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
    });
  });

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
