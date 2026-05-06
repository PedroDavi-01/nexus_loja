'use client'

import { useState, useEffect } from 'react'
import { X, ImageUp, AlignLeft, Box, AlertTriangle } from 'lucide-react' 
import { supabase } from '@/src/lib/supabase'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  produtoParaEditar?: any
}

export default function ProductModal({ isOpen, onClose, onSuccess, produtoParaEditar }: ProductModalProps) {
  const [nome, setNome] = useState('')
  const [preco, setPreco] = useState('')
  const [precoAntigo, setPrecoAntigo] = useState('')
  const [marca, setMarca] = useState('')
  const [categoria, setCategoria] = useState('')
  const [desconto, setDesconto] = useState('')
  const [loading, setLoading] = useState(false)
  
  const [estoque, setEstoque] = useState('')
  const [stockMinimo, setStockMinimo] = useState('')
  
  const [descricao, setDescricao] = useState('')
  const [imagens, setImagens] = useState<string[]>(['', '', '', ''])

  useEffect(() => {
    if (produtoParaEditar) {
      setNome(produtoParaEditar.nome)
      setPreco(produtoParaEditar.preco.toString())
      setPrecoAntigo(produtoParaEditar.preco_antigo?.toString() || '')
      setMarca(produtoParaEditar.marca || '')
      setCategoria(produtoParaEditar.categoria || '')
      setDesconto(produtoParaEditar.desconto?.toString() || '')
      setDescricao(produtoParaEditar.descricao || '')
      setEstoque(produtoParaEditar.estoque?.toString() || '0')
      setStockMinimo(produtoParaEditar.stock_minimo?.toString() || '0')
      
      const fotos = [
        produtoParaEditar.imagem_url || '',
        ...(produtoParaEditar.imagens_secundarias || [])
      ]
      setImagens([...fotos, '', '', '', ''].slice(0, 4))
    } else {
      setNome(''); setPreco(''); setPrecoAntigo(''); setMarca(''); setCategoria(''); setDesconto('');
      setDescricao(''); setImagens(['', '', '', '']); setEstoque(''); setStockMinimo('');
    }
  }, [produtoParaEditar, isOpen])

  if (!isOpen) return null

  const normalizarCategoria = (texto: string) => {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').trim();
  }

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const novasImagens = [...imagens]
        novasImagens[index] = reader.result as string
        setImagens(novasImagens)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const [fotoPrincipal, ...fotosSecundarias] = imagens
    const secundariasFiltradas = fotosSecundarias.filter(url => url !== '')

    const dadosProduto = {
      nome,
      preco: parseFloat(preco),
      preco_antigo: precoAntigo ? parseFloat(precoAntigo) : null,
      marca: marca || 'Nexus Gaming',
      categoria: normalizarCategoria(categoria),
      imagem_url: fotoPrincipal,
      imagens_secundarias: secundariasFiltradas,
      desconto: desconto ? parseInt(desconto) : null,
      descricao,
      estoque: parseInt(estoque) || 0,
      stock_minimo: parseInt(stockMinimo) || 0
    }

    let error;
    if (produtoParaEditar) {
      const { error: err } = await supabase.from('produtos').update(dadosProduto).eq('id', produtoParaEditar.id)
      error = err
    } else {
      const { error: err } = await supabase.from('produtos').insert([dadosProduto])
      error = err
    }

    if (error) alert("Erro ao salvar na Nexus: " + error.message)
    else { onSuccess(); onClose(); }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        <div className="bg-[#E21E26] p-6 flex justify-between items-center shadow-md">
          <div className="flex flex-col">
            <h2 className="text-white font-black italic uppercase tracking-tighter text-2xl">
              {produtoParaEditar ? 'Editar Equipamento' : 'Novo Produto Nexus'}
            </h2>
            <span className="text-red-200 text-[10px] font-bold uppercase tracking-widest">Painel de Administração</span>
          </div>
          <button onClick={onClose} className="bg-white/10 p-2 rounded-full text-white hover:bg-white hover:text-[#E21E26] transition-all hover:rotate-90">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto no-scrollbar flex flex-col gap-6">
          
          <div className="flex flex-col gap-3">
             <label className="text-[11px] font-black uppercase text-gray-500 flex items-center gap-2">
               <ImageUp size={14} /> Galeria do Produto (4 Slots)
             </label>
             <div className="grid grid-cols-4 gap-3">
               {imagens.map((url, index) => (
                 <div key={index} className="relative group aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center cursor-pointer hover:border-[#E21E26] hover:bg-red-50 transition-all overflow-hidden bg-gray-50">
                   {url ? <img src={url} alt="Preview" className="w-full h-full object-contain p-2" /> : <ImageUp size={20} className="text-gray-300 group-hover:text-[#E21E26]" />}
                   <input type="file" accept="image/*" onChange={(e) => handleFileChange(index, e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                 </div>
               ))}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="text-[11px] font-black uppercase text-gray-500">Nome do Produto</label>
              <input type="text" value={nome} onChange={e => setNome(e.target.value)} required placeholder="Ex: Teclado Mecânico RGB"
                className="w-full p-4 bg-gray-100 rounded-xl text-black font-semibold outline-none border-2 border-transparent focus:border-[#E21E26] transition-all" />
            </div>

            <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100 flex flex-col gap-4 md:col-span-2">
                <span className="text-[10px] font-black uppercase text-[#E21E26] flex items-center gap-2 tracking-widest">
                    <Box size={14} /> Controle de Inventário
                </span>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Estoque Atual</label>
                        <input type="number" value={estoque} onChange={e => setEstoque(e.target.value)} required placeholder="Qtd"
                            className="w-full p-3 bg-white border border-gray-200 rounded-lg text-black font-bold outline-none focus:border-[#E21E26]" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1 text-right">Alerta Mínimo</label>
                        <input type="number" value={stockMinimo} onChange={e => setStockMinimo(e.target.value)} required placeholder="Mín"
                            className="w-full p-3 bg-white border border-gray-200 rounded-lg text-black font-bold outline-none focus:border-[#E21E26] text-right" />
                    </div>
                </div>
            </div>

            <div>
              <label className="text-[11px] font-black uppercase text-gray-500">Preço Atual (R$)</label>
              <input type="number" step="0.01" value={preco} onChange={e => setPreco(e.target.value)} required placeholder="0,00"
                className="w-full p-4 bg-gray-100 rounded-xl text-black font-semibold outline-none border-2 border-transparent focus:border-[#E21E26] transition-all" />
            </div>

            {/* CAMPO ADICIONADO: PREÇO ANTIGO */}
            <div>
              <label className="text-[11px] font-black uppercase text-gray-500">Preço Riscado (R$)</label>
              <input type="number" step="0.01" value={precoAntigo} onChange={e => setPrecoAntigo(e.target.value)} placeholder="Ex: 599.90"
                className="w-full p-4 bg-gray-100 rounded-xl text-black font-semibold outline-none border-2 border-transparent focus:border-[#E21E26] transition-all" />
            </div>

            <div>
              <label className="text-[11px] font-black uppercase text-gray-500">Marca</label>
              <input type="text" value={marca} onChange={e => setMarca(e.target.value)} placeholder="Ex: Nexus"
                className="w-full p-4 bg-gray-100 rounded-xl text-black font-semibold outline-none border-2 border-transparent focus:border-[#E21E26] transition-all" />
            </div>

            <div>
              <label className="text-[11px] font-black uppercase text-gray-500">Categoria</label>
              <input type="text" value={categoria} onChange={e => setCategoria(e.target.value)} placeholder="hardware, perifericos..."
                className="w-full p-4 bg-gray-100 rounded-xl text-black font-semibold outline-none border-2 border-transparent focus:border-[#E21E26] transition-all" />
            </div>
            
            {/* DESCONTO MOVIDO PARA BAIXO PARA MANTER O GRID ALINHADO */}
            <div className="md:col-span-2">
              <label className="text-[11px] font-black uppercase text-gray-500">Desconto (%)</label>
              <input type="number" value={desconto} onChange={e => setDesconto(e.target.value)} placeholder="Ex: 20"
                className="w-full p-4 bg-gray-100 rounded-xl text-black font-semibold outline-none border-2 border-transparent focus:border-[#E21E26] transition-all" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-black uppercase text-gray-500 flex items-center gap-2">
              <AlignLeft size={14} /> Sobre o Produto
            </label>
            <textarea 
              value={descricao} 
              onChange={e => setDescricao(e.target.value)} 
              rows={3}
              className="w-full p-4 bg-gray-100 rounded-xl text-black outline-none border-2 border-transparent focus:border-[#E21E26] transition-all resize-none text-sm font-medium"
              placeholder="Descreva as especificações técnicas..."
            />
          </div>

          <button 
            disabled={loading} 
            className="mt-4 bg-black text-white py-5 rounded-2xl font-black uppercase italic text-lg hover:bg-[#E21E26] transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl active:scale-95"
          >
            {loading ? <span className="animate-pulse">Processando...</span> : (produtoParaEditar ? 'Salvar Alterações' : 'Cadastrar na Loja')}
          </button>
        </form>
      </div>
    </div>
  )
}