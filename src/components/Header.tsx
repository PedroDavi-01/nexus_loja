'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/src/lib/supabase';
import { useCart } from '@/src/context/CartContext';
import { LogOut, Search } from 'lucide-react'; 

export default function Header() {
  const { cart, toggleCart } = useCart();
  const [user, setUser] = useState<any>(null);
  const [nome, setNome] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); 
  const router = useRouter();

  // Função para disparar a busca
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      // Redireciona para a página de busca com o parâmetro query
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Monitora o estado da autenticação
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setNome(session.user.user_metadata?.nome_completo?.split(' ')[0] || 'Usuário');
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        setNome(session.user.user_metadata?.nome_completo?.split(' ')[0] || 'Usuário');
      } else {
        setUser(null);
        setNome('');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="bg-[#0B0B0B] text-white border-b-4 border-[#E21E26] sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="text-4xl font-black italic text-white uppercase tracking-tighter hover:opacity-90 transition">
          NEXUS
        </Link>
        
        {/* BARRA DE BUSCA CORRIGIDA */}
        <form 
          onSubmit={handleSearch}
          className="flex-1 mx-12 hidden md:flex bg-gray-200 rounded overflow-hidden border-2 border-transparent focus-within:border-[#E21E26] transition-all"
        >
          <input 
            type="text" 
            placeholder="O que você está buscando hoje?" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 text-black outline-none border-none text-sm font-medium"
          />
          <button 
            type="submit"
            className="bg-[#E21E26] px-6 hover:bg-[#b0181e] transition flex items-center justify-center text-white"
          >
            <Search size={18} strokeWidth={3} />
          </button>
        </form>

        {/* AÇÕES DO USUÁRIO */}
        <div className="flex items-center gap-6">
          
          {user ? (
            <div className="hidden lg:flex items-center gap-4 border-r border-gray-800 pr-6">
              <div className="flex flex-col items-end">
                <span className="text-[10px] leading-tight uppercase text-gray-400 font-black">Olá,</span>
                <span className="text-sm font-black italic uppercase leading-tight text-[#E21E26]">
                   <Link href="/canto">{nome}</Link>
                  </span>
              </div>
              <button 
                onClick={handleLogout}
                className="hover:text-[#E21E26] transition-colors flex items-center gap-1 group"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-3 cursor-pointer">
              <i className="fa-regular fa-circle-user text-2xl text-[#E21E26]"></i>
              <div className="flex items-center gap-1">
                <Link href="/login">
                <span className="text-xs font-bold leading-tight hover:text-gray-300 transition">Entre</span>
                </Link>
                <span className='text-[10px] leading-tight uppercase text-gray-400 font-black'>ou</span>
                <Link href="/cadastro">
                 <span className="text-xs font-bold leading-tight hover:text-gray-300 transition">Cadastre-se</span>
                </Link>
              </div>
            </div>
          )}

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
      
      {/* NAVEGAÇÃO SECUNDÁRIA */}
      <nav className="bg-[#1F1F1F] py-3 shadow-inner">
        <ul className="container mx-auto px-4 flex gap-8 text-[13px] font-bold uppercase overflow-x-auto no-scrollbar whitespace-nowrap items-center">
          
          <li className="text-white cursor-pointer hover:text-[#E21E26] flex items-center gap-2 border-r border-gray-700 pr-4">
            <i className="fa-solid fa-bars text-[#E21E26]"></i> Departamentos
          </li>

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
        </ul>
      </nav>
    </header>
  );
}