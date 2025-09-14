(() => {
  const CART_ITEMS_KEY = 'foireme_cart_items';
  let items = [];
  try { items = JSON.parse(localStorage.getItem(CART_ITEMS_KEY) || '[]') || []; } catch {}

  const list = document.querySelector('.cart-page__items');
  const subtotalEl = document.getElementById('cart-subtotal');
  const modal = document.getElementById('checkout-modal');
  const btnCheckout = document.getElementById('cart-checkout');

  const render = () => {
    if (!list) return;
    if (!items.length){
      list.innerHTML = '<li style="color:var(--muted)">Your cart is empty.</li>';
      if (btnCheckout) btnCheckout.disabled = true;
      if (subtotalEl) subtotalEl.textContent = '$0';
      return;
    }
    list.innerHTML = items.map(i => `
      <li class="mini-cart__item" data-id="${i.id}">
        <img src="${i.image}" alt="${i.name}" class="mini-cart__img"/>
        <div>
          <p class="mini-cart__name">${i.name}</p>
          ${i.options ? `<p class=\"mini-cart__price\" style=\"margin:0 0 4px\">${[i.options.shade&&`Shade: ${i.options.shade}`, i.options.size&&`Size: ${i.options.size}`].filter(Boolean).join(' • ')}</p>` : ''}
          <p class="mini-cart__price">$${i.price} × ${i.qty} = $${(i.price*i.qty).toFixed(2)}</p>
          <div class="mini-cart__qty">
            <button class="mini-cart__btn js-dec" aria-label="Decrease">−</button>
            <span>${i.qty}</span>
            <button class="mini-cart__btn js-inc" aria-label="Increase">+</button>
          </div>
        </div>
        <button class="mini-cart__remove js-remove" aria-label="Remove">Remove</button>
      </li>
    `).join('');
    const subtotal = items.reduce((s,i)=>s + (i.price||0)*i.qty, 0).toFixed(2);
    if (subtotalEl) subtotalEl.textContent = `$${subtotal}`;
    if (btnCheckout) btnCheckout.disabled = false;
  };

  const save = () => localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(items));
  const findIndex = (id) => items.findIndex(x=>x.id===id);

  list && list.addEventListener('click', (e) => {
    const li = e.target.closest('.mini-cart__item');
    if (!li) return;
    const id = li.getAttribute('data-id');
    const idx = findIndex(id); if (idx<0) return;
    if (e.target.closest('.js-inc')) items[idx].qty += 1;
    if (e.target.closest('.js-dec')) items[idx].qty = Math.max(0, items[idx].qty - 1);
    if (e.target.closest('.js-remove')) items.splice(idx, 1);
    items = items.filter(x=>x.qty>0);
    save(); render();
  });

  btnCheckout && btnCheckout.addEventListener('click', ()=>{ window.location.assign('checkout.html'); });

  render();
})();
