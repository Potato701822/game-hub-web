import React, { useState, useEffect } from 'react';
import { 
  Home, LayoutGrid, Library, Download, Settings, 
  Play, Sparkles, Filter, Shield, Bell, User, 
  Monitor, Palette, X, Trash2, Edit3, Pause, RotateCw
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase (Vercel env)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

export default function App() {
  const [view, setView] = useState('inicio'); 
  const [games, setGames] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingGame, setEditingGame] = useState(null);

  // --- Lógica de Simulação de Downloads ---
  const startDownload = (game) => {
    if (downloads.find(d => d.id === game.id)) {
        setView('downloads');
        return;
    }
    const newDownload = {
        ...game,
        progress: 0,
        status: 'baixando',
        speed: '0 MB/s',
        size: '42.5 GB'
    };
    setDownloads(prev => [newDownload, ...prev]);
    setView('downloads');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDownloads(prev => prev.map(dl => {
        if (dl.status === 'baixando' && dl.progress < 100) {
          const nextProgress = dl.progress + Math.random() * 2;
          return { 
            ...dl, 
            progress: Math.min(nextProgress, 100),
            status: nextProgress >= 100 ? 'concluido' : 'baixando',
            speed: nextProgress >= 100 ? '0 MB/s' : `${(Math.random() * 15 + 5).toFixed(1)} MB/s`
          };
        }
        return dl;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- Busca de Jogos (Supabase) ---
  useEffect(() => {
    if (supabase) fetchGames();
  }, []);

  async function fetchGames() {
    const { data } = await supabase.from('games').select('*').order('created_at', { ascending: false });
    if (data) setGames(data);
  }

  return (
    <div className="flex min-h-screen bg-black text-[#888] font-['Montserrat']">
      <script src="https://cdn.tailwindcss.com"></script>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap');
        .glass { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); }
        .progress-fill { transition: width 0.5s ease-out; box-shadow: 0 0 15px rgba(255,157,0,0.3); }
      `}</style>
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/5 flex flex-col bg-black fixed h-full z-50">
        <div className="p-10 pb-16">
          <div className="flex flex-col gap-1 cursor-pointer" onClick={() => setView('inicio')}>
             <span className="text-white font-black text-3xl tracking-tighter italic">KRAKEN</span>
             <span className="text-[9px] text-zinc-700 tracking-[0.4em] font-black">PRO EDITION</span>
          </div>
        </div>
        <nav className="flex-1 px-5 space-y-1">
          {[
            { id: 'inicio', icon: Home, label: 'Início' },
            { id: 'catalogo', icon: LayoutGrid, label: 'Catálogo' },
            { id: 'downloads', icon: Download, label: 'Downloads', badge: downloads.filter(d => d.status === 'baixando').length },
            { id: 'configuracoes', icon: Settings, label: 'Ajustes' }
          ].map(item => (
            <button key={item.id} onClick={() => setView(item.id)} className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-sm transition-all text-[9px] font-bold uppercase tracking-widest relative ${view === item.id ? 'bg-white/5 text-white' : 'hover:text-zinc-300'}`}>
              <item.icon size={16} className={view === item.id ? 'text-[#ff9d00]' : 'text-zinc-600'} />
              <span>{item.label}</span>
              {item.badge > 0 && <span className="absolute right-4 w-4 h-4 bg-[#ff9d00] text-black text-[7px] flex items-center justify-center rounded-full animate-pulse">{item.badge}</span>}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-white/5 bg-[#050505]">
           <button onClick={() => setIsAdmin(!isAdmin)} className="text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
             <Shield size={12}/> {isAdmin ? 'ADMIN ATIVO' : 'MODO USER'}
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 flex flex-col">
        {view === 'inicio' && (
          <div className="p-12 animate-in fade-in">
             <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
               <Sparkles size={14} className="text-[#ff9d00]" /> Biblioteca Disponível
             </h2>
             <div className="grid grid-cols-4 gap-6">
                {games.map(game => (
                  <div key={game.id} onClick={() => startDownload(game)} className="group cursor-pointer">
                    <div className="aspect-video glass rounded-sm overflow-hidden mb-3 relative">
                       <img src={game.image} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-all" />
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                          <Play size={32} className="text-[#ff9d00]" fill="currentColor"/>
                       </div>
                    </div>
                    <p className="text-[10px] font-black text-white uppercase tracking-wider">{game.title}</p>
                  </div>
                ))}
             </div>
          </div>
        )}

        {view === 'downloads' && (
          <div className="flex-1 flex flex-col bg-[#080808]">
            <header className="h-20 flex items-center px-12 border-b border-white/5 justify-between">
               <h1 className="text-xl font-black italic uppercase text-white tracking-tighter">Gerenciador de Downloads</h1>
               <span className="text-[10px] font-black text-[#ff9d00]">ESTADO: {downloads.length} ATIVOS</span>
            </header>
            <div className="p-12 space-y-6">
              {downloads.length === 0 ? (
                <div className="text-center py-20 opacity-20 uppercase text-[10px] font-black tracking-widest">Nenhum download na fila</div>
              ) : (
                downloads.map(dl => (
                  <div key={dl.id} className="glass p-6 flex items-center gap-8 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff9d00]" />
                    <img src={dl.image} className="w-32 aspect-video object-cover rounded-sm opacity-60" />
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <span className="text-[10px] font-black text-white uppercase">{dl.title}</span>
                        <span className="text-[10px] font-black text-white">{dl.progress.toFixed(1)}%</span>
                      </div>
                      <div className="h-1 bg-white/5 w-full rounded-full overflow-hidden">
                        <div className="h-full bg-[#ff9d00] progress-fill" style={{ width: `${dl.progress}%` }} />
                      </div>
                      <div className="flex justify-between mt-2 text-[8px] font-bold uppercase text-zinc-500">
                        <span>{dl.speed}</span>
                        <span>{dl.size}</span>
                      </div>
                    </div>
                    <button className="text-zinc-600 hover:text-white"><X size={18}/></button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
