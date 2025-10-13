const Instructions = () => (
  <div className="max-w-3xl mx-auto">
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-800/50">
      <h3 className="text-xl font-semibold mb-6 text-slate-200">Getting Started</h3>
      <div className="space-y-4 text-slate-400">
        {[
          'Enter a public GitHub repository URL',
          'Click "Visualize" or press Enter',
          'Explore the interactive radial tree visualization',
          'Hover over nodes to highlight connections'
        ].map((step, idx) => (
          <div key={idx} className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-semibold text-sm">
              {idx + 1}
            </div>
            <p className="pt-1">{step}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 p-5 bg-slate-950/50 border border-slate-800/30 rounded-xl">
        <p className="text-sm text-slate-400 font-medium mb-3">
          Example repositories:
        </p>
        <div className="space-y-2 text-sm font-mono">
          <p className="text-slate-500">https://github.com/facebook/react</p>
          <p className="text-slate-500">https://github.com/vuejs/vue</p>
          <p className="text-slate-500">https://github.com/pallets/flask</p>
        </div>
      </div>
    </div>
  </div>
);

export default Instructions;