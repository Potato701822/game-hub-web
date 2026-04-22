import React from 'react';
import { Play } from 'lucide-react';

export default function GameCard({ game, onClick }) {
  return (
    <div onClick={() => onClick(game)} className="group cursor-pointer">
      <div className="relative aspect-[16/10] bg-zinc-900 rounded-sm overflow-hidden mb-5 border border-white/[0.02]">
        <img src={game.image} className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/40 backdrop-blur-[2px]">
          <div className="w-14 h-14 bg-[#ff9d00] rounded-full flex items-center justify-center text-black shadow-2xl scale-90 group-hover:scale-100 transition-transform">
             <Play size={28} fill="currentColor" className="ml-1" />
          </div>
        </div>
      </div>
      <h3 className="text-[11px] font-black text-white uppercase tracking-[0.15em] group-hover:text-[#ff9d00] transition-colors">{game.title}</h3>
      <p className="text-[8px] font-bold text-zinc-600 uppercase mt-1.5 tracking-widest italic">FGSTUDIOS ENGINE</p>
    </div>
  );
}
