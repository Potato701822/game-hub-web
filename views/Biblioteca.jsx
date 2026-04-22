import React from 'react';
import { Library, Play } from 'lucide-react';

export default function Biblioteca({ ownedGames, onSelectGame }) {
  return (
    <div className="p-16 animate-in fade-in duration-500">
      <h1 className="text-8xl font-black text-white italic uppercase tracking-tighter mb-16 opacity-10">BIBLIOTECA</h1>
      {ownedGames.length === 0 ? (
        <div className="h-64 border border-dashed border-white/5 flex flex-col items-center justify-center rounded-sm text-zinc-800 text-[10px] font-black uppercase tracking-widest">Nenhum jogo instalado</div>
      ) : (
        <div className="grid grid-cols-4 gap-8">
          {ownedGames.map(game => (
            <div key={game.id} onClick={() => onSelectGame(game)} className="group cursor-pointer">
               <div className="relative aspect-video bg-zinc-900 rounded-sm overflow-hidden border border-white/5">
                  <img src={game.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/40"><Play size={20} fill="currentColor" /></div>
               </div>
               <h3 className="text-[10px] font-black text-white uppercase mt-4 tracking-widest">{game.title}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
