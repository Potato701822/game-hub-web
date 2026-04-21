import React, { useState, useEffect } from 'react';
import { Gamepad2, Settings, LayoutDashboard, CheckCircle2, Edit3, Trash2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [view, setView] = useState('launcher');
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingGame, setEditingGame] = useState(null);

  useEffect(() => { fetchGames(); }, []);
  async function fetchGames() {
    const { data } = await supabase.from('games').select('*');
    if (data) setGames(data);
  }
  async function deleteGame(id) {
    await supabase.from('games').delete().match({ id });
    fetchGames();
  }
  async function saveGame(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const gameData = {
      title: formData.get('title'),
      description: formData.get('description'),
      image: formData.get('image'),
      install_url: formData.get('installUrl'),
      has_online_fix: formData.get('hasOnlineFix') === 'on',
      online_fix_url: formData.get('onlineFixUrl'),
    };
    if (editingGame) { await supabase.from('games').update(gameData).match({ id: editingGame.id }); }
    else { await supabase.from('games').insert([gameData]); }
    setShowModal(false); setEditingGame(null); fetchGames();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans">
      <nav className="fixed left-0 top-0 h-full w-20 bg-[#0f0f12] border-r border-white/5 flex flex-col items-center py-8 gap-8 z-50">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center"><Gamepad2 size={28} /></div>
        <button onClick={() => setView('launcher')} className="p-3 text-gray-500"><LayoutDashboard size={24} /></button>
        <button onClick={() => setView('admin')} className="p-3 text-gray-500"><Settings size={24} /></button>
        <button onClick={() => setIsAdmin(!isAdmin)} className={`mt-auto p-3 ${isAdmin ? 'text-green-400' : 'text-gray-600'}`}><CheckCircle2 size={24} /></button>
      </nav>
      <main className="pl-20 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{view === 'launcher' ? 'Game Hub' : 'Painel Admin'}</h1>
          {view === 'admin' && <button onClick={() => { setEditingGame(null); setShowModal(true); }} className="bg-blue-600 px-4 py-2 rounded"> + Adicionar </button>}
        </header>
        {view === 'launcher' && (
          <div className="grid grid-cols-4 gap-6">
            {games.map(game => (
              <div key={game.id} onClick={() => { setSelectedGame(game); setView('details'); }} className="bg-[#16161d] rounded-xl overflow-hidden cursor-pointer border border-white/5">
                <img src={game.image} className="w-full h-40 object-cover" />
                <div className="p-4"><h3 className="font-bold">{game.title}</h3></div>
              </div>
            ))}
          </div>
        )}
        {view === 'details' && selectedGame && (
          <div>
            <button onClick={() => setView('launcher')} className="mb-4 text-gray-400">← Voltar</button>
            <div className="flex gap-8">
              <img src={selectedGame.image} className="w-64 rounded-xl" />
              <div>
                <h2 className="text-4xl font-bold mb-2">{selectedGame.title}</h2>
                <p className="text-gray-400 mb-6">{selectedGame.description}</p>
                <a href={selectedGame.install_url} target="_blank" className="bg-blue-600 px-8 py-3 rounded-xl font-bold">Instalar Jogo</a>
              </div>
            </div>
          </div>
        )}
      </main>
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[100]">
          <form onSubmit={saveGame} className="bg-[#1c1c24] p-6 rounded-xl w-full max-w-md space-y-4 text-black">
            <h2 className="text-white text-xl font-bold">Novo Jogo</h2>
            <input name="title" placeholder="Nome" className="w-full p-2 rounded" required />
            <textarea name="description" placeholder="Descrição" className="w-full p-2 rounded" />
            <input name="image" placeholder="Link da Imagem" className="w-full p-2 rounded" />
            <input name="installUrl" placeholder="Link de Download" className="w-full p-2 rounded" required />
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded font-bold">Salvar</button>
            <button type="button" onClick={() => setShowModal(false)} className="w-full text-white text-sm">Cancelar</button>
          </form>
        </div>
      )}
    </div>
  );
}
