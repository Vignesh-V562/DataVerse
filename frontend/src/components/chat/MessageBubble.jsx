import { useMemo } from 'react';
import { Check, ThumbsUp, ThumbsDown, MoreHorizontal, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PlotlyChart from './PlotlyChart';
import DatasetSummary from './DatasetSummary';

/* ─── Markdown component overrides for DataVerse dark theme ─── */
const markdownComponents = {
  table: ({ node, ...props }) => (
    <div className="my-3 overflow-x-auto rounded-lg border border-white/[0.06]">
      <table className="w-full text-xs" {...props} />
    </div>
  ),
  thead: ({ node, ...props }) => <thead className="bg-dv-elevated/40" {...props} />,
  th: ({ node, ...props }) => (
    <th className="text-left px-3 py-2 text-txt-tertiary font-medium border-b border-white/[0.06] whitespace-nowrap" {...props} />
  ),
  td: ({ node, ...props }) => (
    <td className="px-3 py-2 text-txt-secondary border-b border-white/[0.03] whitespace-nowrap" {...props} />
  ),
  tr: ({ node, ...props }) => (
    <tr className="hover:bg-white/[0.02] transition-colors" {...props} />
  ),
  strong: ({ node, ...props }) => <strong className="font-semibold text-txt-primary" {...props} />,
  em: ({ node, ...props }) => <em className="italic text-sage-300" {...props} />,
  code: ({ node, inline, className, ...props }) =>
    inline ? (
      <code className="bg-dv-elevated/60 px-1.5 py-0.5 rounded text-sage-300 text-[11px] font-mono" {...props} />
    ) : (
      <code className="block bg-dv-bg/80 p-3 rounded-lg text-sage-300 text-xs font-mono overflow-x-auto" {...props} />
    ),
  pre: ({ node, ...props }) => <pre className="bg-dv-bg/80 rounded-lg overflow-x-auto my-3" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 my-2 ml-1" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-1 my-2 ml-1" {...props} />,
  li: ({ node, ...props }) => <li className="text-txt-secondary leading-relaxed" {...props} />,
  p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
  h1: ({ node, ...props }) => <h1 className="text-lg font-bold text-txt-primary mb-2 mt-3" {...props} />,
  h2: ({ node, ...props }) => <h2 className="text-base font-bold text-txt-primary mb-2 mt-3" {...props} />,
  h3: ({ node, ...props }) => <h3 className="text-sm font-semibold text-txt-primary mb-1 mt-2" {...props} />,
  a: ({ node, ...props }) => <a className="text-sage-400 hover:text-sage-300 underline underline-offset-2" {...props} />,
  blockquote: ({ node, ...props }) => (
    <blockquote className="border-l-2 border-sage-500/30 pl-4 my-2 text-txt-secondary italic" {...props} />
  ),
  hr: () => <hr className="border-white/[0.06] my-4" />,
};

export default function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  /* Defensive Plotly data parsing */
  const plotData = useMemo(() => {
    if (!msg.plot_json) return null;
    if (typeof msg.plot_json === 'string') {
      try {
        return JSON.parse(msg.plot_json);
      } catch {
        return null;
      }
    }
    return msg.plot_json;
  }, [msg.plot_json]);

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : ''} animate-fade-in`}>
      {/* AI Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-sage-600/15 border border-sage-500/20 flex items-center justify-center shrink-0 mt-1 shadow-sage-glow">
          <Sparkles className="w-3.5 h-3.5 text-sage-400" />
        </div>
      )}

      {isUser ? (
        /* ─── User Message: Sage green pill ─── */
        <div className="flex items-end gap-2 max-w-[70%]">
          <div className="bg-sage-800 border border-sage-700/30 rounded-2xl rounded-br-md px-5 py-3">
            <p className="text-sm text-sage-300 leading-relaxed">{msg.content}</p>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-txt-tertiary shrink-0 pb-1">
            <span>{timestamp}</span>
            <Check className="w-3 h-3 text-sage-500" />
          </div>
        </div>
      ) : (
        /* ─── AI Message: Dark structured card ─── */
        <div className="max-w-[85%] space-y-3">
          {msg.isTyping ? (
            <div className="dv-card px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sage-500 animate-pulse-dot" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-sage-500 animate-pulse-dot" style={{ animationDelay: '200ms' }} />
                  <span className="w-2 h-2 rounded-full bg-sage-500 animate-pulse-dot" style={{ animationDelay: '400ms' }} />
                </div>
                <span className="text-sm text-txt-secondary">Analyzing your data...</span>
              </div>
            </div>
          ) : (
            <div className="dv-card px-5 py-4">
              {/* Timestamp */}
              <div className="flex items-center justify-end mb-2">
                <span className="text-[10px] text-txt-tertiary">{timestamp}</span>
              </div>

              {/* Dataset Summary (if present) */}
              {msg.summary && <DatasetSummary summary={msg.summary} />}

              {/* Markdown Content */}
              {msg.content && (
                <div className="text-sm text-txt-secondary">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {msg.content.length > 5000 
                      ? msg.content.substring(0, 5000) + '\n\n... *(Content truncated: Too large to display. This usually happens if raw chart data was accidentally included in the text.)*'
                      : msg.content}
                  </ReactMarkdown>
                </div>
              )}

              {/* Inline Plotly Chart */}
              {plotData && plotData.data && (
                <div className="mt-4 rounded-lg overflow-hidden bg-dv-bg/50 border border-white/[0.04] p-2">
                  <PlotlyChart
                    data={plotData.data}
                    layout={plotData.layout}
                    style={{ width: '100%', height: '370px' }}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-1 mt-4 pt-3 border-t border-white/[0.04]">
                <button className="dv-rail-btn w-7 h-7 hover:text-sage-400" title="Helpful">
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>
                <button className="dv-rail-btn w-7 h-7 hover:text-coral-500" title="Not helpful">
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
                <div className="flex-1" />
                <button className="dv-rail-btn w-7 h-7" title="More actions">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
