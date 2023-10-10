import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast';
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Todoapp-codingtest',
  description: 'Your daily companion',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster/>
        {children}
      </body>
    </html>
  )
}
