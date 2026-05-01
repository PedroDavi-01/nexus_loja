import '@/src/styles/globals.css'
import Header from '@/src/components/Header'
import Footer from '@/src/components/Footer'
import { CartProvider } from '@/src/context/CartContext'
import CartSidebar from '@/src/components/CartSidebar'
import { Metadata } from 'next'

// Titulo e Favicon
export const metadata: Metadata = {
  title: 'Nexus Gaming',
  description: 'Os melhores equipamentos gamer estão aqui na Nexus.',
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <head>
        
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
          
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </head>
      <body className="flex flex-col min-h-screen bg-[#F2F3F4]">
        <CartProvider>
          <Header />
          <CartSidebar />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}