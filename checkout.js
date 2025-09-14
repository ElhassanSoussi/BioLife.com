(() => {
  const ITEMS_KEY = 'foireme_cart_items';
  let items = [];
  try { items = JSON.parse(localStorage.getItem(ITEMS_KEY) || '[]') || []; } catch {}

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  // Step controls
  const steps = $$('.stepper .step');
  const showStep = (n) => {
    steps.forEach((s,i)=> s.classList.toggle('is-active', i<=n));
    $('#step-shipping').hidden = n!==0; $('#step-shipping').classList.toggle('is-active', n===0);
    $('#step-payment').hidden = n!==1; $('#step-payment').classList.toggle('is-active', n===1);
    $('#step-review').hidden = n!==2; $('#step-review').classList.toggle('is-active', n===2);
  };
  showStep(0);

  // Sign in toggle
  const signinBtn = $('#toggle-signin');
  const signinForm = $('#signin-form');
  signinBtn && signinBtn.addEventListener('click', ()=>{ signinForm.hidden = !signinForm.hidden; });

  // Summary rendering
  const fmt = (n) => `$${Number(n).toFixed(2)}`;
  const subEl = $('#summary-subtotal');
  const discEl = $('#summary-discount');
  const shipEl = $('#summary-shipping');
  const totEl = $('#summary-total');
  const itemsEl = $('#summary-items');
  const PROMOS = { FOIREME10: { type:'percent', value:10, msg:'10% off applied' }, FREESHIP: { type:'ship', value:0, msg:'Free shipping applied' } };
  let discount = 0; let shipping = 5.00; let promoApplied = null;

  function calc(){
    const subtotal = items.reduce((s,i)=> s + (i.price||0) * i.qty, 0);
    discount = 0; shipping = (promoApplied && PROMOS[promoApplied]?.type==='ship') ? 0 : 5.00;
    if (promoApplied && PROMOS[promoApplied]?.type==='percent') discount = subtotal * (PROMOS[promoApplied].value/100);
    const total = Math.max(0, subtotal - discount) + shipping;
    subEl.textContent = fmt(subtotal);
    discEl.textContent = `-${fmt(discount)}`;
    shipEl.textContent = fmt(shipping);
    totEl.textContent = fmt(total);
  }
  function renderItems(){
    itemsEl.innerHTML = items.map(i=>{
      const opt = i.options ? [i.options.shade && `Shade: ${i.options.shade}`, i.options.size && `Size: ${i.options.size}`].filter(Boolean).join(' • ') : '';
      return `<li class="summary-item"><img src="${i.image}" alt="${i.name}"/><div><div class="name">${i.name} × ${i.qty}</div>${opt?`<div class="opts">${opt}</div>`:''}</div><div class="price">${fmt((i.price||0)*i.qty)}</div></li>`;
    }).join('');
  }
  renderItems(); calc();

  // Promo code
  const promoInput = $('#promo');
  const promoMsg = $('#promo-msg');
  $('#apply-promo').addEventListener('click', ()=>{
    const code = (promoInput.value||'').trim().toUpperCase();
    if (!PROMOS[code]){ promoApplied = null; promoMsg.textContent = 'Invalid code'; promoMsg.style.color = '#cc3b3b'; calc(); return; }
    promoApplied = code; promoMsg.textContent = PROMOS[code].msg; promoMsg.style.color = '#137333'; calc();
  });

  // Step transitions
  $('#to-payment').addEventListener('click', ()=> showStep(1));
  $('#back-to-shipping').addEventListener('click', ()=> showStep(0));
  $('#to-review').addEventListener('click', ()=>{
    // Populate review sections
    const ship = {
      name: `${$('#ship-first').value || ''} ${$('#ship-last').value || ''}`.trim(),
      email: $('#ship-email').value,
      address: $('#ship-address').value,
      city: $('#ship-city').value,
      state: $('#ship-state').value,
      zip: $('#ship-zip').value,
      country: $('#ship-country').value
    };
    $('#review-shipping').innerHTML = `<h3>Shipping</h3><p>${ship.name}<br/>${ship.address}<br/>${ship.city}, ${ship.state} ${ship.zip}<br/>${ship.country}<br/>${ship.email}</p>`;
    $('#review-payment').innerHTML = `<h3>Payment</h3><p>Card ending in ${($('#pay-card').value||'').slice(-4)} · Exp ${$('#pay-exp').value}</p>`;
    showStep(2);
  });
  $('#back-to-payment').addEventListener('click', ()=> showStep(1));

  // Place order (demo)
  $('#place-order').addEventListener('click', ()=>{
    const subtotal = items.reduce((s,i)=> s + (i.price||0) * i.qty, 0);
    const countKey = 'foireme_cart_count';
    // compute totals similar to summary
    let discount = 0; let shipping = (promoApplied && PROMOS[promoApplied]?.type==='ship') ? 0 : 5.00;
    if (promoApplied && PROMOS[promoApplied]?.type==='percent') discount = subtotal * (PROMOS[promoApplied].value/100);
    const total = Math.max(0, subtotal - discount) + shipping;
    const order = { id: Date.now(), date: new Date().toISOString(), items, subtotal, discount, shipping, total, email: $('#ship-email').value };
    try{
      const ORDERS_KEY = 'foireme_orders';
      const arr = JSON.parse(localStorage.getItem(ORDERS_KEY)||'[]')||[];
      arr.push(order);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(arr));
    }catch{}
    localStorage.removeItem(ITEMS_KEY);
    localStorage.setItem(countKey, '0');
    $('#order-success').hidden = false;
    setTimeout(()=>{ window.location.assign('orders.html'); }, 1600);
  });
})();
