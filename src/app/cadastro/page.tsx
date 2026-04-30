'use client'

import { useState } from 'react'
import { supabase } from '@/src/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Cadastro() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const router = useRouter()

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErro('')

    // 1. Cria o usuário no Auth
    // Enviamos o nome no 'options.data' para a Trigger do banco ler
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome_completo: nome
        }
      }
    })

    if (authError) {
      setErro(authError.message)
      setLoading(false)
      return
    }

    // 2. Com a Trigger configurada no SQL, o perfil é criado automaticamente!
    // Não precisamos de um segundo insert manual aqui.
    if (authData.user) {
      alert("Conta criada com sucesso! O perfil foi gerado automaticamente.")
      router.push('/login?msg=conta-criada')
    }
    
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#0B0B0B] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black italic text-gray-900 tracking-tighter uppercase">NEXUS</h1>
          <p className="text-gray-500 font-bold text-[10px] uppercase mt-2 tracking-widest">Store & Management</p>
        </div>

        {erro && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded">
            <p className="text-red-600 text-xs font-bold">{erro}</p>
          </div>
        )}

        <form onSubmit={handleCadastro} className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Nome Completo</label>
            <input 
              type="text" placeholder="Ex: Pedro Silva" required
              className="w-full p-4 bg-gray-100 rounded-xl text-black outline-none border-2 border-transparent focus:border-[#E21E26] transition-all"
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">E-mail</label>
            <input 
              type="email" placeholder="seu@email.com" required
              className="w-full p-4 bg-gray-100 rounded-xl text-black outline-none border-2 border-transparent focus:border-[#E21E26] transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Senha</label>
            <input 
              type="password" placeholder="••••••••" required
              className="w-full p-4 bg-gray-100 rounded-xl text-black outline-none border-2 border-transparent focus:border-[#E21E26] transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            className="mt-2 bg-[#E21E26] text-white py-4 rounded-xl font-black uppercase tracking-tighter hover:bg-black transition-all disabled:opacity-50 shadow-lg shadow-red-500/20"
          >
            {loading ? 'Sincronizando...' : 'Criar minha conta'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500 text-xs font-bold uppercase tracking-tight">
          Já faz parte da Nexus? <Link href="/login" className="text-[#E21E26] hover:underline">Faça Login</Link>
        </p>
      </div>
    </main>
  )
}