'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/src/lib/supabase';
import { useCart } from '@/src/context/CartContext';
import { LogOut, Search, LayoutDashboard, Menu, X } from 'lucide-react'; 

export default function Header() {
  const { cart, toggleCart } = useCart();
  const [user, setUser] = useState<any>(null);
  const [nome, setNome] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const ADMIN_EMAIL = "admin@nexus.com"; 

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

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setIsMenuOpen(false); // Fecha o menu mobile ao pesquisar
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) {
    return null; 
  }

  return (
    <header className="bg-[#0B0B0B] text-white border-b-4 border-[#E21E26] sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* BOTÃO HAMBÚRGUER (MOBILE) */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 text-white hover:text-[#E21E26] transition-colors"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* LOGO */}
        <Link href="/" className="text-4xl font-black italic text-white uppercase tracking-tighter hover:opacity-90 transition">
          NEXUS
        </Link>
        
        {/* BARRA DE BUSCA (DESKTOP) */}
        <form 
          onSubmit={handleSearch}
          className="flex-1 mx-12 hidden lg:flex bg-gray-200 rounded overflow-hidden border-2 border-transparent focus-within:border-[#E21E26] transition-all"
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
                className="hover:text-[#E21E26] transition-colors flex items-center gap-1"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-3 cursor-pointer">
              <i className="fa-regular fa-circle-user text-2xl text-[#E21E26]"></i>
              <div className="flex items-center content-center gap-1">
                <Link href="/login">
                  <span className="text-xs font-bold leading-tight uppercase hover:text-gray-300 transition">Entre</span>
                </Link>
                <span className='text-[10px] leading-tight uppercase text-gray-400 font-black'>ou</span>
                <Link href="/cadastro">
                  <span className="text-xs font-bold leading-tight uppercase hover:text-gray-300 transition">Cadastre-se</span>
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

      {/* MENU MOBILE (ABERTO) */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[#0B0B0B] border-t border-[#E21E26] animate-in slide-in-from-top duration-300">
          <div className="p-4">
            {/* BARRA DE BUSCA MOBILE */}
            <form onSubmit={handleSearch} className="flex bg-gray-200 rounded overflow-hidden mb-6 border-2 border-transparent focus-within:border-[#E21E26]">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="O que você busca?" 
                className="flex-1 p-3 text-black outline-none text-sm font-medium"
              />
              <button type="submit" className="bg-[#E21E26] px-4 flex items-center justify-center">
                <Search size={18} color="white" strokeWidth={3} />
              </button>
            </form>

            <nav className="flex flex-col gap-4 font-black uppercase italic tracking-tighter">
              <Link href="/categoria/hardware" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-white/5 text-gray-300">Hardware</Link>
              <Link href="/categoria/pc-gamer" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-white/5 text-gray-300">PC Gamer</Link>
              <Link href="/categoria/perifericos" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-white/5 text-gray-300">Periféricos</Link>
              <Link href="/categoria/monitores" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-white/5 text-gray-300">Monitores</Link>
              
              {/* DASHBOARD NO MOBILE */}
              {user?.email === ADMIN_EMAIL && (
                <Link 
                  href="/admin" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="py-3 px-4 bg-[#E21E26]/10 border border-[#E21E26] text-[#E21E26] flex items-center gap-2 rounded-sm"
                >
                  <LayoutDashboard size={18} />
                  Dashboard Admin
                </Link>
              )}

              {!user ? (
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="py-2 text-[#E21E26]">Entre / Cadastre-se</Link>
              ) : (
                <>
                  <Link href="/canto" onClick={() => setIsMenuOpen(false)} className="py-2 text-[#E21E26]">Minha Conta ({nome})</Link>
                  <button onClick={handleLogout} className="text-left py-2 text-gray-500 font-bold uppercase text-xs">Sair da Conta</button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
      
      {/* NAVEGAÇÃO SECUNDÁRIA (DESKTOP) */}
      <nav className="bg-[#1F1F1F] py-3 shadow-inner hidden lg:block">
        <ul className="container mx-auto px-4 flex gap-8 text-[13px] font-bold uppercase items-center">
          <li className="text-gray-400 hover:text-white transition"><Link href="/categoria/hardware">Hardware</Link></li>
          <li className="text-gray-400 hover:text-white transition"><Link href="/categoria/pc-gamer">PC Gamer</Link></li>
          <li className="text-gray-400 hover:text-white transition"><Link href="/categoria/perifericos">Periféricos</Link></li>
          <li className="text-gray-400 hover:text-white transition"><Link href="/categoria/monitores">Monitores</Link></li>

          {user?.email === ADMIN_EMAIL && (
            <li className="ml-auto">
              <Link 
                href="/admin" 
                className="flex items-center gap-2 bg-[#E21E26] text-white px-4 py-1.5 rounded-sm hover:bg-white hover:text-[#E21E26] transition-all duration-300 shadow-[0_0_10px_rgba(226,30,38,0.4)]"
              >
                <LayoutDashboard size={14} />
                Dashboard Admin
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}