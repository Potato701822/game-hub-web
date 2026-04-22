import React from 'react';
import { Settings, Shield, Globe, Cpu, Database } from 'lucide-react';

export default function Configuracoes() {
  const items = [
    { icon: Shield, t: 'Segurança', d: 'Criptografia de dados Kraken' },
    { icon: Globe, t: 'Rede', d: 'Localização de servidores proxy' },
    { icon: Cpu, t: 'Sistema', d: 'Otimização de Hardware' },
    { icon: Database, t: 'Arquivos', d: 'Diretório de instalação' },
  ];
  return (
    <div className="p-16 animate-in fade-in duration-500">
      <h1 className="text-8xl font-black text-white italic uppercase tracking-tighter mb-20 opacity-10">AJUSTES</h1>
      <div className="grid grid-cols-2 gap-6 max-w-4xl">
        {items.map(i => (
          <div key={i.t} className="bg-white/[0.02] border border-white/5 p-8 rounded-sm hover:border-[#ff9d00]/30 transition-all cursor-pointer">
            <i.icon size={20} className="text-[#ff9d00] mb-4" />
            <h3 className="text-white font-black uppercase text-[11px] tracking-widest">{i.t}</h3>
            <p className="text-zinc-600 text-[9px] font-bold uppercase mt-1">{i.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
