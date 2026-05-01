'use client'
import { useState } from 'react'
import { useCart } from '@/src/context/CartContext'
import { supabase } from '@/src/lib/supabase'

export default function CartSidebar() {
  const { cart, isOpen, toggleCart, removeFromCart, clearCart } = useCart()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [finalizando, setFinalizando] = useState(false)

  const total = cart.reduce((acc, item) => acc + item.preco, 0)

  const handleFinalizarCompra = async () => {
    setFinalizando(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        alert("Você precisa estar logado para finalizar a compra.")
        return
      }

      // Criar o Pedido na tabela 'pedidos'
      const { data: pedido, error: errorPedido } = await supabase
        .from('pedidos')
        .insert([{ 
          usuario_id: session.user.id, 
          valor_total: total,
          status: 'Finalizado' 
        }])
        .select()
        .single()

      if (errorPedido) throw errorPedido

      // Criar os itens na tabela 'itens_pedido'
      const itensParaInserir = cart.map(item => ({
        pedido_id: pedido.id,
        produto_id: item.id,
        quantidade: 1, 
        preco_unitario: item.preco
      }))

      const { error: errorItens } = await supabase
        .from('itens_pedido')
        .insert(itensParaInserir)

      if (errorItens) throw errorItens

      alert("Nexus System: Compra registrada com sucesso!")
      clearCart() // Limpa o estado do carrinho
      setIsModalOpen(false)
      toggleCart()
    } catch (error: any) {
      alert("Erro ao processar compra: " + error.message)
    } finally {
      setFinalizando(false)
    }
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm transition-opacity" onClick={toggleCart} />
      )}

      <aside className={`fixed top-0 right-0 h-full w-[380px] bg-white z-[101] shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="bg-[#0B0B0B] text-white p-6 flex justify-between items-center border-b-4 border-[#E21E26]">
            <h3 className="font-black italic uppercase tracking-tighter">Meu Carrinho</h3>
            <button onClick={toggleCart} className="text-2xl hover:text-[#E21E26]">&times;</button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 text-black">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center mt-10 italic">Seu carrinho está vazio.</p>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="flex items-center gap-4 border-b pb-4">
                  <img src={item.imagem_url} alt={item.nome} className="w-16 h-16 object-contain" />
                  <div className="flex-1 text-black">
                    <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{item.nome}</h4>
                    <p className="text-[#E21E26] font-black text-lg">R$ {item.preco.toLocaleString('pt-BR')}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-600">&times;</button>
                </div>
              ))
            )}
          </div>

          <div className="p-6 bg-gray-50 border-t">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-gray-600">Total:</span>
              <span className="text-2xl font-black text-[#E21E26]">R$ {total.toLocaleString('pt-BR')}</span>
            </div>
            <button 
              disabled={cart.length === 0}
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-[#E21E26] text-white py-4 font-black rounded hover:bg-[#b0181e] transition uppercase tracking-widest disabled:opacity-50"
            >
              Finalizar Compra
            </button>
          </div>
        </div>
      </aside>

      {/* MODAL DE CHECKOUT ILUSTRATIVO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-[110] flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-[#0B0B0B] border-2 border-[#E21E26] w-full max-w-md p-8 text-white relative">
            <h2 className="text-2xl font-black uppercase italic mb-6 border-b border-[#E21E26] pb-2">Nexus Checkout</h2>
            
            <div className="space-y-4 mb-8 max-h-40 overflow-y-auto pr-2">
              {cart.map((item, i) => (
                <div key={i} className="flex justify-between text-[10px] uppercase font-bold italic text-zinc-400">
                  <span>{item.nome}</span>
                  <span>R$ {item.preco.toLocaleString('pt-BR')}</span>
                </div>
              ))}
              <div className="border-t border-white/10 pt-4 flex justify-between font-black text-[#E21E26] uppercase italic text-xl">
                <span>Total:</span>
                <span>R$ {total.toLocaleString('pt-BR')}</span>
              </div>
            </div>

            <div className="grid gap-3">
              <button 
                onClick={handleFinalizarCompra}
                disabled={finalizando}
                className="bg-white text-black py-4 font-black uppercase italic hover:bg-[#E21E26] hover:text-white transition"
              >
                {finalizando ? "PROCESSANDO..." : "CONFIRMAR PAGAMENTO"}
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-[10px] text-zinc-500 uppercase font-bold hover:text-white transition"
              >
                Voltar ao Carrinho
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}