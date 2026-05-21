import { BarChart3, Download, MoreHorizontal, Maximize2 } from 'lucide-react';
import PlotlyChart from '../chat/PlotlyChart';

export default function InsightsPanel({ charts = [] }) {
  return (
    <aside className="w-80 border-l border-white/[0.06] bg-dv-bg flex-col shrink-0 hidden lg:flex">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-5 border-b border-white/[0.06] shrink-0">
        <span className="text-[11px] font-semibold text-txt-tertiary uppercase tracking-widest">
          Insights Surface
        </span>
        <div className="flex items-center gap-1">
          <button className="dv-rail-btn w-7 h-7">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Charts Stack */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {charts.length > 0 ? (
          charts.map((chart, idx) => (
            <div key={idx} className="dv-card p-3 animate-fade-in">
              {/* Chart Title Bar */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-txt-primary truncate pr-2">
                  {chart.title || `Chart ${idx + 1}`}
                </span>
                <div className="flex items-center gap-0.5 shrink-0">
                  <button className="dv-rail-btn w-6 h-6">
                    <Download className="w-3 h-3" />
                  </button>
                  <button className="dv-rail-btn w-6 h-6">
                    <MoreHorizontal className="w-3 h-3" />
                  </button>
                </div>
              </div>
              {/* Plotly Chart */}
              <PlotlyChart
                data={chart.data}
                layout={chart.layout}
                style={{ width: '100%', height: '200px' }}
              />
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-14 h-14 bg-sage-600/10 rounded-2xl flex items-center justify-center mb-5 border border-sage-500/10">
              <BarChart3 className="w-7 h-7 text-sage-500/40" />
            </div>
            <p className="text-sm font-medium text-txt-secondary mb-1.5">No insights yet</p>
            <p className="text-xs text-txt-tertiary leading-relaxed">
              Charts and visualizations will appear here as you analyze your data.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
