import React, { useState, useEffect } from 'react';
import { 
  Home, LayoutGrid, Library, Download, Settings, 
  Search, Heart, LogOut, Play, Star, Sparkles,
  Filter, Shield, Bell, User, Monitor, Palette, Plus, X, Trash2, Edit3, ChevronRight
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase (Variáveis de Ambiente da Vercel)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

export default function App() {
  const [view, setView] = useState('inicio'); 
  const [games, setGames] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dados dos Banners (Destaques Estáticos)
  const featuredGames = [
    {
      title: "Cyberpunk 2077",
      sub: "Phantom Liberty",
      tag: "Novo",
      genre: "Ação • RPG",
      desc: "Mergulhe em um novo thriller de espionagem. Torne-se um mercenário cibernético e infiltre-se no distrito mais perigoso de Night City.",
      img: "https://images.unsplash.com/photo-1605898962319-19451dba5093?q=80&w=2070"
    },
    {
      title: "Starfield",
      sub: "Constellation",
      tag: "Popular",
      genre: "Espaço • Exploração",
      desc: "Neste RPG de próxima geração ambientado entre as estrelas, crie qualquer personagem que desejar e explore com liberdade inigualável.",
      img: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=2070"
    }
  ];

  // --- BUSCA DE DADOS ---
  useEffect(() => {
    if (supabase) fetchGames();
  }, []);

  async function fetchGames() {
    setLoading(true);
    const { data } = await supabase.from('games').select('*').order('created_at', { ascending: false });
    if (data) setGames(data);
    setLoading(false);
  }

  // --- FUNÇÕES ADMIN ---
  async function handleSaveGame(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const gamePayload = {
      title: formData.get('title'),
      genre: formData.get('genre') || 'Ação • Aventura',
      image: formData.get('image'),
      install_url: formData.get('installUrl'),
      description: formData.get('description')
    };

    if (editingGame) {
      await supabase.from('games').update(gamePayload).eq('id', editingGame.id);
    } else {
      await supabase.from('games').insert([gamePayload]);
    }
    
    setShowModal(false);
    setEditingGame(null);
    fetchGames();
  }

  async function deleteGame(id) {
    if (confirm("Tens a certeza que queres eliminar este jogo?")) {
      await supabase.from('games').delete().eq('id', id);
      fetchGames();
    }
  }

  // --- ESTILOS GLOBAIS ---
  const GlobalStyles = () => (
    <style dangerouslySetInnerHTML={{ __html: `
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');
      body { font-family: 'Montserrat', sans-serif; background: #000; color: #fff; margin: 0; }
      .fade-in { animation: fadeIn 0.5s ease-out; }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      .glass { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.05); }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
    `}} />
  );

  if (!supabase) return <div className="h-screen flex items-center justify-center text-red-500">Erro: Configura as chaves do Supabase na Vercel.</div>;

  return (
    <div className="flex min-h-screen bg-black text-[#888]">
      <script src="https://cdn.tailwindcss.com"></script>
      <GlobalStyles />
      
      {/* SIDEBAR LATERAL */}
      <aside className="w-64 border-r border-white/5 flex flex-col bg-black fixed h-full z-50">
        <div className="p-10 pb-16">
          <div className="flex flex-col gap-1 cursor-pointer group" onClick={() => setView('inicio')}>
             <span className="text-white font-black text-3xl tracking-tighter leading-none italic group-hover:text-[#ff9d00] transition-colors">KRAKEN</span>
             <span className="text-[9px] text-zinc-700 tracking-[0.4em] font-black">PRO EDITION</span>
          </div>
        </div>
        <nav className="flex-1 px-5 space-y-1.5">
          {[
            { id: 'inicio', icon: Home, label: 'Início' },
            { id: 'catalogo', icon: LayoutGrid, label: 'Catálogo' },
            { id: 'biblioteca', icon: Library, label: 'Biblioteca' },
            { id: 'configuracoes', icon: Settings, label: 'Ajustes' }
          ].map(item => (
            <button key={item.id} onClick={() => setView(item.id)} className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-sm transition-all text-[9px] font-bold uppercase tracking-widest ${view === item.id ? 'bg-white/5 text-white' : 'hover:text-zinc-300'}`}>
              <item.icon size={16} className={view === item.id ? 'text-[#ff9d00]' : 'text-zinc-600'} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="px-5 mb-4">
           <button onClick={() => setIsAdmin(!isAdmin)} className={`w-full p-3 border border-white/5 rounded-sm flex items-center gap-3 transition-all ${isAdmin ? 'bg-[#ff9d00]/10 text-[#ff9d00]' : 'bg-black text-zinc-800'}`}>
              <Shield size={14} />
              <span className="text-[8px] font-black uppercase tracking-widest">Modo Admin</span>
           </button>
        </div>

        <div className="p-6 bg-[#050505] border-t border-white/5">
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 overflow-hidden">
                <img src="https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Admin" alt="Avatar" />
             </div>
             <div className="flex-1">
                <p className="text-[9px] font-black text-white uppercase tracking-tighter">Utilizador Pro</p>
                <p className="text-[7px] text-emerald-500 font-black uppercase">Online</p>
             </div>
          </div>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 ml-64 flex flex-col min-w-0 bg-black">
        {view === 'inicio' && (
          <div className="fade-in">
            {/* Banner Hero */}
            <div className="relative h-[55vh] w-full overflow-hidden border-b border-white/5">
               <img src={featuredGames[0].img} className="w-full h-full object-cover opacity-50" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
               <div className="absolute bottom-12 left-12">
                  <span className="bg-[#ff9d00] text-black text-[8px] font-black px-2 py-0.5 rounded-sm uppercase mb-4 inline-block">Destaque</span>
                  <h1 className="text-6xl font-black italic uppercase tracking-tighter text-white mb-4 leading-none">Cyberpunk 2077</h1>
                  <button className="bg-white text-black text-[10px] font-black px-10 py-4 flex items-center gap-2 hover:bg-[#ff9d00] transition-all">
                    <Play size={14} fill="currentColor" /> JOGAR AGORA
                  </button>
               </div>
            </div>

            {/* Grid de Jogos Recentes */}
            <div className="p-12">
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 flex items-center gap-3">
                    <Sparkles size={14} className="text-[#ff9d00]" /> Lançamentos na Base
                  </h2>
                  {isAdmin && (
                    <button onClick={() => { setEditingGame(null); setShowModal(true); }} className="bg-[#ff9d00] text-black text-[8px] font-black px-4 py-2 uppercase tracking-widest flex items-center gap-2">
                      <Plus size={12} /> Adicionar
                    </button>
                  )}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {games.map(game => (
                    <div key={game.id} className="group relative aspect-video glass rounded-sm overflow-hidden cursor-pointer">
                       <img src={game.image} className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                       
                       {isAdmin && (
                         <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={(e) => { e.stopPropagation(); setEditingGame(game); setShowModal(true); }} className="p-1.5 bg-black/50 hover:bg-[#ff9d00] text-white hover:text-black transition-all"><Edit3 size={12}/></button>
                            <button onClick={(e) => { e.stopPropagation(); deleteGame(game.id); }} className="p-1.5 bg-black/50 hover:bg-red-600 text-white transition-all"><Trash2 size={12}/></button>
                         </div>
                       )}

                       <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                          <div>
                            <p className="text-[10px] font-black text-white uppercase tracking-wider">{game.title}</p>
                            <p className="text-[7px] font-bold text-zinc-500 uppercase">{game.genre || 'Ação • RPG'}</p>
                          </div>
                          <div className="bg-[#ff9d00] p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                             <Play size={10} className="text-black" fill="currentColor" />
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {/* Outras vistas podem ser adicionadas aqui (Configurações, Catálogo, etc) */}
        {view === 'configuracoes' && (
          <div className="p-20 fade-in">
             <h1 className="text-4xl font-black italic uppercase text-white mb-10 tracking-tighter">Ajustes</h1>
             <div className="grid grid-cols-2 gap-4 max-w-2xl">
                <div className="glass p-8 flex flex-col gap-2 hover:border-[#ff9d00]/30 transition-all group">
                   <Monitor size={24} className="text-[#ff9d00]" />
                   <span className="text-[10px] font-black uppercase text-white mt-4">Interface do Launcher</span>
                   <span className="text-[8px] font-bold text-zinc-600 uppercase">Personalizar Cores e Escala</span>
                </div>
                <div className="glass p-8 flex flex-col gap-2 hover:border-[#ff9d00]/30 transition-all group">
                   <Palette size={24} className="text-[#ff9d00]" />
                   <span className="text-[10px] font-black uppercase text-white mt-4">Tema Industrial</span>
                   <span className="text-[8px] font-bold text-zinc-600 uppercase">Activo: Kraken Sombrio</span>
                </div>
             </div>
          </div>
        )}

        {/* MODAL ADMIN */}
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-10 bg-black/95 backdrop-blur-sm fade-in">
             <div className="glass w-full max-w-md p-10 relative bg-black/80">
                <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-zinc-600 hover:text-white transition-colors"><X /></button>
                <h2 className="text-xl font-black italic uppercase text-[#ff9d00] mb-8 tracking-tighter">
                  {editingGame ? 'Editar Registo' : 'Novo Artefato'}
                </h2>
                <form onSubmit={handleSaveGame} className="space-y-4">
                   <div className="space-y-1">
                      <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest ml-1">Nome do Jogo</label>
                      <input name="title" defaultValue={editingGame?.title} required className="w-full bg-white/5 border border-white/10 p-3 text-[10px] font-bold text-white outline-none focus:border-[#ff9d00]/50 transition-all" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest ml-1">URL da Imagem (Capa)</label>
                      <input name="image" defaultValue={editingGame?.image} required className="w-full bg-white/5 border border-white/10 p-3 text-[10px] font-bold text-white outline-none focus:border-[#ff9d00]/50 transition-all" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest ml-1">Link de Instalação</label>
                      <input name="installUrl" defaultValue={editingGame?.install_url} required className="w-full bg-white/5 border border-white/10 p-3 text-[10px] font-bold text-white outline-none focus:border-[#ff9d00]/50 transition-all" />
                   </div>
                   <button type="submit" className="w-full bg-[#ff9d00] text-black p-4 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white transition-all mt-6 shadow-lg shadow-[#ff9d00]/10">
                      SINCRONIZAR COM A BASE
                   </button>
                </form>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
