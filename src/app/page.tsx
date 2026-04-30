'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/src/lib/supabase';

interface Produto {
  id: string;
  nome: string;
  preco: number;
  imagem_url: string;
  categoria?: string;
  desconto?: number;
}

export default function HomePage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    async function fetchProdutos() {
      const { data, error } = await supabase.from('produtos').select('*');
      if (error) {
        console.error('Erro ao carregar produtos:', error);
      } else {
        setProdutos(data || []);
      }
    }
    fetchProdutos();
  }, []);

  return (
    <main className="container mx-auto px-4">
      {/* --- BANNER (SEU VISUAL ORIGINAL) --- */}
      <section className="my-6 rounded-xl overflow-hidden h-[320px] bg-gradient-to-br from-[#4b0003] to-[#0b0b0b] flex items-center shadow-lg">
        <div className="p-8 md:p-16 text-white">
          <h2 className="text-4xl md:text-5xl font-black leading-tight mb-4 italic uppercase">
            Festival de Cupons Nexus
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            Os melhores setups com preços imbatíveis e entrega rápida.
          </p>
          <button className="bg-[#E21E26] text-white px-9 py-3.5 font-bold rounded uppercase transition hover:scale-105 hover:bg-[#f0242b]">
            Aproveitar Agora
          </button>
        </div>
      </section>

      {/* --- CATEGORIAS (SEU VISUAL ORIGINAL) --- */}
     <section className="flex justify-between py-8 gap-4 overflow-x-auto no-scrollbar">
  {[
    { name: 'Hardware', icon: 'fa-microchip' },
    { name: 'Periféricos', icon: 'fa-mouse' },
    { name: 'Áudio', icon: 'fa-headset' },
    { name: 'Notebooks', icon: 'fa-laptop' },
    { name: 'Cadeiras', icon: 'fa-chair' }
  ].map((cat) => (
    <Link 
      key={cat.name} 
      href={`/categoria/${cat.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-')}`}
      className="group text-center cursor-pointer flex-1 min-w-[100px] no-underline"
    >
      <div className="w-[85px] h-[85px] bg-white rounded-full mx-auto mb-3 flex items-center justify-center text-3xl text-[#E21E26] shadow-md transition-all duration-400 group-hover:bg-[#E21E26] group-hover:text-white group-hover:-translate-y-1">
        <i className={`fa-solid ${cat.icon}`}></i>
      </div>
      <span className="text-sm font-bold text-[#1F1F1F] group-hover:text-[#E21E26] transition-colors">
        {cat.name}
      </span>
    </Link>
  ))}
</section>
      <h3 className="my-10 border-l-[6px] border-[#E21E26] pl-4 text-2xl font-extrabold uppercase">
        Ofertas em Destaque
      </h3>

      {/* --- GRID DE PRODUTOS (SEU VISUAL ORIGINAL - SEM O BOTÃO) --- */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {produtos.map((produto) => (
          <Link 
            href={`/produto/${produto.id}`} 
            key={produto.id} 
            className="bg-white p-5 rounded-lg border border-gray-100 flex flex-col justify-between min-h-[400px] shadow-sm hover:shadow-md transition cursor-pointer"
          >
            {produto.desconto && (
              <div className="bg-[#E21E26] text-white text-xs font-bold px-2 py-1 rounded w-fit mb-2">
                -{produto.desconto}%
              </div>
            )}

            <div className="h-[180px] w-full flex items-center justify-center my-4 overflow-hidden">
              <img 
                src={produto.imagem_url} 
                alt={produto.nome} 
                className="max-w-full max-h-full object-contain transition-transform hover:scale-110 duration-300"
              />
            </div>

            <div className="flex flex-col flex-grow">
              <span className="text-[#E21E26] text-[10px] font-bold uppercase tracking-wider">
                {produto.categoria || 'Nexus'}
              </span>
              <h2 className="text-sm font-semibold text-[#333] h-[40px] line-clamp-2 mt-1 mb-2">
                {produto.nome}
              </h2>
              <div className="mt-auto">
                <p className="text-xs text-gray-400 line-through">
                  R$ {(produto.preco * 1.2).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-2xl font-extrabold text-[#E21E26]">
                  R$ {produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-[#7f858d]">à vista no PIX</p>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}