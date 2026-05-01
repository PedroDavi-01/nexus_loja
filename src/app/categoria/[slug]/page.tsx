'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/src/lib/supabase';
import ProductCard from '@/src/components/ProductCard';

export default function CategoryPage() {
  const { slug } = useParams();
  const [produtos, setProdutos] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function fetchCategoryData() {
      if (!slug) return;

      // Converte "pc-gamer" para "pc gamer" para buscar das duas formas
      const slugComEspaco = String(slug).replace(/-/g, ' ');

      const { data } = await supabase
        .from('produtos')
        .select('*')
        // Busca ignorando maiúsculas e aceitando com traço ou com espaço
        .or(`categoria.ilike.%${slug}%,categoria.ilike.%${slugComEspaco}%`)
        .order('created_at', { ascending: false });

      setProdutos(data || []);

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: perfil } = await supabase.from('perfis').select('role').eq('id', session.user.id).single();
        if (perfil?.role === 'admin') setIsAdmin(true);
      }
    }
    fetchCategoryData();
  }, [slug]);

  const handleDelete = async (id: string) => {
    if (confirm("Excluir produto?")) {
      await supabase.from('produtos').delete().eq('id', id);
      setProdutos(produtos.filter(p => p.id !== id));
    }
  };

  return (
    <main className="container mx-auto px-4 pb-20">
      <h3 className="my-10 border-l-[6px] border-[#E21E26] pl-4 text-2xl font-extrabold uppercase italic">
        Categoria: <span className="text-[#E21E26]">{slug}</span>
      </h3>

      {produtos.length > 0 ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {produtos.map((produto) => (
            <ProductCard 
              key={produto.id} 
              produto={produto} 
              isAdmin={isAdmin} 
              onDelete={handleDelete} 
              onEdit={() => {}} 
            />
          ))}
        </section>
      ) : (
        <div className="bg-white p-20 rounded-2xl text-center border-2 border-dashed border-gray-200">
           <p className="text-gray-400 font-bold uppercase">Nenhum produto encontrado nesta categoria.</p>
        </div>
      )}
    </main>
  );
}