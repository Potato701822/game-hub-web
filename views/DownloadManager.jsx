import React from 'react';
import { ChevronLeft, Pause, X } from 'lucide-react';

export default function DownloadManager({ game, onBack }) {
  if (!game) return null;
  return (
    <div className="p-16 animate-in slide-in-from-right-4 duration-500 h-full flex flex-col justify-center">
      <button onClick={onBack} className="absolute top-16 left-16 flex items-center gap-2 text-zinc-600 hover:text-white uppercase text-[10px] font-black tracking-widest transition-colors"><ChevronLeft size={16} /> Voltar para lista</button>
      <div className="bg-white/[0.01] border border-white/5 p-12 rounded-sm flex gap-12 items-center max-w-6xl mx-auto w-full">
        <img src={game.image} className="w-[400px] aspect-video object-cover rounded-sm border border-white/10" />
        <div className="flex-1 space-y-8">
          <div><h2 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">{game.title}</h2><p className="text-[#ff9d00] text-[10px] font-black tracking-[0.3em] uppercase">Transferência em curso...</p></div>
          <div className="space-y-4">
             <div className="flex justify-between text-white font-black italic text-2xl tracking-tighter"><span>PROGRESSO</span><span>{game.progress}%</span></div>
             <div className="h-2 bg-white/5 w-full rounded-full overflow-hidden"><div className="h-full bg-[#ff9d00] shadow-[0_0_15px_#ff9d00] transition-all duration-700" style={{ width: `${game.progress}%` }} /></div>
          </div>
          <div className="flex gap-4"><button className="bg-white/5 hover:bg-white/10 text-white p-4 rounded-sm transition-all"><Pause size={18} /></button><button className="bg-red-500/10 hover:bg-red-500/20 text-red-500 p-4 rounded-sm transition-all"><X size={18} /></button></div>
        </div>
      </div>
    </div>
  );
}
