import { useRef, useEffect } from 'react';
import Plotly from 'plotly.js-dist-min';
import { Download, Image as ImageIcon } from 'lucide-react';

/**
 * Direct Plotly renderer — bypasses react-plotly.js entirely.
 * Uses Plotly.react() which is the recommended way to render/update.
 * Includes download buttons for PNG and SVG export.
 */
export default function PlotlyChart({ data, layout, style, title }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !data) return;

    const darkLayout = {
      ...(layout || {}),
      autosize: true,
      margin: { l: 50, r: 30, t: 40, b: 50 },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(30,32,30,0.6)',
      font: { color: '#b0aca6', size: 11, family: 'Inter, sans-serif' },
      xaxis: {
        ...(layout?.xaxis || {}),
        gridcolor: 'rgba(255,255,255,0.05)',
        zerolinecolor: 'rgba(255,255,255,0.08)',
        linecolor: 'rgba(255,255,255,0.08)',
        tickfont: { color: '#8a8680' },
      },
      yaxis: {
        ...(layout?.yaxis || {}),
        gridcolor: 'rgba(255,255,255,0.05)',
        zerolinecolor: 'rgba(255,255,255,0.08)',
        linecolor: 'rgba(255,255,255,0.08)',
        tickfont: { color: '#8a8680' },
      },
      legend: {
        ...(layout?.legend || {}),
        font: { color: '#b0aca6' },
      },
      colorway: ['#7aab91', '#e8927c', '#7ca8c6', '#c4a46d', '#a78bba', '#6bc4a6', '#d4836d', '#8fbdd4'],
    };

    const config = {
      displayModeBar: false,
      responsive: true,
    };

    Plotly.react(containerRef.current, data, darkLayout, config);

    // Cleanup on unmount
    return () => {
      if (containerRef.current) {
        Plotly.purge(containerRef.current);
      }
    };
  }, [data, layout]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        Plotly.Plots.resize(containerRef.current);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDownloadPNG = () => {
    if (containerRef.current) {
      Plotly.downloadImage(containerRef.current, {
        format: 'png',
        width: 1200,
        height: 700,
        filename: title || 'dataverse-chart',
        scale: 2,
      });
    }
  };

  const handleDownloadSVG = () => {
    if (containerRef.current) {
      Plotly.downloadImage(containerRef.current, {
        format: 'svg',
        width: 1200,
        height: 700,
        filename: title || 'dataverse-chart',
      });
    }
  };

  return (
    <div className="relative group">
      <div
        ref={containerRef}
        style={style || { width: '100%', height: '370px' }}
      />
      {/* Download toolbar — appears on hover */}
      <div className="absolute top-2 right-2 hidden group-hover:flex items-center gap-1 bg-dv-card/90 backdrop-blur-sm border border-white/[0.08] rounded-lg px-1.5 py-1 shadow-lg transition-all z-10">
        <button
          onClick={handleDownloadPNG}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] text-txt-secondary hover:text-sage-300 hover:bg-white/[0.06] transition-colors"
          title="Download as PNG"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          PNG
        </button>
        <div className="w-px h-4 bg-white/[0.08]" />
        <button
          onClick={handleDownloadSVG}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] text-txt-secondary hover:text-sage-300 hover:bg-white/[0.06] transition-colors"
          title="Download as SVG"
        >
          <Download className="w-3.5 h-3.5" />
          SVG
        </button>
      </div>
    </div>
  );
}
