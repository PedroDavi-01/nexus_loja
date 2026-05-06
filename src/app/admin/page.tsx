'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/src/lib/supabase'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, Legend 
} from 'recharts'
import { Package, AlertTriangle, TrendingUp } from 'lucide-react'

export default function DashboardAdmin() {
  const [data, setData] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, alerta: 0, valorTotal: 0 })
  const [loading, setLoading] = useState(true)

  const carregarDados = async () => {
    setLoading(true)
    const { data: produtos, error } = await supabase
      .from('produtos')
      .select('*')
      .order('estoque', { ascending: false })

    if (error) {
      console.error("Erro ao carregar dados:", error.message)
    }

    if (produtos) {
      setData(produtos)
      const totalItens = produtos.reduce((acc, curr) => acc + (curr.estoque || 0), 0)
      const itensAlerta = produtos.filter(p => (p.estoque || 0) <= (p.stock_minimo || 0)).length
      const financeiro = produtos.reduce((acc, curr) => acc + ((curr.estoque || 0) * (curr.preco || 0)), 0)
      setStats({ total: totalItens, alerta: itensAlerta, valorTotal: financeiro })
    }
    setLoading(false)
  }

  useEffect(() => {
    carregarDados()
  }, [])

  // Formata o nome para manter o dashboard limpo
  const formatarNomeEixo = (nome: string) => {
    return nome.length > 12 ? `${nome.substring(0, 10)}...` : nome
  }

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center font-black uppercase italic text-[#E21E26]">
      Sincronizando Nexus...
    </div>
  )

  return (
    <div className="p-8 bg-[#050505] min-h-screen text-white">
      
      {/* CARDS DE STATUS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#0b0b0b] border-l-4 border-[#E21E26] p-6 shadow-xl">
          <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest block mb-2">Volume Total</span>
          <h2 className="text-4xl font-black italic tracking-tighter">{stats.total}</h2>
        </div>

        <div className="bg-[#0b0b0b] border-l-4 border-yellow-500 p-6 shadow-xl">
          <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest block mb-2">Alertas Críticos</span>
          <h2 className="text-4xl font-black italic text-yellow-500 tracking-tighter">{stats.alerta}</h2>
        </div>

        <div className="bg-[#0b0b0b] border-l-4 border-green-500 p-6 shadow-xl">
          <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest block mb-2">Valor em Stock</span>
          <h2 className="text-4xl font-black italic tracking-tighter">
            <span className="text-sm font-bold text-green-500 mr-1 italic">R$</span>
            {stats.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h2>
        </div>
      </div>

      {/* GRÁFICO COM BARRA DUPLA E ROLAGEM */}
      <div className="bg-[#0b0b0b] border border-[#1a1a1a] p-8 rounded-sm shadow-2xl">
        <div className="mb-8">
          <h3 className="text-xl font-black uppercase italic tracking-tighter border-b border-[#E21E26] inline-block pb-1">
            Análise de Disponibilidade (Atual x Mínimo)
          </h3>
        </div>

        {/* Scroll lateral caso tenha muitos produtos */}
        <div className="w-full overflow-x-auto no-scrollbar pb-6">
          <div style={{ minWidth: data.length > 6 ? `${data.length * 120}px` : '100%', height: '450px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                
                <XAxis 
                  dataKey="nome" 
                  tickFormatter={formatarNomeEixo} 
                  interval={0} 
                  angle={-45} 
                  textAnchor="end"
                  tick={{ fill: '#444', fontSize: 10, fontWeight: '900' }}
                  stroke="#1a1a1a"
                />
                
                <YAxis 
                  tick={{ fill: '#444', fontSize: 10, fontWeight: 'bold' }} 
                  stroke="#1a1a1a"
                />

                <Tooltip 
                  cursor={{ fill: '#111' }}
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #E21E26', borderRadius: '0px', textTransform: 'uppercase', fontWeight: 'bold' }}
                />
                
                <Legend 
                    wrapperStyle={{ paddingTop: '20px', textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold' }}
                />

                {/* BARRA 1: ESTOQUE ATUAL */}
                <Bar name="Estoque Atual" dataKey="estoque" barSize={35}>
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.estoque <= entry.stock_minimo ? '#E21E26' : '#fff'} 
                    />
                  ))}
                </Bar>

                {/* BARRA 2: ESTOQUE MÍNIMO */}
                <Bar name="Estoque Mínimo" dataKey="stock_minimo" fill="#333" barSize={15} />
                
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}