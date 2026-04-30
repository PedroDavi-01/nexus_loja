'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/src/lib/supabase';
import ProductCard from '@/src/components/ProductCard';
import ProductModal from '@/src/components/ProductModal';
import { Plus } from 'lucide-react';

export default function HomePage() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true); // Para evitar o erro de sumir botões
  
  // Estados para o Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Busca os produtos
        const { data: prodData } = await supabase
          .from('produtos')
          .select('*')
          .order('created_at', { ascending: false });
        setProdutos(prodData || []);

        // 2. Verifica a sessão do usuário
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // 3. Busca o perfil (sem usar .single() para evitar o erro do JSON)
          const { data: perfis } = await supabase
            .from('perfis')
            .select('role')
            .eq('id', session.user.id);
          
          // Se encontrou o perfil e o role for admin
          if (perfis && perfis.length > 0 && perfis[0].role === 'admin') {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error("Erro no carregamento:", error);
      } finally {
        setLoadingAuth(false); // Terminou de checar tudo
      }
    }
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Deseja realmente apagar este produto da Nexus?")) {
      const { error } = await supabase.from('produtos').delete().eq('id', id);
      if (!error) {
        setProdutos(produtos.filter(p => p.id !== id));
      } else {
        alert("Erro ao excluir: " + error.message);
      }
    }
  };

  const handleOpenCreateModal = () => {
    setProdutoSelecionado(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (produto: any) => {
    setProdutoSelecionado(produto);
    setIsModalOpen(true);
  };

  return (
    <main className="container mx-auto px-4 pb-12">
      {/* --- BANNER ORIGINAL --- */}
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

      {/* --- CATEGORIAS ORIGINAIS --- */}
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

      {/* --- HEADER DE PRODUTOS + BOTÃO ADMIN --- */}
      <div className="flex items-center justify-between my-10">
        <h3 className="border-l-[6px] border-[#E21E26] pl-4 text-2xl font-extrabold uppercase">
          Ofertas em Destaque
        </h3>
        
        {/* Só renderiza o botão se o carregamento acabou E for admin */}
        {!loadingAuth && isAdmin && (
          <button 
            onClick={handleOpenCreateModal}
            className="bg-[#E21E26] text-white px-6 py-3 rounded-lg font-black uppercase italic flex items-center gap-2 hover:bg-[#b7191e] transition-all shadow-lg active:scale-95"
          >
            <Plus size={20} /> Novo Produto
          </button>
        )}
      </div>

      {/* --- GRID DE PRODUTOS --- */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {produtos.map((produto) => (
          <ProductCard 
            key={produto.id} 
            produto={produto} 
            isAdmin={isAdmin} // Aqui o card recebe se deve mostrar os ícones ou não
            onDelete={handleDelete} 
            onEdit={handleOpenEditModal} 
          />
        ))}
      </section>

      {/* --- MODAL DE CRIAÇÃO/EDIÇÃO --- */}
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        produtoParaEditar={produtoSelecionado}
        onSuccess={() => {
          // Em vez de reload, poderiamos atualizar o estado, mas reload é mais seguro por enquanto
          window.location.reload();
        }} 
      />
    </main>
  );
}