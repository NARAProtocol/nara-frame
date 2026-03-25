import { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export async function generateMetadata(): Promise<Metadata> {
  const imageUrl = `${BASE_URL}/api/frame-image`
  return {
    title: 'NARA Degen Board',
    description: '100 founding degens. One tile each. Lock NARA, earn NARA + ETH every epoch.',
    openGraph: {
      title: 'NARA Degen Board',
      images: [{ url: imageUrl, width: 1200, height: 630 }],
    },
    other: {
      'fc:frame': 'vNext',
      'fc:frame:image': imageUrl,
      'fc:frame:image:aspect_ratio': '1.91:1',
      'fc:frame:button:1': 'View Founding Grid',
      'fc:frame:button:1:action': 'link',
      'fc:frame:button:1:target': 'https://naraprotocol.io/mine',
      'fc:frame:button:2': 'Buy NARA',
      'fc:frame:button:2:action': 'link',
      'fc:frame:button:2:target': 'https://naraprotocol.io/mine',
      'fc:frame:post_url': `${BASE_URL}/api/frame-action`,
    },
  }
}

export default function FramePage() {
  const imageUrl = `${BASE_URL}/api/frame-image`
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: '#0a0a0a', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: 560, width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#71717a' }}>Farcaster Frame</p>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>NARA DEGEN BOARD</h1>
          <p style={{ margin: '8px 0 0', fontSize: 14, color: '#a1a1aa', lineHeight: 1.6, fontFamily: 'sans-serif' }}>
            100 founding degens. One tile each. Lock supply, earn NARA + ETH from every protocol product — forever.
          </p>
        </div>
        <img src={imageUrl} alt="NARA Degen Board grid" style={{ width: '100%', borderRadius: 8, border: '1px solid #27272a', display: 'block' }} />
        <div style={{ display: 'flex', gap: 12 }}>
          <a href="https://naraprotocol.io/mine" style={{ flex: 1, display: 'block', padding: '12px 24px', background: '#F59E0B', color: '#000', textAlign: 'center', textDecoration: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600 }}>View Founding Grid</a>
          <a href="https://naraprotocol.io/mine" style={{ flex: 1, display: 'block', padding: '12px 24px', background: '#18181b', color: '#fff', textAlign: 'center', textDecoration: 'none', borderRadius: 6, fontSize: 14, border: '1px solid #3f3f46' }}>Buy NARA</a>
        </div>
        <p style={{ margin: 0, fontSize: 12, color: '#52525b', textAlign: 'center', fontFamily: 'sans-serif' }}>
          1 / 100 OG tiles claimed · Epoch 776+ running · naraprotocol.io/mine
        </p>
      </div>
    </main>
  )
}
