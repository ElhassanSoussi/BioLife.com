(() => {
  const AKEY='foireme_addresses'; const PKEY='foireme_payments';
  const getA = () => { try { return JSON.parse(localStorage.getItem(AKEY)||'[]')||[]; } catch { return []; } };
  const setA = (v) => localStorage.setItem(AKEY, JSON.stringify(v));
  const getP = () => { try { return JSON.parse(localStorage.getItem(PKEY)||'[]')||[]; } catch { return []; } };
  const setP = (v) => localStorage.setItem(PKEY, JSON.stringify(v));
  const addrList = document.getElementById('addr-list');
  const payList = document.getElementById('pay-list');
  const saveAddrBtn = document.getElementById('save-addr');
  const savePayBtn = document.getElementById('save-pay');

  // Bail if the page structure isn't present to avoid runtime errors on other pages
  if (!addrList || !payList || !saveAddrBtn || !savePayBtn) return;
  function renderA(){
    const arr = getA();
    addrList.innerHTML = arr.length? arr.map((a,i)=>`<div class="summary-row"><div>${a.name}<br/>${a.line1}<br/>${a.city}, ${a.state} ${a.zip}<br/>${a.country}<br/>${a.phone||''}</div><button class="btn btn--sm js-del-a" data-i="${i}">Delete</button></div>`).join('') : '<p style="color:var(--muted)">No saved addresses.</p>';
  }
  function renderP(){
    const arr = getP();
    payList.innerHTML = arr.length? arr.map((p,i)=>`<div class="summary-row"><div>${p.name}<br/>•••• •••• •••• ${(p.card||'').slice(-4)} · Exp ${p.exp}</div><button class="btn btn--sm js-del-p" data-i="${i}">Delete</button></div>`).join('') : '<p style="color:var(--muted)">No saved payments.</p>';
  }
  renderA(); renderP();
  saveAddrBtn.addEventListener('click', ()=>{
    const a = { name:val('a-name'), phone:val('a-phone'), line1:val('a-line1'), city:val('a-city'), state:val('a-state'), zip:val('a-zip'), country:val('a-country') };
    if (!a.name || !a.line1) { alert('Please fill required fields'); return; }
    const arr = getA(); arr.push(a); setA(arr); renderA();
  });
  savePayBtn.addEventListener('click', ()=>{
    const p = { name:val('p-name'), card:val('p-card'), exp:val('p-exp'), cvc:val('p-cvc') };
    if (!p.name || !p.card) { alert('Please fill required fields'); return; }
    const arr = getP(); arr.push(p); setP(arr); renderP();
  });
  function val(id){ return (document.getElementById(id).value||'').trim(); }
  document.addEventListener('click', (e)=>{
    if (e.target.closest('.js-del-a')){ const i = +e.target.getAttribute('data-i'); const arr = getA(); arr.splice(i,1); setA(arr); renderA(); }
    if (e.target.closest('.js-del-p')){ const i = +e.target.getAttribute('data-i'); const arr = getP(); arr.splice(i,1); setP(arr); renderP(); }
  });
})();
