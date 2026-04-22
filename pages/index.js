import React, { useState, useEffect } from 'react';
import { Gamepad2, Settings, LayoutDashboard, CheckCircle2, Download, ArrowLeft, X, Trash2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
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
    const { data } = await supabase.from('games').select('*');
    if (data) setGames(data);
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

  if (!supabase) return <div className="bg-black h-screen flex items-center justify-center text-white">Configuração Pendente: Adicione as chaves no painel da Vercel.</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex">
      <nav className="w-20 bg-[#0f0f12] border-r border-white/5 flex flex-col items-center py-8 gap-8 fixed h-full z-50">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center"><Gamepad2 size={28} /></div>
        <button onClick={() => setView('launcher')} className="text-gray-500"><LayoutDashboard size={24} /></button>
        <button onClick={() => setView('admin')} className="text-gray-500"><Settings size={24} /></button>
        <button onClick={() => setIsAdmin(!isAdmin)} className={`mt-auto ${isAdmin ? 'text-green-400' : 'text-gray-600'}`}><CheckCircle2 size={24} /></button>
      </nav>

      <main className="ml-20 p-8 w-full">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-black">{view === 'launcher' ? 'BIBLIOTECA' : 'PAINEL ADMIN'}</h1>
          {view === 'admin' && isAdmin && (
            <button onClick={() => setShowModal(true)} className="bg-blue-600 px-6 py-2 rounded-lg font-bold"> + NOVO JOGO </button>
          )}
        </header>

        {view === 'launcher' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {games.map(game => (
              <div key={game.id} onClick={() => { setSelectedGame(game); setView('details'); }} className="bg-[#16161d] rounded-2xl overflow-hidden border border-white/5 cursor-pointer hover:border-blue-500 transition-all">
                <img src={game.image} className="w-full h-48 object-cover" />
                <div className="p-4"><h3 className="font-bold">{game.title}</h3></div>
              </div>
            ))}
          </div>
        )}

        {view === 'details' && selectedGame && (
          <div>
            <button onClick={() => setView('launcher')} className="text-gray-400 mb-6 flex items-center gap-2"><ArrowLeft size={20} /> Voltar</button>
            <div className="flex gap-10">
              <img src={selectedGame.image} className="w-80 rounded-2xl" />
              <div>
                <h2 className="text-5xl font-black mb-4">{selectedGame.title}</h2>
                <p className="text-gray-400 text-lg mb-8">{selectedGame.description}</p>
                <a href={selectedGame.install_url} target="_blank" className="bg-blue-600 px-10 py-4 rounded-xl font-bold text-xl">BAIXAR JOGO</a>
              </div>
            </div>
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[100]">
          <form onSubmit={saveGame} className="bg-[#1c1c24] p-8 rounded-3xl w-full max-w-lg space-y-4 text-black">
            <h2 className="text-white text-2xl font-bold">Cadastrar Jogo</h2>
            <input name="title" placeholder="Nome do Jogo" className="w-full p-3 rounded-xl" required />
            <textarea name="description" placeholder="Descrição" className="w-full p-3 rounded-xl h-24" />
            <input name="image" placeholder="Link da Imagem" className="w-full p-3 rounded-xl" />
            <input name="installUrl" placeholder="Link de Download" className="w-full p-3 rounded-xl" required />
            <button type="submit" className="w-full bg-blue-600 py-4 rounded-xl font-bold text-white">SALVAR</button>
            <button type="button" onClick={() => setShowModal(false)} className="w-full text-white">Cancelar</button>
          </form>
        </div>
      )}
    </div>
  );
}
