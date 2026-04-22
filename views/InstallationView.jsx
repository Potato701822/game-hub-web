import React from 'react';
import { ChevronLeft, Download } from 'lucide-react';

export default function InstallationView({ game, onBack, onDownload }) {
  return (
    <div className="p-16 animate-in slide-in-from-bottom-4 duration-500 h-full flex flex-col justify-center relative">
      <button onClick={onBack} className="absolute top-16 left-16 flex items-center gap-2 text-zinc-500 hover:text-white uppercase text-[10px] font-black tracking-widest">
          <ChevronLeft size={16} /> Voltar
      </button>
      <div className="max-w-6xl mx-auto flex gap-16 items-center">
        <img src={game.image} className="w-1/2 aspect-video object-cover rounded-sm border border-white/10 shadow-2xl" />
        <div className="w-1/2 space-y-8">
           <h2 className="text-7xl font-black text-white italic uppercase tracking-tighter leading-none">{game.title}</h2>
           <p className="text-zinc-400 leading-relaxed text-sm">Este artefato digital está pronto para extração. Clique abaixo para iniciar o download direto via Kraken Engine.</p>
           <button onClick={onDownload} className="bg-[#ff9d00] hover:bg-white text-black px-12 py-5 rounded-sm flex items-center gap-4 transition-all">
             <Download size={20} /><span className="font-black text-sm uppercase tracking-widest italic">Baixar Agora</span>
           </button>
        </div>
      </div>
    </div>
  );
}
