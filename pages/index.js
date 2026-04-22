import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { createClient } from '@supabase/supabase-js';

// Componentes
import Sidebar from '../components/Sidebar';
import Inicio from '../views/Inicio';
import Catalogo from '../views/Catalogo';
import Downloads from '../views/Downloads';
import Biblioteca from '../views/Biblioteca';
import Configuracoes from '../views/Configuracoes';
import InstallationView from '../views/InstallationView';
import DownloadManager from '../views/DownloadManager';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

export default function App() {
  const [view, setView] = useState('inicio'); 
  const [selectedGame, setSelectedGame] = useState(null);
  const [dbGames, setDbGames] = useState([]);
  const [downloads, setDownloads] = useState([]);

  useEffect(() => {
    async function fetchGames() {
      const { data } = await supabase.from('games').select('*');
      if (data) setDbGames(data);
    }
    fetchGames();
  }, []);

  const handleGameClick = (game) => {
    setSelectedGame(game);
    const isDownloading = downloads.find(d => d.id === game.id);
    if (isDownloading) {
      setView('download_manager');
    } else {
      setView('install');
    }
  };

  const startDownload = (game) => {
    if (!downloads.find(d => d.id === game.id)) {
      setDownloads([{ ...game, progress: 10 }, ...downloads]);
    }
    setView('downloads');
  };

  return (
    <div className="flex h-screen bg-[#020202] text-[#888] font-sans overflow-hidden">
      <Head>
        <title>KRAKEN PRO EDITION</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>
      
      <Sidebar activeView={view} setView={setView} downloadCount={downloads.length} />

      <main className="flex-1 ml-72 flex flex-col relative h-full bg-[#050505] overflow-y-auto custom-scrollbar">
        {view === 'inicio' && <Inicio games={dbGames} onSelectGame={handleGameClick} />}
        {view === 'catalogo' && <Catalogo games={dbGames} onSelectGame={handleGameClick} />}
        {view === 'downloads' && <Downloads downloads={downloads} onSelectGame={handleGameClick} />}
        {view === 'biblioteca' && <Biblioteca ownedGames={dbGames.slice(0, 2)} onSelectGame={handleGameClick} />}
        {view === 'configuracoes' && <Configuracoes />}
        {view === 'install' && selectedGame && <InstallationView game={selectedGame} onBack={() => setView('inicio')} onDownload={() => startDownload(selectedGame)} />}
        {view === 'download_manager' && selectedGame && <DownloadManager game={downloads.find(d => d.id === selectedGame.id)} onBack={() => setView('downloads')} />}
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #111; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ff9d00; }
      `}</style>
    </div>
  );
}
