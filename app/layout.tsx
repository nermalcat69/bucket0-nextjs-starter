import "./global.css"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"

export const metadata: Metadata = {
  title: 'Next.js x Bucket0 Starter',
  description: 'File storage starter with Bucket0 S3-compatible API.',
}

const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(' ')

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cx(GeistSans.variable, GeistMono.variable)}>
      <body className="antialiased min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {children}
      </body>
    </html>
  )
}
