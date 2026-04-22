import React from 'react';
import { Play } from 'lucide-react';

const GameCard = ({ game, onClick }) => (
  <div onClick={() => onClick(game)} className="group cursor-pointer">
    <div className="aspect-video bg-zinc-900 border border-white/5 rounded-sm overflow-hidden mb-4 relative">
      <img src={game.image} className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
        <div className="w-12 h-12 bg-[#ff9d00] rounded-full flex items-center justify-center text-black">
           <Play size={24} fill="currentColor" />
        </div>
      </div>
    </div>
    <h3 className="text-xs font-black text-white uppercase tracking-widest group-hover:text-[#ff9d00]">{game.title}</h3>
    <p className="text-[8px] font-bold text-zinc-600 uppercase mt-1 italic">KRAKEN ENGINE</p>
  </div>
);

export default GameCard;
