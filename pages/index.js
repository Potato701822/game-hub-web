import React, { useState, useEffect } from 'react';
import { Gamepad2, Settings, LayoutDashboard, CheckCircle2, Download, ArrowLeft, X, Plus, Info } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

export default function App() {
  const [view, setView] = useState('launcher');
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (supabase) fetchGames(); }, []);

  async function fetchGames() {
    setLoading(true);
    const { data, error } = await supabase.from('games').select('*');
    if (!error && data) setGames(data);
    setLoading(false);
  }

  async function saveGame(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const gameData = {
      title: formData.get('title'),
      description: formData.get('description'),
      image: formData.get('image'),
      install_url: formData.get('installUrl'),
    };
    const { error } = await supabase.from('games').insert([gameData]);
    if (!error) { setShowModal(false); fetchGames(); }
  }

  if (!supabase) return <div className="bg-black h-screen text-white flex items-center justify-center">Faltam as chaves na Vercel.</div>;

  return (
    <div className="min-h-screen bg-[#050507] text-white flex font-sans selection:bg-blue-500/30">
      <script src="https://cdn.tailwindcss.com"></script>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .glass { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .game-card:hover { transform: translateY(-10px); border-color: rgba(59, 130, 246, 0.4); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
      `}} />

      <nav className="w-24 bg-[#08080a] border-r border-white/5 flex flex-col items-center py-10 gap-10 fixed h-full z-50">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg mb-4">
          <Gamepad2 size={30} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col gap-6">
          <button onClick={() => setView('launcher')} className={`p-4 rounded-2xl transition-all ${view === 'launcher' ? 'bg-blue-600/10 text-blue-400' : 'text-gray-600'}`}><LayoutDashboard size={26} /></button>
          <button onClick={() => setView('admin')} className={`p-4 rounded-2xl transition-all ${view === 'admin' ? 'bg-purple-600/10 text-purple-400' : 'text-gray-600'}`}><Settings size={26} /></button>
        </div>
        <button onClick={() => setIsAdmin(!isAdmin)} className={`mt-auto p-4 rounded-2xl transition-all ${isAdmin ? 'text-green-500 bg-green-500/10' : 'text-gray-900 opacity-20'}`}><CheckCircle2 size={26} /></button>
      </nav>

      <main className="flex-1 ml-24 p-12 max-w-7xl mx-auto w-full">
        <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-16">
          <div>
            <h2 className="text-blue-500 font-bold tracking-[0.3em] text-[10px] mb-3 uppercase opacity-80">Plataforma Digital</h2>
            <h1 className="text-6xl font-extrabold tracking-tighter leading-none">{view === 'launcher' ? 'Biblioteca' : 'Admin'}</h1>
          </div>
          {view === 'admin' && isAdmin && (
            <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-blue-600/20 active:scale-95">
              <Plus size={22} strokeWidth={3} /> NOVO JOGO
            </button>
          )}
        </header>

        {loading ? (
          <div className="h-[50vh] flex items-center justify-center"><div className="w-16 h-16 border-t-2 border-blue-500 rounded-full animate-spin"></div></div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            {view === 'launcher' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {games.map(game => (
                  <div key={game.id} onClick={() => { setSelectedGame(game); setView('details'); }} className="game-card glass rounded-[2.5rem] overflow-hidden cursor-pointer transition-all duration-500 group relative">
                    <div className="relative h-64 overflow-hidden">
                      <img src={game.image || 'https://via.placeholder.com/400x600'} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent opacity-80 transition-opacity"></div>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center gap-3 mb-2"><div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div><span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Disponível</span></div>
                      <h3 className="font-extrabold text-2xl truncate group-hover:text-blue-400 transition-colors tracking-tight">{game.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {view === 'details' && selectedGame && (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                <button onClick={() => setView('launcher')} className="flex items-center gap-3 text-gray-500 mb-10 hover:text-white transition group bg-white/5 px-6 py-3 rounded-full w-fit"><ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Voltar</button>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                  <div className="lg:col-span-5"><div className="relative rounded-[3.5rem] overflow-hidden shadow-[0_0_80px_rgba(37,99,235,0.15)] ring-1 ring-white/10"><img src={selectedGame.image} className="w-full object-cover aspect-[4/5]" alt="" /></div></div>
                  <div className="lg:col-span-7">
                    <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500/10 text-blue-400 text-[11px] font-black mb-8 tracking-[0.2em] uppercase border border-blue-500/20">Online</span>
                    <h2 className="text-8xl font-black mb-8 tracking-tighter leading-[0.85]">{selectedGame.title}</h2>
                    <p className="text-gray-400 text-xl mb-12 leading-relaxed max-w-xl font-medium">{selectedGame.description || 'Sem descrição.'}</p>
                    <div className="flex flex-wrap gap-5">
                      <a href={selectedGame.install_url} target="_blank" rel="noreferrer" className="bg-blue-600 text-white hover:bg-blue-500 px-14 py-6 rounded-[2rem] font-black text-2xl transition-all flex items-center gap-4 shadow-2xl active:scale-95 group"><Download size={28} className="group-hover:translate-y-1 transition-transform" /> BAIXAR</a>
                      <button className="w-20 h-20 rounded-[2rem] glass flex items-center justify-center hover:bg-white/10 transition-colors"><Info size={28} className="text-gray-400" /></button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-6 z-[100] backdrop-blur-2xl animate-in fade-in duration-300">
          <form onSubmit={saveGame} className="bg-[#0c0c0f] p-12 rounded-[3.5rem] w-full max-w-2xl space-y-8 border border-white/10 shadow-3xl">
            <div className="flex justify-between items-start">
              <div><h2 className="text-4xl font-black tracking-tight mb-2">Novo Jogo</h2><p className="text-gray-500 font-medium">Preencha os dados do título.</p></div>
              <button type="button" onClick={() => setShowModal(false)} className="w-12 h-12 flex items-center justify-center hover:bg-white/5 rounded-full text-gray-400"><X size={28} /></button>
            </div>
            <div className="space-y-5">
              <input name="title" placeholder="Nome" className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" required />
              <textarea name="description" placeholder="Resumo..." className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-white h-32 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none" />
              <div className="grid grid-cols-2 gap-5">
                <input name="image" placeholder="URL Imagem" className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
                <input name="installUrl" placeholder="Link Download" className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" required />
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-6 rounded-[2rem] font-black text-xl transition-all shadow-xl mt-4">SALVAR NO SISTEMA</button>
          </form>
        </div>
      )}
    </div>
  );
}
