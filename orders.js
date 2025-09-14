(() => {
  const USER_KEY = 'foireme_user';
  const ORDERS_KEY = 'foireme_orders';
  const getUser = () => { try { return JSON.parse(localStorage.getItem(USER_KEY)||'null'); } catch { return null; } };
  const orders = () => { try { return JSON.parse(localStorage.getItem(ORDERS_KEY)||'[]')||[]; } catch { return []; } };
  const fmt = (n) => `$${Number(n).toFixed(2)}`;
  const list = document.getElementById('orders-list');
  const u = getUser();
  if (!u){ list.innerHTML = '<p>Please <a href="account.html">sign in</a> to view your orders.</p>'; return; }
  const data = orders().filter(o => !o.email || o.email === u.email);
  if (!data.length){ list.innerHTML = '<p>You have no orders yet.</p>'; return; }
  list.innerHTML = data.map(o => `
    <div class="summary-row" style="align-items: start; gap: 10px;">
      <div><strong>Order #${o.id}</strong><br/><span style="color:var(--muted)">${new Date(o.date).toLocaleString()}</span></div>
      <div><strong>Total</strong><br/>${fmt(o.total)}</div>
    </div>
    <ul class="summary-items" style="margin-bottom:12px;">${o.items.map(i=>`<li class="summary-item"><img src="${i.image}" alt="${i.name}"/><div><div class="name">${i.name} × ${i.qty}</div>${i.options?`<div class="opts">${[i.options.shade&&`Shade: ${i.options.shade}`, i.options.size&&`Size: ${i.options.size}`].filter(Boolean).join(' • ')}</div>`:''}</div><div class="price">${fmt((i.price||0)*i.qty)}</div></li>`).join('')}</ul>
  `).join('');
})();

