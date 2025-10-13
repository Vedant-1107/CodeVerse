import { Code2 } from 'lucide-react';
import ControlsPanel from './ControlsPanel';

const RepoInfo = ({ repoData, handleZoomIn, handleZoomOut, handleResetZoom, handleDownload }) => (
  <div className="max-w-7xl mx-auto mb-8 flex gap-4">
    <div className="flex-1 bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-slate-800/50">
      <div className="flex items-center gap-4">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 p-3 rounded-xl shadow-lg shadow-indigo-500/20">
          <Code2 className="w-7 h-7 text-white" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-200 mb-1">
            {repoData.owner}<span className="text-slate-500">/</span>{repoData.repo_name}
          </h2>
          <p className="text-sm text-slate-400">
            {repoData.structure.length} items · Radial layout
          </p>
        </div>
      </div>
    </div>
    <ControlsPanel {...{ handleZoomIn, handleZoomOut, handleResetZoom, handleDownload }} />
  </div>
);
export default RepoInfo;