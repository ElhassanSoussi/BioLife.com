import Image from 'next/image';

const products = [
  {
    id: 'p1',
    name: 'Velvet Skin Foundation',
    image: '/assets/foundation.svg',
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
      { name: 'Mocha', hex: '#8a5a40' }
    ]
  },
  {
    id: 'p2',
    name: 'Glow Boost Serum',
    image: '/assets/serum.svg',
    alt: 'Glow Boost Serum bottle',
    price: 28,
    rating: 4,
    reviews: 98,
    size: '50 ml',
    tags: ['New'],
    swatches: [
      { name: 'Clear', hex: '#ffffff' },
      { name: 'Rose', hex: '#ffd1dc' },
      { name: 'Champagne', hex: '#ffe1a8' }
    ]
  },
  {
    id: 'p3',
    name: 'Pro Finish Brush',
    image: '/assets/brush.svg',
    alt: 'Pro Finish Brush',
    price: 22,
    rating: 5,
    reviews: 1100,
    tags: ['Best Seller'],
    swatches: [
      { name: 'Matte Black', hex: '#111111' },
      { name: 'Champagne Gold', hex: '#e9b17d' },
      { name: 'Pearl', hex: '#faf7f2' }
    ]
  }
];

function Stars({ rating }: { rating: number }) {
  return (
    <span
      className="stars"
      style={{
        backgroundImage: `linear-gradient(90deg, #d4b06a ${(rating / 5) * 100}%, rgba(0,0,0,0.16) ${(rating / 5) * 100}%)`
      }}
    >
      ★★★★★
    </span>
  );
}

export default function Page() {
  return (
    <div>
      <header style={{ position: 'sticky', top: 0, background: '#fff', borderBottom: '1px solid #e8e6e1', zIndex: 10 }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 24px', minHeight: 72, display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 20 }}>
          <a href="#" style={{ fontWeight: 800, letterSpacing: '0.02em' }}>BioLife.com</a>
          <nav aria-label="Primary">
            <ul style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
              {['Skincare','Makeup','Gifts','New Arrivals','Blog','Membership'].map(i => (
                <li key={i}><a href="#" style={{ padding: '10px 12px', textTransform: 'uppercase', fontSize: 14, fontWeight: 600 }}>{i}</a></li>
              ))}
            </ul>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <a href="#cart" aria-label="Cart" style={{ width: 42, height: 42, display: 'grid', placeItems: 'center', borderRadius: 999, border: '1px solid #e8e6e1' }}>🛒</a>
          </div>
        </div>
      </header>

      <main>
        <section style={{ background: '#fff' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '48px 24px', display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: '5vw', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, color: '#5f6368', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Limited-time offer</p>
              <h1 style={{ margin: '8px 0 12px', fontWeight: 800, fontSize: 'clamp(2.5rem, 5vw, 4.25rem)' }}>Free Brush & More</h1>
              <p style={{ color: '#5f6368', maxWidth: 680 }}>Upgrade your routine with our best-sellers for a flawless finish.</p>
              <a href="#shop" style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 24px', borderRadius: 999, background: '#0b1f3a', color: '#fff', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Shop Now</a>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: 'min(42vw, 520px)', aspectRatio: '1 / 1' }}>
                <Image src="/assets/foundation.svg" alt="Foundation" width={320} height={460} style={{ position:'absolute', left:'6%', bottom:'8%', width:'54%', borderRadius:16, boxShadow:'0 16px 30px rgba(16,24,40,0.18)', background:'#fff', border:'1px solid #e8e6e1' }} />
                <Image src="/assets/brush.svg" alt="Brush" width={280} height={420} style={{ position:'absolute', right:'2%', top:'12%', width:'46%', borderRadius:16, boxShadow:'0 16px 30px rgba(16,24,40,0.18)', background:'#fff', border:'1px solid #e8e6e1' }} />
                <Image src="/assets/serum.svg" alt="Serum" width={300} height={440} style={{ position:'absolute', right:'18%', bottom:0, width:'40%', borderRadius:16, boxShadow:'0 16px 30px rgba(16,24,40,0.18)', background:'#fff', border:'1px solid #e8e6e1' }} />
              </div>
            </div>
          </div>
        </section>

        <section id="shop" style={{ padding: '64px 0', borderTop: '1px solid #e8e6e1' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 24px' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.01em' }}>Flawless Essentials</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
              {products.map(p => (
                <article key={p.id} style={{ border: '1px solid #e8e6e1', borderRadius: 16, background: '#fff' }}>
                  <div style={{ position: 'relative', aspectRatio: '1 / 1', background: '#f2eee8' }}>
                    <Image src={p.image} alt={p.alt} width={600} height={600} style={{ objectFit: 'contain' }} />
                  </div>
                  <div style={{ padding: 14 }}>
                    <h3 style={{ margin: '0 0 8px', fontSize: '1.0625rem' }}>{p.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <Stars rating={p.rating} />
                      <span style={{ color: '#5f6368', fontSize: 14 }}>({p.reviews})</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontWeight: 700 }}>${p.price}</span>
                      {p.size && <><span aria-hidden>•</span><span>{p.size}</span></>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

