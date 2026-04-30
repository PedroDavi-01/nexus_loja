'use client'

import Link from 'next/link';
import { useCart } from '@/src/context/CartContext';

export default function Header() {
  const { cart, toggleCart } = useCart();

  return (
    <header className="bg-[#0B0B0B] text-white border-b-4 border-[#E21E26] sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="text-4xl font-black italic text-white uppercase tracking-tighter hover:opacity-90 transition">
          NEXUS
        </Link>
        
        {/* BARRA DE BUSCA */}
        <div className="flex-1 mx-12 hidden md:flex bg-gray-200 rounded overflow-hidden">
          <input 
            type="text" 
            placeholder="O que você está buscando hoje?" 
            className="w-full p-3 text-black outline-none border-none text-sm"
          />
          <button className="bg-[#E21E26] px-6 hover:bg-[#b0181e] transition flex items-center justify-center">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>

        {/* AÇÕES DO USUÁRIO */}
        <div className="flex items-center gap-6">
          <Link href="/login" className="hidden lg:flex items-center gap-3 cursor-pointer hover:text-gray-300 transition">
            <i className="fa-regular fa-circle-user text-2xl text-[#E21E26]"></i>
            <div className="flex flex-col">
              <span className="text-[10px] leading-tight uppercase text-gray-400">Entre ou</span>
              <span className="text-xs font-bold leading-tight">Cadastre-se</span>
            </div>
          </Link>

          {/* ÍCONE DO CARRINHO */}
          <button 
            onClick={toggleCart} 
            className="relative cursor-pointer hover:text-[#E21E26] transition p-2 bg-transparent border-none"
          >
            <i className="fa-solid fa-cart-shopping text-2xl"></i>
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-[#E21E26] text-white text-[10px] px-1.5 py-0.5 rounded-full border-2 border-[#0B0B0B] font-bold">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>
      
      {/* NAVEGAÇÃO SECUNDÁRIA (DEPARTAMENTOS) */}
      <nav className="bg-[#1F1F1F] py-3 shadow-inner">
        <ul className="container mx-auto px-4 flex gap-8 text-[13px] font-bold uppercase overflow-x-auto no-scrollbar whitespace-nowrap items-center">
          
          <li className="text-white cursor-pointer hover:text-[#E21E26] flex items-center gap-2 border-r border-gray-700 pr-4">
            <i className="fa-solid fa-bars text-[#E21E26]"></i> Departamentos
          </li>

          {/* Links apontando para a pasta dinâmica /categoria/[slug] */}
          <li className="text-gray-400 hover:text-white transition">
            <Link href="/categoria/hardware">Hardware</Link>
          </li>
          
          <li className="text-gray-400 hover:text-white transition">
            <Link href="/categoria/pc-gamer">PC Gamer</Link>
          </li>
          
          <li className="text-gray-400 hover:text-white transition">
            <Link href="/categoria/perifericos">Periféricos</Link>
          </li>
          
          <li className="text-gray-400 hover:text-white transition">
            <Link href="/categoria/monitores">Monitores</Link>
          </li>
          
          <li className="ml-auto">
            <Link href="/ofertas" className="text-[#E21E26] hover:brightness-125 transition font-black flex items-center gap-2">
              <i className="fa-solid fa-fire-flame-curved"></i> Ofertas do Dia
            </Link>
          </li>
          
        </ul>
      </nav>
    </header>
  );
}