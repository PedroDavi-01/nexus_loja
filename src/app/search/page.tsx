'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/src/lib/supabase'
import ProductCard from '@/src/components/ProductCard' 
import { SearchX, Loader2 } from 'lucide-react'

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const [produtos, setProdutos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function buscarProdutos() {
      setLoading(true)
      
      if (!query) {
        setProdutos([])
        setLoading(false)
        return
      }

      // Faz a busca no banco 
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .or(`nome.ilike.%${query}%,marca.ilike.%${query}%,categoria.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setProdutos(data)
      }
      setLoading(false)
    }

    buscarProdutos()
  }, [query])

  return (
    <main className="min-h-screen bg-[#f2f3f4] pb-20">
      {/* CABEÇALHO DA BUSCA */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-black uppercase italic text-black">
            Resultados para: <span className="text-[#E21E26]">{query}</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-bold uppercase tracking-tighter">
            {produtos.length} {produtos.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#E21E26] mb-4" size={40} />
            <p className="text-gray-600 font-bold uppercase italic">Vasculhando o estoque Nexus...</p>
          </div>
        ) : produtos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {produtos.map((produto) => (
              <ProductCard key={produto.id} produto={produto} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <SearchX size={40} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-black text-black uppercase italic">Ops! Nada encontrado</h2>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              Não encontramos nenhum produto com "<span className="font-bold">{query}</span>". 
              Tente usar termos mais genéricos ou verifique a ortografia.
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="mt-8 bg-black text-white px-8 py-3 rounded-xl font-bold uppercase italic hover:bg-[#E21E26] transition-all"
            >
              Voltar para a Home
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-black italic">CARREGANDO BUSCA...</div>}>
      <SearchContent />
    </Suspense>
  )
}