'use client'
import { useCart } from '@/src/context/CartContext'

export default function CartSidebar() {
  const { cart, isOpen, toggleCart, removeFromCart } = useCart()

  const total = cart.reduce((acc, item) => acc + item.preco, 0)

  return (
    <>
      {/* Overlay Escuro */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm transition-opacity"
          onClick={toggleCart}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 right-0 h-full w-[380px] bg-white z-[101] shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          
          {/* Header do Carrinho */}
          <div className="bg-[#0B0B0B] text-white p-6 flex justify-between items-center border-b-4 border-[#E21E26]">
            <h3 className="font-black italic uppercase tracking-tighter">Meu Carrinho</h3>
            <button onClick={toggleCart} className="text-2xl hover:text-[#E21E26]">&times;</button>
          </div>

          {/* Itens */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center mt-10 italic">Seu carrinho está vazio.</p>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="flex items-center gap-4 border-b pb-4">
                  <img src={item.imagem_url} alt={item.nome} className="w-16 h-16 object-contain" />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{item.nome}</h4>
                    <p className="text-[#E21E26] font-black text-lg">R$ {item.preco.toLocaleString('pt-BR')}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-600">&times;</button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 border-t">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-gray-600">Total:</span>
              <span className="text-2xl font-black text-[#E21E26]">R$ {total.toLocaleString('pt-BR')}</span>
            </div>
            <button className="w-full bg-[#E21E26] text-white py-4 font-black rounded hover:bg-[#b0181e] transition uppercase tracking-widest">
              Finalizar Compra
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}