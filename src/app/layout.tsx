import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'b3 Clothes',
  description: 'Crea outfits con tu closet personal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
        <nav className="bg-gray-100 dark:bg-gray-800 border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-center gap-8">
            <Link href="/" className="font-bold text-lg hover:text-blue-600">
              b3 Clothes
            </Link>
            <Link href="/closet" className="hover:text-blue-600">
              Closet
            </Link>
            <Link href="/outfits" className="hover:text-blue-600">
              Outfits
            </Link>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
