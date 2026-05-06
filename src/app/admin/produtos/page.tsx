'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/src/lib/supabase'
import { 
  Plus, Search, Edit3, Trash2, 
  AlertCircle, Box, ImageIcon 
} from 'lucide-react'
// Certifique-se de que o caminho do import está correto conforme sua estrutura
import ProductModal from '@/src/components/ProductModal' 

export default function PaginaProdutos() {
  const [produtos, setProdutos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null)

  const carregarProdutos = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .order('nome')

    if (data) setProdutos(data)
    setLoading(false)
  }

  useEffect(() => { carregarProdutos() }, [])

  const handleEdit = (p: any) => {
    setProdutoSelecionado(p)
    setIsModalOpen(true)
  }

  const handleAddNew = () => {
    setProdutoSelecionado(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Deseja excluir este produto permanentemente?")) {
      const { error } = await supabase.from('produtos').delete().eq('id', id)
      if (error) alert("Erro: " + error.message)
      else carregarProdutos()
    }
  }

  const filtrados = produtos.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-8 bg-[#050505] min-h-screen text-white">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black italic border-l-4 border-[#E21E26] pl-4 uppercase tracking-tighter">
            Nexus Inventory
          </h1>
          <p className="text-gray-500 text-[10px] mt-2 ml-4 uppercase font-bold tracking-widest">Gestão de Equipamentos</p>
        </div>

        <button 
          onClick={handleAddNew}
          className="bg-[#E21E26] hover:bg-white hover:text-[#E21E26] text-white px-6 py-3 rounded-sm font-black flex items-center gap-2 transition-all italic uppercase text-xs shadow-[0_0_20px_rgba(226,30,38,0.3)]"
        >
          <Plus size={18} /> Novo Produto
        </button>
      </div>

      {/* FILTRO */}
      <div className="relative mb-10 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
        <input 
          type="text" 
          placeholder="BUSCAR NO ESTOQUE..." 
          className="w-full bg-[#0b0b0b] border border-[#222] p-4 pl-12 text-[10px] font-black outline-none focus:border-[#E21E26] transition-all uppercase tracking-widest"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* GRID DE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center animate-pulse font-black text-gray-700 uppercase italic">Acessando Banco de Dados...</div>
        ) : filtrados.map((p) => (
          <div key={p.id} className="bg-[#0b0b0b] border border-[#222] rounded-sm overflow-hidden group hover:border-[#E21E26]/50 transition-all flex flex-col">
            
            {/* ÁREA DA IMAGEM DO PRODUTO */}
            <div className="aspect-square bg-white relative flex items-center justify-center overflow-hidden">
              {p.imagem_url ? (
                <img 
                  src={p.imagem_url} 
                  alt={p.nome} 
                  className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-300">
                  <ImageIcon size={40} strokeWidth={1} />
                  <span className="text-[8px] font-bold uppercase">Sem Imagem</span>
                </div>
              )}
              
              {/* Overlay de Ações */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button onClick={() => handleEdit(p)} className="bg-white text-black p-3 hover:bg-[#E21E26] hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300">
                  <Edit3 size={18} />
                </button>
                <button onClick={() => handleDelete(p.id)} className="bg-white text-black p-3 hover:bg-[#E21E26] hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75">
                  <Trash2 size={18} />
                </button>
              </div>

              {Number(p.estoque) <= Number(p.stock_minimo) && (
                <div className="absolute top-0 left-0 bg-[#E21E26] text-white text-[8px] font-black px-3 py-1 uppercase italic z-10">
                  Low Stock
                </div>
              )}
            </div>

            {/* INFO DO PRODUTO */}
            <div className="p-5 flex flex-col flex-grow">
              <span className="text-[8px] font-black text-[#E21E26] uppercase mb-1">{p.marca || 'Nexus'}</span>
              <h3 className="font-black uppercase italic text-sm mb-4 line-clamp-1">{p.nome}</h3>
              
              <div className="mt-auto">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-xl font-black font-mono">
                    R$ {Number(p.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  {p.desconto && (
                    <span className="text-[9px] bg-green-500/10 text-green-500 px-2 py-0.5 font-black rounded-full">
                      -{p.desconto}%
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-[#1a1a1a] pt-4">
                  <div className="flex flex-col">
                    <span className="text-[7px] text-gray-600 font-black uppercase">Disponível</span>
                    <span className={`text-xs font-black flex items-center gap-1 ${Number(p.estoque) <= Number(p.stock_minimo) ? 'text-[#E21E26]' : 'text-white'}`}>
                      <Box size={10} /> {p.estoque}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[7px] text-gray-600 font-black uppercase">Mínimo</span>
                    <span className="text-xs font-black text-gray-500 italic">{p.stock_minimo}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SEU PRODUCT MODAL INTEGRADO */}
      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          carregarProdutos();
          setIsModalOpen(false);
        }}
        produtoParaEditar={produtoSelecionado}
      />
    </div>
  )
}