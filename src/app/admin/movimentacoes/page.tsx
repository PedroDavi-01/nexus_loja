'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/src/lib/supabase'
import { ArrowUpCircle, ArrowDownCircle, User, Clock, Plus, X } from 'lucide-react'

export default function PaginaMovimentacoes() {
  const [logs, setLogs] = useState<any[]>([])
  const [produtos, setProdutos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    produto_id: '',
    tipo: 'entrada',
    quantidade: '',
    motivo: ''
  })

  const carregarDados = async () => {
    setLoading(true)
    const { data: logsData } = await supabase
      .from('movimentacoes')
      .select(`*, produtos ( nome )`)
      .order('created_at', { ascending: false })

    const { data: produtosData } = await supabase
      .from('produtos')
      .select('id, nome, estoque')
      .order('nome')

    if (logsData) setLogs(logsData)
    if (produtosData) setProdutos(produtosData)
    setLoading(false)
  }

  useEffect(() => {
    carregarDados()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const { data: { session } } = await supabase.auth.getSession()
    const autor = session?.user.user_metadata?.nome_completo || session?.user.email

    const { error } = await supabase.from('movimentacoes').insert([{
      produto_id: Number(formData.produto_id),
      tipo: formData.tipo,
      quantidade: parseInt(formData.quantidade),
      motivo: formData.motivo,
      autor_nome: autor,
      usuario_id: session?.user.id
    }])

    if (error) {
      alert("Erro ao registrar: " + error.message)
    } else {
      setShowModal(false)
      setFormData({ produto_id: '', tipo: 'entrada', quantidade: '', motivo: '' })
      carregarDados() 
    }
    setIsSubmitting(false)
  }

  return (
    <div className="p-4 md:p-8 bg-[#050505] min-h-screen text-white">
      {/* HEADER RESPONSIVO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-black italic border-l-4 border-[#E21E26] pl-4 uppercase tracking-tighter">
            Histórico de Fluxo
          </h1>
          <p className="text-gray-500 text-[9px] md:text-[10px] mt-2 ml-4 uppercase font-bold tracking-widest">Auditoria de Inventário Nexus</p>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="w-full md:w-auto bg-[#E21E26] hover:bg-white hover:text-[#E21E26] text-white px-6 py-4 md:py-3 rounded-sm font-black flex items-center justify-center gap-2 transition-all italic uppercase text-xs shadow-[0_0_20px_rgba(226,30,38,0.3)]"
        >
          <Plus size={18} /> Nova Movimentação
        </button>
      </div>

      {/* CONTAINER DA LISTA */}
      <div className="bg-[#0b0b0b] border border-[#222] rounded-sm overflow-hidden shadow-2xl">
        
        {/* VIEW DESKTOP: TABELA (Aparece de 'lg' pra cima) */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#111] border-b border-[#222]">
                <th className="p-4 text-[#E21E26] text-[10px] font-black uppercase tracking-widest">Data / Operador</th>
                <th className="p-4 text-[#E21E26] text-[10px] font-black uppercase tracking-widest">Produto</th>
                <th className="p-4 text-[#E21E26] text-[10px] font-black uppercase tracking-widest text-center">Operação</th>
                <th className="p-4 text-[#E21E26] text-[10px] font-black uppercase tracking-widest text-center">Qtd</th>
                <th className="p-4 text-[#E21E26] text-[10px] font-black uppercase tracking-widest">Motivo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {loading ? (
                <tr><td colSpan={5} className="p-10 text-center text-gray-600 animate-pulse font-bold uppercase text-xs">Sincronizando registros...</td></tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#0f0f0f] transition-colors group">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 font-mono mb-1">{new Date(log.created_at).toLocaleString('pt-BR')}</span>
                        <span className="text-xs font-black uppercase italic flex items-center gap-1">
                          <User size={12} className="text-[#E21E26]" /> {log.autor_nome || 'Sistema'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-sm uppercase tracking-tight text-gray-200 block max-w-[300px] break-words">
                        {log.produtos?.nome || 'Item Excluído'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                        <span className={`inline-flex px-3 py-1 rounded-sm text-[9px] font-black uppercase items-center gap-1 border ${
                          log.tipo === 'entrada' ? 'text-green-500 bg-green-500/5 border-green-500/20' : 'text-[#E21E26] bg-[#E21E26]/5 border-[#E21E26]/20'
                        }`}>
                          {log.tipo === 'entrada' ? <ArrowUpCircle size={10}/> : <ArrowDownCircle size={10}/>}
                          {log.tipo}
                        </span>
                    </td>
                    <td className="p-4 text-center font-black text-lg font-mono">{log.quantidade}</td>
                    <td className="p-4 text-[11px] text-gray-500 italic max-w-[200px] truncate">{log.motivo}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* VIEW MOBILE: CARDS (Aparece abaixo de 'lg') */}
        <div className="lg:hidden divide-y divide-[#222]">
          {loading ? (
            <div className="p-10 text-center text-gray-600 animate-pulse font-bold uppercase text-xs">Sincronizando...</div>
          ) : logs.length === 0 ? (
            <div className="p-10 text-center text-gray-600 font-bold uppercase text-xs">Sem registros.</div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-4 bg-[#0b0b0b] hover:bg-[#0f0f0f] transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-500 font-mono">{new Date(log.created_at).toLocaleString('pt-BR')}</span>
                    <span className="text-[10px] font-black uppercase italic text-[#E21E26] flex items-center gap-1">
                       <User size={10} /> {log.autor_nome || 'Sistema'}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-sm text-[8px] font-black uppercase border ${
                    log.tipo === 'entrada' ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-[#E21E26] border-[#E21E26]/20 bg-[#E21E26]/5'
                  }`}>
                    {log.tipo}
                  </span>
                </div>
                
                <h3 className="text-xs font-bold uppercase text-gray-200 leading-tight mb-2">
                  {log.produtos?.nome || 'Item Excluído'}
                </h3>

                <div className="flex justify-between items-end mt-4">
                  <div className="flex flex-col">
                    <span className="text-[8px] text-gray-600 uppercase font-bold tracking-widest">Justificativa</span>
                    <span className="text-[10px] text-gray-400 italic">{log.motivo}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] text-gray-600 uppercase font-bold block">Qtd</span>
                    <span className="text-xl font-black font-mono text-[#E21E26] leading-none">{log.quantidade}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL RESPONSIVO */}
      {showModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 z-[500]">
          <form onSubmit={handleSubmit} className="bg-[#0b0b0b] border-2 border-[#E21E26] p-6 md:p-8 w-full max-w-md shadow-[0_0_50px_rgba(226,30,38,0.2)] overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black uppercase italic text-[#E21E26]">Registrar Fluxo</h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition"><X size={24} /></button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Selecionar Produto</label>
                <select 
                  required 
                  className="w-full bg-black border border-[#222] p-4 text-xs font-bold text-white outline-none focus:border-[#E21E26] transition-all appearance-none"
                  onChange={e => setFormData({...formData, produto_id: e.target.value})}
                  value={formData.produto_id}
                >
                  <option value="">-- Escolha o Item --</option>
                  {produtos.map(p => (
                    <option key={p.id} value={p.id}>{p.nome} (Estoque: {p.estoque})</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, tipo: 'entrada'})}
                  className={`flex-1 p-3 text-[10px] font-black uppercase border transition-all ${formData.tipo === 'entrada' ? 'bg-green-600 border-green-600 text-white shadow-[0_0_15px_rgba(22,163,74,0.4)]' : 'border-[#222] text-gray-600'}`}
                >Entrada</button>
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, tipo: 'saida'})}
                  className={`flex-1 p-3 text-[10px] font-black uppercase border transition-all ${formData.tipo === 'saida' ? 'bg-[#E21E26] border-[#E21E26] text-white shadow-[0_0_15px_rgba(226,30,38,0.4)]' : 'border-[#222] text-gray-600'}`}
                >Saída</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase mb-2 tracking-widest">Quantidade</label>
                  <input 
                    type="number" required min="1"
                    className="w-full bg-black border border-[#222] p-4 text-xs font-bold outline-none focus:border-[#E21E26]"
                    onChange={e => setFormData({...formData, quantidade: e.target.value})}
                    value={formData.quantidade}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase mb-2 tracking-widest">Justificativa</label>
                  <input 
                    type="text" required placeholder="Venda..."
                    className="w-full bg-black border border-[#222] p-4 text-xs font-bold outline-none focus:border-[#E21E26]"
                    onChange={e => setFormData({...formData, motivo: e.target.value})}
                    value={formData.motivo}
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-white text-black py-4 mt-8 font-black uppercase text-[11px] italic hover:bg-[#E21E26] hover:text-white transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Sincronizando...' : 'Confirmar Lançamento'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}