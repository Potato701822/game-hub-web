import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import GameCard from '../components/GameCard';
import InstallationView from '../views/InstallationView';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

export default function App() {
  const [view, setView] = useState('inicio'); 
  const [selectedGame, setSelectedGame] = useState(null);
  const [dbGames, setDbGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloads, setDownloads] = useState([]);

  useEffect(() => {
    async function fetchGames() {
      const { data } = await supabase.from('games').select('*');
      if (data) setDbGames(data);
      setLoading(false);
    }
    fetchGames();
  }, []);

  return (
    <div className="flex h-screen bg-black text-[#888] font-sans overflow-hidden">
      <Sidebar activeView={view} setView={setView} downloadCount={downloads.length} />

      <main className="flex-1 ml-64 flex flex-col relative h-full">
        
        {view === 'inicio' && (
          <div className="p-12 space-y-12 overflow-y-auto">
            <h1 className="text-6xl font-black italic text-white uppercase tracking-tighter">Início</h1>
            <div className="grid grid-cols-3 gap-8">
              {dbGames.slice(0, 3).map(game => (
                <GameCard key={game.id} game={game} onClick={(g) => { setSelectedGame(g); setView('install_details'); }} />
              ))}
            </div>
          </div>
        )}

        {view === 'install_details' && selectedGame && (
          <InstallationView game={selectedGame} onBack={() => setView('inicio')} />
        )}

        {/* Adicione outras abas conforme precisar aqui */}

      </main>
    </div>
  );
}
