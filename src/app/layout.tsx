import '@/src/styles/globals.css'
import Header from '@/src/components/Header'
import Footer from '@/src/components/Footer'
import { CartProvider } from '@/src/context/CartContext'
import CartSidebar from '@/src/components/CartSidebar'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <head>
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