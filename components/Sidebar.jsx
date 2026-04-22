import React from 'react';
import { Home, LayoutGrid, Library, Download, Settings, User } from 'lucide-react';

export default function Sidebar({ activeView, setView, downloadCount }) {
  const menuItems = [
    { id: 'inicio', icon: Home, label: 'Início' },
    { id: 'catalogo', icon: LayoutGrid, label: 'Catálogo' },
    { id: 'biblioteca', icon: Library, label: 'Biblioteca' },
    { id: 'downloads', icon: Download, label: 'Downloads', badge: downloadCount },
    { id: 'configuracoes', icon: Settings, label: 'Ajustes' },
  ];

  return (
    <aside className="w-72 bg-[#050505] border-r border-white/[0.03] flex flex-col fixed h-full z-50">
      <div className="p-12 mb-8">
        <div className="flex flex-col cursor-pointer" onClick={() => setView('inicio')}>
          <span className="text-white font-black text-4xl tracking-tighter italic leading-none">KRAKEN</span>
          <span className="text-[8px] text-zinc-600 tracking-[0.5em] font-black uppercase mt-1">FGSTUDIOS</span>
        </div>
      </div>
      <nav className="flex-1 px-8 space-y-2">
        {menuItems.map(item => (
          <button key={item.id} onClick={() => setView(item.id)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-sm transition-all text-[10px] font-black uppercase tracking-[0.2em] relative ${activeView === item.id ? 'bg-white/[0.03] text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>
            <item.icon size={18} className={activeView === item.id ? 'text-[#ff9d00]' : 'text-zinc-800'} />
            <span>{item.label}</span>
            {item.badge > 0 && <span className="ml-auto bg-[#ff9d00] text-black w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black">{item.badge}</span>}
          </button>
        ))}
      </nav>
      <div className="p-8 border-t border-white/[0.03] flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center"><User size={20} className="text-zinc-700" /></div>
        <div className="flex-1"><p className="text-[10px] font-black text-white uppercase tracking-wider">POTATO</p><p className="text-[8px] text-emerald-500 font-black uppercase">Online</p></div>
      </div>
    </aside>
  );
}
