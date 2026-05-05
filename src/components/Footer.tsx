import Link from 'next/link';



export default function Footer() {
  return (
    <footer className="mt-auto bg-[#050505] text-white border-t border-red-600/40">
      {/* glow line */}
      <div className="h-[3px] w-full bg-[#E21E26] shadow-[0_0_25px_rgba(226,30,38,0.9)]" />

      <div className="container mx-auto px-6 py-14">
        {/* topo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* marca */}
          <div>
            <h2 className="text-4xl font-black italic text-white mb-4 tracking-tight">
              NEXUS
            </h2>

            <p className="text-gray-400 text-sm leading-7 mb-6">
              Tecnologia de ponta para gamers, criadores e apaixonados por performance.
              Equipamentos premium com potência sem limites.
            </p>

            <div className="flex gap-3">
              {["IG", "FB", "X", "YT", "DC"].map((item) => (
                <button
                  key={item}
                  className="w-10 h-10 rounded-full border border-zinc-700 hover:border-[#E21E26] hover:bg-[#E21E26] transition-all duration-300 font-bold text-sm"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* atendimento */}
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
             <a href="https://wa.me/558199472821">FALE CONOSCO</a>
            </button>
          </div>

          {/* links */}
          <div>
            <h3 className="text-[#E21E26] text-sm font-black uppercase tracking-[3px] mb-5">
              Links rápidos
            </h3>

            <ul className="space-y-3 text-sm text-gray-400">
              {[
                <Link href="/categoria/hardware">Hardware</Link>,
                <Link href="/categoria/pc-gamer">Pc Gamer</Link>,
                <Link href="/categoria/perifericos">Periféricos</Link>,
                <Link href="/categoria/monitores">Monitores</Link>,
              ].map((item) => (
                <li
                  key={item}
                  className="hover:text-white hover:translate-x-1 transition-all cursor-pointer"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* newsletter */}
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
                placeholder="Digite seu email"
                className="w-full bg-[#111] border border-zinc-700 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#E21E26] transition"
              />

              <button className="w-full bg-[#E21E26] hover:bg-red-700 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-[1.02]">
                CADASTRAR
              </button>
            </div>
          </div>
        </div>

        {/* divisor */}
        <div className="border-t border-zinc-800 my-10" />

        {/* bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-sm">
            © 2026 NEXUS Technology — <span className="text-white">Performance sem limites.</span>
          </p>

          <div className="flex gap-6 text-sm text-zinc-500">
            <span className="hover:text-white cursor-pointer transition">
              Compra Segura 🔒
            </span>
            <span className="hover:text-white cursor-pointer transition">
              PIX com desconto
            </span>
            <span className="hover:text-white cursor-pointer transition">
              Garantia Premium
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}