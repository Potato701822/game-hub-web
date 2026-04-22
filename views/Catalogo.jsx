import React from 'react';
import GameCard from '../components/GameCard';

export default function Catalogo({ games, onSelectGame }) {
  return (
    <div className="p-16 animate-in fade-in duration-500">
      <h1 className="text-8xl font-black text-white italic uppercase tracking-tighter mb-16 opacity-10">CATALOGO</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {games.map(game => (<GameCard key={game.id} game={game} onClick={onSelectGame} />))}
      </div>
    </div>
  );
}
