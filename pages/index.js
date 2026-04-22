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
  const [downloads, setDownloads] = useState([]);

  useEffect(() => {
    async function fetchGames() {
      const { data } = await supabase.from('games').select('*');
      if (data) setDbGames(data);
      setLoading(false);
    }
    fetchGames();
  }, []);

  const handleStartDownload = (game) => {
    if (!downloads.find(d => d.id === game.id)) {
      setDownloads([{ ...game, progress: 10 }, ...downloads]);
    }
    setView('downloads');
  };

  return (
    <div className="flex h-screen bg-[#020202] text-[#888] font-sans overflow-hidden">
      <Head>
        <title>KRAKEN FGSTUDIOS</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>
      
      <Sidebar activeView={view} setView={setView} downloadCount={downloads.length} />

      <main className="flex-1 ml-72 flex flex-col relative h-full bg-[#050505] overflow-y-auto">
        
        {view === 'inicio' && (
          <div className="p-16 space-y-12 animate-in fade-in duration-700">
            <div className="relative h-64 w-full rounded-sm overflow-hidden mb-12 border border-white/5">
               <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200" className="w-full h-full object-cover opacity-20" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
               <div className="absolute bottom-8 left-8">
                  <h1 className="text-5xl font-black italic text-white uppercase tracking-tighter">BEM-VINDO</h1>
                  <p className="text-[10px] text-[#ff9d00] font-black tracking-[0.4em] uppercase">SISTEMA KRAKEN ATIVO</p>
               </div>
            </div>
            <div className="grid grid-cols-3 gap-10">
              {dbGames.map(game => (
                <GameCard key={game.id} game={game} onClick={(g) => { setSelectedGame(g); setView('install'); }} />
              ))}
            </div>
          </div>
        )}

        {view === 'downloads' && (
          <div className="p-16 animate-in fade-in duration-500">
            <h1 className="text-8xl font-black text-white italic uppercase tracking-tighter mb-16 opacity-10">DOWNLOADS</h1>
            {downloads.length === 0 ? (
              <div className="h-64 border border-dashed border-white/5 flex items-center justify-center rounded-sm text-[10px] font-black uppercase tracking-widest text-zinc-800">Vazio</div>
            ) : (
              <div className="space-y-4">
                {downloads.map(dl => (
                  <div key={dl.id} className="bg-white/[0.02] p-8 border border-white/5 rounded-sm flex items-center gap-10">
                    <img src={dl.image} className="w-48 aspect-video object-cover rounded-sm border border-white/5" />
                    <div className="flex-1">
                       <div className="flex justify-between mb-4"><span className="text-white font-black italic uppercase text-2xl">{dl.title}</span><span className="text-[#ff9d00] font-black">{dl.progress}%</span></div>
                       <div className="h-1 bg-white/5 w-full"><div className="h-full bg-[#ff9d00]" style={{ width: `${dl.progress}%` }} /></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'install' && selectedGame && (
          <InstallationView game={selectedGame} onBack={() => setView('inicio')} onDownload={() => handleStartDownload(selectedGame)} />
        )}

      </main>
    </div>
  );
}
