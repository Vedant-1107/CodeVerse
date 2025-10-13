import { ZoomIn, ZoomOut, Maximize2, Download } from 'lucide-react';

const ControlsPanel = ({ handleZoomIn, handleZoomOut, handleResetZoom, handleDownload }) => (
  <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl p-3 border border-slate-800/50 flex flex-col gap-2">
    <button
      onClick={handleZoomIn}
      className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-all group"
      title="Zoom In"
    >
      <ZoomIn className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" strokeWidth={1.5} />
    </button>
    <button
      onClick={handleZoomOut}
      className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-all group"
      title="Zoom Out"
    >
      <ZoomOut className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" strokeWidth={1.5} />
    </button>
    <button
      onClick={handleResetZoom}
      className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-all group"
      title="Reset View"
    >
      <Maximize2 className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" strokeWidth={1.5} />
    </button>
    <button
      onClick={handleDownload}
      className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-all group"
      title="Download SVG"
    >
      <Download className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" strokeWidth={1.5} />
    </button>
  </div>
);

export default ControlsPanel;