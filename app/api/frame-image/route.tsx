import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

// Slot tier data — fixed layout for the 10x10 founding grid
const SLOT_NARA = [
  // Row 1
  50, 100, 250, 500, 1000, 50, 500, 100, 500, 250,
  // Row 2
  500, 250, 100, 250, 250, 100, 50, 50, 250, 100,
  // Row 3
  500, 100, 1000, 50, 1000, 50, 250, 500, 500, 50,
  // Rows 4–10: deterministic fill from tier cycle
  ...Array.from({ length: 70 }, (_, j) => {
    const tiers = [50, 100, 250, 500, 1000]
    return tiers[(j + 3) % 5]
  }),
]

interface Slot {
  id: number
  nara: number
  taken: boolean
}

const SLOTS: Slot[] = SLOT_NARA.map((nara, i) => ({
  id: i + 1,
  nara,
  taken: i === 2, // slot #3 (index 2) is taken
}))

// Tier colors — border/accent color when a slot is taken
function tierColor(nara: number): string {
  switch (nara) {
    case 50:
      return '#71717a'
    case 100:
      return '#3b82f6'
    case 250:
      return '#8b5cf6'
    case 500:
      return '#f59e0b'
    case 1000:
      return '#ef4444'
    default:
      return '#3f3f46'
  }
}

function formatNara(n: number): string {
  return n >= 1000 ? `${n / 1000}k` : `${n}`
}

const TAKEN_COUNT = SLOTS.filter((s) => s.taken).length
const OPEN_COUNT = 100 - TAKEN_COUNT

export async function GET(req: NextRequest) {
  // Cell dimensions — 10 columns, 10 rows in 1200x630
  // Reserve top ~100px for header, bottom ~40px for footer
  // Side panel ~140px on right
  // Grid area: (1200 - 140 - 32) x (630 - 100 - 40 - 32) = 1028 x 458
  // Cell: floor((1028 - 9*4) / 10) = floor(992/10) = 99 wide
  //       floor((458 - 9*4) / 10) = floor(422/10) = 42 tall

  const GRID_X = 16
  const GRID_Y = 100
  const PANEL_W = 148
  const CELL_W = 95
  const CELL_H = 42
  const GAP = 4

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#0a0a0a',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: '"Inter", monospace',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            padding: '20px 16px 12px 16px',
            borderBottom: '1px solid #27272a',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: 26,
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.01em',
              }}
            >
              NARA DEGEN BOARD
            </span>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: 13,
                color: '#71717a',
                letterSpacing: '0.02em',
              }}
            >
              100 founding degens · one tile each · lock supply, earn NARA + ETH
            </span>
          </div>

          {/* Live badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              border: '1px solid #27272a',
              borderRadius: 4,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#22c55e',
              }}
            />
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: 11,
                color: '#a1a1aa',
                letterSpacing: '0.08em',
              }}
            >
              EPOCH 776+
            </span>
          </div>
        </div>

        {/* Body: grid + side panel */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            padding: '12px 16px',
            gap: 16,
          }}
        >
          {/* 10x10 Grid */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: `${GAP}px`,
              flex: 1,
            }}
          >
            {Array.from({ length: 10 }, (_, row) => (
              <div
                key={row}
                style={{
                  display: 'flex',
                  gap: `${GAP}px`,
                  flex: 1,
                }}
              >
                {SLOTS.slice(row * 10, row * 10 + 10).map((slot) => {
                  const color = slot.taken ? tierColor(slot.nara) : '#3f3f46'
                  const bgColor = slot.taken ? '#0f0f0f' : '#18181b'
                  const numColor = slot.taken ? tierColor(slot.nara) : '#52525b'
                  const naraColor = slot.taken ? '#a1a1aa' : '#3f3f46'

                  return (
                    <div
                      key={slot.id}
                      style={{
                        flex: 1,
                        border: `1px solid ${color}`,
                        background: bgColor,
                        borderRadius: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '3px 5px',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Slot number */}
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: 10,
                          color: numColor,
                          fontWeight: slot.taken ? 600 : 400,
                          lineHeight: 1,
                        }}
                      >
                        {String(slot.id).padStart(2, '0')}
                      </span>

                      {/* NARA amount + lock indicator */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontSize: 10,
                            color: naraColor,
                            lineHeight: 1,
                          }}
                        >
                          {formatNara(slot.nara)}
                        </span>
                        {slot.taken && (
                          <span
                            style={{
                              fontSize: 9,
                              color: tierColor(slot.nara),
                              lineHeight: 1,
                            }}
                          >
                            ▣
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Side panel */}
          <div
            style={{
              width: PANEL_W,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {/* Stat block: claimed */}
            <div
              style={{
                border: '1px solid #27272a',
                borderRadius: 4,
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 10,
                  color: '#52525b',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                OG TILES
              </span>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#ffffff',
                  lineHeight: 1,
                }}
              >
                {TAKEN_COUNT}
                <span style={{ fontSize: 13, color: '#52525b', fontWeight: 400 }}>
                  {' '}/ 100
                </span>
              </span>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 10,
                  color: '#71717a',
                }}
              >
                CLAIMED
              </span>
            </div>

            {/* Stat block: open */}
            <div
              style={{
                border: '1px solid #f59e0b',
                borderRadius: 4,
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                background: '#0f0b02',
              }}
            >
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 10,
                  color: '#92400e',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                SLOTS OPEN
              </span>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#f59e0b',
                  lineHeight: 1,
                }}
              >
                {OPEN_COUNT}
              </span>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 10,
                  color: '#92400e',
                }}
              >
                REMAINING
              </span>
            </div>

            {/* Stat block: reward info */}
            <div
              style={{
                border: '1px solid #27272a',
                borderRadius: 4,
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 10,
                  color: '#52525b',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                EARN
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    color: '#a1a1aa',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <span style={{ color: '#f59e0b' }}>+</span> NARA drip
                </span>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    color: '#a1a1aa',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <span style={{ color: '#3b82f6' }}>+</span> ETH fees
                </span>
              </div>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 9,
                  color: '#52525b',
                  lineHeight: 1.4,
                }}
              >
                every 15min epoch
              </span>
            </div>

            {/* Tier legend */}
            <div
              style={{
                border: '1px solid #27272a',
                borderRadius: 4,
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
              }}
            >
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 10,
                  color: '#52525b',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: 2,
                }}
              >
                TIERS
              </span>
              {([
                [50, '#71717a'],
                [100, '#3b82f6'],
                [250, '#8b5cf6'],
                [500, '#f59e0b'],
                [1000, '#ef4444'],
              ] as [number, string][]).map(([n, c]) => (
                <div
                  key={n}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 1,
                      background: c,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 10,
                      color: '#71717a',
                    }}
                  >
                    {formatNara(n)} NARA
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 16px',
            borderTop: '1px solid #1c1c1e',
          }}
        >
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: 11,
              color: '#52525b',
              letterSpacing: '0.02em',
            }}
          >
            {TAKEN_COUNT} / 100 OG tiles claimed · 700k sealed reserve · epoch every 15min
          </span>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: 11,
              color: '#71717a',
              letterSpacing: '0.02em',
            }}
          >
            naraprotocol.io/mine
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
