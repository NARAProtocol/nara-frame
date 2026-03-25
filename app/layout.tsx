import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NARA Degen Board',
  description: '100 founding degens. One tile each. Lock supply. Earn NARA + ETH every epoch.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ margin: 0, background: '#0a0a0a', color: '#fff' }}>
        {children}
      </body>
    </html>
  )
}
