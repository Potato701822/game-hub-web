import React, { useState, useEffect } from 'react';
import { Gamepad2, Settings, LayoutDashboard, CheckCircle2, Download, ArrowLeft, X } from 'lucide-react';
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

  useEffect(() => {
    if (supabase) fetchGames();
  }, []);

  async function fetchGames() {
    try {
      const { data, error } = await supabase.from('games').select('*');
      if (!error && data) setGames(data);
    } catch (e) { console.log(e); }
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

  if (!supabase) return <div className="bg-black h-screen text-white flex items-center justify-center">A configurar chaves do Supabase...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex font-sans">
      <nav className="w-20 bg-[#0f0f12] border-r border-white/5 flex flex-col items-center py-8 gap-8 fixed h-full z-50">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center"><Gamepad2 size={28} /></div>
        <button onClick={() => setView('launcher')} className="text-gray-500 hover:text-white"><LayoutDashboard size={24} /></button>
        <button onClick={() => setView('admin')} className="text-gray-500 hover:text-white"><Settings size={24} /></button>
        <button onClick={() => setIsAdmin(!isAdmin)} className={`mt-auto ${isAdmin ? 'text-green-400' : 'text-gray-700'}`}><CheckCircle2 size={24} /></button>
      </nav>

      <main className="flex-1 ml-20 p-8">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-black">{view === 'launcher' ? 'BIBLIOTECA' : 'ADMIN'}</h1>
          {view === 'admin' && isAdmin && (
            <button onClick={() => setShowModal(true)} className="bg-blue-600 px-6 py-2 rounded-lg font-bold"> + NOVO JOGO </button>
          )}
        </header>

        {view === 'launcher' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {games.map(game => (
              <div key={game.id} onClick={() => { setSelectedGame(game); setView('details'); }} className="bg-[#16161d] rounded-2xl overflow-hidden border border-white/5 cursor-pointer hover:border-blue-500 transition-all">
                <img src={game.image || 'https://via.placeholder.com/400'} className="w-full h-48 object-cover" alt="" />
                <div className="p-4 font-bold truncate">{game.title}</div>
              </div>
            ))}
          </div>
        )}

        {view === 'details' && selectedGame && (
          <div className="max-w-4xl">
            <button onClick={() => setView('launcher')} className="flex items-center gap-2 text-gray-400 mb-6"><ArrowLeft size={20} /> Voltar</button>
            <div className="flex flex-col md:flex-row gap-10 bg-[#16161d] p-8 rounded-3xl border border-white/5 shadow-2xl">
              <img src={selectedGame.image} className="w-full md:w-72 rounded-2xl" alt="" />
              <div className="flex-1">
                <h2 className="text-5xl font-black mb-4 leading-none">{selectedGame.title}</h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">{selectedGame.description}</p>
                <a href={selectedGame.install_url} target="_blank" rel="noreferrer" className="inline-block bg-blue-600 px-10 py-4 rounded-xl font-bold text-xl hover:bg-blue-700 transition">DESCARREGAR JOGO</a>
              </div>
            </div>
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[100] backdrop-blur-sm">
          <form onSubmit={saveGame} className="bg-[#1c1c24] p-8 rounded-3xl w-full max-w-lg space-y-4 border border-white/10">
            <div className="flex justify-between items-center text-white"><h2 className="text-2xl font-bold">Novo Jogo</h2><button type="button" onClick={() => setShowModal(false)}><X /></button></div>
            <input name="title" placeholder="Nome" className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none" required />
            <textarea name="description" placeholder="Descrição" className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white h-24 outline-none" />
            <input name="image" placeholder="URL da Capa" className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none" />
            <input name="installUrl" placeholder="URL de Download" className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none" required />
            <button type="submit" className="w-full bg-blue-600 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition text-white">SALVAR JOGO</button>
          </form>
        </div>
      )}
    </div>
  );
}
