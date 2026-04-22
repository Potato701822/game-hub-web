import React, { useState, useEffect } from 'react';
import { Gamepad2, Settings, LayoutDashboard, ShieldCheck, Download, ArrowLeft, X, Plus, Info, Globe, PackagePlus } from 'lucide-react';
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
    try {
      const { data, error } = await supabase.from('games').select('*');
      if (!error && data) setGames(data);
    } catch (e) { console.error("Erro ao carregar jogos:", e); }
    setLoading(false);
  }

  async function saveGame(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Criamos o objeto base
    const gameData = {
      title: formData.get('title'),
      description: formData.get('description'),
      image: formData.get('image'),
      install_url: formData.get('installUrl'),
    };

    // Adicionamos os novos campos apenas se eles tiverem valor (para evitar erros se as colunas não existirem ainda)
    const dlc = formData.get('dlcUrl');
    const fix = formData.get('onlineFixUrl');
    if (dlc) gameData.dlc_url = dlc;
    if (fix) gameData.online_fix_url = fix;

    const { error } = await supabase.from('games').insert([gameData]);
    if (!error) { setShowModal(false); fetchGames(); }
    else { alert("Nota: Se der erro aqui, é porque ainda precisas adicionar as colunas no Supabase."); }
  }

  if (!supabase) return <div className="bg-black h-screen text-white flex items-center justify-center font-sans uppercase tracking-widest text-xs opacity-50">Configurações pendentes...</div>;

  return (
    <div className="min-h-screen bg-[#050507] text-white flex font-sans selection:bg-blue-500/30">
      <script src="https://cdn.tailwindcss.com"></script>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #050507; }
        .glass { background: rgba(255, 255, 255, 0.01); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .game-card:hover { transform: translateY(-8px); border-color: rgba(59, 130, 246, 0.3); }
        .btn-gradient { background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); }
        .animate-fade-up { animation: fadeUp 0.6s ease-out forwards; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}} />

      {/* Navegação Lateral */}
      <nav className="w-20 bg-[#08080a] border-r border-white/5 flex flex-col items-center py-8 gap-10 fixed h-full z-50">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
          <Gamepad2 size={24} />
        </div>
        <div className="flex flex-col gap-8">
          <button onClick={() => setView('launcher')} className={`p-2 transition-colors ${view === 'launcher' ? 'text-blue-500' : 'text-gray-700 hover:text-gray-400'}`}><LayoutDashboard size={24} /></button>
          <button onClick={() => setView('admin')} className={`p-2 transition-colors ${view === 'admin' ? 'text-purple-500' : 'text-gray-700 hover:text-gray-400'}`}><Settings size={24} /></button>
        </div>
        <button onClick={() => { setIsAdmin(!isAdmin); if(!isAdmin) setView('admin'); }} className={`mt-auto p-2 transition-all ${isAdmin ? 'text-green-500' : 'text-gray-800'}`}><ShieldCheck size={24} /></button>
      </nav>

      <main className="flex-1 ml-20 p-8 md:p-16">
        <header className="flex justify-between items-end mb-16 max-w-6xl mx-auto">
          <div>
            <p className="text-blue-500 text-[10px] font-bold tracking-[0.4em] uppercase mb-2">Game Hub</p>
            <h1 className="text-5xl font-extrabold tracking-tight italic uppercase">{view === 'launcher' ? 'Explorar' : 'Gestão'}</h1>
          </div>
          {view === 'admin' && isAdmin && (
            <button onClick={() => setShowModal(true)} className="btn-gradient px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-blue-900/20">
              <Plus size={20} /> NOVO TÍTULO
            </button>
          )}
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {view === 'launcher' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-up">
                {games.map(game => (
                  <div key={game.id} onClick={() => { setSelectedGame(game); setView('details'); }} className="game-card glass rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-300">
                    <div className="h-60 overflow-hidden relative">
                      <img src={game.image || 'https://via.placeholder.com/400x600'} className="w-full h-full object-cover" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050507] to-transparent opacity-60"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg truncate tracking-tight">{game.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {view === 'details' && selectedGame && (
              <div className="animate-fade-up">
                <button onClick={() => setView('launcher')} className="flex items-center gap-2 text-gray-500 mb-10 hover:text-white transition group"><ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> BIBLIOTECA</button>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                  <div className="lg:col-span-4">
                    <img src={selectedGame.image} className="w-full rounded-[2.5rem] shadow-2xl border border-white/5" alt="" />
                  </div>
                  <div className="lg:col-span-8">
                    <h2 className="text-7xl font-black mb-6 tracking-tighter leading-none italic uppercase">{selectedGame.title}</h2>
                    <p className="text-gray-400 text-lg mb-10 leading-relaxed font-medium">{selectedGame.description || 'Sem descrição.'}</p>
                    
                    <div className="flex flex-col gap-4 max-w-sm">
                      <a href={selectedGame.install_url} target="_blank" rel="noreferrer" className="bg-white text-black px-10 py-5 rounded-2xl font-black text-center hover:bg-blue-600 hover:text-white transition-all shadow-xl">BAIXAR AGORA</a>
                      
                      {/* Botões Opcionais (só aparecem se tiverem link no banco) */}
                      <div className="flex gap-4">
                        {selectedGame.dlc_url && (
                          <a href={selectedGame.dlc_url} target="_blank" rel="noreferrer" className="flex-1 bg-white/5 border border-white/10 p-4 rounded-2xl font-bold text-center text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2"><PackagePlus size={16}/> DLC</a>
                        )}
                        {selectedGame.online_fix_url && (
                          <a href={selectedGame.online_fix_url} target="_blank" rel="noreferrer" className="flex-1 bg-white/5 border border-white/10 p-4 rounded-2xl font-bold text-center text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2"><Globe size={16}/> ONLINE</a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-6 z-[100] backdrop-blur-xl animate-fade-up">
          <form onSubmit={saveGame} className="bg-[#0c0c0f] p-10 rounded-[2.5rem] w-full max-w-2xl border border-white/10 space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-black uppercase italic">Novo Jogo</h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><X size={24} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="title" placeholder="Nome" className="md:col-span-2 w-full bg-white/5 p-4 rounded-xl border border-white/5 outline-none focus:border-blue-500 transition-colors" required />
              <textarea name="description" placeholder="Resumo" className="md:col-span-2 w-full bg-white/5 p-4 rounded-xl border border-white/5 h-24 outline-none focus:border-blue-500 transition-colors resize-none" />
              <input name="image" placeholder="URL da Capa" className="w-full bg-white/5 p-4 rounded-xl border border-white/5 outline-none focus:border-blue-500" />
              <input name="installUrl" placeholder="Link Download" className="w-full bg-white/5 p-4 rounded-xl border border-white/5 outline-none focus:border-blue-500" required />
              
              <div className="md:col-span-2 p-4 bg-blue-500/5 rounded-xl border border-blue-500/10">
                <p className="text-[10px] font-bold text-blue-500 uppercase mb-3">Extras (Ligar colunas no Supabase depois)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="dlcUrl" placeholder="Link DLC" className="w-full bg-white/5 p-4 rounded-xl border border-white/5 text-xs outline-none focus:border-purple-500" />
                  <input name="onlineFixUrl" placeholder="Link Online Fix" className="w-full bg-white/5 p-4 rounded-xl border border-white/5 text-xs outline-none focus:border-green-500" />
                </div>
              </div>
            </div>
            <button type="submit" className="w-full btn-gradient py-5 rounded-2xl font-black text-lg shadow-lg uppercase tracking-widest">Publicar</button>
          </form>
        </div>
      )}
    </div>
  );
}
