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
      const { data } = await supabase.from('produtos').select('*').ilike('categoria', `%${slug}%`);
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
    <main className="container mx-auto px-4">
      <h3 className="my-10 border-l-[6px] border-[#E21E26] pl-4 text-2xl font-extrabold uppercase">
        Categoria: {slug}
      </h3>

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
    </main>
  );
}