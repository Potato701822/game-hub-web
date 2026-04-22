import React from 'react';
import { ChevronLeft, Cpu } from 'lucide-react';

const InstallationView = ({ game, onBack }) => (
  <div className="flex-1 bg-[#050505] p-12 animate-in slide-in-from-bottom-4 duration-500 h-full overflow-y-auto">
    <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-white mb-12 uppercase text-[10px] font-black tracking-widest">
        <ChevronLeft size={16} /> Voltar para Gerenciador
    </button>
    <div className="grid grid-cols-3 gap-12 max-w-6xl">
       <div className="col-span-2 space-y-8">
          <div className="flex items-end gap-8 mb-4">
             <img src={game.image} className="w-64 aspect-video object-cover rounded-sm border-2 border-[#ff9d00]/20" />
             <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">{game.title}</h2>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-10 rounded-sm space-y-6">
             <div className="flex justify-between items-end text-white">
                <p className="text-xl font-black italic uppercase">Extraindo Dados</p>
                <span className="text-5xl font-black italic tracking-tighter">{game.progress}%</span>
             </div>
             <div className="h-3 bg-white/5 w-full rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#ff9d00] to-white" style={{ width: `${game.progress}%` }} />
             </div>
          </div>
       </div>
    </div>
  </div>
);

export default InstallationView;
