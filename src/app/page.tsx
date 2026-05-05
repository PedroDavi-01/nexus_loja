'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/src/lib/supabase';
import ProductCard from '@/src/components/ProductCard';
import ProductModal from '@/src/components/ProductModal';
import { Plus } from 'lucide-react';

// Imports do Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Estilos do Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function HomePage() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: prodData } = await supabase
          .from('produtos')
          .select('*')
          .order('created_at', { ascending: false });
        setProdutos(prodData || []);

        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: perfis } = await supabase
            .from('perfis')
            .select('role')
            .eq('id', session.user.id);
          
          if (perfis && perfis.length > 0 && perfis[0].role === 'admin') {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error("Erro no carregamento:", error);
      } finally {
        setLoadingAuth(false);
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
      
      {/* --- CARROSSEL DE BANNERS --- */}
      <section className="my-6 rounded-xl overflow-hidden h-[350px] md:h-[450px] shadow-2xl">
        <Swiper
          spaceBetween={0}
          centeredSlides={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="h-full w-full"
        >
          {/* Slide 1 - Estilo Original */}
                    <SwiperSlide>
            <div className="relative h-full w-full bg-[#111] flex items-center">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?q=80&w=2070)] bg-cover bg-center opacity-40"></div>
              <div className="p-8 md:p-16 text-white z-10 w-full text-center">
                <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter">
                  Aproveite as promoções da Nexus
                </h2>
                <p className="text-xl text-gray-200 mb-8">
                  Produtos com até 30% OFF.
                </p>
                <Link href="categoria/perifericos">
                <button className="bg-white text-black px-12 py-4 font-black rounded uppercase hover:bg-[#E21E26] hover:text-white transition-all">
                Aproveite agora
                </button>
                </Link>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 2 - Promoção de Periféricos */}
          <SwiperSlide>
            <div className="relative h-full w-full bg-[#111] flex items-center">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070')] bg-cover bg-center opacity-40"></div>
              <div className="p-8 md:p-16 text-white z-10 w-full text-center">
                <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter">
                  Linha Gamer Profissional
                </h2>
                <p className="text-xl text-gray-200 mb-8">
                  Teclados mecânicos, mouses e headsets com até 30% OFF.
                </p>
                <Link href="categoria/perifericos">
                <button className="bg-white text-black px-12 py-4 font-black rounded uppercase hover:bg-[#E21E26] hover:text-white transition-all">
                Ver Periféricos
                </button>
                </Link>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 3 - Hardware */}
          <SwiperSlide>
            <div className="relative h-full w-full bg-[#050505] flex items-center justify-end">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=2070')] bg-cover bg-center opacity-30"></div>
              <div className="p-8 md:p-16 text-white z-10 text-right">
                <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase italic">
                  Upgrade de Respeito
                </h2>
                <p className="text-lg text-gray-300 mb-6">
                  As melhores placas de vídeo e processadores do mercado.
                </p>
                <Link href="categoria/hardware">
                <button className="border-2 border-[#E21E26] text-white px-9 py-3.5 font-bold rounded uphover:bg-[#E21E26] transition-all">
                  Montar meu PC
                </button>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* --- CATEGORIAS --- */}
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
          Produtos em Estoque
        </h3>
        
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
            isAdmin={isAdmin} 
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
          window.location.reload();
        }} 
      />
    </main>
  );
}