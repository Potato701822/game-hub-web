import React from 'react';
import { Home, LayoutGrid, Library, Download, Settings } from 'lucide-react';

const Sidebar = ({ activeView, setView, downloadCount }) => {
  const menuItems = [
    { id: 'inicio', icon: Home, label: 'Início' },
    { id: 'catalogo', icon: LayoutGrid, label: 'Catálogo' },
    { id: 'biblioteca', icon: Library, label: 'Biblioteca' },
    { id: 'downloads', icon: Download, label: 'Downloads', badge: downloadCount },
    { id: 'configuracoes', icon: Settings, label: 'Ajustes' }
  ];

  return (
    <aside className="w-64 border-r border-white/5 flex flex-col bg-black fixed h-full z-50">
      <div className="p-10 pb-16">
        <div className="flex flex-col gap-1 cursor-pointer group" onClick={() => setView('inicio')}>
          <span className="text-white font-black text-3xl tracking-tighter italic group-hover:text-[#ff9d00] transition-colors">KRAKEN</span>
          <span className="text-[9px] text-zinc-700 tracking-[0.4em] font-black uppercase">FGSTUDIOS</span>
        </div>
      </div>
      <nav className="flex-1 px-5 space-y-1.5">
        {menuItems.map(item => (
          <button 
            key={item.id} 
            onClick={() => setView(item.id)} 
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-sm transition-all text-[9px] font-bold uppercase tracking-widest relative ${activeView === item.id ? 'bg-white/5 text-white shadow-[inset_4px_0_0_#ff9d00]' : 'hover:text-zinc-300 text-zinc-500'}`}
          >
            <item.icon size={16} className={activeView === item.id ? 'text-[#ff9d00]' : 'text-zinc-600'} />
            <span>{item.label}</span>
            {item.badge > 0 && (
              <span className="absolute right-4 w-4 h-4 bg-[#ff9d00] text-black text-[7px] font-black rounded-full flex items-center justify-center animate-pulse">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
