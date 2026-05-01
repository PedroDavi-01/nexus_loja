'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ContaPage() {
  const [activeTab, setActiveTab] = useState('perfil');
  const [perfil, setPerfil] = useState<any>(null);
  const [nomeInput, setNomeInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(true);
  
  // ESTADOS DE DADOS
  const [meusPedidos, setMeusPedidos] = useState<any[]>([]); 
  const [usuarios, setUsuarios] = useState<any[]>([]);       
  const [usuarioInspecionado, setUsuarioInspecionado] = useState<any>(null);
  const [pedidosInspecionados, setPedidosInspecionados] = useState<any[]>([]);
  const [carregandoPedidos, setCarregandoPedidos] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    async function getInitialData() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      // Busca Perfil
      const { data: perfilData } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (perfilData) {
        setPerfil({ ...perfilData, email: session.user.email });
        setNomeInput(perfilData.nome_completo || '');
        setEmailInput(session.user.email || '');

        // Busca Pedidos do Usuário Logado
        const { data: pedidosData } = await supabase
          .from('pedidos')
          .select('*')
          .eq('usuario_id', session.user.id)
          .order('created_at', { ascending: false });
        
        setMeusPedidos(pedidosData || []);

        // Se for Admin, busca todos os usuários
        if (perfilData.role === 'admin') {
          const { data: todosUsuarios } = await supabase
            .from('perfis')
            .select('*')
            .neq('id', session.user.id);
          setUsuarios(todosUsuarios || []);
        }
      }
      setLoading(false);
    }
    getInitialData();
  }, [router]);

  // Função para Admin ver compras de um usuário específico
  const inspecionarUsuario = async (usuario: any) => {
    setUsuarioInspecionado(usuario);
    setCarregandoPedidos(true);
    
    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .eq('usuario_id', usuario.id)
      .order('created_at', { ascending: false });

    if (!error) {
      setPedidosInspecionados(data || []);
    }
    setCarregandoPedidos(false);
  };

  const handleSalvarAlteracoes = async () => {
    try {
      const { error: errorPerfil } = await supabase
        .from('perfis')
        .update({ nome_completo: nomeInput })
        .eq('id', perfil.id);

      if (errorPerfil) throw errorPerfil;

      if (emailInput !== perfil.email) {
        const { error: errorAuth } = await supabase.auth.updateUser({ email: emailInput });
        if (errorAuth) throw errorAuth;
        alert("Nexus: Verifique o NOVO e-mail para confirmar a alteração.");
      }

      alert("Perfil atualizado!");
    } catch (error: any) {
      alert("Erro: " + error.message);
    }
  };

  const handleResetPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(perfil.email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    if (error) alert("Erro: " + error.message);
    else alert("E-mail de redefinição enviado!");
  };

  if (loading) return <div className="p-20 text-center text-white font-black italic animate-pulse">CARREGANDO...</div>;

  const isAdmin = perfil?.role === 'admin';

  return (
    <main className="container mx-auto px-4 py-10 text-white min-h-screen">
      <h1 className="text-3xl font-black uppercase italic mb-8 border-l-8 border-red-600 pl-4 flex items-center gap-4">
        Minha Conta {isAdmin && <span className="bg-red-600 text-white text-[10px] px-2 py-1 not-italic">ADMIN</span>}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <nav className="flex flex-col gap-2">
          <button onClick={() => setActiveTab('perfil')} className={`p-4 text-left font-bold uppercase italic transition ${activeTab === 'perfil' ? 'bg-red-600' : 'bg-zinc-900 hover:bg-zinc-800'}`}>Perfil</button>
          <button onClick={() => setActiveTab('endereco')} className={`p-4 text-left font-bold uppercase italic transition ${activeTab === 'endereco' ? 'bg-red-600' : 'bg-zinc-900 hover:bg-zinc-800'}`}>Endereço</button>
          {isAdmin ? (
            <button onClick={() => { setActiveTab('usuarios'); setUsuarioInspecionado(null); }} className={`p-4 text-left font-bold uppercase italic transition ${activeTab === 'usuarios' ? 'bg-red-600' : 'bg-zinc-900 hover:bg-zinc-800'}`}>Usuários</button>
          ) : (
            <button onClick={() => setActiveTab('pedidos')} className={`p-4 text-left font-bold uppercase italic transition ${activeTab === 'pedidos' ? 'bg-red-600' : 'bg-zinc-900 hover:bg-zinc-800'}`}>Pedidos</button>
          )}
        </nav>

        <div className="md:col-span-3 bg-zinc-900 p-8 rounded border border-white/5">
          {activeTab === 'perfil' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold uppercase italic border-b border-white/10 pb-2">Informações Pessoais</h2>
              <div className="grid gap-6">
                <div>
                  <label className="text-xs text-gray-500 uppercase font-bold">Nome</label>
                  <input type="text" value={nomeInput} onChange={(e) => setNomeInput(e.target.value)} readOnly={isAdmin} className="w-full bg-black border border-white/10 p-3 rounded focus:border-red-600 outline-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase font-bold">E-mail</label>
                  <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} readOnly={isAdmin} className="w-full bg-black border border-white/10 p-3 rounded focus:border-red-600 outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Segurança</label>
                  {isAdmin ? <p className="text-[10px] text-red-500 font-bold uppercase italic">Bloqueado para Admin</p> : 
                  <button onClick={handleResetPassword} className="bg-white text-black px-4 py-2 text-[10px] font-black uppercase italic hover:bg-red-600 hover:text-white transition">Trocar Senha</button>}
                </div>
              </div>
              {!isAdmin && <button onClick={handleSalvarAlteracoes} className="bg-red-600 mt-4 px-8 py-3 font-black uppercase italic hover:bg-red-700 transition">Salvar Nexus</button>}
            </div>
          )}

          {activeTab === 'endereco' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold uppercase italic border-b border-white/10 pb-2">Endereço</h2>
              <div className="grid grid-cols-2 gap-4 text-black">
                <input placeholder="CEP" readOnly={isAdmin} className="bg-black text-white border border-white/10 p-3 rounded col-span-2 outline-none focus:border-red-600" />
                <input placeholder="Rua" readOnly={isAdmin} className="bg-black text-white border border-white/10 p-3 rounded col-span-2 outline-none focus:border-red-600" />
                <input placeholder="Bairro" readOnly={isAdmin} className="bg-black text-white border border-white/10 p-3 rounded outline-none focus:border-red-600" />
                <input placeholder="Número" readOnly={isAdmin} className="bg-black text-white border border-white/10 p-3 rounded outline-none focus:border-red-600" />
              </div>
              {!isAdmin && <button className="bg-red-600 mt-6 px-8 py-3 font-black uppercase italic hover:bg-red-700 transition">Atualizar</button>}
            </div>
          )}

          {activeTab === 'pedidos' && !isAdmin && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold uppercase italic border-b border-red-600 pb-2">Meus Pedidos</h2>
              {meusPedidos.length === 0 ? (
                <div className="text-center py-10 italic text-gray-500 border border-dashed border-white/10">Nenhum pedido encontrado.</div>
              ) : (
                <div className="grid gap-4">
                  {meusPedidos.map((p) => (
                    <div key={p.id} className="bg-black p-4 border border-white/5 flex justify-between items-center group hover:border-red-600 transition">
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">Pedido #{String(p.id).slice(0,8)}</p>
                        <p className="font-black italic uppercase text-lg text-red-600">R$ {p.valor_total?.toLocaleString('pt-BR')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(p.created_at).toLocaleDateString('pt-BR')}</p>
                        <span className="text-[10px] bg-zinc-800 px-2 py-1 font-black uppercase italic">{p.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'usuarios' && isAdmin && (
            <div className="space-y-6">
              {!usuarioInspecionado ? (
                <>
                  <h2 className="text-xl font-bold uppercase italic border-b border-red-600 pb-2">Nexus Database: Usuários</h2>
                  <div className="grid gap-2">
                    {usuarios.map(u => (
                      <div key={u.id} className="bg-black p-4 flex justify-between items-center border border-white/5 hover:border-red-600 transition group">
                        <span className="font-bold uppercase italic">{u.nome_completo}</span>
                        <button onClick={() => inspecionarUsuario(u)} className="bg-white text-black px-4 py-1 text-[10px] font-black uppercase italic group-hover:bg-red-600 group-hover:text-white transition">Ver Compras</button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <button onClick={() => setUsuarioInspecionado(null)} className="text-[10px] text-red-600 font-bold uppercase mb-4 block underline italic">← Voltar para lista</button>
                  <h3 className="text-lg font-black uppercase italic text-white">
                    Histórico de: <span className="text-red-600">{usuarioInspecionado.nome_completo}</span>
                  </h3>
                  
                  {carregandoPedidos ? (
                    <p className="text-center py-10 animate-pulse font-bold italic uppercase">Acessando Nexus DB...</p>
                  ) : pedidosInspecionados.length === 0 ? (
                    <div className="bg-black p-10 border border-white/10 rounded text-center italic text-gray-500 uppercase text-xs">Este usuário não possui compras registradas.</div>
                  ) : (
                    <div className="grid gap-4">
                      {pedidosInspecionados.map((p) => (
                        <div key={p.id} className="bg-black p-4 border border-white/5 flex justify-between items-center">
                          <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase">Pedido #{String(p.id).slice(0,8)}</p>
                            <p className="font-black italic uppercase text-lg text-red-600">R$ {p.valor_total?.toLocaleString('pt-BR')}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(p.created_at).toLocaleDateString('pt-BR')}</p>
                            <span className="text-[10px] bg-zinc-800 px-2 py-1 font-black uppercase italic">{p.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}