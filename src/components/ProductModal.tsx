'use client'

import { useState, useEffect } from 'react'
import { X, ImageUp, Check } from 'lucide-react'
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
  const [categoria, setCategoria] = useState('')
  const [imagemUrl, setImagemUrl] = useState('')
  const [desconto, setDesconto] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (produtoParaEditar) {
      setNome(produtoParaEditar.nome)
      setPreco(produtoParaEditar.preco.toString())
      setCategoria(produtoParaEditar.categoria || '')
      setImagemUrl(produtoParaEditar.imagem_url)
      setDesconto(produtoParaEditar.desconto?.toString() || '')
    } else {
      setNome(''); setPreco(''); setCategoria(''); setImagemUrl(''); setDesconto('')
    }
  }, [produtoParaEditar, isOpen])

  if (!isOpen) return null

  const handleFileClick = () => {
    document.getElementById('fileInput')?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagemUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const dadosProduto = {
      nome,
      preco: parseFloat(preco),
      categoria: categoria.toLowerCase().trim(),
      imagem_url: imagemUrl,
      desconto: desconto ? parseInt(desconto) : null,
    }

    let error;
    if (produtoParaEditar) {
      const { error: err } = await supabase
        .from('produtos')
        .update(dadosProduto)
        .eq('id', produtoParaEditar.id)
      error = err
    } else {
      const { error: err } = await supabase
        .from('produtos')
        .insert([dadosProduto])
      error = err
    }

    if (error) {
      alert("Erro ao salvar na Nexus: " + error.message)
    } else {
      onSuccess()
      onClose()
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* HEADER ESTILO NEXUS */}
        <div className="bg-[#E21E26] p-6 flex justify-between items-center shadow-md">
          <div className="flex flex-col">
            <h2 className="text-white font-black italic uppercase tracking-tighter text-2xl">
              {produtoParaEditar ? 'Editar Equipamento' : 'Novo Produto Nexus'}
            </h2>
            <span className="text-red-200 text-[10px] font-bold uppercase tracking-widest">Painel de Administração</span>
          </div>
          <button 
            onClick={onClose} 
            className="bg-white/10 p-2 rounded-full text-white hover:bg-white hover:text-[#E21E26] transition-all hover:rotate-90"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto no-scrollbar flex flex-col gap-6">
          
          {/* UPLOAD DE IMAGEM BONITO */}
          <div className="flex flex-col gap-3">
            <label className="text-[11px] font-black uppercase text-gray-500 flex items-center gap-2">
              <ImageUp size={14} /> Visual do Produto
            </label>
            <div 
              onClick={handleFileClick}
              className="group relative w-full h-44 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#E21E26] hover:bg-red-50 transition-all overflow-hidden"
            >
              {imagemUrl ? (
                <>
                  <img src={imagemUrl} alt="Preview" className="w-full h-full object-contain p-4" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <div className="bg-white text-black px-4 py-2 rounded-full font-bold text-xs uppercase italic flex items-center gap-2">
                      <ImageUp size={16} /> Trocar Foto
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-red-100 transition-colors">
                    <ImageUp size={28} className="text-gray-400 group-hover:text-[#E21E26]" />
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter group-hover:text-[#E21E26]">Clique para abrir a galeria</p>
                </div>
              )}
            </div>
            <input id="fileInput" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            
            <input 
              type="text" 
              placeholder="Ou cole a URL da imagem aqui..."
              value={imagemUrl}
              onChange={e => setImagemUrl(e.target.value)}
              className="text-[11px] p-3 bg-gray-50 rounded-lg text-gray-500 italic border border-transparent focus:border-gray-200 outline-none transition-all"
            />
          </div>

          {/* DADOS TÉCNICOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="text-[11px] font-black uppercase text-gray-500">Nome do Produto</label>
              <input type="text" value={nome} onChange={e => setNome(e.target.value)} required placeholder="Ex: Teclado Mecânico RGB"
                className="w-full p-4 bg-gray-100 rounded-xl text-black font-semibold outline-none border-2 border-transparent focus:border-[#E21E26] transition-all" />
            </div>

            <div>
              <label className="text-[11px] font-black uppercase text-gray-500">Preço (R$)</label>
              <input type="number" step="0.01" value={preco} onChange={e => setPreco(e.target.value)} required placeholder="0,00"
                className="w-full p-4 bg-gray-100 rounded-xl text-black font-semibold outline-none border-2 border-transparent focus:border-[#E21E26] transition-all" />
            </div>

            <div>
              <label className="text-[11px] font-black uppercase text-gray-500">Desconto (%)</label>
              <input type="number" value={desconto} onChange={e => setDesconto(e.target.value)} placeholder="Opcional"
                className="w-full p-4 bg-gray-100 rounded-xl text-black font-semibold outline-none border-2 border-transparent focus:border-[#E21E26] transition-all" />
            </div>

            <div className="md:col-span-2">
              <label className="text-[11px] font-black uppercase text-gray-500">Categoria</label>
              <input type="text" value={categoria} onChange={e => setCategoria(e.target.value)} placeholder="hardware, perifericos, audio..."
                className="w-full p-4 bg-gray-100 rounded-xl text-black font-semibold outline-none border-2 border-transparent focus:border-[#E21E26] transition-all" />
            </div>
          </div>

          {/* BOTÃO SALVAR */}
          <button 
            disabled={loading} 
            className="mt-4 bg-black text-white py-5 rounded-2xl font-black uppercase italic text-lg hover:bg-[#E21E26] transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl active:scale-95"
          >
            {loading ? (
              <span className="animate-pulse">Processando...</span>
            ) : (
              <>
                {produtoParaEditar ? 'Salvar Alterações' : 'Cadastrar na Loja'}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}