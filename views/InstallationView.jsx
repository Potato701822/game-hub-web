import React from 'react';
import { ChevronLeft } from 'lucide-react';

export default function InstallationView({ game, onBack }) {
  return (
    <div className="p-16 animate-in slide-in-from-bottom-4 duration-500">
      <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-white mb-12 uppercase text-[10px] font-black tracking-widest">
          <ChevronLeft size={16} /> Voltar
      </button>
      <div className="flex items-end gap-8 mb-12">
         <img src={game.image} className="w-64 aspect-video object-cover rounded-sm border border-[#ff9d00]/20" />
         <h2 className="text-6xl font-black text-white italic uppercase tracking-tighter">{game.title}</h2>
      </div>
      <div className="bg-white/[0.02] border border-white/5 p-10 rounded-sm max-w-4xl">
         <div className="flex justify-between items-end text-white mb-4">
            <p className="text-xl font-black italic uppercase">Descompactando Artefatos</p>
            <span className="text-5xl font-black italic tracking-tighter">{game.progress || 0}%</span>
         </div>
         <div className="h-2 bg-white/5 w-full rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#ff9d00] to-white transition-all duration-1000" style={{ width: `${game.progress || 0}%` }} />
         </div>
      </div>
    </div>
  );
}
