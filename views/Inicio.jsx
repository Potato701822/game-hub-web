import React from 'react';
import GameCard from '../components/GameCard';

export default function Inicio({ games, onSelectGame }) {
  return (
    <div className="p-16 space-y-12 animate-in fade-in duration-700">
      <div className="relative h-72 w-full rounded-sm overflow-hidden mb-12 border border-white/5 bg-zinc-900">
         <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200" className="w-full h-full object-cover opacity-20" />
         <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
         <div className="absolute bottom-10 left-10">
            <h1 className="text-6xl font-black italic text-white uppercase tracking-tighter leading-none mb-2">BEM-VINDO</h1>
            <p className="text-[10px] text-[#ff9d00] font-black tracking-[0.4em] uppercase">SISTEMA CENTRAL PRO ATIVO</p>
         </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {games.map(game => (<GameCard key={game.id} game={game} onClick={onSelectGame} />))}
      </div>
    </div>
  );
}
