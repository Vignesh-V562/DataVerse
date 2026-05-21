import { Home, MessageSquare, Layers, Bookmark, Settings } from 'lucide-react';

export default function IconRail({ onHomeClick }) {
  return (
    <div className="w-14 hidden md:flex flex-col items-center py-4 bg-dv-bg border-r border-white/[0.06] shrink-0">
      {/* Brand Logo */}
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-8 overflow-hidden">
        <img src="/dataverse-logo.png" alt="DataVerse" className="w-9 h-9 object-contain" />
      </div>

      {/* Navigation Icons */}
      <div className="flex flex-col gap-2 flex-1">
        <button className="dv-rail-btn" title="Home — New Conversation" onClick={onHomeClick}>
          <Home className="w-[18px] h-[18px]" />
        </button>
        <button className="dv-rail-btn active" title="Chat">
          <MessageSquare className="w-[18px] h-[18px]" />
        </button>
        <button className="dv-rail-btn" title="Layers">
          <Layers className="w-[18px] h-[18px]" />
        </button>
        <button className="dv-rail-btn" title="Bookmarks">
          <Bookmark className="w-[18px] h-[18px]" />
        </button>
      </div>

      {/* Bottom Settings */}
      <button className="dv-rail-btn" title="Settings">
        <Settings className="w-[18px] h-[18px]" />
      </button>
    </div>
  );
}
