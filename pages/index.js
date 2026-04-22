import React, { useState, useEffect } from 'react';
import { Gamepad2, Settings, LayoutDashboard, CheckCircle2, Download, ArrowLeft, X, Trash2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Configuração do cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

export default function App() {
  const [view, setView] = useState('launcher');
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (supabase) fetchGames();
  }, []);

  async function fetchGames() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('games').select('*');
      if (error) throw error;
      if (data) setGames(data);
    } catch (err) {
      console.error("Erro ao carregar jogos:", err.message);
    } finally {
      setLoading(false);
    }
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

    try {
      const { error } = await supabase.from('games').insert([gameData]);
      if (error) throw error;
      setShowModal(false);
      fetchGames();
    } catch (err) {
      alert("Erro ao salvar: " + err.message);
    }
  }

  if (!supabase) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-10 text-center">
        <div>
          <h1 className="text-red-500 text-2xl font-bold mb-4">Atenção!</h1>
          <p>Faltam as chaves do Supabase na Vercel (Environment Variables).</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans flex">
      {/* Menu Lateral */}
      <nav className="w-20 bg-[#0f0f12] border-r border-white/5 flex flex-col items-center py-8 gap-8 fixed h-full z-50">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
          <Gamepad2 size={28} />
        </div>
        <button onClick={() => setView('launcher')} className={`p-3 rounded-xl transition ${view === 'launcher' ? 'text-blue-400 bg-white/5' : 'text-gray-500 hover:text-white'}`}>
          <LayoutDashboard size={24} />
        </button>
        <button onClick={() => setView('admin')} className={`p-3 rounded-xl transition ${view === 'admin' ? 'text-purple-400 bg-white/5' : 'text-gray-500 hover:text-white'}`}>
          <Settings size={24} />
        </button>
        <button onClick={() => setIsAdmin(!isAdmin)} className={`mt-auto p-3 transition ${isAdmin ? 'text-green-400' : 'text-gray-600'}`}>
          <CheckCircle2 size={24} />
        </button>
      </nav>

      {/* Área de Conteúdo */}
      <main className="flex-1 ml-20 p-8">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-black">{view === 'launcher' ? 'MINHA BIBLIOTECA' : 'PAINEL DE CONTROLO'}</h1>
          {view === 'admin' && isAdmin && (
            <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-bold transition"> + NOVO JOGO </button>
          )}
        </header>

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div></div>
        ) : (
          <>
            {view === 'launcher' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {games.map(game => (
                  <div key={game.id} onClick={() => { setSelectedGame(game); setView('details'); }} className="bg-[#16161d] rounded-2xl overflow-hidden border border-white/5 cursor-pointer hover:border-blue-500 transition-all">
                    <img src={game.image || 'https://via.placeholder.com/400x225'} className="w-full h-48 object-cover" alt={game.title} />
                    <div className="p-4"><h3 className="font-bold text-lg truncate">{game.title}</h3></div>
                  </div>
                ))}
              </div>
            )}

            {view === 'details' && selectedGame && (
              <div className="max-w-4xl">
                <button onClick={() => setView('launcher')} className="flex items-center gap-2 text-gray-400 mb-6 hover:text-white transition"><ArrowLeft size={20} /> Voltar</button>
                <div className="flex flex-col md:flex-row gap-10 bg-[#16161d] p-8 rounded-3xl">
                  <img src={selectedGame.image} className="w-full md:w-72 rounded-2xl shadow-2xl" alt={selectedGame.title} />
                  <div className="flex-1">
                    <h2 className="text-5xl font-black mb-4">{selectedGame.title}</h2>
                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">{selectedGame.description || "Sem descrição disponível."}</p>
                    <a href={selectedGame.install_url} target="_blank" rel="noreferrer" className="inline-flex bg-blue-600 px-10 py-4 rounded-xl font-bold text-xl hover:bg-blue-700 transition">
                      BAIXAR AGORA
                    </a>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal de Cadastro */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[100] backdrop-blur-sm">
          <form onSubmit={saveGame} className="bg-[#1c1c24] p-8 rounded-3xl w-full max-w-lg space-y-4 border border-white/10">
            <div className="flex justify-between items-center text-white mb-2">
              <h2 className="text-2xl font-bold">Adicionar Jogo</h2>
              <button type="button" onClick={() => setShowModal(false)}><X /></button>
            </div>
            <input name="title" placeholder="Título do Jogo" className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-blue-500" required />
            <textarea name="description" placeholder="Descrição" className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white h-24 outline-none focus:border-blue-500" />
            <input name="image" placeholder="URL da Imagem (Capa)" className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-blue-500" />
            <input name="installUrl" placeholder="Link de Download" className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-blue-500" required />
            <button type="submit" className="w-full bg-blue-600 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition">SALVAR JOGO</button>
          </form>
        </div>
      )}
    </div>
  );
}
