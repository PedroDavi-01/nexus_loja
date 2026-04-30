export default function Footer() {
  return (
    <footer className="bg-[#0B0B0B] text-white pt-12 pb-6 border-t-[5px] border-[#E21E26] mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="text-[#E21E26] text-sm font-black uppercase mb-4 tracking-widest">Atendimento</h3>
          <p className="text-sm text-gray-400">08:00 às 20:00 - Segunda a Sábado</p>
          <button className="mt-4 bg-[#E21E26] px-6 py-2 rounded font-bold text-sm hover:bg-[#b0181e] transition">
            FALE CONOSCO
          </button>
        </div>
        <div>
          <h3 className="text-[#E21E26] text-sm font-black uppercase mb-4 tracking-widest">Institucional</h3>
          <ul className="text-sm text-gray-400 space-y-2">
            <li className="hover:text-white cursor-pointer transition">Sobre a NEXUS</li>
            <li className="hover:text-white cursor-pointer transition">Políticas de Privacidade</li>
          </ul>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black italic text-gray-800">NEXUS</div>
          <p className="text-[10px] text-gray-600 mt-2">© 2026 Nexus Technology. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}