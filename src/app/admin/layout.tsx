'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, History, ArrowLeft, Menu, X } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) 

  const menuItems = [
    { name: 'Geral', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Produtos', path: '/admin/produtos', icon: <Package size={20} /> },
    { name: 'Movimentações', path: '/admin/movimentacoes', icon: <History size={20} /> },
  ]

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      
      {/* BOTÃO HAMBÚRGUER MOBILE */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-[60] bg-[#E21E26] p-2 rounded-sm shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* OVERLAY (ESCURECE O FUNDO NO MOBILE) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-[80] w-64 border-r border-[#222] bg-[#0b0b0b] flex flex-col
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        <div className="p-6 border-b border-[#222] flex items-center justify-between">
          <h2 className="text-[#E21E26] font-black italic text-xl uppercase tracking-tighter">Nexus Admin</h2>
          {/* BOTÃO FECHAR NO MOBILE */}
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              onClick={() => setIsSidebarOpen(false)} 
              className={`flex items-center gap-3 px-4 py-3 rounded-sm font-bold text-xs uppercase transition-all ${
                pathname === item.path 
                ? 'bg-[#E21E26] text-white shadow-[0_0_15px_rgba(226,30,38,0.3)]' 
                : 'text-gray-500 hover:text-white hover:bg-[#151515]'
              }`}
            >
              {item.icon} {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[#222]">
          <Link href="/" className="flex items-center gap-2 text-[10px] uppercase font-black text-gray-600 hover:text-white transition">
            <ArrowLeft size={14} /> Voltar para a Loja
          </Link>
        </div>
      </aside>

      {/* CONTEÚDO DA PÁGINA */}
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${isSidebarOpen ? 'blur-sm lg:blur-none' : ''}`}>
        {/* Padding superior no mobile para o conteúdo não ficar embaixo do botão de hambúrguer */}
        <div className="p-4 lg:p-0 pt-16 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  )
}