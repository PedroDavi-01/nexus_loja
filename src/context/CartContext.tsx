'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

interface CartItem {
  id: string
  nome: string
  preco: number
  imagem_url: string
}

interface CartContextType {
  cart: CartItem[]
  isOpen: boolean
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  toggleCart: () => void
  clearCart: () => void 
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item])
    setIsOpen(true) 
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const toggleCart = () => setIsOpen(!isOpen)

  // Função  para limpar o carrinho após a compra
  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider value={{ 
      cart, 
      isOpen, 
      addToCart, 
      removeFromCart, 
      toggleCart,
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart deve ser usado dentro de um CartProvider')
  return context
}