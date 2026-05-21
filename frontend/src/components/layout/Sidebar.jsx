import { Plus, FileSpreadsheet, Brain, LogOut, Sparkles, Trash2 } from 'lucide-react';

/* Simple relative time formatter (no external dependency) */
function timeAgo(isoString) {
  if (!isoString) return '';
  const now = new Date();
  const then = new Date(isoString);
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString();
}

export default function Sidebar({ user, handleSignOut, resetSession, session, sessions = [], onSelectSession, onDeleteSession }) {
  return (
    <aside className="w-56 flex flex-col border-r border-white/[0.06] bg-dv-sidebar shrink-0">
      {/* Brand Header */}
      <div className="px-5 py-5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
          <img src="/dataverse-logo.png" alt="DataVerse" className="w-8 h-8 object-contain" />
        </div>
        <span className="font-semibold text-txt-primary text-sm tracking-wide">DataVerse</span>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* CONTEXT Section */}
        <div>
          <p className="text-[11px] font-semibold text-txt-tertiary mb-3 px-2 uppercase tracking-widest">Context</p>
          <div className="space-y-0.5">
            {session ? (
              <div className="dv-sidebar-item active">
                <FileSpreadsheet className="w-4 h-4 shrink-0" />
                <span className="truncate">Active Dataset</span>
                <span className="w-1.5 h-1.5 rounded-full bg-sage-500 ml-auto shrink-0" />
              </div>
            ) : (
              <p className="text-xs text-txt-tertiary px-2 italic">No files uploaded</p>
            )}
            <button onClick={resetSession} className="dv-sidebar-item text-txt-tertiary hover:text-sage-300 mt-1 w-full text-left">
              <Plus className="w-4 h-4" />
              <span>New Analysis</span>
            </button>
          </div>
        </div>

        {/* RECENT SESSIONS Section (Real History) */}
        <div>
          <p className="text-[11px] font-semibold text-txt-tertiary mb-3 px-2 uppercase tracking-widest flex items-center gap-1.5">
            Recent Sessions
            <Brain className="w-3 h-3 text-sage-500" />
          </p>
          <div className="space-y-0.5">
            {sessions.length > 0 ? (
              sessions.map((s) => {
                const isActive = s.session_id === session;
                const displayName = s.filename
                  ? s.filename.replace(/^https?:\/\//, '').substring(0, 22)
                  : 'Dataset';
                return (
                  <div key={s.session_id} className={`group relative flex items-center w-full dv-sidebar-item ${isActive ? 'active' : ''}`}>
                    <button
                      onClick={() => onSelectSession?.(s.session_id)}
                      className="flex items-center gap-2 flex-1 min-w-0"
                      title={s.filename || s.session_id}
                    >
                      <FileSpreadsheet className="w-4 h-4 shrink-0" />
                      <span className="truncate text-left text-sm flex-1">{displayName}</span>
                      <span className="text-[10px] text-txt-tertiary shrink-0 group-hover:hidden">
                        {timeAgo(s.created_at)}
                      </span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession?.(s.session_id);
                      }}
                      className="hidden group-hover:flex items-center justify-center w-6 h-6 rounded hover:bg-white/[0.06] text-txt-tertiary hover:text-coral-500 transition-colors shrink-0 ml-1"
                      title="Delete Session"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-txt-tertiary px-2 italic">No past sessions</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Area */}
      <div className="p-3 border-t border-white/[0.06]">
        {/* Product Badge */}
        <div className="px-3 py-2.5 mb-3 rounded-lg bg-dv-elevated/60 border border-white/[0.04]">
          <p className="text-xs font-semibold text-txt-primary">DataVerse Pro</p>
          <p className="text-[10px] text-txt-tertiary mt-0.5">AI analytical workspace</p>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-2.5 px-2 py-2">
          <img
            src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email}&background=2e4a3a&color=7aab91&bold=true`}
            alt="Avatar"
            className="w-8 h-8 rounded-full border border-white/[0.08]"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-txt-primary truncate">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
            </p>
            <p className="text-[10px] text-sage-400">Pro Plan</p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-txt-tertiary hover:text-coral-500 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
