'use client'

import { useState } from 'react'
import { supabase } from '@/src/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErro('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      
      if (error.message === 'Invalid login credentials') {
        setErro('E-mail ou senha incorretos.')
      } else {
        setErro(error.message)
      }
      setLoading(false)
    } else {
      // Login com sucesso! Redireciona para a Home
      router.push('/')
      router.refresh() // Atualiza os componentes para reconhecer o usuário logado
    }
  }

  return (
    <main className="min-h-screen bg-[#0B0B0B] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl border-t-8 border-[#E21E26]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black italic text-gray-900 tracking-tighter uppercase">NEXUS</h1>
          <p className="text-gray-500 font-bold text-[10px] uppercase mt-2 tracking-widest">Acesse sua conta</p>
        </div>

        {erro && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded">
            <p className="text-red-600 text-xs font-bold">{erro}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Seu E-mail</label>
            <input 
              type="email" placeholder="email@exemplo.com" required
              className="w-full p-4 bg-gray-100 rounded-xl text-black outline-none border-2 border-transparent focus:border-[#E21E26] transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Sua Senha</label>
            <input 
              type="password" placeholder="••••••••" required
              className="w-full p-4 bg-gray-100 rounded-xl text-black outline-none border-2 border-transparent focus:border-[#E21E26] transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            className="mt-2 bg-[#E21E26] text-white py-4 rounded-xl font-black uppercase tracking-tighter hover:bg-black transition-all disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? 'Validando...' : 'Entrar na Loja'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3 text-center">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-tight">
            Novo por aqui? <Link href="/cadastro" className="text-[#E21E26] hover:underline">Crie seu perfil</Link>
          </p>
          <Link href="/" className="text-gray-400 text-[10px] uppercase font-black hover:text-black transition-colors">
            ← Voltar para a vitrine
          </Link>
        </div>
      </div>
    </main>
  )
}