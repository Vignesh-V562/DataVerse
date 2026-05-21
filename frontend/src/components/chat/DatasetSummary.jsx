import { Database, Columns3 } from 'lucide-react';

export default function DatasetSummary({ summary }) {
  if (!summary) return null;

  const { total_rows, total_columns, columns, data_types, null_counts, preview } = summary;

  return (
    <div className="space-y-4 mt-2">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-dv-elevated/60 rounded-lg px-4 py-3 border border-white/[0.04]">
          <div className="flex items-center gap-2 mb-1">
            <Database className="w-3.5 h-3.5 text-sage-400" />
            <span className="text-[10px] text-txt-tertiary uppercase tracking-wider">Records</span>
          </div>
          <p className="text-2xl font-bold text-sage-300">{total_rows?.toLocaleString()}</p>
        </div>
        <div className="bg-dv-elevated/60 rounded-lg px-4 py-3 border border-white/[0.04]">
          <div className="flex items-center gap-2 mb-1">
            <Columns3 className="w-3.5 h-3.5 text-sage-400" />
            <span className="text-[10px] text-txt-tertiary uppercase tracking-wider">Dimensions</span>
          </div>
          <p className="text-2xl font-bold text-sage-300">{total_columns}</p>
        </div>
      </div>

      {/* Column Schema Table */}
      {columns && columns.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold text-txt-tertiary mb-2 uppercase tracking-wider">
            Column Schema
          </p>
          <div className="bg-dv-bg/50 rounded-lg border border-white/[0.04] overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] bg-dv-elevated/30">
                  <th className="text-left px-3 py-2 text-txt-tertiary font-medium">Column</th>
                  <th className="text-left px-3 py-2 text-txt-tertiary font-medium">Type</th>
                  <th className="text-right px-3 py-2 text-txt-tertiary font-medium">Nulls</th>
                </tr>
              </thead>
              <tbody>
                {columns.map((col, i) => (
                  <tr key={i} className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-3 py-1.5 text-txt-primary font-medium">{col}</td>
                    <td className="px-3 py-1.5">
                      <span className="text-sage-400 font-mono text-[11px] bg-sage-500/[0.08] px-1.5 py-0.5 rounded">
                        {data_types?.[col]}
                      </span>
                    </td>
                    <td className="px-3 py-1.5 text-right">
                      <span className={null_counts?.[col] > 0 ? 'text-coral-500 font-medium' : 'text-txt-tertiary'}>
                        {null_counts?.[col] ?? 0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Data Preview Table */}
      {preview && preview.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold text-txt-tertiary mb-2 uppercase tracking-wider">
            Preview — First {preview.length} rows
          </p>
          <div className="bg-dv-bg/50 rounded-lg border border-white/[0.04] overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] bg-dv-elevated/30">
                  {Object.keys(preview[0]).map((key, i) => (
                    <th key={i} className="text-left px-3 py-2 text-txt-tertiary font-medium whitespace-nowrap">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors">
                    {Object.values(row).map((val, j) => (
                      <td
                        key={j}
                        className="px-3 py-1.5 text-txt-secondary whitespace-nowrap max-w-[200px] truncate"
                        title={val !== null && val !== undefined ? String(val) : ''}
                      >
                        {val !== null && val !== undefined ? String(val) : <span className="text-txt-tertiary">—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
