import React, { useState, useEffect } from 'react';
import { 
  Home, LayoutGrid, Library, Download, Settings, 
  Search, Heart, LogOut, ChevronDown, ListFilter,
  Grid2X2, RotateCw, Clock, Trophy, Play, Star, Sparkles,
  Filter, Zap, Flame, Calendar, ChevronLeft, ChevronRight,
  Shield, Bell, User, Monitor, Palette
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, query, onSnapshot, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'kraken-minimal-pro';

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('inicio'); 
  const [games, setGames] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

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
    },
    {
      title: "Elden Ring",
      sub: "Shadow of the Erdtree",
      tag: "Destaque",
      genre: "Souls-like • Fantasia",
      desc: "Levante-se, Maculado, e seja guiado pela graça para empunhar o poder do Anel Prístino e se tornar um Lorde Prístino nas Terras Intermédias.",
      img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070"
    }
  ];

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) { console.error(err); }
    };
    initAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, setUser);
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    const gamesRef = collection(db, 'artifacts', appId, 'public', 'data', 'games');
    const unsubscribeGames = onSnapshot(gamesRef, (snapshot) => {
      setGames(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => console.error(err));

    const favsRef = collection(db, 'artifacts', appId, 'users', user.uid, 'favorites');
    const unsubscribeFavs = onSnapshot(favsRef, (snapshot) => {
      setFavorites(snapshot.docs.map(doc => doc.id));
    }, (err) => console.error(err));

    return () => { unsubscribeGames(); unsubscribeFavs(); };
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % featuredGames.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [featuredGames.length]);

  const toggleFavorite = async (gameId) => {
    if (!user) return;
    const favRef = doc(db, 'artifacts', appId, 'users', user.uid, 'favorites', gameId);
    if (favorites.includes(gameId)) {
      await deleteDoc(favRef);
    } else {
      await setDoc(favRef, { favoritedAt: new Date() });
    }
  };

  const GlobalStyles = () => (
    <style dangerouslySetInnerHTML={{ __html: `
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');
      body { font-family: 'Montserrat', sans-serif; background: #000; color: #fff; margin: 0; overflow: hidden; }
      .fade-in { animation: fadeIn 0.4s ease-out forwards; }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      .banner-transition { transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1); }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
    `}} />
  );

  const RenderInicio = () => (
    <div className="flex-1 overflow-y-auto bg-black fade-in scroll-smooth">
      {/* Banner Principal - Reduzido para 50vh para melhor visibilidade da grade */}
      <div className="relative h-[50vh] w-full overflow-hidden border-b border-white/5">
        {featuredGames.map((game, idx) => (
          <div 
            key={idx}
            className={`absolute inset-0 banner-transition ${idx === activeBannerIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent z-10" />
            <img src={game.img} className="w-full h-full object-cover" alt={game.title} />
            <div className="absolute bottom-12 left-12 z-20 max-w-2xl">
              <div className="flex items-center gap-3 mb-3">
                 <span className="bg-[#ff9d00] text-black text-[8px] font-black px-2 py-0.5 rounded-sm uppercase tracking-tighter">{game.tag}</span>
                 <span className="text-zinc-300 text-[9px] font-bold uppercase tracking-widest">{game.genre}</span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter mb-2 italic uppercase leading-none text-white">
                {game.title} <br/> <span className="text-zinc-500">{game.sub}</span>
              </h1>
              <p className="text-[10px] text-zinc-400 leading-relaxed mb-6 font-medium max-w-md opacity-80">
                {game.desc}
              </p>
              <div className="flex items-center gap-4">
                <button className="bg-white text-black text-[9px] font-black px-8 py-3.5 flex items-center gap-2 hover:bg-[#ff9d00] transition-all">
                  <Play size={14} fill="currentColor" /> JOGAR AGORA
                </button>
                <div className="flex gap-1.5">
                  {featuredGames.map((_, dotIdx) => (
                    <div 
                      key={dotIdx} 
                      onClick={() => setActiveBannerIndex(dotIdx)}
                      className={`h-1 transition-all cursor-pointer ${dotIdx === activeBannerIndex ? 'w-6 bg-[#ff9d00]' : 'w-1.5 bg-white/20 hover:bg-white/40'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Grid de Games */}
      <div className="p-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Sparkles size={14} className="text-[#ff9d00]" />
            <h2 className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/90">Sua Coleção & Destaques</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {(games.length > 0 ? games.slice(0, 12) : Array.from({length: 12}, (_, i) => ({id: `mock-${i}`}))).map((g, idx) => (
             <div key={g.id} className="relative aspect-video rounded-sm border border-white/5 overflow-hidden group cursor-pointer bg-zinc-900/40">
                <img 
                  src={g.banner || g.image || `https://api.dicebear.com/7.x/abstract/svg?seed=start-${idx}`} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" 
                  alt={g.title || "Game"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                   <div>
                     <p className="text-[9px] font-black text-white tracking-wider uppercase mb-0.5">{g.title || 'Carregando...'}</p>
                     <p className="text-[7px] font-bold text-zinc-500 uppercase tracking-tighter">Ação • Aventura</p>
                   </div>
                   <div className="bg-white/5 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={8} className="text-[#ff9d00]" fill="currentColor" />
                   </div>
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );

  const RenderGridPage = ({ title, icon: Icon, isCatalog = false }) => {
    const filteredGames = games.length > 0 
      ? games.filter(g => g.title?.toLowerCase().includes(searchTerm.toLowerCase()))
      : Array.from({ length: 16 }, (_, i) => ({ id: `mock-${i}`, title: 'Carregando...' }));

    return (
      <div className="flex-1 flex flex-col min-w-0 bg-[#080808] fade-in">
        <header className="h-14 flex items-center justify-between px-8 border-b border-white/5 bg-black/40">
           <div className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest">
              <Icon size={14} className="text-[#ff9d00]"/> {title}
           </div>
           <div className="relative group">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input 
                type="text" 
                placeholder={`BUSCAR...`} 
                className="bg-zinc-900/40 border border-white/5 text-[9px] font-bold pl-9 pr-4 py-2 rounded-sm w-64 outline-none focus:border-[#ff9d00]/30 transition-all" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
           </div>
        </header>

        <div className="px-8 py-4 flex items-center gap-3 bg-black/20">
            <div className="flex items-center gap-2 text-[9px] bg-zinc-900/80 px-4 py-2 border border-white/5 rounded-sm">
               <Filter size={12} className="text-zinc-600" />
               <span className="text-white font-bold uppercase">Gêneros</span>
            </div>
            {!isCatalog && (
               <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest ml-auto">
                 {games.length} Itens na Coleção
               </div>
            )}
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8">
           <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-x-6 gap-y-10">
              {filteredGames.map((game) => (
                <div key={game.id} className="group cursor-pointer">
                  <div className="aspect-[2/3] relative rounded-sm overflow-hidden border border-white/5 bg-zinc-900 transition-all duration-300 group-hover:border-[#ff9d00]/50 group-hover:-translate-y-1.5">
                     <img 
                       src={game.image || `https://api.dicebear.com/7.x/shapes/svg?seed=${game.id}`} 
                       className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all" 
                     />
                     
                     {isCatalog && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleFavorite(game.id); }}
                          className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md rounded-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-[#ff9d00] hover:text-black"
                        >
                          <Heart size={12} fill={favorites.includes(game.id) ? "currentColor" : "none"} />
                        </button>
                     )}

                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-[#ff9d00] text-black p-2.5 rounded-full shadow-xl">
                           <Play size={18} fill="currentColor" />
                        </div>
                     </div>
                  </div>
                  <div className="mt-3 px-1">
                    <p className="text-[9px] font-black text-zinc-400 group-hover:text-white transition-colors truncate uppercase tracking-widest">{game.title}</p>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    );
  };

  const RenderAjustes = () => (
    <div className="flex-1 overflow-y-auto bg-[#0a0a0a] p-12 fade-in">
      <div className="max-w-4xl">
        <header className="mb-10">
          <h1 className="text-3xl font-black italic uppercase text-white mb-2 tracking-tighter">Ajustes do Sistema</h1>
          <div className="h-1 w-12 bg-[#ff9d00]"></div>
        </header>

        <div className="grid gap-6">
          <section className="bg-zinc-900/40 border border-white/5 rounded-xl p-8">
            <div className="flex items-center gap-4 mb-8">
              <User size={20} className="text-[#ff9d00]" />
              <h2 className="text-[10px] font-black uppercase tracking-widest text-white/90">Conta & Perfil</h2>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-[#ff9d00]/20 flex items-center justify-center overflow-hidden">
                 <img src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${user?.uid || 'guest'}`} alt="Avatar" />
              </div>
              <div className="space-y-1">
                <p className="text-white font-black uppercase text-lg">Potato7846</p>
                <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-tighter">Membro desde Abril 2024</p>
                <button className="text-[#ff9d00] text-[9px] font-black uppercase hover:underline mt-2 block">Editar Perfil</button>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Monitor, label: "Interface", desc: "Escala e Temas" },
              { icon: Bell, label: "Notificações", desc: "Alertas de Updates" },
              { icon: Shield, label: "Privacidade", desc: "Gerenciar Visibilidade" },
              { icon: Palette, label: "Aparência", desc: "Cores e Efeitos" }
            ].map((item, i) => (
              <div key={i} className="bg-zinc-900/40 border border-white/5 rounded-xl p-5 hover:border-[#ff9d00]/30 transition-all group">
                <item.icon size={18} className="text-zinc-500 group-hover:text-[#ff9d00] mb-3 transition-colors" />
                <h3 className="text-[9px] font-black text-white uppercase mb-1">{item.label}</h3>
                <p className="text-[8px] text-zinc-500 font-bold uppercase mb-4 leading-relaxed">{item.desc}</p>
                <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-sm">
                  <span className="text-[8px] font-black uppercase">Configurar</span>
                  <ChevronRight size={12} className="text-[#ff9d00]" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
            <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest">Kraken Launcher v2.4.0-pro</p>
            <button onClick={() => signOut(auth)} className="flex items-center gap-2 text-red-500/50 hover:text-red-500 text-[9px] font-black uppercase transition-colors">
              <LogOut size={12} /> Sair da Conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-black text-[#888]">
      <GlobalStyles />
      <aside className="w-64 border-r border-white/5 flex flex-col bg-black z-50">
        <div className="p-10 pb-16">
          <div className="flex flex-col gap-1 cursor-pointer group" onClick={() => setView('inicio')}>
             <span className="text-white font-black text-3xl tracking-tighter leading-none italic group-hover:text-[#ff9d00] transition-colors">KRAKEN</span>
             <span className="text-[9px] text-zinc-700 tracking-[0.4em] font-black">FGSTUDIOS</span>
          </div>
        </div>
        <nav className="flex-1 px-5 space-y-1.5">
          {[
            { id: 'inicio', icon: Home, label: 'Início' },
            { id: 'catalogo', icon: LayoutGrid, label: 'Catálogo' },
            { id: 'biblioteca', icon: Library, label: 'Biblioteca' },
            { id: 'downloads', icon: Download, label: 'Downloads' },
            { id: 'configuracoes', icon: Settings, label: 'Ajustes' }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-sm transition-all text-[9px] font-bold uppercase tracking-widest ${view === item.id ? 'bg-white/5 text-white' : 'hover:text-zinc-300'}`}
            >
              <item.icon size={16} className={view === item.id ? 'text-[#ff9d00]' : 'text-zinc-600'} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-6 bg-[#050505] border-t border-white/5">
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${user?.uid || 'guest'}`} alt="Avatar" />
             </div>
             <div className="flex-1">
                <p className="text-[9px] font-black text-white uppercase">Potato7846</p>
                <p className="text-[7px] text-emerald-500 font-black uppercase">Online</p>
             </div>
             <button onClick={() => signOut(auth)} className="text-zinc-700 hover:text-white"><LogOut size={14}/></button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 relative">
        {view === 'inicio' && <RenderInicio />}
        {view === 'catalogo' && <RenderGridPage title="Catálogo" icon={LayoutGrid} isCatalog={true} />}
        {view === 'biblioteca' && <RenderGridPage title="Biblioteca" icon={Library} isCatalog={false} />}
        {view === 'downloads' && (
          <div className="flex-1 flex items-center justify-center bg-black">
            <p className="text-[9px] font-black text-zinc-800 tracking-[0.5em] uppercase">Sem downloads ativos</p>
          </div>
        )}
        {view === 'configuracoes' && <RenderAjustes />}
      </main>
    </div>
  );
}
