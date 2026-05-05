'use client'

import { useState } from 'react';
import Link from 'next/link';
import { FaXTwitter } from "react-icons/fa6";
import { FaGithub, FaInstagramSquare, FaFacebook, FaLinkedin  } from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const redesSociais = [
    { id: 'instagram', icon: <FaInstagramSquare size={20}/>, href: 'https://instagram.com/seu-user' },
    { id: 'github', icon: <FaGithub size={20}/>, href: 'https://github.com/seu-user' },
    { id: 'twitter', icon: <FaXTwitter size={20}/>, href: 'https://x.com/seu-user' }
  ];

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) {
      alert("Por favor, insira um e-mail válido.");
      return;
    }

    setLoading(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/send-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email,
          nomeProduto: "Novidades e Ofertas Relâmpago Nexus" 
        }),
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Erro na newsletter:", error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="mt-auto bg-[#050505] text-white border-t border-red-600/40">
      {/* Linha de Brilho (Glow) */}
      <div className="h-[3px] w-full bg-[#E21E26] shadow-[0_0_25px_rgba(226,30,38,0.9)]" />

      <div className="container mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Coluna 1: Marca e Redes Sociais */}
          <div>
            <h2 className="text-4xl font-black italic text-white mb-4 tracking-tight">
              NEXUS
            </h2>
            <p className="text-gray-400 text-sm leading-7 mb-6">
              Tecnologia de ponta para gamers, criadores e apaixonados por performance.
              Equipamentos premium com potência sem limites.
            </p>
            
            
            <div className="flex gap-3">
              {redesSociais.map((item) => (
                <a
                  key={item.id} 
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-zinc-700 hover:border-[#E21E26] hover:bg-[#E21E26] flex items-center justify-center transition-all duration-300 text-white"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Coluna 2: Atendimento */}
          <div>
            <h3 className="text-[#E21E26] text-sm font-black uppercase tracking-[3px] mb-5">
              Atendimento
            </h3>
            <div className="space-y-3 text-sm text-gray-400">
              <p>🕒 08:00 às 20:00</p>
              <p>📅 Segunda a Sábado</p>
              <p>📧 contato@nexus.com</p>
              <p>📱 (81) 99999-9999</p>
            </div>
            <button className="mt-6 bg-[#E21E26] hover:bg-red-700 px-6 py-3 rounded-lg font-bold text-sm transition-all duration-300 hover:scale-105 shadow-lg shadow-red-700/20">
              <a href="https://wa.me/558199472821" target="_blank" rel="noopener noreferrer">FALE CONOSCO</a>
            </button>
          </div>

          {/* Coluna 3: Links Rápidos */}
          <div>
            <h3 className="text-[#E21E26] text-sm font-black uppercase tracking-[3px] mb-5">
              Links rápidos
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              {[
                { name: 'Hardware', href: '/categoria/hardware' },
                { name: 'Pc Gamer', href: '/categoria/pc-gamer' },
                { name: 'Periféricos', href: '/categoria/perifericos' },
                { name: 'Monitores', href: '/categoria/monitores' },
              ].map((item) => (
                <li
                  key={item.href}
                  className="hover:text-white hover:translate-x-1 transition-all cursor-pointer"
                >
                  <Link href={item.href}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 4: Newsletter com Resend */}
          <div>
            <h3 className="text-[#E21E26] text-sm font-black uppercase tracking-[3px] mb-5">
              Receba novidades
            </h3>
            <p className="text-sm text-gray-400 mb-5 leading-7">
              Promoções exclusivas, lançamentos e ofertas relâmpago direto no seu email.
            </p>

            <div className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
                className="w-full bg-[#111] border border-zinc-700 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#E21E26] transition text-white"
              />

              <button 
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full bg-[#E21E26] hover:bg-red-700 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'ENVIANDO...' : 'CADASTRAR'}
              </button>

              {/* Status de envio */}
              {status === 'success' && (
                <p className="text-[11px] text-green-500 font-bold uppercase tracking-wider animate-pulse text-center">
                   E-mail enviado com sucesso!
                </p>
              )}
              {status === 'error' && (
                <p className="text-[11px] text-red-500 font-bold uppercase tracking-wider text-center">
                  ❌ Erro ao enviar!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Divisor */}
        <div className="border-t border-zinc-800 my-10" />

        {/* Rodapé Inferior */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-sm">
            © 2026 NEXUS Technology — <span className="text-white">Performance sem limites.</span>
          </p>
          <div className="flex gap-6 text-sm text-zinc-500">
            <span className="hover:text-white cursor-pointer transition">Compra Segura 🔒</span>
            <span className="hover:text-white cursor-pointer transition">PIX com desconto</span>
            <span className="hover:text-white cursor-pointer transition">Garantia Premium</span>
          </div>
        </div>
      </div>
    </footer>
  );
}