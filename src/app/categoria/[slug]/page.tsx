'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/src/lib/supabase';

export default function PaginaCategoria() {
  const params = useParams();
  const slug = params?.slug as string;
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProdutos() {
      setLoading(true);
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .ilike('categoria', slug); 

      if (!error) setProdutos(data || []);
      setLoading(false);
    }
    if (slug) fetchProdutos();
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-[#f2f3f4] p-20 text-center font-bold text-black uppercase italic">Buscando {slug}...</div>;

  return (
    <main className="min-h-screen bg-[#f2f3f4] pb-20">
      {/* TÍTULO DA CATEGORIA */}
      <div className="bg-white border-b border-gray-200 py-8 mb-8 shadow-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic border-l-4 border-[#E21E26] pl-4">
            Departamento: {slug.replace('-', ' ')}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {produtos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {produtos.map((item) => (
              <Link 
                key={item.id} 
                href={`/produto/${item.id}`}
                className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-2xl transition-all group flex flex-col justify-between h-full"
              >
                <div>
                  {/* BADGE DE DESCONTO  */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-[#E21E26] text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
                      -25% OFF
                    </span>
                    <i className="fa-regular fa-heart text-gray-300 hover:text-[#E21E26] cursor-pointer transition-colors"></i>
                  </div>

                  {/* IMAGEM COM EFEITO DE ZOOM */}
                  <div className="h-48 flex items-center justify-center mb-6 overflow-hidden">
                    <img 
                      src={item.imagem_url || '/placeholder.png'} 
                      alt={item.nome} 
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* CATEGORIA EM VERMELHO */}
                  <span className="text-[#E21E26] text-[10px] font-bold uppercase tracking-wider mb-1 block">
                    {item.categoria}
                  </span>

                  {/* TÍTULO EM PRETO - IGUAL À HOME */}
                  <h3 className="text-gray-900 font-bold text-sm line-clamp-2 mb-4 leading-tight">
                    {item.nome}
                  </h3>
                </div>

                <div className="flex flex-col gap-1 mt-auto">
                  {/* PREÇO ANTIGO RISCADO */}
                  <span className="text-gray-400 line-through text-[11px] mb-1">
                    R$ {(item.preco * 1.25).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>

                  {/* PREÇO ATUAL EM VERMELHO*/}
                  <span className="text-3xl font-black text-[#E21E26]">
                    R$ {item.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>

                  {/* DESCRIÇÃO DO PIX */}
                  <p className="text-gray-500 text-[10px] mb-4">
                    à vista no PIX
                  </p>

                  {/* BOTÃO  */}
                  <button className="w-full bg-[#1A1A1A] text-white py-3 rounded-lg text-xs font-bold uppercase group-hover:bg-[#E21E26] transition-colors flex items-center justify-center gap-2">
                    <i className="fa-solid fa-cart-plus"></i> Ver Detalhes
                  </button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-20 text-center border-2 border-dashed border-gray-200">
            <h2 className="text-2xl font-bold text-gray-300 uppercase">Nenhum produto em "{slug}"</h2>
            <Link href="/" className="text-[#E21E26] font-bold mt-4 inline-block hover:underline">Voltar ao Início</Link>
          </div>
        )}
      </div>
    </main>
  );
}