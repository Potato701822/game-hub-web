import React, { useState, useEffect } from 'react';
import Head from 'next/head';
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
      <Head>
        <title>KRAKEN FGSTUDIOS</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>
      
      <Sidebar activeView={view} setView={setView} downloadCount={0} />

      <main className="flex-1 ml-72 flex flex-col relative h-full bg-[#050505] overflow-y-auto">
        {view === 'inicio' && (
          <div className="p-16 space-y-12 animate-in fade-in duration-700">
            <h1 className="text-[11px] font-black text-white uppercase tracking-[0.4em] opacity-40">Destaques</h1>
            <div className="grid grid-cols-3 gap-10">
              {dbGames.map(game => (
                <GameCard key={game.id} game={game} onClick={(g) => { setSelectedGame(g); setView('install'); }} />
              ))}
            </div>
          </div>
        )}

        {view === 'install' && selectedGame && (
          <InstallationView game={selectedGame} onBack={() => setView('inicio')} />
        )}
      </main>
    </div>
  );
}
