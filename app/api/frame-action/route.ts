import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

/**
 * Handles Farcaster Frame button POST actions.
 *
 * When a user interacts with a Frame button (action type "post"), Farcaster
 * sends a signed message payload here. Both buttons on the NARA Degen Board
 * are "link" type, so this endpoint exists as a fallback and for any future
 * interactive frames (e.g. showing a user's slot after they connect wallet).
 *
 * Farcaster frame message body shape:
 * {
 *   untrustedData: {
 *     fid: number,
 *     url: string,
 *     messageHash: string,
 *     timestamp: number,
 *     network: number,
 *     buttonIndex: number,  // 1 or 2
 *     castId: { fid: number, hash: string }
 *   },
 *   trustedData: { messageBytes: string }
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { untrustedData } = body ?? {}
    const buttonIndex: number = untrustedData?.buttonIndex ?? 1

    // Both current buttons link out — redirect accordingly
    const destination =
      buttonIndex === 2
        ? 'https://naraprotocol.io/mine' // Buy NARA
        : 'https://naraprotocol.io/mine' // View Founding Grid

    return NextResponse.redirect(destination, { status: 302 })
  } catch {
    // Malformed payload — still redirect to a safe destination
    return NextResponse.redirect('https://naraprotocol.io/mine', { status: 302 })
  }
}

// GET is not used by Farcaster but handy for health checks during deployment
export async function GET() {
  return NextResponse.json({ ok: true, frame: 'nara-degen-board' })
}
