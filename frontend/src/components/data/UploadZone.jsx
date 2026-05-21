import { useDropzone } from 'react-dropzone';
import { UploadCloud, Database, Link as LinkIcon, Loader2 } from 'lucide-react';

export default function UploadZone({ onDrop, urlInput, setUrlInput, handleUrlSubmit, isLoading }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
  });

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 animate-slide-up relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-20 bg-dv-bg/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-sage-500 animate-spin mb-4" />
          <p className="text-txt-primary font-medium">Processing Data Context...</p>
          <p className="text-xs text-txt-tertiary mt-1">Extracting schema and computing statistics</p>
        </div>
      )}

      {/* Hero */}
      <div className="text-center mb-10 max-w-lg">
        <div className="w-16 h-16 bg-sage-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-sage-500/15">
          <Database className="w-8 h-8 text-sage-400" />
        </div>
        <h1 className="text-3xl font-bold text-txt-primary mb-3 tracking-tight">Data Intelligence</h1>
        <p className="text-txt-secondary text-sm leading-relaxed">
          Upload your dataset and ask complex analytical questions in natural language.
        </p>
      </div>

      {/* Upload Area */}
      <div className="w-full max-w-xl space-y-6">
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`dv-card rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 relative overflow-hidden group ${
            isDragActive
              ? 'border-sage-500 bg-sage-500/5'
              : 'hover:border-sage-500/20 hover:bg-dv-elevated/60'
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud
            className={`w-10 h-10 mx-auto mb-4 transition-colors ${
              isDragActive
                ? 'text-sage-400 animate-bounce'
                : 'text-txt-tertiary group-hover:text-sage-400'
            }`}
          />
          <p className="text-base font-medium text-txt-primary mb-1">
            {isDragActive ? 'Drop to analyze...' : 'Drag & drop your dataset'}
          </p>
          <p className="text-xs text-txt-tertiary">CSV or Excel files supported</p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="h-px bg-white/[0.04] flex-1" />
          <span className="text-txt-tertiary text-[10px] font-semibold uppercase tracking-widest">
            or provide URL
          </span>
          <div className="h-px bg-white/[0.04] flex-1" />
        </div>

        {/* URL Input */}
        <form onSubmit={handleUrlSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-tertiary" />
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/data.csv"
              className="dv-input pl-11"
              required
            />
          </div>
          <button type="submit" disabled={isLoading} className="dv-btn-sage">
            Import
          </button>
        </form>
      </div>
    </div>
  );
}
