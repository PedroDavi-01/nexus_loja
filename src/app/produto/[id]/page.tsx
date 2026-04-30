'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/src/lib/supabase';
import { useCart } from '@/src/context/CartContext';

export default function ProdutoDetalhes() {
  const params = useParams();
  const id = params?.id;
  const [produto, setProduto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  // Estados para o Frete
  const [cep, setCep] = useState('');
  const [freteResult, setFreteResult] = useState<any>(null);
  const [loadingFrete, setLoadingFrete] = useState(false);

  useEffect(() => {
    async function fetchProduto() {
      if (!id) return;
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('id', id)
        .single();

      if (!error) setProduto(data);
      setLoading(false);
    }
    fetchProduto();
  }, [id]);

  const calcularFrete = async () => {
    if (cep.length !== 8) {
      alert("Digite um CEP válido (8 números)");
      return;
    }

    setLoadingFrete(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        alert("CEP não encontrado!");
        setLoadingFrete(false);
        return;
      }

      const uf = data.uf;
      let valor = 0;
      let prazo = 0;

      // Lógica de preços saindo de RECIFE
      if (uf === 'PE') {
        valor = 15.90;
        prazo = 2;
      } else if (['AL', 'PB', 'RN', 'CE', 'BA', 'SE', 'MA', 'PI'].includes(uf)) {
        valor = 29.90;
        prazo = 5;
      } else {
        valor = 54.90;
        prazo = 10;
      }

      setFreteResult({ valor, prazo, cidade: data.localidade, uf: data.uf });
    } catch (error) {
      console.error("Erro ao calcular frete", error);
    } finally {
      setLoadingFrete(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-white p-20 text-center font-bold">Carregando...</div>;
  if (!produto) return <div className="min-h-screen bg-white p-20 text-center font-bold">Produto não encontrado.</div>;

  return (
    <main className="min-h-screen bg-[#f2f3f4] pb-12">
      {/* BREADCRUMBS */}
      <div className="container mx-auto px-4 py-4 text-xs text-gray-500">
        <Link href="/" className="hover:text-[#E21E26]">Home</Link> 
        <span className="mx-2">&gt;</span> 
        <span className="uppercase">{produto.categoria || 'Hardware'}</span>
        <span className="mx-2">&gt;</span> 
        <strong className="text-gray-800">Código: {String(produto.id).padStart(6, '0')}</strong>
      </div>

      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-10 flex flex-col lg:flex-row gap-10">
          
          {/* IMAGEM */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-full max-w-[500px] aspect-square flex items-center justify-center border border-gray-50 rounded-lg p-4">
              <img 
                src={produto.imagem_url} 
                alt={produto.nome} 
                className="max-w-full max-h-full object-contain transition-transform hover:scale-105 text-black"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <div className="w-20 h-20 border-2 border-[#E21E26] rounded-md p-1 cursor-pointer">
                <img src={produto.imagem_url} className="w-full h-full object-contain" alt="thumb" />
              </div>
            </div>
          </div>

          {/* INFO E COMPRA */}
          <div className="flex-1 flex flex-col">
            <div className="mb-6">
              <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                {produto.categoria || 'Nexus Exclusive'}
              </span>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#1f2937] mt-3 leading-tight">
                {produto.nome}
              </h1>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <div className="flex flex-col text-black">
                <span className="text-gray-400 line-through text-sm">
                  R$ {(produto.preco * 1.2).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-black text-[#E21E26]">
                    R$ {produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="bg-[#e7f9ee] text-[#00a846] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    -20% OFF
                  </span>
                </div>
                <p className="text-[#00a846] font-bold text-sm mt-1">
                  À vista no PIX ou em 10x de R$ {(produto.preco / 10).toFixed(2)}
                </p>
              </div>
            </div>

            <button 
              onClick={() => addToCart(produto)}
              className="w-full bg-[#E21E26] hover:bg-[#c41920] text-white py-5 rounded-xl font-bold text-xl transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-3 uppercase mb-8"
            >
              <i className="fa-solid fa-cart-shopping"></i> Comprar Agora
            </button>

            {/* SEÇÃO DE FRETE */}
            <div className="mt-4 border-t border-gray-100 pt-6">
              <div className="flex items-center gap-3 text-gray-600 text-sm">
                <i className="fa-solid fa-truck text-[#E21E26]"></i>
                <span className="font-bold uppercase text-xs">Consultar frete (Saída: Recife)</span>
              </div>
              <div className="flex mt-3 gap-2">
                <input 
                  type="text" 
                  maxLength={8}
                  placeholder="00000000" 
                  value={cep}
                  onChange={(e) => setCep(e.target.value.replace(/\D/g, ""))}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-[#E21E26] w-36 text-black"
                />
                <button 
                  onClick={calcularFrete}
                  disabled={loadingFrete}
                  className="bg-gray-800 text-white px-6 py-2 rounded-lg text-xs font-bold uppercase hover:bg-black transition-all disabled:opacity-50"
                >
                  {loadingFrete ? '...' : 'Calcular'}
                </button>
              </div>

              {freteResult && (
                <div className="mt-4 p-4 bg-gray-50 border border-gray-100 rounded-xl flex justify-between items-center text-black">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Transportadora Nexus</p>
                    <p className="text-sm font-medium">{freteResult.cidade} - {freteResult.uf}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#00a846] font-bold text-lg">R$ {freteResult.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <p className="text-[10px] text-gray-500 italic">Até {freteResult.prazo} dias úteis</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ESPECIFICAÇÕES */}
        <div className="mt-10 bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-6 uppercase border-l-4 border-[#E21E26] pl-4">
            Especificações Técnicas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-black">
            <div className="flex justify-between border-b border-gray-50 py-2 text-sm">
              <span className="text-gray-500 italic">Marca</span>
              <span className="font-bold">Nexus Gaming</span>
            </div>
            <div className="flex justify-between border-b border-gray-50 py-2 text-sm">
              <span className="text-gray-500 italic">Modelo</span>
              <span className="font-bold uppercase">{produto.nome.split(' ')[0]}</span>
            </div>
            <div className="flex justify-between border-b border-gray-50 py-2 text-sm">
              <span className="text-gray-500 italic">Garantia</span>
              <span className="font-bold">12 Meses</span>
            </div>
            <div className="flex justify-between border-b border-gray-50 py-2 text-sm">
              <span className="text-gray-500 italic">Categoria</span>
              <span className="font-bold uppercase">{produto.categoria}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}