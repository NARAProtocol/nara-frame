import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const SLOT_NARA = [
  50, 100, 250, 500, 1000, 50, 500, 100, 500, 250,
  500, 250, 100, 250, 250, 100, 50, 50, 250, 100,
  500, 100, 1000, 50, 1000, 50, 250, 500, 500, 50,
  ...Array.from({ length: 70 }, (_, j) => [50, 100, 250, 500, 1000][(j + 3) % 5]),
]

const TAKEN = [false, false, true, ...Array(97).fill(false)] // slot #3 taken

const SLOTS = SLOT_NARA.map((nara, i) => ({ id: i + 1, nara, taken: TAKEN[i] }))
const TAKEN_COUNT = SLOTS.filter(s => s.taken).length
const OPEN_COUNT = 100 - TAKEN_COUNT

function tierColor(nara: number): string {
  if (nara === 50)   return '#71717a'
  if (nara === 100)  return '#3b82f6'
  if (nara === 250)  return '#8b5cf6'
  if (nara === 500)  return '#f59e0b'
  if (nara === 1000) return '#ef4444'
  return '#3f3f46'
}

function fmt(n: number): string { return n >= 1000 ? `${n / 1000}k` : `${n}` }

export async function GET(req: NextRequest) {
  const W = 1200, H = 630
  const HEADER_H = 72
  const FOOTER_H = 36
  const PANEL_W = 160
  const PADDING = 12
  const GRID_X = PADDING
  const GRID_Y = HEADER_H + PADDING
  const GRID_W = W - PANEL_W - PADDING * 3
  const GRID_H = H - HEADER_H - FOOTER_H - PADDING * 2
  const CELL_W = Math.floor((GRID_W - 9 * 4) / 10)
  const CELL_H = Math.floor((GRID_H - 9 * 4) / 10)
  const GAP = 4
  const PX = W - PANEL_W - PADDING
  const PY = HEADER_H + PADDING

  const cells = SLOTS.map((slot, i) => {
    const col = i % 10
    const row = Math.floor(i / 10)
    const x = GRID_X + col * (CELL_W + GAP)
    const y = GRID_Y + row * (CELL_H + GAP)
    const border = slot.taken ? tierColor(slot.nara) : '#3f3f46'
    const bg = slot.taken ? '#0f0f0f' : '#18181b'
    const numColor = slot.taken ? tierColor(slot.nara) : '#52525b'
    const naraColor = slot.taken ? '#a1a1aa' : '#3f3f46'
    const idStr = String(slot.id).padStart(2, '0')
    return `<rect x="${x}" y="${y}" width="${CELL_W}" height="${CELL_H}" rx="3" fill="${bg}" stroke="${border}" stroke-width="1"/>
<text x="${x+5}" y="${y+13}" font-family="monospace" font-size="10" fill="${numColor}" font-weight="${slot.taken?600:400}">${idStr}</text>
<text x="${x+5}" y="${y+CELL_H-5}" font-family="monospace" font-size="10" fill="${naraColor}">${fmt(slot.nara)}</text>
${slot.taken ? `<text x="${x+CELL_W-12}" y="${y+CELL_H-5}" font-family="monospace" font-size="9" fill="${border}">&#9635;</text>` : ''}`
  }).join('\n')

  const tierLegend = [[50,'#71717a'],[100,'#3b82f6'],[250,'#8b5cf6'],[500,'#f59e0b'],[1000,'#ef4444']] as [number,string][]

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#0a0a0a"/>
  <line x1="0" y1="${HEADER_H}" x2="${W}" y2="${HEADER_H}" stroke="#27272a" stroke-width="1"/>
  <text x="${PADDING}" y="38" font-family="monospace" font-size="26" font-weight="700" fill="#ffffff">NARA DEGEN BOARD</text>
  <text x="${PADDING}" y="58" font-family="monospace" font-size="12" fill="#71717a">100 founding degens · one tile each · lock supply, earn NARA + ETH</text>
  <rect x="${W-130}" y="18" width="118" height="24" rx="4" fill="#0a0a0a" stroke="#27272a" stroke-width="1"/>
  <circle cx="${W-116}" cy="30" r="4" fill="#22c55e"/>
  <text x="${W-108}" y="34" font-family="monospace" font-size="11" fill="#a1a1aa">EPOCH 776+</text>
  ${cells}
  <rect x="${PX}" y="${PY}" width="${PANEL_W}" height="80" rx="4" fill="#0a0a0a" stroke="#27272a" stroke-width="1"/>
  <text x="${PX+10}" y="${PY+18}" font-family="monospace" font-size="10" fill="#52525b">OG TILES</text>
  <text x="${PX+10}" y="${PY+48}" font-family="monospace" font-size="28" font-weight="700" fill="#ffffff">${TAKEN_COUNT}</text>
  <text x="${PX+36}" y="${PY+48}" font-family="monospace" font-size="14" fill="#52525b">/ 100</text>
  <text x="${PX+10}" y="${PY+68}" font-family="monospace" font-size="10" fill="#71717a">CLAIMED</text>
  <rect x="${PX}" y="${PY+88}" width="${PANEL_W}" height="80" rx="4" fill="#0f0b02" stroke="#f59e0b" stroke-width="1"/>
  <text x="${PX+10}" y="${PY+106}" font-family="monospace" font-size="10" fill="#92400e">SLOTS OPEN</text>
  <text x="${PX+10}" y="${PY+136}" font-family="monospace" font-size="28" font-weight="700" fill="#f59e0b">${OPEN_COUNT}</text>
  <text x="${PX+10}" y="${PY+156}" font-family="monospace" font-size="10" fill="#92400e">REMAINING</text>
  <rect x="${PX}" y="${PY+176}" width="${PANEL_W}" height="76" rx="4" fill="#0a0a0a" stroke="#27272a" stroke-width="1"/>
  <text x="${PX+10}" y="${PY+194}" font-family="monospace" font-size="10" fill="#52525b">EARN</text>
  <text x="${PX+10}" y="${PY+216}" font-family="monospace" font-size="12" fill="#f59e0b">+</text>
  <text x="${PX+22}" y="${PY+216}" font-family="monospace" font-size="12" fill="#a1a1aa">NARA drip</text>
  <text x="${PX+10}" y="${PY+234}" font-family="monospace" font-size="12" fill="#3b82f6">+</text>
  <text x="${PX+22}" y="${PY+234}" font-family="monospace" font-size="12" fill="#a1a1aa">ETH fees</text>
  <text x="${PX+10}" y="${PY+246}" font-family="monospace" font-size="9" fill="#52525b">every 15min epoch</text>
  <rect x="${PX}" y="${PY+260}" width="${PANEL_W}" height="100" rx="4" fill="#0a0a0a" stroke="#27272a" stroke-width="1"/>
  <text x="${PX+10}" y="${PY+278}" font-family="monospace" font-size="10" fill="#52525b">TIERS</text>
  ${tierLegend.map(([n,c],i) => `<rect x="${PX+10}" y="${PY+286+i*16}" width="8" height="8" rx="1" fill="${c}"/><text x="${PX+24}" y="${PY+294+i*16}" font-family="monospace" font-size="10" fill="#71717a">${fmt(n)} NARA</text>`).join('\n  ')}
  <line x1="0" y1="${H-FOOTER_H}" x2="${W}" y2="${H-FOOTER_H}" stroke="#1c1c1e" stroke-width="1"/>
  <text x="${PADDING}" y="${H-12}" font-family="monospace" font-size="11" fill="#52525b">${TAKEN_COUNT} / 100 OG tiles claimed · 700k sealed reserve · epoch every 15min</text>
  <text x="${W-184}" y="${H-12}" font-family="monospace" font-size="11" fill="#71717a">naraprotocol.io/mine</text>
</svg>`

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=300',
    },
  })
}
