const VisualizationCanvas = ({ svgRef }) => (
  <div
    className="bg-slate-900/30 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-slate-800/50"
    style={{ height: '700px' }}
  >
    <div className="mb-4 text-center">
      <p className="text-sm text-slate-500 font-light">
        Scroll to zoom · Drag to pan · Hover for details · Click for effect
      </p>
    </div>
    <div className="bg-slate-950/50 rounded-xl overflow-hidden border border-slate-800/30" style={{ height: '700px' }}>
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  </div>
);

export default VisualizationCanvas;