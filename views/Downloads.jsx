import React from 'react';
import { Download } from 'lucide-react';

export default function Downloads({ downloads, onSelectGame }) {
  return (
    <div className="p-16 animate-in fade-in duration-500 h-full">
      <h1 className="text-8xl font-black text-white italic uppercase tracking-tighter mb-16 opacity-10">DOWNLOADS</h1>
      {downloads.length === 0 ? (
        <div className="h-64 border border-dashed border-white/5 flex flex-col items-center justify-center rounded-sm text-zinc-800 text-[10px] font-black uppercase tracking-widest">Lista de downloads vazia</div>
      ) : (
        <div className="space-y-6">
          {downloads.map(dl => (
            <div key={dl.id} onClick={() => onSelectGame(dl)} className="bg-white/[0.02] p-8 border border-white/5 rounded-sm flex items-center gap-10 hover:bg-white/[0.04] transition-all cursor-pointer">
              <img src={dl.image} className="w-48 aspect-video object-cover rounded-sm border border-white/5" />
              <div className="flex-1">
                 <div className="flex justify-between mb-4"><span className="text-white font-black italic uppercase text-2xl tracking-tighter">{dl.title}</span><span className="text-[#ff9d00] font-black">{dl.progress}%</span></div>
                 <div className="h-1 bg-white/5 w-full"><div className="h-full bg-[#ff9d00]" style={{ width: `${dl.progress}%` }} /></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
