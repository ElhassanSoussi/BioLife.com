(() => {
  const KEY = 'foireme_user';
  const getUser = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; } };
  const setUser = (u) => localStorage.setItem(KEY, JSON.stringify(u));
  const clearUser = () => localStorage.removeItem(KEY);

  const msg = document.getElementById('auth-msg');
  const links = document.getElementById('account-links');
  const signin = document.getElementById('signin');
  const signup = document.getElementById('signup');
  const signout = document.getElementById('signout');

  function render(){
    const u = getUser();
    if (u){
      msg.textContent = `Signed in as ${u.name || u.email}`;
      links.hidden = false; signin.hidden = true; signup.hidden = true;
    } else {
      msg.textContent = 'Sign in or create an account.';
      links.hidden = true; signin.hidden = false; signup.hidden = false;
    }
  }
  render();

  signin.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = document.getElementById('si-email').value.trim();
    const pass = document.getElementById('si-pass').value.trim();
    const u = getUser();
    if (!u || u.email !== email || u.password !== pass){ alert('Invalid credentials'); return; }
    render();
    window.location.assign('orders.html');
  });
  signup.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('su-name').value.trim();
    const email = document.getElementById('su-email').value.trim();
    const pass = document.getElementById('su-pass').value.trim();
    if (!name || !email || !pass){ alert('Please fill required fields'); return; }
    setUser({ name, email, password: pass });
    render();
  });
  signout.addEventListener('click', ()=>{ clearUser(); render(); });
})();

