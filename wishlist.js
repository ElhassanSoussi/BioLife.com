(() => {
  const KEY = 'foireme_wishlist';
  const get = () => { try { return JSON.parse(localStorage.getItem(KEY)||'[]')||[]; } catch { return []; } };
  const set = (v) => localStorage.setItem(KEY, JSON.stringify(v));
  const wl = document.getElementById('wl');
  if (!wl) return;
  const data = get();
  if (!data.length){ wl.innerHTML = '<p style="color:var(--muted)">Your wishlist is empty.</p>'; return; }
  wl.innerHTML = data.map(p => `
    <article class="card">
      <div class="card__media"><a href="product.html?id=${p.id}" class="card__thumb"><img src="${p.image}" alt="${p.name}"/></a></div>
      <div class="card__body">
        <h3 class="card__title">${p.name}</h3>
        <div class="card__meta"><span class="price">$${p.price}</span></div>
        <div class="quickadd" style="position: static; transform:none; opacity:1; margin-top:10px; display:flex; gap:8px;">
          <button class="btn btn--primary btn--sm js-add" data-id="${p.id}">Add to Cart</button>
          <button class="btn btn--sm js-remove" data-id="${p.id}" style="background:#fff;border:1px solid var(--divider);color:var(--ink)">Remove</button>
        </div>
      </div>
    </article>
  `).join('');
  wl.addEventListener('click', (e)=>{
    const id = (e.target.getAttribute('data-id'));
    if (e.target.closest('.js-remove')){
      const arr = get().filter(x=>x.id!==id); set(arr); location.reload();
    }
  });
})();
