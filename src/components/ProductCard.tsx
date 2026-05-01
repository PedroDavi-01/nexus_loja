'use client'

import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';

export default function ProductCard({ produto, isAdmin, onDelete, onEdit }: any) {
  const precoRiscado = produto.preco_antigo || (produto.preco * 1.2);

  return (
    <div className="group relative bg-white p-5 rounded-lg border border-gray-100 flex flex-col justify-between min-h-[400px] shadow-sm hover:shadow-md transition">
      
      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-2 z-20">
          <button 
            onClick={() => onEdit(produto)}
            className="bg-blue-600 text-white p-2 rounded-md cursor-pointer hover:bg-blue-700 shadow-lg transition-transform hover:scale-110"
          >
            <Pencil size={16} />
          </button>
          <button 
            onClick={() => onDelete(produto.id)}
            className="bg-red-600 text-white p-2 rounded-md cursor-pointer hover:bg-red-700 shadow-lg transition-transform hover:scale-110"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      <Link href={`/produto/${produto.id}`} className="flex flex-col h-full cursor-pointer">
        {produto.desconto && (
          <div className="bg-[#E21E26] text-white text-xs font-bold px-2 py-1 rounded w-fit mb-2">
            -{produto.desconto}%
          </div>
        )}

        <div className="h-[180px] w-full flex items-center justify-center my-4 overflow-hidden">
          <img src={produto.imagem_url} alt={produto.nome} className="max-w-full max-h-full object-contain transition-transform group-hover:scale-110 duration-300" />
        </div>

        <div className="flex flex-col flex-grow">
          <span className="text-[#E21E26] text-[10px] font-bold uppercase tracking-wider">
            {produto.marca || 'Nexus'}
          </span>
          <h2 className="text-sm font-semibold text-[#333] h-[40px] line-clamp-2 mt-1 mb-2">
            {produto.nome}
          </h2>
          <div className="mt-auto">
            <p className="text-xs text-gray-400 line-through">
              R$ {precoRiscado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-2xl font-extrabold text-[#E21E26]">
              R$ {produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-[#7f858d]">à vista no PIX</p>
          </div>
        </div>
      </Link>
    </div>
  );
}